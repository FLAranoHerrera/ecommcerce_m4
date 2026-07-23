import {
  IsString,
  IsOptional,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Nombre completo', example: 'Ana López' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de 10 a 15 dígitos',
    example: '5512345678',
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{10,15}$/)
  phone?: string;

  @ApiPropertyOptional({ description: 'País', example: 'México' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    description: 'Dirección postal',
    example: 'Avenida Reforma 100',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Ciudad',
    example: 'Ciudad de México',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsOptional()
  city?: string;
}
