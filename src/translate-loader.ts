import { TranslateLoader, TranslationObject } from "@ngx-translate/core";
import { Observable, of } from "rxjs";

import fr from '@assets/i18n/fr.json';

/**
 * TODO: Documentation for CustomTranslateLoader (class)
 */
export class CustomTranslateLoader implements TranslateLoader {

/**
 * TODO: Documentation for translations (property)
 */
  private translations: { [key: string]: any } = {
    fr
  };

/**
 * TODO: Documentation for getTranslation (method)
 * @param lang - TODO
 * @returns TODO
 */
  getTranslation(lang: string): Observable<TranslationObject> {
    const translation = this.translations[lang]

/**
 * TODO: Documentation for if (method)
 * @param !translation - TODO
 * @returns TODO
 */
    if (!translation) {
      return of({});
    }

    return of(translation);
  }
}

