import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

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
export class TicketTableComponent {
  displayedColumns: string[] = ['id', 'objet', 'nom', 'prenom', 'mail', 'statut', 'date'];
  dataSource = []; // Remplacez par vos données réelles
}