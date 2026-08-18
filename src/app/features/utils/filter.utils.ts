/**
<<<<<<< Updated upstream
 * TODO: Documentation for FilterUtils (class)
 */
export class FilterUtils {

/**
 * TODO: Documentation for getRoleLabel (method)
 * @param role - TODO
 * @returns TODO
 */
=======
 * Filter Utilities
 * 
 * This utility class provides helper methods for filtering, formatting,
 * and processing data in the Wavecare application.
 * 
 * @class FilterUtils
 * @see {@link FilterUtils.getRoleLabel} for role label formatting
 * @see {@link FilterUtils.formatDate} for date formatting
 */
export class FilterUtils {

  /**
   * Get the i18n label key for a user role
   * 
   * Converts a role identifier to its corresponding i18n translation key.
   * 
   * @static
   * @method getRoleLabel
   * @param {string} role - The role identifier (e.g., 'ADMINISTRATOR', 'RADIOLOGIST')
   * @returns {string} The i18n label key (e.g., 'model.user.role.ADMINISTRATOR')
   * @example
   * const label = FilterUtils.getRoleLabel('ADMINISTRATOR');
   * // Returns: 'model.user.role.ADMINISTRATOR'
   */
>>>>>>> Stashed changes
  static getRoleLabel(role: string): string {
    return `model.user.role.${role}`;
  }

<<<<<<< Updated upstream
/**
 * TODO: Documentation for getStatusLabel (method)
 * @param status - TODO
 * @returns TODO
 */
=======
  /**
   * Get the i18n label key for a user status
   * 
   * Converts a status identifier to its corresponding i18n translation key.
   * 
   * @static
   * @method getStatusLabel
   * @param {string} status - The status identifier (e.g., 'ACTIVE', 'INACTIVE')
   * @returns {string} The i18n label key (e.g., 'model.user.status.ACTIVE')
   * @example
   * const label = FilterUtils.getStatusLabel('ACTIVE');
   * // Returns: 'model.user.status.ACTIVE'
   */
>>>>>>> Stashed changes
  static getStatusLabel(status: string): string {
    return `model.user.status.${status}`;
  }

<<<<<<< Updated upstream
/**
 * TODO: Documentation for formatDate (method)
 * @param dateInput - TODO
 * @returns TODO
 */
=======
  /**
   * Format a date string to the French locale format (dd/mm/yyyy)
   * 
   * Handles multiple date formats:
   * - Date objects: Converted to French date format
   * - ISO format (yyyy-MM-dd): Converted to dd/mm/yyyy
   * - US format (mm/dd/yyyy): Converted to French format if detected
   * - French format (dd/mm/yyyy): Returned as-is
   * - Ambiguous format: Returned as-is without conversion
   * 
   * @static
   * @method formatDate
   * @param {string | Date | null} dateInput - The date to format
   * @returns {string} The formatted date string in French locale (dd/mm/yyyy), or empty string if null
   * @example
   * FilterUtils.formatDate('2024-04-21');
   * // Returns: '21/04/2024'
   * 
   * FilterUtils.formatDate(new Date('2024-04-21'));
   * // Returns: '21/04/2024'
   * 
   * FilterUtils.formatDate(null);
   * // Returns: ''
   */
>>>>>>> Stashed changes
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
      const [day, month, year] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }

    // Sinon, essayer de construire une date et formater en français
    const parsed = new Date(dateString);
    if (!Number.isNaN(parsed.getTime())) return parsed.toLocaleDateString('fr-FR');
    return dateString;
  }

}