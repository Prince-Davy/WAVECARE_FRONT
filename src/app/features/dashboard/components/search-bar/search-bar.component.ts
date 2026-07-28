
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { AdvancedFiltersComponent, AdvancedFilters } from './filters/advanced-filters.component';
import { FilterUtils } from '@app/features/utils/filter.utils';


/**
 * TODO: Documentation for SearchBarComponent (class)
 */
/**
 * TODO: Documentation for SearchBarComponent (class)
 */
/**
 * TODO: Documentation for SearchBarComponent (class)
 */
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    TranslateModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatChipsModule,
    FormsModule,
    MatIconModule,
    AdvancedFiltersComponent
  ],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

/**
 * TODO: Documentation for getTranslationResultsFound (method)
 * @param results - TODO
 * @returns TODO
 */
  getTranslationResultsFound(results: number): string {
    return results > 1 ? 'feature.dashboard.search-bar.search-bar-component.result-found-second-part.plural' : 'feature.dashboard.search-bar.search-bar-component.result-found-second-part.singular'
  }

/**
 * TODO: Documentation for listKeywords (property)
 */
  listKeywords: string[] = [];
/**
 * TODO: Documentation for inputValue (property)
 */
  inputValue: string = '';
/**
 * TODO: Documentation for isFiltersOpen (property)
 */
  isFiltersOpen: boolean = false;
/**
 * TODO: Documentation for advancedFilters (property)
 */
  advancedFilters: AdvancedFilters = {};
  get showResetButton(): boolean {
    const hasKeywords = Array.isArray(this.listKeywords) && this.listKeywords.length > 0;
    const af = this.advancedFilters || {} as any;
    const hasRole = Array.isArray(af.role) && af.role.length > 0;
    const hasStatus = Array.isArray(af.status) && af.status.length > 0;
    const hasDate = !!af.createdDate && af.createdDate !== '';
    return hasKeywords || hasRole || hasStatus || hasDate;
  }
    readonly mode = input<'chips' | 'simple'>('chips');

  // Personnalisation labels (patients vs tickets)
  readonly placeholderKey = input('feature.dashboard.search-bar.search-bar-component.search-input-placeholder');
  readonly infoKey = input('feature.dashboard.search-bar.search-bar-component.search-information');

  // Pour le mode simple : un seul terme (pas de chips obligatoires)
  readonly simpleSearch = output<string>();

  readonly totalResults = input(0);
  readonly showAdvancedFilters = input(false);
  readonly keywordsChanged = output<string[]>();
  readonly filtersChanged = output<AdvancedFilters>();

	readonly resetRequested = output<void>();

/**
 * TODO: Documentation for onReset (method)
 * @returns TODO
 */
  onReset(): void {
  this.inputValue = '';          
  this.removeAllKeywords();
  this.isFiltersOpen = false;

  if (this.mode() === 'simple') {
    this.simpleSearch.emit('');
  }

  this.resetRequested.emit();
}

/**
 * TODO: Documentation for onSearch (method)
 * @returns TODO
 */
  onSearch(): void {
  const trimmed = (this.inputValue ?? '').trim();
  console.log('SEARCH MODE => ', this.mode());
  console.log('INPUT BEFORE => ', this.inputValue);

  const trimed = (this.inputValue ?? '').trim();
  console.log('INPUT TRIMMED => ', trimed);

  if (this.mode() === 'simple') {
    console.log('PASSAGE SIMPLE ');

    this.listKeywords = trimmed ? [trimmed.toLowerCase()] : [];
    this.simpleSearch.emit(trimmed);

    this.inputValue = '';
    console.log('INPUT AFTER => ', this.inputValue);

    return;
  }

  // Mode actuel : chips
  this.addKeyword();
}

/**
 * TODO: Documentation for toggleFilters (method)
 * @returns TODO
 */
	toggleFilters(): void {
		this.isFiltersOpen = !this.isFiltersOpen;
	}

/**
 * TODO: Documentation for onAdvancedFiltersChanged (method)
 * @param filters - TODO
 * @returns TODO
 */
	onAdvancedFiltersChanged(filters: AdvancedFilters): void {
    this.advancedFilters = filters;
    this.filtersChanged.emit(filters);
	}

/**
 * TODO: Documentation for onAdvancedFiltersReset (method)
 * @returns TODO
 */
	onAdvancedFiltersReset(): void {
		this.advancedFilters = {};
		this.filtersChanged.emit({});
	}

/**
 * TODO: Documentation for addKeyword (method)
 * @returns TODO
 */

  addKeyword(): void {
    const trimmed = this.inputValue?.trim();

    if (trimmed && !this.listKeywords.includes(trimmed)) {

      if (this.listKeywords.length < 4) {
        this.listKeywords.push(trimmed.toLowerCase());
        this.keywordsChanged.emit(this.listKeywords);
      }
    }
    this.inputValue = '';
  }

/**
 * TODO: Documentation for removeKeyword (method)
 * @param keyword - TODO
 * @returns TODO
 */
  removeKeyword(keyword: string): void {
    const index = this.listKeywords.indexOf(keyword);

    if (index >= 0) {
      this.listKeywords.splice(index, 1);
      this.keywordsChanged.emit(this.listKeywords);
    }
  }

/**
 * TODO: Documentation for removeRoleFilter (method)
 * @param filter - TODO
 * @returns TODO
 */
  removeRoleFilter(filter: string): void {
    const index = this.advancedFilters.role?.indexOf(filter) ?? -1;

    if (index >= 0) {
      this.advancedFilters.role?.splice(index, 1);
      this.filtersChanged.emit(this.advancedFilters);
    }
  }

/**
 * TODO: Documentation for removeStatusFilter (method)
 * @param filter - TODO
 * @returns TODO
 */
  removeStatusFilter(filter: string): void {
    const index = this.advancedFilters.status?.indexOf(filter) ?? -1;

    if (index >= 0) {
      this.advancedFilters.status?.splice(index, 1);
      this.filtersChanged.emit(this.advancedFilters);
    }
  }

/**
 * TODO: Documentation for removeDateFilter (method)
 * @returns TODO
 */
  removeDateFilter(): void {
    this.advancedFilters.createdDate = ''
    this.filtersChanged.emit(this.advancedFilters);
  }

/**
 * TODO: Documentation for getRoleLabel (method)
 * @param role - TODO
 * @returns TODO
 */
  getRoleLabel(role: string): string {
    return FilterUtils.getRoleLabel(role);
  }

/**
 * TODO: Documentation for getStatusLabel (method)
 * @param status - TODO
 * @returns TODO
 */
  getStatusLabel(status: string): string {
    return FilterUtils.getStatusLabel(status);
  }

/**
 * TODO: Documentation for formatDate (method)
 * @param dateInput - TODO
 * @returns TODO
 */
  formatDate(dateInput: string | Date | null): string {
    return FilterUtils.formatDate(dateInput);
  }

/**
 * TODO: Documentation for removeAllKeywords (method)
 * @returns TODO
 */
  removeAllKeywords(): void {
    this.listKeywords = [];
    this.advancedFilters = {

      role: [],

      status: [],

      createdDate: ''
    }
    this.keywordsChanged.emit(this.listKeywords);
  }
}
