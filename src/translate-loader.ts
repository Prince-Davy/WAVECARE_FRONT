import { TranslateLoader, TranslationObject } from "@ngx-translate/core";
import { Observable, of } from "rxjs";

import fr from '@assets/i18n/fr.json';

export class CustomTranslateLoader implements TranslateLoader {

  private translations: { [key: string]: any } = {
    fr
  };

  getTranslation(lang: string): Observable<TranslationObject> {
    const translation = this.translations[lang]

    if (!translation) {
      return of({});
    }

    return of(translation);
  }
}

