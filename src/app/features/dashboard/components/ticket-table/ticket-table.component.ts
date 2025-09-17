import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { DashboardComponent } from '@app/features/dashboard/abstract/dashboard-component.abstract';
import { CustomPaginator } from '@app/features/dashboard/classes/custom-paginator';
import { Page, TicketService } from '@app/features/dashboard/services/ticket.service';
import { TranslateModule } from '@ngx-translate/core';
import { finalize, merge, zip } from 'rxjs';
import { TicketDialogComponent, TicketDialogData } from '../ticket-dialog/ticket-dialog.component';
import { TicketViewDTO } from '../../models/ticket-view-dto';
import { TicketdetailUpdateDTO } from '../../models/ticket-detail-update-dto';
import { MatInputModule } from "@angular/material/input";
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../search-bar/ticket-search-bar.component';


@Component({
  selector: 'ticket-table',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatSortModule, DatePipe,
    TranslateModule, MatIconModule, MatTooltip, MatCardModule, FormsModule,
    MatInputModule, MatChipsModule, MatFormFieldModule, CommonModule, MatDialogModule,SearchBarComponent
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

  constructor(private ticketService: TicketService) {
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
        })
          .afterClosed()
          .subscribe((ticketdetailUpdateDTO: TicketdetailUpdateDTO) => {
            if (ticketdetailUpdateDTO !== undefined) {
              console.log(ticketdetailUpdateDTO);
              this.ticketService.updateTicket(ticketdetailUpdateDTO)
                .pipe(finalize(() => this.refreshTable()))
                .subscribe({
                  error: (error: any) => {
                    console.error("An error occurred when trying to update ticket.", error)
                  }
                });
            }
          });;

      });
  }

  private refreshTable(): void {
    this.isLoading = true;
    this.ticketService.getTickets(this.paginator.pageIndex, this.paginator.pageSize)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (result: Page<TicketViewDTO>) => {
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
    this.applyMultiFilter();
  }

  onKeywordsChanged(keywords: string[]) {
    this.listKeywords = keywords;
    this.applyMultiFilter();
  }
  

  applyMultiFilter(): void {
    this.dataSource.filterPredicate = (data: TicketViewDTO, filter: string): boolean => {
      const keywords = filter.split('|').map(k => k.toLowerCase().trim());

      return keywords.every(keyword =>
        data.id?.toString().includes(keyword) ||
        data.firstName?.toLowerCase().includes(keyword) ||
        data.lastName?.toLowerCase().includes(keyword) ||
        data.mail?.toLowerCase().includes(keyword)
      );
    };

    this.dataSource.filter = this.listKeywords.join('|').toLowerCase().trim();
    this.resultsLength = this.dataSource.filteredData.length;
  }
}
