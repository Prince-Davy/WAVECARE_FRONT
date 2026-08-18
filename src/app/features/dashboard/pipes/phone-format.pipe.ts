/**
 * Phone Format Pipe Module
 * 
 * Formats phone numbers according to the locale using Google libphonenumber.
 * 
 * @module PhoneFormatPipe
 * @see {@link PhoneFormatPipe} for the pipe class
 */
import { Pipe, PipeTransform } from '@angular/core';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

/**
<<<<<<< Updated upstream
 * TODO: Documentation for PhoneFormatPipe (class)
 */
/**
 * TODO: Documentation for PhoneFormatPipe (class)
 */
/**
 * TODO: Documentation for PhoneFormatPipe (class)
=======
 * Phone Number Format Pipe
 * 
 * Formats phone numbers to the national format for France.
 * Uses Google's libphonenumber library for accurate formatting.
 * 
 * Default locale: France (FR)
 * Default format: National (e.g., 06 12 34 56 78)
 * 
 * @class PhoneFormatPipe
 * @implements {PipeTransform}
 * @standalone
 * @example
 * {{ '0612345678' | phoneFormat }}
 * // Returns: '06 12 34 56 78'
 * 
 * {{ '+33612345678' | phoneFormat }}
 * // Returns: '06 12 34 56 78'
>>>>>>> Stashed changes
 */
@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {

/**
 * TODO: Documentation for transform (method)
 * @param value - TODO
 * @returns TODO
 */
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