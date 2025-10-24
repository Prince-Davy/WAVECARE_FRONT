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
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { DashboardComponent } from '@app/features/dashboard/abstract/dashboard-component.abstract';
import { CustomPaginator } from '@app/features/dashboard/classes/custom-paginator';
import { Page, TicketService } from '@app/features/dashboard/services/ticket.service';
import { NotificationService } from '@app/features/notification/services/notification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize, merge, zip } from 'rxjs';
import { TicketDetailUpdateDTO } from '../../models/ticket-detail-update-dto';
import { TicketViewDTO } from '../../models/ticket-view-dto';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { TicketDialogComponent, TicketDialogData } from '../ticket-dialog/ticket-dialog.component';


@Component({
  selector: 'ticket-table',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatSortModule, DatePipe,
    TranslateModule, MatIconModule, MatTooltip, MatCardModule, FormsModule,
    MatInputModule, MatChipsModule, MatFormFieldModule, CommonModule, MatDialogModule, SearchBarComponent
  ],
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginator }
  ]
})
export class TicketTableComponent extends DashboardComponent implements AfterViewInit {

  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'subject', 'lastName', 'firstName', 'mail', 'status', 'date', 'action'];
  dataSource: MatTableDataSource<TicketViewDTO> = new MatTableDataSource<TicketViewDTO>([]);

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
    merge(this.paginator.initialized, this.paginator.page)
      .subscribe(() => {
        this.refreshTable();
      });

    this.dataSource.paginator = this.paginator;
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
          .subscribe((ticketDetailUpdateDTO: TicketDetailUpdateDTO | undefined) => {
            if (ticketDetailUpdateDTO !== undefined) {
              this.ticketService.updateTicket(ticketDetailUpdateDTO)
                .pipe(finalize(() => this.refreshTable()))
                .subscribe({
                  next: () => {
                    this.notificationService.openSuccessSnackBar(this.translate.instant('feature.dashboard.ticket-table-component.table.column.action.message.success', { id: ticketId }));
                  },
                  error: (error: any) => {
                    this.notificationService.openErrorSnackBar(this.translate.instant('feature.dashboard.ticket-table-component.table.column.action.message.error', { id: ticketId }));
                    console.error("An error occurred when trying to update ticket.", error)
                  }
                });
            }
          });;

      });
  }

  private refreshTable(pageIndex?: number): void {
    this.isLoading = true;

    if (pageIndex !== undefined) {
      this.paginator.pageIndex = pageIndex;
    }
    this.ticketService.getTickets(this.paginator.pageIndex, this.paginator.pageSize, this.listKeywords)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (result: Page<TicketViewDTO>) => {
          result.content = result.content.sort((a: TicketViewDTO, b:TicketViewDTO) => { return (a.statusLabel === "SOLVED" ? 1 : 0) - (b.statusLabel === "SOLVED" ? 1 : 0);});
          this.updateRows(result.content, result.totalElements, result.size);
        },
        error: (error: HttpErrorResponse) => {
          console.error('An error occurred while loading tickets;', error);
          this.updateRows([], 0, 0);
        }
      });
  }

  private updateRows(rows: TicketViewDTO[], totalElements: number, pageSize: number) {
    this.dataSource = new MatTableDataSource(rows);
    this.resultsLength = totalElements;
    this.pageSize = pageSize;
  }

  keywordsChanged(currentListKeywords: string[]) {
    this.listKeywords = currentListKeywords;
    this.refreshTable(0);
  }
}
