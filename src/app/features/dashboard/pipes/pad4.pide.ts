/**
 * Pad4 Pipe Module
 * 
 * Formats numbers with left-padding to 4 digits using zeros.
 * 
 * @module Pad4Pipe
 * @see {@link Pad4Pipe} for the pipe class
 */
import { Pipe, PipeTransform } from '@angular/core';

/**
<<<<<<< Updated upstream
 * TODO: Documentation for Pad4Pipe (class)
 */
/**
 * TODO: Documentation for Pad4Pipe (class)
 */
/**
 * TODO: Documentation for Pad4Pipe (class)
=======
 * Pad with 4 Digits Pipe
 * 
 * Formats a number or string by padding it with leading zeros to reach 4 digits total.
 * Useful for displaying formatted codes, IDs, or sequential numbers.
 * 
 * @class Pad4Pipe
 * @implements {PipeTransform}
 * @standalone
 * @example
 * {{ 42 | pad4 }}
 * // Returns: '0042'
 * 
 * {{ '123' | pad4 }}
 * // Returns: '0123'
 * 
 * {{ 5000 | pad4 }}
 * // Returns: '5000'
>>>>>>> Stashed changes
 */
@Pipe({
  name: 'pad4',
  standalone: true 
})
export class Pad4Pipe implements PipeTransform {
<<<<<<< Updated upstream
/**
 * TODO: Documentation for transform (method)
 * @param value - TODO
 * @returns TODO
 */
=======
  /**
   * Transform a number or string to 4-digit padded string
   * 
   * @param {number | string} value - The value to pad
   * @returns {string} The padded value with leading zeros to reach 4 digits
   */
>>>>>>> Stashed changes
  transform(value: number | string): string {
    return String(value).padStart(4, '0');
  }
}
