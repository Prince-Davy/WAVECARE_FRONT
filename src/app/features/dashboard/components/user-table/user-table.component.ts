
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardComponent } from '@app/features/dashboard/abstract/dashboard-component.abstract';
import { Page } from '@app/features/dashboard/models/page';
import { UserViewDTO } from '@app/features/dashboard/models/user-view-dto';
import { UserService } from '@app/features/dashboard/services/user.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize, merge, startWith, tap, zip } from 'rxjs';
import { SearchBarComponent } from '@app/features/dashboard/components/search-bar/search-bar.component';
import { UserCreateDTO, UserDialogComponent, UserDialogData } from '../user-dialog/user-dialog.component';
import { UserDetailUpdateDTO } from '../../models/user-detail-update';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NotificationService } from '@app/features/notification/services/notification.service';
import { DeleteUserDialogComponent } from '../delete-user-dialog/delete-user-dialog.component';
import { AdvancedFilters } from '@app/features/dashboard/components/search-bar/filters/advanced-filters.component';
import { UserFilters } from '../../models/user-filters';
import { MatButtonModule } from '@angular/material/button';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, DatePipe, TranslateModule,
    MatIconModule, MatTooltipModule, MatCardModule, SearchBarComponent, MatSortModule, MatButtonModule,MatDialogModule
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent extends DashboardComponent {
  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['lastName', 'firstName', 'email', 'role', 'locked', 'creationDate', 'update', 'delete'];
  dataSource: MatTableDataSource<UserViewDTO> = new MatTableDataSource<UserViewDTO>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading: boolean = false;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  resultsLength: number = 0;
  pageSize: number = this.pageSizeOptions[1];
  listKeywords: string[] = [];
  currentUserId!: string;
  advancedFilters: AdvancedFilters = {};
  filters: UserFilters = {};
  

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private authTokenService: AuthTokenService
  ) {
    super();
    this.currentUserId = this.authTokenService.getUserId() ?? '';
  }

  ngAfterViewInit(): void {
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(startWith({}))
      .subscribe(() => this.refreshTable());
  }

  private refreshTable(pageIndex?: number): void {
    this.isLoading = true;

    if (pageIndex !== undefined) {
      this.paginator.pageIndex = pageIndex;
    }

    const sortField = this.sort?.active || 'creationDate'; // fallback si rien
    const sortDirection = this.sort?.direction || 'asc';


    this.filters = {
      ...this.filters,
      keywords: this.listKeywords ?? this.filters.keywords,
      roles: this.advancedFilters?.role ?? this.filters.roles,
      statuses: this.advancedFilters?.status ?? this.filters.statuses,
      creationDate: this.advancedFilters?.createdDate ?? this.filters.creationDate,
    };

    this.userService.getUsers(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.listKeywords,
      sortField,
      sortDirection,
      this.filters
    ).pipe(
      finalize(() => this.isLoading = false),
      tap((result: Page<UserViewDTO>) => {
        this.dataSource.data = result.content ?? [];
        const total = result.totalElements ?? 0;
        const size = result.size ?? this.pageSize;
        this.resultsLength = total;
        this.pageSize = size;
        this.paginator.length = total;
        this.paginator.pageSize = size;
      })
    )
      .subscribe();
  }
  
openCreateUserDialog() {
  this.userService.getUserRoles().subscribe(roles => {
    const empty: UserCreateDTO = {
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
  zip(this.userService.getUserRoles(), this.userService.getUser(userId)).subscribe(([roles, dto]) => {
    const payload: UserDetailUpdateDTO = {
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
        this.userService.deleteUser(user.id)
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
    this.sort.active = '';
    this.sort.direction = '';
    this.paginator.pageIndex = 0;
    this.refreshTable(0);
  }
}
