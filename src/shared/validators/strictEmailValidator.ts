import { AbstractControl, ValidationErrors } from '@angular/forms';

export function strictEmailValidator(control: AbstractControl): ValidationErrors | null {
  const email = control.value;
  const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|fr|net|org|edu|gov|info|biz|io|co)$/i;

  if (email && !strictEmailRegex.test(email)) {
    return { strictEmail: true };
  }

  return null;
}
