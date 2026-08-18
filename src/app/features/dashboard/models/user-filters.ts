/**
<<<<<<< Updated upstream
 * TODO: Documentation for UserFilters (interface)
=======
 * User Filters Interface Module
 * 
 * Defines the data structure for user list filtering parameters.
 * Used in user search and advanced filtering operations.
 * 
 * @module UserFilters
 * @see {@link UserFilters} for the interface definition
 */

/**
 * User Filters Interface
 * 
 * Defines optional filter criteria for querying user lists.
 * All properties are optional and can be combined for advanced filtering.
 * 
 * @interface UserFilters
 * @property {string[]} [keywords] - Keywords to search for in user names or other text fields
 * @property {string[]} [roles] - Filter users by roles (e.g., ADMINISTRATOR, RADIOLOGIST, RADIO_OPERATOR)
 * @property {string[]} [statuses] - Filter users by account status (e.g., ACTIVE, INACTIVE, LOCKED, DISABLED)
 * @property {string} [creationDate] - Filter by user creation date (format: dd/MM/yyyy or similar)
 * @example
 * const filters: UserFilters = {
 *   keywords: ['john', 'doe'],
 *   roles: ['RADIOLOGIST'],
 *   statuses: ['ACTIVE'],
 *   creationDate: '01/01/2024'
 * };
>>>>>>> Stashed changes
 */
export interface UserFilters {
  /**
   * Keywords for user name search
   */
  keywords?: string[];
  
  /**
   * Filter by user roles (ADMINISTRATOR, RADIOLOGIST, RADIO_OPERATOR)
   */
  roles?: string[];
  
  /**
   * Filter by user account status (ACTIVE, INACTIVE, LOCKED, DISABLED)
   */
  statuses?: string[];
  
  /**
   * Filter by creation date
   */
  creationDate?: string;
}
