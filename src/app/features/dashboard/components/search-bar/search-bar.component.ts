
import { Component, EventEmitter, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { AdvancedFiltersComponent, AdvancedFilters } from './filters/advanced-filters.component';
import { FilterUtils } from '@app/features/utils/filter.utils';


@Component({
  selector: 'app-search-bar',
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
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

  getTranslationResultsFound(results: number): string {
    return results > 1 ? 'feature.dashboard.search-bar.search-bar-component.result-found-second-part.plural' : 'feature.dashboard.search-bar.search-bar-component.result-found-second-part.singular'
  }

  listKeywords: string[] = [];
  inputValue: string = '';
  isFiltersOpen: boolean = false;
  advancedFilters: AdvancedFilters = {};
  get showResetButton(): boolean {
    const hasKeywords = Array.isArray(this.listKeywords) && this.listKeywords.length > 0;
    const af = this.advancedFilters || {} as any;
    const hasRole = Array.isArray(af.role) && af.role.length > 0;
    const hasStatus = Array.isArray(af.status) && af.status.length > 0;
    const hasDate = !!af.createdDate && af.createdDate !== '';
    return hasKeywords || hasRole || hasStatus || hasDate;
  }

    @Input() mode: 'chips' | 'simple' = 'chips';

  // Personnalisation labels (patients vs tickets)
  @Input() placeholderKey = 'feature.dashboard.search-bar.search-bar-component.search-input-placeholder';
  @Input() infoKey = 'feature.dashboard.search-bar.search-bar-component.search-information';


  // Pour le mode simple : un seul terme (pas de chips obligatoires)
  @Output() simpleSearch = new EventEmitter<string>();

  @Input() totalResults: number = 0;
  @Input() showAdvancedFilters: boolean = false;
  @Output() keywordsChanged = new EventEmitter<string[]>();
  @Output() filtersChanged = new EventEmitter<AdvancedFilters>();

	@Output() resetRequested = new EventEmitter<void>();

	/*
  onReset(): void {
		this.removeAllKeywords();
		this.isFiltersOpen = false;
		this.resetRequested.emit();
	}
  */

  onReset(): void {
  this.inputValue = '';          
  this.removeAllKeywords();
  this.isFiltersOpen = false;

  // si mode simple : déclencher une recherche vide (retour liste complète)
  if (this.mode === 'simple') {
    this.simpleSearch.emit('');
  }

  this.resetRequested.emit();
}

  onSearch(): void {
  const trimmed = (this.inputValue ?? '').trim();

  // Mode patient/simple : on émet directement la valeur
  if (this.mode === 'simple') {

    this.listKeywords = trimmed ? [trimmed.toLowerCase()] : [];
    this.simpleSearch.emit(trimmed);
    return;
  }

  // Mode actuel : chips
  this.addKeyword();
}

	toggleFilters(): void {
		this.isFiltersOpen = !this.isFiltersOpen;
	}

	onAdvancedFiltersChanged(filters: AdvancedFilters): void {
    this.advancedFilters = filters;
    this.filtersChanged.emit(filters);
	}

	onAdvancedFiltersReset(): void {
		this.advancedFilters = {};
		this.filtersChanged.emit({});
	}


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

  removeKeyword(keyword: string): void {
    const index = this.listKeywords.indexOf(keyword);

    if (index >= 0) {
      this.listKeywords.splice(index, 1);
      this.keywordsChanged.emit(this.listKeywords);
    }
  }

  removeRoleFilter(filter: string): void {
    const index = this.advancedFilters.role?.indexOf(filter) ?? -1;
    if (index >= 0) {
      this.advancedFilters.role?.splice(index, 1);
      this.filtersChanged.emit(this.advancedFilters);
    }
  }

  removeStatusFilter(filter: string): void {
    const index = this.advancedFilters.status?.indexOf(filter) ?? -1;
    if (index >= 0) {
      this.advancedFilters.status?.splice(index, 1);
      this.filtersChanged.emit(this.advancedFilters);
    }
  }

  removeDateFilter(): void {
    this.advancedFilters.createdDate = ''
    this.filtersChanged.emit(this.advancedFilters);
  }

  getRoleLabel(role: string): string {
    return FilterUtils.getRoleLabel(role);
  }

  getStatusLabel(status: string): string {
    return FilterUtils.getStatusLabel(status);
  }

  formatDate(dateInput: string | Date | null): string {
    return FilterUtils.formatDate(dateInput);
  }

  removeAllKeywords(): void {
    this.listKeywords = [];
    this.advancedFilters = {
      role: [],
      status: [],
      createdDate: ''
    }
    this.keywordsChanged.emit(this.listKeywords);
    // this.filtersChanged.emit(this.advancedFilters);
  }
}
