
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

/**
 * TODO: Documentation for getFrenchPaginatorIntl (function)
 */
// Factory function to create a MatPaginatorIntl with French labels
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

/**
 * TODO: Documentation for UserTableComponent (class)
 */
/**
 * TODO: Documentation for UserTableComponent (class)
 */
/**
 * TODO: Documentation for UserTableComponent (class)
 */
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

/**
 * TODO: Documentation for displayedColumns (property)
 */
  displayedColumns: string[] = ['lastName', 'firstName', 'email', 'role', 'locked', 'creationDate', 'update', 'delete'];
/**
 * TODO: Documentation for dataSource (property)
 */
  dataSource: MatTableDataSource<UserResponse> = new MatTableDataSource<UserResponse>([]);

  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);

/**
 * TODO: Documentation for isLoading (property)
 */
  isLoading: boolean = false;
/**
 * TODO: Documentation for pageSizeOptions (property)
 */
  pageSizeOptions: number[] = [5, 10, 25, 50];
/**
 * TODO: Documentation for resultsLength (property)
 */
  resultsLength: number = 0;
/**
 * TODO: Documentation for pageSize (property)
 */
  pageSize: number = this.pageSizeOptions[1];
/**
 * TODO: Documentation for listKeywords (property)
 */
  listKeywords: string[] = [];
  currentUserId!: string;
/**
 * TODO: Documentation for advancedFilters (property)
 */
  advancedFilters: AdvancedFilters = {};
  filters: UserFilters = {};

/**
 * TODO: Documentation for constructor (method)
 * @param userStore - TODO
 * @param usersApi - TODO
 * @param notificationService - TODO
 * @param translate - TODO
 * @param authTokenService - TODO
 * @returns TODO
 */

  constructor(
/**
 * TODO: Documentation for userStore (property)
 */
    private userStore: UserStore,
/**
 * TODO: Documentation for usersApi (property)
 */
    private usersApi: UsersService,
/**
 * TODO: Documentation for notificationService (property)
 */
    private notificationService: NotificationService,
/**
 * TODO: Documentation for translate (property)
 */
    private translate: TranslateService,
/**
 * TODO: Documentation for authTokenService (property)
 */
    private authTokenService: AuthTokenService
  ) {
/**
 * TODO: Documentation for super (method)
 * @returns TODO
 */
    super();
    this.currentUserId = this.authTokenService.getUserId() ?? '';
    const destroyRef = inject(DestroyRef);

/**
 * TODO: Documentation for effect (method)
 * @param ( - TODO
 * @returns TODO
 */
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

/**
 * TODO: Documentation for afterNextRender (method)
 * @param ( - TODO
 * @returns TODO
 */
    afterNextRender(() => {
/**
 * TODO: Documentation for merge (method)
 * @param this.paginator()!.page - TODO
 * @param this.sort()!.sortChange - TODO
 * @returns TODO
 */
      merge(this.paginator()!.page, this.sort()!.sortChange)
        .pipe(startWith({}), takeUntilDestroyed(destroyRef))
        .subscribe(() => this.refreshTable());
    });
  }

