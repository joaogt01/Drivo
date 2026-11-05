
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  brand: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  model: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 2)
  modelYear?: number;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{3}\d[A-Za-z0-9]\d{2}$/)
  plate?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$/)
  renavam?: string;

  @IsOptional()
  @IsString()
  @MinLength(17)
  @MaxLength(17)
  chassis?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  fuel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  vehicleType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;
}
