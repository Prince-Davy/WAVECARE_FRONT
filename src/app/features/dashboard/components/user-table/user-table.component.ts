import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import { DashboardComponent } from '@app/features/dashboard/abstract/dashboard-component.abstract';
import { Page } from '@app/features/dashboard/models/page';
import { UserViewDTO } from '@app/features/dashboard/models/user-view-dto';
import { UserService } from '@app/features/dashboard/services/user.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize, merge, zip } from 'rxjs';
import { SearchBarComponent } from '@app/features/dashboard/components/search-bar/search-bar.component';
import { UserDialogComponent, UserDialogData } from '../user-dialog/user-dialog.component';
import { UserDetailUpdateDTO } from '../../models/user-detail-update';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@app/features/notification/services/notification.service';


@Component({
  selector: 'app-user-table',
  imports: [
    MatTableModule, MatPaginatorModule, DatePipe, TranslateModule,
    MatIconModule, MatTooltip, MatCardModule, SearchBarComponent, MatSortModule
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent extends DashboardComponent {
  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'locked', 'creationDate', 'update', 'delete'];
  dataSource: MatTableDataSource<UserViewDTO> = new MatTableDataSource<UserViewDTO>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading: boolean = false;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  resultsLength: number = 0;
  pageSize: number = this.pageSizeOptions[1];
  listKeywords: string[] = [];

  constructor(private userService: UserService, private notificationService: NotificationService, private translate: TranslateService) {
    super();
  }

  ngAfterViewInit(): void {
    if (this.sort && this.paginator) {
      merge(this.paginator.page, this.sort.sortChange)
        .subscribe(() => this.refreshTable());
    }

    this.refreshTable(0); // charge la première page au démarrage

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  private refreshTable(pageIndex?: number): void {
    this.isLoading = true;

    if (pageIndex !== undefined) {
      this.paginator.pageIndex = pageIndex;
    }
	
	// Récupération des infos de tri
	const sortField = this.sort?.active || 'creationDate'; // fallback si rien
	const sortDirection = this.sort?.direction || 'asc';

	this.userService.getUsers(
	    this.paginator.pageIndex,
	    this.paginator.pageSize,
	    this.listKeywords,
	    sortField,
	    sortDirection
	  ).pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (result: Page<UserViewDTO>) => {
          this.updateRows(result.content, result.totalElements, result.size);
        },
        error: (error: HttpErrorResponse) => {
          console.error('An error occurred while loading users;', error);
          this.updateRows([], 0, 0);
        }
      });
  }

  private updateRows(rows: UserViewDTO[], totalElements: number, pageSize: number) {
	this.dataSource.data = rows;
    this.resultsLength = totalElements;
    this.pageSize = pageSize;
  }

  openUpdateUserDialog(userId: number) {
	zip(this.userService.getUserRoles(), this.userService.getUser(userId))
	      .subscribe(([roles, userDetailDTO]) => {
	        this.dialog.open(UserDialogComponent, {
	          data: {
	            userDetailDTO,
	            roles
	          } as UserDialogData,
	          disableClose: true,
	          autoFocus: false
	        })
	          .afterClosed()
	          .subscribe((userDetailUpdateDTO: UserDetailUpdateDTO | undefined) => {
	            if (userDetailUpdateDTO !== undefined) {
	              this.userService.updateUser(userDetailUpdateDTO)
	                .pipe(finalize(() => this.refreshTable()))
	                .subscribe({
	                  next: () => {
	                    this.notificationService.openSuccessSnackBar(this.translate.instant('feature.dashboard.user-table-component.table.column.action.message.success', { id: userId }));
	                  },
	                  error: (error: any) => {
	                    this.notificationService.openErrorSnackBar(this.translate.instant('feature.dashboard.user-table-component.table.column.action.message.error', { id: userId }));
	                    console.error("An error occurred when trying to update ticket.", error)
	                  }
	                });
	            }
	          });;

	      });
  }

  openDeleteUserDialog(id: string) {
    alert("id = " + id);
  }
  
  keywordsChanged(currentListKeywords: string[]) {
    this.listKeywords = currentListKeywords;
    this.refreshTable(0);
  }
  
  resetTable(): void {
    this.listKeywords = [];
    this.sort.active = '';
    this.sort.direction = '';
    this.paginator.pageIndex = 0;
    this.refreshTable(0);
  }
}
