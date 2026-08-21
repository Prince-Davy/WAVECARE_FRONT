import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pad4',
  standalone: true 
})
export class Pad4Pipe implements PipeTransform {
  transform(value: number | string): string {
    return String(value).padStart(4, '0');
  }
}
