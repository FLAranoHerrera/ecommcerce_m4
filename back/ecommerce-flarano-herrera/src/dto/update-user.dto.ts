import { IsString, IsOptional, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  phone?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  country?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city?: string;

  @IsBoolean()
  @IsOptional()
  admin?: boolean;
}
