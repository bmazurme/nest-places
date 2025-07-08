import { Reflector } from '@nestjs/core';

/**
 * Custom decorator for role-based authorization.
 * Creates a decorator that can be used to specify required roles for a method or class.
 * Accepts an array of roles as a parameter.
 *
 * Example usage:
 * @Roles('admin')
 * @Roles('admin', 'moderator')
 *
 * @param roles Array of roles required to access the method/class
 * @returns Decorator function
 */
export const Roles = Reflector.createDecorator<string[]>();
