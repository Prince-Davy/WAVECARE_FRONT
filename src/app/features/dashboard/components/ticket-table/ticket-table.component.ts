import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, afterNextRender, effect, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { TicketStore } from '@app/features/dashboard/stores/ticket.store';
import { TicketsService } from '@app/api/generated/tickets/tickets.service';
import { TicketStatusesService } from '@app/api/generated/ticket-statuses/ticket-statuses.service';
import { NotificationService } from '@app/features/notification/services/notification.service';
import { Pad4Pipe } from '@app/features/dashboard/pipes/pad4.pide';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { merge, startWith, zip } from 'rxjs';
import type { TicketResponse } from '@app/api/model';


/**
 * TODO: Documentation for TicketTableComponent (class)
 */
/**
 * TODO: Documentation for TicketTableComponent (class)
 */
/**
 * TODO: Documentation for TicketTableComponent (class)
 */
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
export class TicketTableComponent extends DashboardComponent {

  readonly dialog = inject(MatDialog);

/**
 * TODO: Documentation for displayedColumns (property)
 */
  displayedColumns: string[] = ['id', 'subject', 'lastName', 'firstName', 'mail', 'status', 'lastModifiedDate', 'action'];
  dataSource = new MatTableDataSource<TicketResponse>([]);

  readonly sort = viewChild(MatSort);
  readonly paginator = viewChild(MatPaginator);

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

/**
 * TODO: Documentation for constructor (method)
 * @param ticketStore - TODO
 * @param ticketsApi - TODO
 * @param ticketStatusesApi - TODO
 * @param notificationService - TODO
 * @param translate - TODO
 * @returns TODO
 */
  constructor(private ticketStore: TicketStore, private ticketsApi: TicketsService, private ticketStatusesApi: TicketStatusesService, private notificationService: NotificationService, private translate: TranslateService) {
/**
 * TODO: Documentation for super (method)
 * @returns TODO
 */
    super();
    const destroyRef = inject(DestroyRef);

/**
 * TODO: Documentation for effect (method)
 * @param ( - TODO
 * @returns TODO
 */
    effect(() => {
      this.dataSource.data = this.ticketStore.tickets();
      this.resultsLength = this.ticketStore.totalElements();
      this.pageSize = this.ticketStore.pageSize();
      this.isLoading = this.ticketStore.loading();
      const p = this.paginator();
      if (p) {
        p.length = this.ticketStore.totalElements();
        p.pageSize = this.ticketStore.pageSize();
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
 * TODO: Documentation for openTicketDialog (method)
 * @param ticketId - TODO
 * @returns TODO
 */

  openTicketDialog(ticketId: number) {
/**
 * TODO: Documentation for zip (method)
 * @param this.ticketStatusesApi.ticketStatusList() - TODO
 * @param this.ticketsApi.ticketGetById(ticketId) - TODO
 * @returns TODO
 */
    zip(this.ticketStatusesApi.ticketStatusList(), this.ticketsApi.ticketGetById(ticketId))
      .subscribe(([statuses, ticketDetailDTO]) => {
        this.dialog.open(TicketDialogComponent, {
/**
 * TODO: Documentation for data (property)
 */
          data: {
            ticketDetailDTO,
            statuses
          } as TicketDialogData,
/**
 * TODO: Documentation for disableClose (property)
 */
          disableClose: true,
/**
 * TODO: Documentation for autoFocus (property)
 */
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

/**
 * TODO: Documentation for refreshTable (method)
 * @param pageIndex? - TODO
 * @returns TODO
 */

  private refreshTable(pageIndex?: number): void {
    if (pageIndex !== undefined) {
      this.paginator()!.pageIndex = pageIndex;
    }

    const sortFieldMap: Record<string, string> = {
/**
 * TODO: Documentation for subject (property)
 */
      subject: 'ticketCategoryEntity.label',
/**
 * TODO: Documentation for status (property)
 */
      status: 'ticketStatusEntity.label',
    };

    const sortFields: { field: string; direction: 'asc' | 'desc' }[] = [];
    if (this.sort()?.active && this.sort()?.direction) {
      const field = sortFieldMap[this.sort()!.active] ?? this.sort()!.active;
      const direction = this.sort()!.direction as 'asc' | 'desc';
      sortFields.push({ field, direction });
    }

    this.ticketStore.load(
      this.paginator()!.pageIndex,
      this.paginator()!.pageSize,
      this.listKeywords,
      sortFields
    );
  }

/**
 * TODO: Documentation for updateRows (method)
 * @param rows - TODO
 * @param totalElements - TODO
 * @param pageSize - TODO
 * @returns TODO
 */

  private updateRows(rows: TicketResponse[], totalElements: number, pageSize: number) {
    this.dataSource.data = rows;
    this.resultsLength = totalElements;
    this.pageSize = pageSize;
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
 * TODO: Documentation for resetTable (method)
 * @returns TODO
 */

  resetTable(): void {
    this.listKeywords = [];
    this.sort()!.active = '';
    this.sort()!.direction = '';
    this.paginator()!.pageIndex = 0;
    this.refreshTable(0);
  }

/**
 * TODO: Documentation for getFormattedSequence (method)
 * @param index - TODO
 * @returns TODO
 */
  getFormattedSequence(index: number): string {
/**
 * TODO: Documentation for return (method)
 * @param 1).toString().padStart(4 - TODO
 * @param '0' - TODO
 * @returns TODO
 */
    return (index + 1).toString().padStart(4, '0');
  }


}
