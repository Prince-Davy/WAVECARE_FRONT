
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, afterNextRender, effect, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardComponent } from '@app/features/dashboard/abstract/dashboard-component.abstract';
import { UserStore } from '@app/features/dashboard/stores/user.store';
import { UsersService } from '@app/api/generated/users/users.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize, merge, startWith, tap, zip } from 'rxjs';
import { SearchBarComponent } from '@app/features/dashboard/components/search-bar/search-bar.component';
import { UserDialogComponent, UserDialogData } from '../user-dialog/user-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NotificationService } from '@app/features/notification/services/notification.service';
import { DeleteUserDialogComponent } from '../delete-user-dialog/delete-user-dialog.component';
import { AdvancedFilters } from '@app/features/dashboard/components/search-bar/filters/advanced-filters.component';
import { UserFilters } from '../../models/user-filters';
import { MatButtonModule } from '@angular/material/button';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import type { UserResponse } from '@app/api/model';

// Factory function to create a MatPaginatorIntl with French labels
function getFrenchPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Items par page';
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
  selector: 'app-user-table',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, DatePipe, TranslateModule,
    MatIconModule, MatTooltipModule, MatCardModule, SearchBarComponent, MatSortModule, MatButtonModule, MatDialogModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useFactory: getFrenchPaginatorIntl }
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent extends DashboardComponent {
  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['lastName', 'firstName', 'email', 'role', 'locked', 'creationDate', 'update', 'delete'];
  dataSource: MatTableDataSource<UserResponse> = new MatTableDataSource<UserResponse>([]);

  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);

  isLoading: boolean = false;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  resultsLength: number = 0;
  pageSize: number = this.pageSizeOptions[1];
  listKeywords: string[] = [];
  currentUserId!: string;
  advancedFilters: AdvancedFilters = {};
  filters: UserFilters = {};


  constructor(
    private userStore: UserStore,
    private usersApi: UsersService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private authTokenService: AuthTokenService
  ) {
    super();
    this.currentUserId = this.authTokenService.getUserId() ?? '';
    const destroyRef = inject(DestroyRef);

    effect(() => {
      this.dataSource.data = this.userStore.users();
      this.resultsLength = this.userStore.totalElements();
      this.pageSize = this.userStore.pageSize();
      this.isLoading = this.userStore.loading();
      const p = this.paginator();
      if (p) {
        p.length = this.userStore.totalElements();
        p.pageSize = this.userStore.pageSize();
      }
    });

    afterNextRender(() => {
      merge(this.paginator()!.page, this.sort()!.sortChange)
        .pipe(startWith({}), takeUntilDestroyed(destroyRef))
        .subscribe(() => this.refreshTable());
    });
  }

  private refreshTable(pageIndex?: number): void {
    if (pageIndex !== undefined) {
      this.paginator()!.pageIndex = pageIndex;
    }

    const sortField = this.sort()?.active || 'creationDate'; // fallback si rien
    const sortDirection = this.sort()?.direction || 'asc';


    this.filters = {
      ...this.filters,
      keywords: this.listKeywords ?? this.filters.keywords,
      roles: this.advancedFilters?.role ?? this.filters.roles,
      statuses: this.advancedFilters?.status ?? this.filters.statuses,
      creationDate: this.advancedFilters?.createdDate ?? this.filters.creationDate,
    };

    this.userStore.load(
      this.paginator()!.pageIndex,
      this.paginator()!.pageSize,
      this.listKeywords,
      sortField,
      sortDirection,
      this.filters
    );
  }

  openCreateUserDialog() {
    this.usersApi.userListRoles().subscribe(roles => {
      const empty: UserResponse = {
        firstName: '',
        lastName: '',
        email: '',
        role: roles?.[0] ?? '0'
      };

      this.dialog.open(UserDialogComponent, {
        data: { user: empty, roles, mode: 'create' } as UserDialogData,
        disableClose: true,
        autoFocus: false
      }).afterClosed().subscribe((created?: boolean) => {
        if (created) {
          this.refreshTable(0);
        }
      });
    });
  }

  openUpdateUserDialog(userId: number) {
    zip(this.usersApi.userListRoles(), this.usersApi.userGetById(String(userId))).subscribe(([roles, dto]) => {
      const payload: UserResponse = {
        id: dto.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
        email: dto.email
      };

      this.dialog.open(UserDialogComponent, {
        data: { user: payload, roles, mode: 'update' } as UserDialogData,
        disableClose: true,
        autoFocus: false
      }).afterClosed().subscribe((updated?: boolean) => {
        if (updated) {
          this.refreshTable();
        }
      });
    });
  }

  isCurrentUser(user: any): boolean {
    return user?.id === this.currentUserId;
  }

  openDeleteUserDialog(user: any) {
    if (this.isCurrentUser(user)) {
      this.notificationService.openErrorSnackBar(
        this.translate.instant('feature.dashboard.user-table-component.table.column.action.delete.message.self.error')
      );
      return;
    }

    const dialogRef = this.dialog.open(DeleteUserDialogComponent, { data: user });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersApi.userDelete(user.id)
          .pipe(
            tap(() => {
              this.notificationService.openSuccessSnackBar(
                this.translate.instant('feature.dashboard.user-table-component.table.column.action.delete.message.success', {
                  lastName: user.lastName,
                  firstName: user.firstName
                })
              );
            }),
            finalize(() => this.refreshTable())
          )
          .subscribe();
      }
    });
  }

  keywordsChanged(currentListKeywords: string[]) {
    this.listKeywords = currentListKeywords;
    this.refreshTable(0);
  }

  advancedFiltersChanged(filters: AdvancedFilters): void {
    this.advancedFilters = filters;
    this.refreshTable(0);
  }

  applyFilters(filters: { role?: string[]; status?: string[]; createdDate?: string }): void {
    this.advancedFilters = filters;
    this.refreshTable(0);
  }

  resetTable(): void {
    this.listKeywords = [];
    this.advancedFilters = {};
    this.filters = {};
    this.sort()!.active = '';
    this.sort()!.direction = '';
    this.paginator()!.pageIndex = 0;
    this.refreshTable(0);
  }
}
