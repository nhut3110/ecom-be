import { PartialType } from '@nestjs/swagger';
import { InstructionDto } from './lego_instruction.dto';

export class UpdateLegoInstructionDto extends PartialType(InstructionDto) {}
