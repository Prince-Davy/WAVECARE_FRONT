/**
<<<<<<< Updated upstream
 * TODO: Documentation for SnackBarClass (enum)
=======
 * Snack Bar Class Enum Module
 * 
 * Defines CSS class names for different snack bar message types.
 * Used to style and differentiate notification messages (success vs error).
 * 
 * @module SnackBarClass
 * @see {@link SnackBarClass} for the enum values
 */

/**
 * Snack Bar CSS Class Enumeration
 * 
 * Defines CSS class names for styling different types of snack bar notifications.
 * These values are used both in the code and in CSS stylesheets for consistent styling.
 * 
 * @enum {string}
 * @constant
 * @example
 * notificationService.success('Operation completed', SnackBarClass.SUCCESS);
 * notificationService.error('Operation failed', SnackBarClass.ERROR);
>>>>>>> Stashed changes
 */
export enum SnackBarClass {
  /**
   * CSS class for error/failure snack bars.
   * Displayed with error styling (typically red background).
   * This value is used in CSS, be careful when updating it.
   * @constant
   */
  ERROR = 'snack-bar-error',

  /**
   * CSS class for success snack bars.
   * Displayed with success styling (typically green background).
   * This value is used in CSS, be careful when updating it.
   * @constant
   */
  SUCCESS = 'snack-bar-success'
}
