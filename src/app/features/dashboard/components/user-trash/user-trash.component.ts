import { ChangeDetectorRef, Component, DestroyRef, afterNextRender, inject, viewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { finalize, merge, tap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslateModule } from '@ngx-translate/core';

import { SearchBarComponent } from '@app/features/dashboard/components/search-bar/search-bar.component';
import { AdvancedFilters } from '@app/features/dashboard/components/search-bar/filters/advanced-filters.component';
import { NotificationService } from '@app/features/notification/services/notification.service';

import { TrashService, TrashUserResponse,TrashRestoreResponse,
  TrashActionItemResponse, } from '@app/api/generated/trash/trash.service';

import {
  ConfirmUsersActionDialogData,
  ComfirmUserDialogComponent,
} from '../confirm-user-dialog/comfirm-user-dialog.component';

function getFrenchPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Nombre de lignes par page';
  paginatorIntl.nextPageLabel = 'Page suivante';
  paginatorIntl.previousPageLabel = 'Page précédente';
  paginatorIntl.firstPageLabel = 'Première page';
  paginatorIntl.lastPageLabel = 'Dernière page';

  paginatorIntl.getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ): string => {
    if (length === 0 || pageSize === 0) {
      return `0 sur ${length}`;
    }

    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);

    return `${startIndex + 1} – ${endIndex} sur ${length}`;
  };

  return paginatorIntl;
}

@Component({
  selector: 'app-user-trash',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    TranslateModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    SearchBarComponent,
  ],
  providers: [
    { provide: MatPaginatorIntl, useFactory: getFrenchPaginatorIntl },
  ],
  templateUrl: './user-trash.component.html',
  styleUrl: './user-trash.component.scss',
})
export class UserTrashComponent {
  private readonly trashService = inject(TrashService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);

  readonly trashRetentionDays = 10;

  displayedColumns: string[] = [
    'actions',
    'lastName',
    'firstName',
    'email',
    'role',
    'status',
    'deletedAt',
  ];

  dataSource = new MatTableDataSource<TrashUserResponse>([]);
  selection = new SelectionModel<TrashUserResponse>(true, []);

  allTrashUsers: TrashUserResponse[] = [];
  filteredTrashUsers: TrashUserResponse[] = [];

  selectedCount = 0;
  isLoading = false;

  pageSizeOptions: number[] = [5, 10, 25, 50];
  pageSize = this.pageSizeOptions[1];
  resultsLength = 0;

  listKeywords: string[] = [];
  advancedFilters: AdvancedFilters = {};

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.refreshTable();

      const paginator = this.paginator();
      const sort = this.sort();

      if (!paginator || !sort) {
        return;
      }

