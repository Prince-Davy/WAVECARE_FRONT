import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from "@angular/material/input";
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardComponent } from '@app/features/dashboard/abstract/dashboard-component.abstract';
import { CustomPaginator } from '@app/features/dashboard/classes/custom-paginator';
import { SearchBarComponent } from '@app/features/dashboard/components/search-bar/search-bar.component';
import { TicketDialogComponent, TicketDialogData } from '@app/features/dashboard/components/ticket-dialog/ticket-dialog.component';
import { Page } from '@app/features/dashboard/models/page';
import { TicketDetailUpdateDTO } from '@app/features/dashboard/models/ticket-detail-update-dto';
import { TicketViewDTO } from '@app/features/dashboard/models/ticket-view-dto';
import { TicketService } from '@app/features/dashboard/services/ticket.service';
import { NotificationService } from '@app/features/notification/services/notification.service';
import { Pad4Pipe } from '@app/features/dashboard/pipes/pad4.pide';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize, merge, startWith, tap, zip } from 'rxjs';


@Component({
  selector: 'ticket-table',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatSortModule, DatePipe,
    TranslateModule, MatIconModule, MatTooltipModule, MatCardModule, FormsModule,
    MatInputModule, MatChipsModule, MatFormFieldModule, CommonModule, MatDialogModule, SearchBarComponent, Pad4Pipe
  ],
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginator }
  ]
})
export class TicketTableComponent extends DashboardComponent implements AfterViewInit {

  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'subject', 'lastName', 'firstName', 'mail', 'status', 'lastModifiedDate', 'action'];
  dataSource: MatTableDataSource<TicketViewDTO> = new MatTableDataSource<TicketViewDTO>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoading: boolean = false;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  resultsLength: number = 0;
  pageSize: number = this.pageSizeOptions[1];
  listKeywords: string[] = [];

  constructor(private ticketService: TicketService, private notificationService: NotificationService, private translate: TranslateService) {
    super();
  }


  ngAfterViewInit(): void {
    merge(
      this.paginator.page,
      this.sort.sortChange
    )
      .pipe(
        startWith({}),
      )
      .subscribe(() => this.refreshTable());
  }


  openTicketDialog(ticketId: number) {
    zip(this.ticketService.getTicketStatuses(), this.ticketService.getTicket(ticketId))
      .subscribe(([statuses, ticketDetailDTO]) => {
        this.dialog.open(TicketDialogComponent, {
          data: {
            ticketDetailDTO,
            statuses
          } as TicketDialogData,
          disableClose: true,
          autoFocus: false
        })
          .afterClosed()
          .subscribe((updated?: boolean) => {
            if (updated) {
              this.refreshTable();
            }
          });;

      });
  }


  private refreshTable(pageIndex?: number): void {
    this.isLoading = true;

    if (pageIndex !== undefined) {
      this.paginator.pageIndex = pageIndex;
    }

    const sortFieldMap: Record<string, string> = {
      subject: 'ticketCategoryEntity.label',
      status: 'ticketStatusEntity.label',
    };

    const sortFields: { field: string; direction: 'asc' | 'desc' }[] = [];
    if (this.sort?.active && this.sort?.direction) {
      const field = sortFieldMap[this.sort.active] ?? this.sort.active;
      const direction = this.sort.direction as 'asc' | 'desc';
      sortFields.push({ field, direction });
    }

    this.ticketService.getTickets(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.listKeywords,
      sortFields
    )
      .pipe(
        finalize(() => this.isLoading = false),
        tap((result: Page<TicketViewDTO>) => {
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


  private updateRows(rows: TicketViewDTO[], totalElements: number, pageSize: number) {
    this.dataSource.data = rows;
    this.resultsLength = totalElements;
    this.pageSize = pageSize;
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

  getFormattedSequence(index: number): string {
    return (index + 1).toString().padStart(4, '0');
  }


}
