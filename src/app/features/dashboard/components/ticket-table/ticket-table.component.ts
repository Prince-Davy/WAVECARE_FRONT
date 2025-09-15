import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from '@angular/material/dialog';
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
import { MatChip, MatChipInputEvent } from "@angular/material/chips";
import { MatInputModule } from "@angular/material/input";
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ENTER } from '@angular/cdk/keycodes';


@Component({
  selector: 'ticket-table',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatSortModule, DatePipe,
    TranslateModule, MatIconModule, MatTooltip, MatCardModule, FormsModule,
    MatChip, MatInputModule,MatChipsModule,MatFormFieldModule,CommonModule],
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

  isLoading: boolean = false; // TODO : Make a loader ?
  pageSizeOptions: number[] = [5, 10, 25, 50];
  resultsLength: number = 0;
  pageSize: number = this.pageSizeOptions[1];
  matChipInputTokenEnd: any;
  listKeywords: string[] = [];
  inputValue: string = '';
  separatorKeysCodes: number[] = [ENTER];

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
        })
          .afterClosed()
          .subscribe((ticketdetailUpdateDTO: TicketdetailUpdateDTO) => {
            console.log('The dialog was closed');
            if (ticketdetailUpdateDTO !== undefined) {
              console.log(ticketdetailUpdateDTO);
              this.ticketService.updateTicket(ticketdetailUpdateDTO)
                .pipe(finalize(() => this.refreshTable()))
                .subscribe({
                  error: (error: any) => {
                    console.error("An error occurred when trying to update ticket.")
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
  }
  
  addKeyword(): void {
    const value = this.inputValue.trim();
    if (value) {
      this.listKeywords.push(value.toLowerCase());
      this.applyMultiFilter();
      this.inputValue = '';
    }
  }

  removeKeyword(keyword: string): void {
    const index = this.listKeywords.indexOf(keyword);

    if (index >= 0) {
      this.listKeywords.splice(index, 1);
      this.applyMultiFilter();
    }
  }

  private applyMultiFilter(): void {
    this.dataSource.filterPredicate = (data: TicketViewDTO, filter: string): boolean => {
      const keywords = filter.split('|');
      return keywords.every(keyword =>
        data.id.toString().includes(keyword) ||
        data.firstName.toLowerCase().includes(keyword) ||
        data.lastName.toLowerCase().includes(keyword) ||
        data.mail.toLowerCase().includes(keyword)
      );
    };
    this.dataSource.filter = this.listKeywords.join('|');
  }

}