      merge(
        paginator.page,
        sort.sortChange.pipe(
          tap(() => {
            paginator.pageIndex = 0;
            this.selection.clear();
            this.updateSelectedCount();
          })
        )
      )
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe(() => this.applyLocalFiltersSortAndPagination());
    });
  }

  refreshTable(pageIndex?: number): void {
    const paginator = this.paginator();

    if (!paginator) {
      return;
    }

    if (pageIndex !== undefined) {
      paginator.pageIndex = pageIndex;
    }

    this.selection.clear();
    this.updateSelectedCount();
    this.isLoading = true;

    this.trashService
      .listInactiveUsers({
        page: 0,
        size: 1000,
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: page => {
          this.allTrashUsers = page.content ?? [];
          this.applyLocalFiltersSortAndPagination();
        },
        error: error => {
          console.error('Erreur chargement corbeille', error);

          this.allTrashUsers = [];
          this.filteredTrashUsers = [];
          this.dataSource.data = [];
          this.resultsLength = 0;

          this.notificationService.openErrorSnackBar(
            'Erreur lors du chargement de la corbeille des comptes inactifs.'
          );
        },
      });
  }

  keywordsChanged(currentListKeywords: string[]): void {
    this.listKeywords = currentListKeywords ?? [];
    this.selection.clear();
    this.updateSelectedCount();

    const paginator = this.paginator();
    if (paginator) {
      paginator.pageIndex = 0;
    }

    this.applyLocalFiltersSortAndPagination();
  }

  advancedFiltersChanged(filters: AdvancedFilters): void {
    this.advancedFilters = filters ?? {};
    this.selection.clear();
    this.updateSelectedCount();

    const paginator = this.paginator();
    if (paginator) {
      paginator.pageIndex = 0;
    }

    this.applyLocalFiltersSortAndPagination();
  }

  resetTable(): void {
    this.listKeywords = [];
    this.advancedFilters = {};
    this.selection.clear();
    this.updateSelectedCount();

    const sort = this.sort();
    if (sort) {
      sort.active = '';
      sort.direction = '';
    }

    const paginator = this.paginator();
    if (paginator) {
      paginator.pageIndex = 0;
    }

    this.applyLocalFiltersSortAndPagination();
  }

  private applyLocalFiltersSortAndPagination(): void {
    let rows = [...this.allTrashUsers];

    rows = this.applyLocalSearch(rows);
    rows = this.applyLocalAdvancedFilters(rows);
    rows = this.applyLocalSort(rows);

    this.filteredTrashUsers = rows;
    this.resultsLength = rows.length;

    this.updateDisplayedPage();
  }

  private applyLocalSearch(users: TrashUserResponse[]): TrashUserResponse[] {
    const keywords = (this.listKeywords ?? [])
      .map(keyword => this.normalize(keyword))
      .filter(keyword => keyword.length > 0);

    if (keywords.length === 0) {
      return users;
    }

    return users.filter(user => {
      const searchableText = this.normalize(
        [
          user.lastName,
          user.firstName,
          user.email,
          user.role,
          user.deletedAt,
          'inactif',
        ].join(' ')
      );

      return keywords.every(keyword => searchableText.includes(keyword));
    });
  }

  private applyLocalAdvancedFilters(users: TrashUserResponse[]): TrashUserResponse[] {
    const roles = this.advancedFilters?.role ?? [];
    const creationDate = this.advancedFilters?.createdDate;

    return users.filter(user => {
      if (roles.length > 0) {
        const userRole = this.normalize(user.role);
        const acceptedRoles = roles.map(role => this.normalize(role));

        if (!acceptedRoles.includes(userRole)) {
          return false;
        }
      }

      if (creationDate) {
        const userCreationDate = user.creationDate?.slice(0, 10);

        if (userCreationDate !== creationDate) {
          return false;
        }
      }

      return true;
    });
  }

  private applyLocalSort(users: TrashUserResponse[]): TrashUserResponse[] {
    const sort = this.sort();

    if (!sort?.active || !sort.direction) {
      return users;
    }

    const direction = sort.direction === 'asc' ? 1 : -1;
    const active = sort.active;

    return users.sort((a, b) => {
      const valueA = this.getSortValue(a, active);
      const valueB = this.getSortValue(b, active);

      if (valueA < valueB) {
        return -1 * direction;
      }

      if (valueA > valueB) {
        return 1 * direction;
      }

      return 0;
    });
  }

  private getSortValue(user: TrashUserResponse, field: string): string | number {
    switch (field) {
      case 'lastName':
        return this.normalize(user.lastName);

      case 'firstName':
        return this.normalize(user.firstName);

      case 'email':
        return this.normalize(user.email);

      case 'role':
        return this.normalize(user.role);

      case 'deletedAt':
        return user.deletedAt ? new Date(user.deletedAt).getTime() : 0;

      case 'creationDate':
        return user.creationDate ? new Date(user.creationDate).getTime() : 0;

      case 'status':
        return 'inactif';

      default:
        return '';
    }
  }

  private updateDisplayedPage(): void {
    const paginator = this.paginator();

    const pageIndex = paginator?.pageIndex ?? 0;
    const pageSize = paginator?.pageSize ?? this.pageSize;

    this.pageSize = pageSize;

    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;

    this.dataSource.data = this.filteredTrashUsers.slice(startIndex, endIndex);
    this.cdr.markForCheck();
  }

  private normalize(value: string | number | null | undefined): string {
    return `${value ?? ''}`
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  goBackToUsers(): void {
    this.router.navigate(['/users']);
  }

  restoreUsers(ids: Array<string | number>) {
    return this.trashService.restoreUsers(ids);
  }

  permanentlyDeleteUsers(ids: Array<string | number>) {
    return this.trashService.permanentlyDeleteUsers(ids);
  }

  toggleRow(user: TrashUserResponse): void {
    this.selection.toggle(user);
    this.updateSelectedCount();
  }

  isAllSelected(): boolean {
    const currentPageRows = this.dataSource.data;

    return (
      currentPageRows.length > 0 &&
      currentPageRows.every(user => this.selection.isSelected(user))
    );
  }

  masterToggle(): void {
    const currentPageRows = this.dataSource.data;

    if (this.isAllSelected()) {
      currentPageRows.forEach(user => this.selection.deselect(user));
    } else {
      this.selection.select(...currentPageRows);
    }

    this.updateSelectedCount();
  }

  private updateSelectedCount(): void {
    this.selectedCount = this.selection.selected.length;
    this.cdr.markForCheck();
  }

  checkboxLabel(row?: TrashUserResponse): string {
    if (!row) {
      return this.isAllSelected()
        ? 'Tout désélectionner'
        : 'Tout sélectionner';
    }

    return this.selection.isSelected(row)
      ? `Désélectionner ${row.lastName} ${row.firstName}`
      : `Sélectionner ${row.lastName} ${row.firstName}`;
  }

  openRestoreSelectedConfirmation(): void {
    const selectedUsers = this.selection.selected;

    if (selectedUsers.length === 0) {
      this.notificationService.openErrorSnackBar(
        'Veuillez sélectionner au moins un compte à restaurer.'
      );
      return;
    }

    const dialogRef = this.dialog.open(ComfirmUserDialogComponent, {
      data: {
        title: selectedUsers.length > 1 ? 'Restaurer les comptes' : 'Restaurer le compte',
        message:
          selectedUsers.length > 1
            ? 'Voulez-vous restaurer les comptes suivants ?'
            : `Voulez-vous restaurer le compte ${this.getUserDisplayName(selectedUsers[0])} ?`,
        confirmLabel: 'Restaurer',
        users: selectedUsers,
      } as ConfirmUsersActionDialogData,
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) {
        return;
      }

      const ids = selectedUsers
        .map(user => user.id)
        .filter((id): id is string => !!id && id.trim() !== '');

      this.restoreUsers(ids)
  .pipe(finalize(() => this.refreshTable()))
  .subscribe({
    next: response => {
      this.showRestoreResultMessage(response, selectedUsers);
    },
    error: error => {
      console.error('Erreur restauration comptes', error);

      this.notificationService.openErrorSnackBar(
        selectedUsers.length > 1
          ? 'Erreur technique lors de la restauration des comptes sélectionnés.'
          : `Erreur technique lors de la restauration du compte ${this.getUserDisplayName(selectedUsers[0])}.`
      );
    },
  });
    });
  }

  private showRestoreResultMessage(
  response: TrashRestoreResponse,
  selectedUsers: TrashUserResponse[]
): void {
  const restored = response.restored ?? [];
  const failed = response.failed ?? [];

  if (restored.length === 0 && failed.length === 0) {
    this.notificationService.openSuccessSnackBar(
      selectedUsers.length > 1
        ? 'Les comptes sélectionnés ont été restaurés.'
        : `Le compte ${this.getUserDisplayName(selectedUsers[0])} a été restauré.`
    );

    return;
  }

  if (restored.length > 0) {
    this.notificationService.openSuccessSnackBar(
      restored.length > 1
        ? `${restored.length} comptes ont été restaurés avec succès.`
        : `Le compte ${this.getActionUserDisplayName(restored[0])} a été restauré avec succès.`
    );
  }

  if (failed.length > 0) {
    this.notificationService.openErrorSnackBar(
      this.buildRestoreFailureMessage(failed)
    );
  }
}

