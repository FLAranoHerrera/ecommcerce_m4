import 'reflect-metadata';
import { validate } from './env.validation';

describe('environment validation', () => {
  it('rejects a missing JWT secret', () => {
    expect(() => validate({ DATABASE_URL: 'postgres://example' })).toThrow();
  });

  it('rejects missing database configuration', () => {
    expect(() => validate({ JWT_SECRET: 'x'.repeat(32) })).toThrow(
      'Debe configurar DATABASE_URL o DB_HOST, DB_USERNAME, DB_PASSWORD y DB_NAME',
    );
  });

  it('rejects partially configured Cloudinary credentials', () => {
    expect(() =>
      validate({
        JWT_SECRET: 'x'.repeat(32),
        DATABASE_URL: 'postgres://example',
        CLOUDINARY_NAME: 'cloud',
      }),
    ).toThrow('Las tres variables CLOUDINARY_NAME');
  });

  it('accepts the minimum secure configuration', () => {
    expect(
      validate({
        JWT_SECRET: 'x'.repeat(32),
        DATABASE_URL: 'postgres://example',
      }),
    ).toMatchObject({ DATABASE_URL: 'postgres://example' });
  });
});
