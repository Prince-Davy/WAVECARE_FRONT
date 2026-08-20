import { Pipe, PipeTransform } from '@angular/core';

/**
 * TODO: Documentation for Pad4Pipe (class)
 */
/**
 * TODO: Documentation for Pad4Pipe (class)
 */
/**
 * TODO: Documentation for Pad4Pipe (class)
 */
@Pipe({
  name: 'pad4',
  standalone: true 
})
export class Pad4Pipe implements PipeTransform {
/**
 * TODO: Documentation for transform (method)
 * @param value - TODO
 * @returns TODO
 */
  transform(value: number | string): string {
    return String(value).padStart(4, '0');
  }
}
