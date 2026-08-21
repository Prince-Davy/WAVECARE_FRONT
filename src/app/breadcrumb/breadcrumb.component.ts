import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export interface BreadcrumbItem {
  /** Translation key used to display the breadcrumb label. */
  labelKey: string;

  /** Optional context passed to the translation string. */
  context?: Record<string, unknown>;

  /** Route target for the breadcrumb item. If omitted, the item is treated as the current page. */
  link?: string | any[];

  /** Optional ARIA label for accessibility. */
  ariaLabel?: string;
}

@Component({
  selector: 'app-patient-breadcrumb',
  standalone: true,
  imports: [RouterLink, MatIconModule, TranslateModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  /** Breadcrumb items to render in order. */
  readonly items = input.required<BreadcrumbItem[]>();
}