/**
 * TODO: Documentation for refreshTable (method)
 * @param pageIndex? - TODO
 * @returns TODO
 */
  private refreshTable(pageIndex?: number): void {
    if (pageIndex !== undefined) {
      this.paginator()!.pageIndex = pageIndex;
    }

    const sortField = this.sort()?.active || 'creationDate'; // fallback si rien
    const sortDirection = this.sort()?.direction || 'asc';


    this.filters = {
      ...this.filters,
/**
 * TODO: Documentation for keywords (property)
 */
      keywords: this.listKeywords ?? this.filters.keywords,
/**
 * TODO: Documentation for roles (property)
 */
      roles: this.advancedFilters?.role ?? this.filters.roles,
/**
 * TODO: Documentation for statuses (property)
 */
      statuses: this.advancedFilters?.status ?? this.filters.statuses,
/**
 * TODO: Documentation for creationDate (property)
 */
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

/**
 * TODO: Documentation for openCreateUserDialog (method)
 * @returns TODO
 */
  openCreateUserDialog() {
    this.usersApi.userListRoles().subscribe(roles => {
      const empty: UserResponse = {
/**
 * TODO: Documentation for firstName (property)
 */
        firstName: '',
/**
 * TODO: Documentation for lastName (property)
 */
        lastName: '',
/**
 * TODO: Documentation for email (property)
 */
        email: '',
/**
 * TODO: Documentation for role (property)
 */
        role: roles?.[0] ?? '0'
      };

      this.dialog.open(UserDialogComponent, {
/**
 * TODO: Documentation for data (property)
 */
        data: { user: empty, roles, mode: 'create' } as UserDialogData,
/**
 * TODO: Documentation for disableClose (property)
 */
        disableClose: true,
/**
 * TODO: Documentation for autoFocus (property)
 */
        autoFocus: false
      }).afterClosed().subscribe((created?: boolean) => {
        if (created) {
          this.refreshTable(0);
        }
      });
    });
  }

/**
 * TODO: Documentation for openUpdateUserDialog (method)
 * @param userId - TODO
 * @returns TODO
 */
  openUpdateUserDialog(userId: number) {
/**
 * TODO: Documentation for zip (method)
 * @param this.usersApi.userListRoles() - TODO
 * @param this.usersApi.userGetById(String(userId))).subscribe(([roles - TODO
 * @param dto] - TODO
 * @returns TODO
 */
    zip(this.usersApi.userListRoles(), this.usersApi.userGetById(String(userId))).subscribe(([roles, dto]) => {
      const payload: UserResponse = {
/**
 * TODO: Documentation for id (property)
 */
        id: dto.id,
/**
 * TODO: Documentation for firstName (property)
 */
        firstName: dto.firstName,
/**
 * TODO: Documentation for lastName (property)
 */
        lastName: dto.lastName,
/**
 * TODO: Documentation for role (property)
 */
        role: dto.role,
/**
 * TODO: Documentation for email (property)
 */
        email: dto.email
      };

      this.dialog.open(UserDialogComponent, {
/**
 * TODO: Documentation for data (property)
 */
        data: { user: payload, roles, mode: 'update' } as UserDialogData,
/**
 * TODO: Documentation for disableClose (property)
 */
        disableClose: true,
/**
 * TODO: Documentation for autoFocus (property)
 */
        autoFocus: false
      }).afterClosed().subscribe((updated?: boolean) => {
        if (updated) {
          this.refreshTable();
        }
      });
    });
  }

/**
 * TODO: Documentation for isCurrentUser (method)
 * @param user - TODO
 * @returns TODO
 */
  isCurrentUser(user: any): boolean {
    return user?.id === this.currentUserId;
  }

/**
 * TODO: Documentation for openDeleteUserDialog (method)
 * @param user - TODO
 * @returns TODO
 */
  openDeleteUserDialog(user: any) {
    if (this.isCurrentUser(user)) {
      this.notificationService.openErrorSnackBar(
        this.translate.instant('feature.dashboard.user-table-component.table.column.action.delete.message.self.error')
      );
/**
 * TODO: Documentation for return (property)
 */
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
/**
 * TODO: Documentation for lastName (property)
 */
                  lastName: user.lastName,
/**
 * TODO: Documentation for firstName (property)
 */
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

/**
 * TODO: Documentation for keywordsChanged (method)
 * @param currentListKeywords - TODO
 * @returns TODO
 */
  keywordsChanged(currentListKeywords: string[]) {
    this.listKeywords = currentListKeywords;
    this.refreshTable(0);
  }

/**
 * TODO: Documentation for advancedFiltersChanged (method)
 * @param filters - TODO
 * @returns TODO
 */
  advancedFiltersChanged(filters: AdvancedFilters): void {
    this.advancedFilters = filters;
    this.refreshTable(0);
  }

/**
 * TODO: Documentation for applyFilters (method)
 * @param filters - TODO
 * @returns TODO
 */
  applyFilters(filters: { role?: string[]; status?: string[]; createdDate?: string }): void {
    this.advancedFilters = filters;
    this.refreshTable(0);
  }

/**
 * TODO: Documentation for resetTable (method)
 * @returns TODO
 */
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
