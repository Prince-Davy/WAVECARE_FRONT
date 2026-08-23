export class FilterUtils {

  static getRoleLabel(role: string): string {
    return `model.user.role.${role}`;
  }

  static getStatusLabel(status: string): string {
    return `model.user.status.${status}`;
  }

  static formatDate(dateInput: string | Date | null): string {
    if (!dateInput) return '';

    // Si c'est déjà un objet Date
    if (dateInput instanceof Date) {
      return dateInput.toLocaleDateString('fr-FR');
    }

    const dateString = dateInput;

    // Si contenant des slashs, tenter de détecter le format
    if (dateString.includes('/')) {
      const parts = dateString.split('/').map(p => p.trim());
      if (parts.length === 3) {
        const p0 = Number.parseInt(parts[0], 10);
        const p1 = Number.parseInt(parts[1], 10);
        const year = parts[2];
        // si premier segment > 12 => déjà au format jour/mois/année
        if (!Number.isNaN(p0) && p0 > 12) return dateString;
        // si deuxième segment > 12 => c'est très probablement mm/dd/yyyy -> swap
        if (!Number.isNaN(p1) && p1 > 12) {
          const day = String(p1).padStart(2, '0');
          const month = String(p0).padStart(2, '0');
          return `${day}/${month}/${year}`;
        }
        // Ambiguïté (les deux segments <= 12) : conserver l'affichage tel quel
        return dateString;
      }
      return dateString;
    }

    // Si au format 'yyyy-MM-dd', convertir
    if (dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
        return dateString;
      }

      const [day, month, year] = parts;
      if (!/\d{4}/.test(year) || Number.isNaN(Number(day)) || Number.isNaN(Number(month))) {
        return dateString;
      }

      return `${day}/${month}/${year}`;
    }

    // Sinon, essayer de construire une date et formater en français
    const parsed = new Date(dateString);
    if (!Number.isNaN(parsed.getTime())) return parsed.toLocaleDateString('fr-FR');
    return dateString;
  }

}