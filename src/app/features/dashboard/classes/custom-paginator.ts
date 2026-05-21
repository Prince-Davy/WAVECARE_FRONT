import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { TranslateService } from "@ngx-translate/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

/**
 * Custom Paginator use to handle the I18N translation with ngx-translate.
 * Don't forget to defined the list of customizable label you want in your i18n.json files
 * This is a Json example :
 * {
 *  "paginator": {
      "itemsPerPageLabel": "Items per page",
      "nextPageLabel": "Next page",
      "previousPageLabel": "Previous page",
      "firstPageLabel": "First page",
      "lastPageLabel": "Last page",
      "of": "of"
    }
   }
 */
/**
 * TODO: Documentation for CustomPaginator (class)
 */
/**
 * TODO: Documentation for CustomPaginator (class)
 */
/**
 * TODO: Documentation for CustomPaginator (class)
 */
@Injectable({
  providedIn: 'root'
})
export class CustomPaginator extends MatPaginatorIntl {
  private readonly PAGINATOR_LABEL_DENOMINATION = `feature.dashboard.ticket-table-component.table.paginator`;

/**
 * TODO: Documentation for ofLabel (property)
 */
  private ofLabel: string | undefined;

/**
 * TODO: Documentation for constructor (method)
 * @param translate - TODO
 * @returns TODO
 */
  constructor(private translate: TranslateService) {
/**
 * TODO: Documentation for super (method)
 * @returns TODO
 */
    super();

    this.translate.onLangChange
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.getAndInitTranslations());
    this.getAndInitTranslations();
  }

/**
 * TODO: Documentation for getAndInitTranslations (method)
 * @returns TODO
 */
  getAndInitTranslations() {
    this.itemsPerPageLabel = this.translate.instant(`${this.PAGINATOR_LABEL_DENOMINATION}.itemsPerPage`);
    this.nextPageLabel = this.translate.instant(`${this.PAGINATOR_LABEL_DENOMINATION}.nextPage`);
    this.previousPageLabel = this.translate.instant(`${this.PAGINATOR_LABEL_DENOMINATION}.previousPage`);
    this.firstPageLabel = this.translate.instant(`${this.PAGINATOR_LABEL_DENOMINATION}.firstPage`);
    this.lastPageLabel = this.translate.instant(`${this.PAGINATOR_LABEL_DENOMINATION}.lastPage`);
    this.ofLabel = this.translate.instant(`${this.PAGINATOR_LABEL_DENOMINATION}.of`);
    this.changes.next();
  }

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.ofLabel} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} ${this.ofLabel} ${length}`;
  };
}
