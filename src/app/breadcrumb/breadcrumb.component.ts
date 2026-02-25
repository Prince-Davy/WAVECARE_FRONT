import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export interface BreadcrumbItem {
  /** Clé de traduction (ex: 'feature.dashboard.patient.detail.breadcrumb.patientFile') */
  labelKey: string;
  /** Contexte i18n (ex: { nss }) */
  context?: Record<string, any>;
  /** Route (ex: ['/patients']) — si absent, l’item est rendu “courant” (non cliquable) */
  link?: string | any[];
  /** Libellé ARIA optionnel */
  ariaLabel?: string;
  /** Clé stable pour trackBy (recommandé) */
  key?: string;
}

@Component({
  selector: 'app-patient-breadcrumb',
  standalone: true,
  imports: [RouterLink, MatIconModule, TranslateModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent {
  /** Liste des items (obligatoire) */
  readonly items = input.required<BreadcrumbItem[]>();
}