private buildRestoreFailureMessage(failed: TrashActionItemResponse[]): string {
  if (failed.length === 1) {
    const user = failed[0];

    return `Le compte ${this.getActionUserDisplayName(user)} n'a pas été restauré : ${this.getFailureReasonLabel(user)}.`;
  }

  const displayedUsers = failed
    .slice(0, 3)
    .map(user => `${this.getActionUserDisplayName(user)} : ${this.getFailureReasonLabel(user)}`)
    .join(' / ');

  const remainingCount = failed.length - 3;

  return remainingCount > 0
    ? `${failed.length} comptes n'ont pas été restaurés. ${displayedUsers} / +${remainingCount} autre(s).`
    : `${failed.length} comptes n'ont pas été restaurés. ${displayedUsers}.`;
}

private getFailureReasonLabel(user: TrashActionItemResponse): string {
  switch (user.reason) {
    case 'ALREADY_RESTORED':
      return 'ce compte a déjà été restauré';

    case 'NOT_FOUND':
      return 'ce compte n’existe plus dans la corbeille';

    case 'CONCURRENT_UPDATE':
      return 'ce compte a été modifié par un autre administrateur';

    case 'EMAIL_ALREADY_USED':
      return 'cet email est déjà utilisé par un autre compte actif';

    default:
      return user.message || 'erreur inconnue';
  }
}

