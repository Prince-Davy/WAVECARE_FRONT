/**
 * NSS Format Pipe Module
 * 
 * Formats social security numbers (NSS/NIR) according to French conventions.
 * 
 * @module NssFormatPipe
 * @see {@link NssFormatPipe} for the pipe class
 */
import { Pipe, PipeTransform } from '@angular/core';

/**
<<<<<<< Updated upstream
 * TODO: Documentation for NssFormatPipe (class)
 */
/**
 * TODO: Documentation for NssFormatPipe (class)
 */
/**
 * TODO: Documentation for NssFormatPipe (class)
=======
 * NSS (Numéro de Sécurité Sociale) Format Pipe
 * 
 * Formats a 13 or 15 digit number as a French social security number.
 * Format: S AA MM DD DDD DDD DDD CCC (13 digits with check code)
 * 
 * Where:
 * - S: Sex (1=male, 2=female)
 * - AA: Year of birth (2 digits)
 * - MM: Month of birth
 * - DD: Department code
 * - DDD: Municipality code
 * - DDD: Birth order
 * - DDD: Control key (optional)
 * 
 * @class NssFormatPipe
 * @implements {PipeTransform}
 * @standalone
 * @example
 * {{ '3880702123456' | nssFormat }}
 * // Returns: '3 88 07 02 123 456 (789)'
>>>>>>> Stashed changes
 */
@Pipe({
  name: 'nssFormat',
  standalone: true
})
export class NssFormatPipe implements PipeTransform {

/**
 * TODO: Documentation for transform (method)
 * @param value - TODO
 * @returns TODO
 */
  transform(value: string | null | undefined): string {
    if (!value) return '';

    // Garde uniquement les chiffres
    const digits = value.replace(/\D/g, '');

    // Doit faire entre 1 et 15 chiffres, sinon on formate ce qu'on peut
    const parts = [
      digits.slice(0, 1),   // S
      digits.slice(1, 3),   // AA
      digits.slice(3, 5),   // MM
      digits.slice(5, 7),   // DD (département)
      digits.slice(7, 10),  // DDD (commune)
      digits.slice(10, 13), // OOO (numéro ordre)
      digits.slice(13, 15), // CC (clé)
    ];

    // On filtre les groupes vides + on join proprement
    return parts.filter(p => p.length > 0).join(' ');
  }
}
``