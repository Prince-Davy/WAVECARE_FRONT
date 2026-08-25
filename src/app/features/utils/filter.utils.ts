export class FilterUtils {
  static getRoleLabel(role: string): string {
    return `model.user.role.${role}`;
  }

  static getStatusLabel(status: string): string {
    return `model.user.status.${status}`;
  }

  static formatDate(dateInput: string | Date | null): string {
    if (!dateInput) {
      return '';
    }

    if (dateInput instanceof Date) {
      return dateInput.toLocaleDateString('fr-FR');
    }

    if (dateInput.includes('/')) {
      return this.formatSlashDate(dateInput);
    }

    if (dateInput.includes('-')) {
      return this.formatDashDate(dateInput);
    }

    return this.formatParsedDate(dateInput);
  }

  private static formatSlashDate(dateString: string): string {
    const parts = dateString.split('/').map((part) => part.trim());

    if (parts.length !== 3) {
      return dateString;
    }

    const firstPart = Number.parseInt(parts[0], 10);
    const secondPart = Number.parseInt(parts[1], 10);
    const year = parts[2];

    if (!Number.isNaN(firstPart) && firstPart > 12) {
      return dateString;
    }

    if (!Number.isNaN(secondPart) && secondPart > 12) {
      const day = String(secondPart).padStart(2, '0');
      const month = String(firstPart).padStart(2, '0');

      return `${day}/${month}/${year}`;
    }

    return dateString;
  }

  private static formatDashDate(dateString: string): string {
    const parts = dateString.split('-');

    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
      return dateString;
    }

    const [day, month, year] = parts;

    if (
      !/\d{4}/.test(year) ||
      Number.isNaN(Number(day)) ||
      Number.isNaN(Number(month))
    ) {
      return dateString;
    }

    return `${day}/${month}/${year}`;
  }

  private static formatParsedDate(dateString: string): string {
    const parsed = new Date(dateString);

    if (Number.isNaN(parsed.getTime())) {
      return dateString;
    }

    return parsed.toLocaleDateString('fr-FR');
  }
}
