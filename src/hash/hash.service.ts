import { Injectable } from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

/**
 * Service for password hashing and comparison.
 * Provides methods for hashing passwords and comparing plaintext passwords with hashed versions.
 * Uses bcrypt for secure password hashing.
 */
@Injectable()
export class HashService {
  /**
   * Generates a hashed password
   * @param password Plaintext password to hash
   * @returns Hashed password string
   * @description Uses bcrypt to create a secure hash with a salt round of 10
   */
  getHash(password: string): string {
    return hashSync(password, genSaltSync(10));
  }

  /**
   * Compares a plaintext password with a hashed password
   * @param password Plaintext password to compare
   * @param hashPassword Hashed password to compare against
   * @returns True if passwords match, false otherwise
   * @description Uses bcrypt to securely compare the passwords
   */
  compare(password: string, hashPassword: string): boolean {
    return compareSync(password, hashPassword);
  }
}
