import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsInt,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InstructionDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  productId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://example.com/image.png' })
  imgUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://example.com/instruction.pdf' })
  instructionUrl: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 10 })
  sequenceTotal: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  sequenceElement: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Step-by-step assembly instructions',
    required: false,
  })
  description?: string;

  @IsDate()
  @IsOptional()
  modifiedDate?: Date;
}