private getActionUserDisplayName(user: TrashActionItemResponse): string {
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

  return fullName || user.email || 'sélectionné';
}

  openPermanentDeleteSelectedConfirmation(): void {
    const selectedUsers = this.selection.selected;

    if (selectedUsers.length === 0) {
      this.notificationService.openErrorSnackBar(
        'Veuillez sélectionner au moins un compte à supprimer définitivement.'
      );
      return;
    }

    const dialogRef = this.dialog.open(ComfirmUserDialogComponent, {
      data: {
        title:
          selectedUsers.length > 1
            ? 'Suppression définitive'
            : 'Suppression définitive du compte',
        message:
          selectedUsers.length > 1
            ? 'Cette action est irréversible. Voulez-vous supprimer définitivement les comptes suivants ?'
            : `Cette action est irréversible. Voulez-vous supprimer définitivement le compte ${this.getUserDisplayName(selectedUsers[0])} ?`,
        confirmLabel: 'Supprimer définitivement',
        confirmColor: 'warn',
        users: selectedUsers,
      } as ConfirmUsersActionDialogData,
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) {
        return;
      }

      const ids = selectedUsers
  .map(user => user.id)
  .filter((id): id is string => !!id && id.trim() !== '');


      this.permanentlyDeleteUsers(ids)
        .pipe(finalize(() => this.refreshTable()))
        .subscribe({
          next: () => {
            this.notificationService.openSuccessSnackBar(
              selectedUsers.length > 1
                ? 'Les comptes sélectionnés ont été supprimés définitivement.'
                : `Le compte ${this.getUserDisplayName(selectedUsers[0])} a été supprimé définitivement.`
            );
          },
          error: error => {
            console.error('Erreur suppression définitive comptes', error);

            this.notificationService.openErrorSnackBar(
              selectedUsers.length > 1
                ? 'Erreur lors de la suppression définitive des comptes sélectionnés.'
                : `Erreur lors de la suppression définitive du compte ${this.getUserDisplayName(selectedUsers[0])}.`
            );
          },
        });
    });
  }

  private getUserDisplayName(user: TrashUserResponse): string {
    const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

    return fullName || user.email || 'sélectionné';
  }
}