import { Component, DestroyRef, afterNextRender, effect, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { merge, startWith } from 'rxjs';

import { DashboardComponent } from '@app/features/dashboard/abstract/dashboard-component.abstract';
import { SearchBarComponent } from '@app/features/dashboard/components/search-bar/search-bar.component';
import { PatientStore, PatientFilters } from '@app/features/dashboard/stores/patient.store';
import type { PatientResponse } from '@app/api/model';

/**
 * TODO: Documentation for parseBirthDate (function)
 */
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

/**
 * TODO: Documentation for getFrenchPaginatorIntl (function)
 */
// Factory function to create a MatPaginatorIntl with French labels
function getFrenchPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Nombre de lignes par page';
  paginatorIntl.nextPageLabel = 'Page suivante';
  paginatorIntl.previousPageLabel = 'Page précédente';
  paginatorIntl.firstPageLabel = 'Première page';
  paginatorIntl.lastPageLabel = 'Dernière page';

  paginatorIntl.getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ): string => {
    if (length === 0 || pageSize === 0) {
      return `0 sur ${length}`;
    }

    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);

    return `${startIndex + 1} – ${endIndex} sur ${length}`;
  };

  return paginatorIntl;
}

// Re-export for backward compat with components that imported from here
export type { PatientFilters } from '@app/features/dashboard/stores/patient.store';
export type { PatientResponse } from '@app/api/model';

/**
 * TODO: Documentation for PatientTableComponent (class)
 */
/**
 * TODO: Documentation for PatientTableComponent (class)
 */
/**
 * TODO: Documentation for PatientTableComponent (class)
 */
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
  providers: [
    { provide: MatPaginatorIntl, useFactory: getFrenchPaginatorIntl }
  ],
  templateUrl: './patient-table.component.html',
  styleUrl: './patient-table.component.scss',
})
export class PatientTableComponent extends DashboardComponent {

/**
 * TODO: Documentation for displayedColumns (property)
 */
  displayedColumns: string[] = ['id', 'lastName', 'firstName', 'ins', 'birthDate', 'action'];
/**
 * TODO: Documentation for dataSource (property)
 */
  dataSource: MatTableDataSource<PatientResponse> = new MatTableDataSource<PatientResponse>([]);

  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);

  isLoading = false;

/**
 * TODO: Documentation for pageSizeOptions (property)
 */
  pageSizeOptions: number[] = [5, 10, 25, 50];
  resultsLength = 0;
  pageSize = this.pageSizeOptions[1];

/**
 * TODO: Documentation for listKeywords (property)
 */
  listKeywords: string[] = [];
/**
 * TODO: Documentation for filters (property)
 */
  filters: PatientFilters = {};

/**
 * TODO: Documentation for constructor (method)
 * @param patientStore - TODO
 * @param router - TODO
 * @param route - TODO
 * @returns TODO
 */
  constructor(private readonly patientStore: PatientStore,
/**
 * TODO: Documentation for router (property)
 */
    private router: Router,
/**
 * TODO: Documentation for route (property)
 */
    public route: ActivatedRoute) {
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
      this.dataSource.data = (this.patientStore.patients() ?? []).map(p => ({
        ...p,
/**
 * TODO: Documentation for birthDate (property)
 */
        birthDate: parseBirthDate(p.birthDate as string)
      })) as any[];
      this.resultsLength = this.patientStore.totalElements();
      this.pageSize = this.patientStore.pageSize();
      this.isLoading = this.patientStore.loading();
      const pg = this.paginator();
/**
 * TODO: Documentation for if (method)
 * @param pg - TODO
 * @returns TODO
 */
      if (pg) {
        pg.length = this.patientStore.totalElements();
        pg.pageSize = this.patientStore.pageSize();
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
 * TODO: Documentation for refreshTable (method)
 * @param pageIndex? - TODO
 * @returns TODO
 */
  private refreshTable(pageIndex?: number): void {
/**
 * TODO: Documentation for if (method)
 * @param ! - TODO
 * @returns TODO
 */
    if (pageIndex !== undefined) {
      this.paginator()!.pageIndex = pageIndex;
    }

    const sortField = this.sort()?.active || 'id';
    const sortDirection = this.sort()?.direction || 'asc';

    this.filters = {
      ...this.filters,
/**
 * TODO: Documentation for keywords (property)
 */
      keywords: this.listKeywords ?? this.filters.keywords,
    };

    this.patientStore.load(
      this.paginator()!.pageIndex,
      this.paginator()!.pageSize,
      this.listKeywords,
      sortField,
      sortDirection,
      this.filters
    );
  }

/**
 * TODO: Documentation for onPatientSearch (method)
 * @param value - TODO
 * @returns TODO
 */
  onPatientSearch(value: string) {
    const v = value?.trim();
    this.listKeywords = v ? [v.toLowerCase()] : [];

    this.filters = {
      ...this.filters,
/**
 * TODO: Documentation for keywords (property)
 */
      keywords: this.listKeywords,
    };

    this.refreshTable(0); // ✅ met à jour la table + resultsLength => compteur aussi
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

  // si votre SearchBar expose aussi des filtres avancés, vous pouvez les brancher ici
/**
 * TODO: Documentation for filtersChanged (method)
 * @param filters - TODO
 * @returns TODO
 */
  filtersChanged(filters: any): void {
    // Exemple si vous ajoutez plus tard une date de naissance
    // this.filters.birthDate = filters?.birthDate;
    this.refreshTable(0);
  }

/**
 * TODO: Documentation for resetTable (method)
 * @returns TODO
 */
  resetTable(): void {
    this.listKeywords = [];
    this.filters = {};
    this.sort()!.active = '';
    this.sort()!.direction = '';
    this.paginator()!.pageIndex = 0;
    this.refreshTable(0);
  }

/**
 * TODO: Documentation for consultPatient (method)
 * @param patient - TODO
 * @returns TODO
 */
  consultPatient(patient: PatientResponse): void {
    // naviguer vers patient detail page
    this.router.navigate([patient.id], {
/**
 * TODO: Documentation for relativeTo (property)
 */
      relativeTo: this.route,
/**
 * TODO: Documentation for queryParamsHandling (property)
 */
      queryParamsHandling: 'preserve'
    });
  }
}
