import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TicketTableService } from '@app/features/ticket-table/ticket-table-services/ticket-table.service';

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
export class TicketTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'objet', 'nom', 'prenom', 'mail', 'statut', 'date'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private ticketTableService: TicketTableService) {
  }

  ngOnInit(): void {
    this.getTicketData();
  }

  getTicketData(): void {
    this.ticketTableService.getTicket().subscribe({
      next: (response) => {
        this.dataSource.data = this.formatTicketData(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      error: (error) => {
        console.error('Erreur lors de la récupération des tickets :', error);
      }
    });

  }


  formatTicketData(data: any[]): any[] {
    return data.map(ticket => ({
      id: ticket.idTicket,
      objet: ticket.ticketCategorie || 'N/A',
      nom: ticket.ticketNom,
      prenom: ticket.ticketPrenom,
      mail: ticket.ticketMail,
      statut: ticket.ticketStatut || 'En attente',
      date: new Date().toLocaleDateString()
    }));
  }

}
