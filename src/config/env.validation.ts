import { plainToClass } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  MinLength,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @MinLength(32)
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  DATABASE_URL?: string;

  @IsString()
  @IsOptional()
  DB_HOST?: string;

  @IsNumber()
  @IsOptional()
  DB_PORT?: number;

  @IsString()
  @IsOptional()
  DB_USERNAME?: string;

  @IsString()
  @IsOptional()
  DB_PASSWORD?: string;

  @IsString()
  @IsOptional()
  DB_NAME?: string;

  @IsString()
  @IsOptional()
  CLOUDINARY_NAME?: string;

  @IsString()
  @IsOptional()
  CLOUDINARY_API_KEY?: string;

  @IsString()
  @IsOptional()
  CLOUDINARY_API_SECRET?: string;

  @IsNumber()
  @IsOptional()
  PORT?: number;

  @IsNumber()
  @IsOptional()
  RATE_LIMIT_TTL?: number;

  @IsNumber()
  @IsOptional()
  RATE_LIMIT_LIMIT?: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  if (
    !validatedConfig.DATABASE_URL &&
    (!validatedConfig.DB_HOST ||
      !validatedConfig.DB_USERNAME ||
      !validatedConfig.DB_PASSWORD ||
      !validatedConfig.DB_NAME)
  ) {
    throw new Error(
      'Debe configurar DATABASE_URL o DB_HOST, DB_USERNAME, DB_PASSWORD y DB_NAME',
    );
  }

  const cloudinaryValues = [
    validatedConfig.CLOUDINARY_NAME,
    validatedConfig.CLOUDINARY_API_KEY,
    validatedConfig.CLOUDINARY_API_SECRET,
  ];
  const configuredCloudinaryValues = cloudinaryValues.filter(Boolean).length;
  if (configuredCloudinaryValues > 0 && configuredCloudinaryValues < 3) {
    throw new Error(
      'Las tres variables CLOUDINARY_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET deben configurarse juntas',
    );
  }
  return validatedConfig;
}
