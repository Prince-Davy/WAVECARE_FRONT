import { Component, EventEmitter, Output, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { FilterUtils } from '@app/features/utils/filter.utils';
import { UserService } from '@app/features/dashboard/services/user.service';

export interface AdvancedFilters {
  role?: string[];
  status?: string[];
  createdDate?: string;
}

@Component({
  selector: 'app-advanced-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    TranslateModule,
    MatCheckbox
],
  templateUrl: './advanced-filters.component.html',
  styleUrl: './advanced-filters.component.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: { dateInput: 'DD/MM/YYYY' },
        display: {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY'
        }
      }
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedFiltersComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() filtersChanged = new EventEmitter<AdvancedFilters>();
  @Output() toggleOpen = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();

  filtersForm: FormGroup;
  appliedFilters: { roles: string[]; statuses: string[]; createdDate: string | null } = {
    roles: [],
    statuses: [],
    createdDate: null
  };
  
  roles: string[] = [];
  statuses = ['active', 'locked'];

  constructor(private readonly fb: FormBuilder, private readonly cdr: ChangeDetectorRef, private readonly userService: UserService) {
    this.filtersForm = this.fb.group({
      roles: this.fb.control<string[]>([]),
      statuses: this.fb.control<string[]>([]),
      createdDate: this.fb.control<string | Date | null>('')
    });
  }

  
  ngOnInit(): void {
    this.userService.getUserRoles().subscribe({
      next: roles => this.roles = roles,
      error: err => console.error('Erreur chargement rôles', err)
    });
  }


  toggleFilters(): void {
    this.toggleOpen.emit();
  }

  
  onToggleArray(key: 'roles' | 'statuses', value: string, checked: boolean) {
    const current = this.filtersForm.get(key)?.value ?? [];
    const next = new Set(current as string[]);
    if (checked) next.add(value);
    else next.delete(value);
    this.filtersForm.get(key)?.setValue(Array.from(next));
    this.filtersForm.get(key)?.markAsDirty();
  }


  applyFilters(): void {
    const formValue = this.filtersForm.value;
    const filters: AdvancedFilters = {};

    // Permettre la combinaison des 3 filtres (role, status, createdDate)
    if (formValue.roles && formValue.roles.length > 0) {
      filters.role = formValue.roles;
    }

    if (formValue.statuses && formValue.statuses.length > 0) {
      filters.status = formValue.statuses;
    }

    if (formValue.createdDate) {
      const dateVal = formValue.createdDate;
      if (dateVal instanceof Date) {
        const year = dateVal.getFullYear();
        const month = String(dateVal.getMonth() + 1).padStart(2, '0');
        const day = String(dateVal.getDate()).padStart(2, '0');
        // valeur envoyée au backend au format dd-MM-yyyy
        filters.createdDate = `${day}-${month}-${year}`;
        // valeur affichée dans l'UI en format français jour/mois/année (formatage manuel pour éviter les dépendances de locale)
      } else if (typeof dateVal === 'string') {
        const [year, month, day] = dateVal.split('-');
        filters.createdDate = `${day}-${month}-${year}`;
      }
    }

    this.cdr.markForCheck();
    this.filtersChanged.emit(filters);
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
}
