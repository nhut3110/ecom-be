import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Instruction } from './lego_instruction.entity';
import { InstructionController } from './lego_instructions.controller';
import { InstructionService } from './lego_instructions.service';

@Module({
  imports: [SequelizeModule.forFeature([Instruction])],
  controllers: [InstructionController],
  providers: [InstructionService],
})
export class InstructionModule {}
