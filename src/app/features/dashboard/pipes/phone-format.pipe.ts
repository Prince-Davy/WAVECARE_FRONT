import { Pipe, PipeTransform } from '@angular/core';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';

    const phoneUtil = PhoneNumberUtil.getInstance();

    try {
      const number = phoneUtil.parse(value, 'FR');
      return phoneUtil.format(number, PhoneNumberFormat.NATIONAL); // ex : 06 12 34 56 78
    } catch (e) {
      return value; // fallback si numéro invalide
    }
  }
}