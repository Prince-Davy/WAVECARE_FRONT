import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { DashboardComponent } from '@app/features/dashboard/abstract/dashboard-component.abstract';
import { CustomPaginator } from '@app/features/dashboard/classes/custom-paginator';
import { Page, Ticket, TicketTableService } from '@app/features/dashboard/services/ticket-table.service';
import { TranslateModule } from '@ngx-translate/core';
import { finalize, merge } from 'rxjs';

@Component({
  selector: 'ticket-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, DatePipe, TranslateModule, MatIconModule, MatTooltip, MatCardModule],
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginator }
  ]
})
export class TicketTableComponent extends DashboardComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'subject', 'lastName', 'firstName', 'mail', 'status', 'date', 'action'];
  dataSource: MatTableDataSource<Ticket> = new MatTableDataSource<Ticket>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoading: boolean = false; // TODO : Make a loader ?
  pageSizeOptions: number[] = [5, 10, 25, 50];
  resultsLength: number = 0;
  pageSize: number = this.pageSizeOptions[1];

  constructor(private api: TicketTableService) {
    super();
  }

  ngAfterViewInit(): void {
    merge(this.paginator.initialized, this.paginator.page)
      .subscribe((event: void | PageEvent) => {
        this.isLoading = true;
        this.api.getTickets(event ? event.pageIndex : 0, event ? event.pageSize : this.pageSize)
          .pipe(
            finalize(() => this.isLoading = false)
          )
          .subscribe({
            next: (result: Page<Ticket>) => {
              this.updateRows(result.content, result.totalElements, result.size);
            },
            error: (error: HttpErrorResponse) => {
              console.error('An error occurred while loading tickets;', error);
              this.updateRows([], 0, 0);
            }
          })
      });

    this.dataSource.paginator = this.paginator;
  }

  private updateRows(rows: Ticket[], totalElements: number, pageSize: number) {
    this.dataSource = new MatTableDataSource(rows);
    this.resultsLength = totalElements;
    this.pageSize = pageSize;
  }
}
