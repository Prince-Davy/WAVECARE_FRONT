import { Component, ViewChild, AfterViewInit } from '@angular/core';

// utility to parse dd/MM/yyyy strings into Date objects
function parseBirthDate(value: string): Date {
  if (!value) {
    return new Date(NaN);
  }
  const parts = value.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  // fallback to native parser
  return new Date(value);
}
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { finalize, merge, startWith, tap } from 'rxjs';

import { DashboardComponent } from '@app/features/dashboard/abstract/dashboard-component.abstract';
import { Page } from '@app/features/dashboard/models/page';
import { SearchBarComponent } from '@app/features/dashboard/components/search-bar/search-bar.component';
import { PatientService } from '@app/features/dashboard/services/patient.service';


export interface PatientDTO {
  id: number;
  lastName: string;
  firstName: string;
  ins: string;
  birthDate: Date; // converted from backend string
}

export interface PatientFilters {
  keywords?: string[];
  birthDate?: string;
}

@Component({
  selector: 'app-patient-table',
  standalone: true,
  imports: [
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    TranslateModule,
    SearchBarComponent,
    RouterModule
  ],
  providers: [PatientService],
  templateUrl: './patient-table.component.html',
  styleUrl: './patient-table.component.scss',
})
export class PatientTableComponent extends DashboardComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'lastName', 'firstName', 'ins', 'birthDate', 'action'];
  dataSource: MatTableDataSource<PatientDTO> = new MatTableDataSource<PatientDTO>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading = false;

  pageSizeOptions: number[] = [5, 10, 25, 50];
  resultsLength = 0;
  pageSize = this.pageSizeOptions[1];

  listKeywords: string[] = [];
  filters: PatientFilters = {};

  constructor(private readonly patientService: PatientService,
              private router: Router,
              public route: ActivatedRoute) {
    super();
  }

  ngAfterViewInit(): void {
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(startWith({}))
      .subscribe(() => this.refreshTable());
  }

  private refreshTable(pageIndex?: number): void {
    this.isLoading = true;

    if (pageIndex !== undefined) {
      this.paginator.pageIndex = pageIndex;
    }

    const sortField = this.sort?.active || 'id';
    const sortDirection = this.sort?.direction || 'asc';

    this.filters = {
      ...this.filters,
      keywords: this.listKeywords ?? this.filters.keywords,
    };

    this.patientService.getPatients(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.listKeywords,
      sortField,
      sortDirection,
      this.filters
    ).pipe(
      finalize(() => (this.isLoading = false)),
      tap((result: Page<PatientDTO>) => {
        // transform birthDate string to Date for the date pipe
        this.dataSource.data = (result.content ?? []).map(p => ({
          ...p,
          birthDate: parseBirthDate(p.birthDate as unknown as string)
        } as PatientDTO));
        const total = result.totalElements ?? 0;
        const size = result.size ?? this.pageSize;

        this.resultsLength = total;
        this.pageSize = size;

        this.paginator.length = total;
        this.paginator.pageSize = size;
      })
    ).subscribe();
  }

  onPatientSearch(value: string) {
  const v = value?.trim();
  this.listKeywords = v ? [v.toLowerCase()] : [];

  this.filters = {
    ...this.filters,
    keywords: this.listKeywords,
  };

  this.refreshTable(0); // ✅ met à jour la table + resultsLength => compteur aussi
}

  keywordsChanged(currentListKeywords: string[]) {
    this.listKeywords = currentListKeywords;
    this.refreshTable(0);
  }

  // si votre SearchBar expose aussi des filtres avancés, vous pouvez les brancher ici
  filtersChanged(filters: any): void {
    // Exemple si vous ajoutez plus tard une date de naissance
    // this.filters.birthDate = filters?.birthDate;
    this.refreshTable(0);
  }

  resetTable(): void {
    this.listKeywords = [];
    this.filters = {};
    this.sort.active = '';
    this.sort.direction = '';
    this.paginator.pageIndex = 0;
    this.refreshTable(0);
  }

  consultPatient(patient: PatientDTO): void {
    // naviguer vers patient detail page
    this.router.navigate([patient.id], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve'
    });
  }
}
