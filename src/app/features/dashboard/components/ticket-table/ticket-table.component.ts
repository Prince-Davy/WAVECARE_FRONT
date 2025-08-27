import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DashboardComponent } from '../../abstract/dashboard-component.abstract';
import { TicketTableService } from '../../services/ticket-table.service';
import { merge, of, startWith, switchMap, map, catchError, Observable, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

type RowDto = any;

@Component({
  selector: 'ticket-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, DatePipe],
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss']
})
export class TicketTableComponent extends DashboardComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'objet', 'nom', 'prenom', 'mail', 'statut', 'date'];
  dataSource = new MatTableDataSource<RowDto>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  resultsLength = 0;
  isLoading = false;
  pageSizeOptions: number[] = [10, 25, 50];

  private sub?: Subscription;

  constructor(private api: TicketTableService) {
    super();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.paginator.pageSize = this.pageSizeOptions[0];
    this.paginator.pageIndex = 0;

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    const page$ = this.paginator.page as unknown as Observable<PageEvent>;
    const sort$ = this.sort.sortChange as unknown as Observable<Sort>;

    this.sub?.unsubscribe();

    this.sub = merge(page$, sort$)
      .pipe(
        startWith(null),
        switchMap(() => {
          this.isLoading = true;

          const sortParams: string[] = this.sort.active
            ? [`${this.sort.active},${this.sort.direction || 'asc'}`]
            : ['ticketCreationDate,desc'];

          return this.api.getTickets(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            sortParams
          );
        }),
        map(res => {
          this.isLoading = false;
          this.resultsLength = res.totalCount ?? res.page.totalElements ?? 0;
          return res.page.content ?? [];
        }),
        catchError(() => {
          this.isLoading = false;
          return of([] as RowDto[]);
        })
      )
      .subscribe(rows => (this.dataSource.data = rows));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  nextPage(): void {
    if (this.paginator?.hasNextPage()) this.paginator.nextPage();
  }

  prevPage(): void {
    if (this.paginator?.hasPreviousPage()) this.paginator.previousPage();
  }
}