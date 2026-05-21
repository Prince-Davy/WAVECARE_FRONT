import { TranslateLoader, TranslationObject } from "@ngx-translate/core";
import { Observable, of } from "rxjs";

import fr from '@assets/i18n/fr.json';

/**
 * Custom translation loader implementation for ngx-translate.
 * Loads i18n translation files and provides them to the translate service.
 */
export class CustomTranslateLoader implements TranslateLoader {

/**
 * Translation dictionary containing available language files.
 * Maps language codes to their corresponding translation objects.
 */
  private translations: { [key: string]: any } = {
    fr
  };

/**
 * Retrieves the translation object for the specified language.
 * Returns an empty object if the requested language is not available.
 * 
 * @param lang - The language code (e.g., 'fr', 'en')
 * @returns Observable containing the translation object for the language
 */
  getTranslation(lang: string): Observable<TranslationObject> {
    const translation = this.translations[lang]

    if (!translation) {
      return of({});
    }

    return of(translation);
  }
}


