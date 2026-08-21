import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '@app/features/notification/services/notification.service';

/**
 * Minimal ProblemDetail adapted to backend RFC 9457 + extensions locales.
 * Seuls les champs exploités par l'intercepteur sont déclarés ; le reste est
 * ignoré par TypeScript grâce aux propriétés optionnelles.
 */
export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  timestamp?: string | number;
  userMessage?: string;
  userMessageKey?: string;
  errorSource?: string;
  /**
   * Pour les erreurs de validation on retrouve un tableau `errors` ou
   * `violations` selon le format renvoyé par Spring.
   */
  errors?: Array<{ field?: string; parameter?: string; message?: string }>;
}

/**
 * Décide quel texte afficher à l'utilisateur à partir du ProblemDetail renvoyé
 * par le serveur.
 */
function normalizeErrorKey(userMessageKey: string): { key: string; statusCode?: number } {
  if (userMessageKey === 'error.validation') {
    return { key: 'error.validation.default' };
  }

  const httpStatusMatch = /^error\.http\.(\d{3})$/.exec(userMessageKey);
  if (httpStatusMatch) {
    return { key: 'error.http.<statusCode>', statusCode: Number(httpStatusMatch[1]) };
  }

  return { key: userMessageKey };
}

function translateProblemKey(userMessageKey: string, pd: ProblemDetail, translate: TranslateService): string {
  const normalized = normalizeErrorKey(userMessageKey);
  const statusCode = normalized.statusCode ?? pd.status;
  const translated = translate.instant(normalized.key, { statusCode });

  // ngx-translate returns the key itself when missing.
  if (typeof translated === 'string' && translated !== normalized.key) {
    return translated;
  }

  return userMessageKey;
}

export function getUserFacingMessage(pd: ProblemDetail, translate?: TranslateService): string {
  if (!pd) {
    return 'Erreur inconnue.';
  }

  // priorité 1 : message littéral
  if (pd.userMessage && pd.userMessage.trim().length) {
    return pd.userMessage;
  }

  // priorité 2 : clé i18n
  if (pd.userMessageKey && pd.userMessageKey.trim().length) {
    if (translate) {
      return translateProblemKey(pd.userMessageKey, pd, translate);
    }
    return pd.userMessageKey;
  }

  // validation error special case
  if (pd.type === '/problems/validation-error') {
    let msg = 'Certains champs sont invalides.';
    const e = pd.errors && pd.errors.length ? pd.errors[0] : undefined;
    const extra = e?.field ?? e?.parameter;
    if (extra) {
      msg += ` (${extra})`;
    }
    return msg;
  }

  // fallback vers detail / title
  return pd.detail ?? pd.title ?? 'Erreur inconnue.';
}

/**
 * Intercepteur qui détecte un ProblemDetail dans la réponse d'erreur et
 * appelle le service de notification pour afficher un message utilisateur.
 * L'erreur est ensuite retransmise sans transformation.
 */
export const problemDetailInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);
  const translate = inject(TranslateService);

  // opt‑out header (valeur littérale string 'true')
  if (req.headers.get('X-Skip-Global-Error-Toast') === 'true') {
    return next(req).pipe(
      catchError(err => throwError(() => err))
    );
  }

  return next(req).pipe(
    catchError(err => {
      try {
        if (err && err.error && typeof err.error === 'object') {
          const pd = err.error as ProblemDetail;
          const msg = getUserFacingMessage(pd, translate);
          // use the existing method on NotificationService
          notification.openErrorSnackBar(msg);
        }
      } catch (e) {
        console.warn('problem-detail interceptor failure', e);
      }
      return throwError(() => err);
    })
  );
};
