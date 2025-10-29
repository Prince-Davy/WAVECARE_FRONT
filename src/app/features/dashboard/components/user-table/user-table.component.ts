import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { DashboardComponent } from '@app/features/dashboard/abstract/dashboard-component.abstract';
import { Page } from '@app/features/dashboard/models/page';
import { UserViewDTO } from '@app/features/dashboard/models/user-view-dto';
import { UserService } from '@app/features/dashboard/services/user.service';
import { TranslateModule } from '@ngx-translate/core';
import { finalize, merge } from 'rxjs';
import { SearchBarComponent } from '@app/features/dashboard/components/search-bar/search-bar.component';


@Component({
  selector: 'app-user-table',
  imports: [
    MatTableModule, MatPaginatorModule, DatePipe, TranslateModule,
    MatIconModule, MatTooltip, MatCardModule, SearchBarComponent
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent extends DashboardComponent {

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'status', 'creationDate', 'update', 'delete'];
  dataSource: MatTableDataSource<UserViewDTO> = new MatTableDataSource<UserViewDTO>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoading: boolean = false;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  resultsLength: number = 0;
  pageSize: number = this.pageSizeOptions[1];
  listKeywords: string[] = [];

  constructor(private userService: UserService) {
    super();
  }

  ngAfterViewInit(): void {
    merge(this.paginator.initialized, this.paginator.page)
      .subscribe(() => {
        this.refreshTable();
      });
    this.dataSource.paginator = this.paginator;
  }

  private refreshTable(pageIndex?: number): void {
    this.isLoading = true;

    if (pageIndex !== undefined) {
      this.paginator.pageIndex = pageIndex;
    }
    this.userService.getUsers(this.paginator.pageIndex, this.paginator.pageSize, this.listKeywords)
      .pipe(
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
    this.dataSource = new MatTableDataSource(rows);
    this.resultsLength = totalElements;
    this.pageSize = pageSize;
  }

  openUpdateUserDialog(id: string) {
    alert("id = " + id);
  }

  openDeleteUserDialog(id: string) {
    alert("id = " + id);
  }
  
  keywordsChanged(currentListKeywords: string[]) {
    this.listKeywords = currentListKeywords;
    this.refreshTable(0);
  }
}
