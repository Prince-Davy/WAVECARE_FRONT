import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nssFormat',
  standalone: true
})
export class NssFormatPipe implements PipeTransform {

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