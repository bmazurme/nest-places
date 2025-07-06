/**
 * Enum representing user roles in the system.
 * Defines the possible roles that a user can have within the application.
 * Each role determines the level of access and permissions for users.
 */
export enum Role {
  /**
   * Administrator role
   * @description Highest level of access with full permissions
   * @example 'admin'
   */
  Admin = 'admin',

  /**
   * Regular user role
   * @description Default role with standard user permissions
   * @example 'user'
   */
  User = 'user',
}
