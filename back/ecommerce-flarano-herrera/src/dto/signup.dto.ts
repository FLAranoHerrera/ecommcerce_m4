import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    minLength: 3,
    maxLength: 80
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @ApiProperty({ 
    description: 'Fecha de nacimiento en formato YYYY-MM-DD',
    example: "1990-07-22"
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe estar en formato YYYY-MM-DD'
  })
  birthday: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@ejemplo.com',
    format: 'email'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (8-15 caracteres, debe incluir mayúsculas, minúsculas, números y caracteres especiales)',
    example: 'Password123!',
    minLength: 8,
    maxLength: 15
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
    {
      message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (!@#$%^&*)',
    },
  )
  password: string;

  @ApiProperty({
    description: 'Confirmación de la contraseña',
    example: 'Password123!',
    minLength: 8,
    maxLength: 15
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
    {
      message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (!@#$%^&*)',
    },
  )
  confirmPassword: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Calle Principal 123',
    minLength: 3,
    maxLength: 80
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario (solo números)',
    example: "1234567890",
    type: 'string'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10,15}$/, {
    message: 'El teléfono debe contener entre 10 y 15 dígitos'
  })
  phone: string;

  @ApiProperty({
    description: 'País del usuario',
    example: 'México',
    minLength: 5,
    maxLength: 20
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  country: string;

  @ApiProperty({
    description: 'Ciudad del usuario',
    example: 'Ciudad de México',
    minLength: 5,
    maxLength: 20
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  city: string;
} 