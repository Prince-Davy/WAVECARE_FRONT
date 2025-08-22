import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DashboardComponent } from '../../abstract/dashboard-component.abstract';

@Component({
  selector: 'ticket-table',
  standalone: true,
  imports: [
    MatTableModule,       // Module pour mat-table
    MatPaginatorModule,   // Module pour mat-paginator
    MatSortModule         // Module pour tri (si nécessaire)
  ],
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss']
})
export class TicketTableComponent extends DashboardComponent implements OnInit {
  displayedColumns: string[] = ['id', 'objet', 'nom', 'prenom', 'mail', 'statut', 'date'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    super();
  }

  ngOnInit(): void { }
}
