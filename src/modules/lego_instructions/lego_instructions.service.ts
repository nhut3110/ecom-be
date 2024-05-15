import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Instruction } from './lego_instruction.entity';
import { InstructionDto } from './dto/lego_instruction.dto';
import { UpdateLegoInstructionDto } from './dto/update-lego_instruction.dto';

@Injectable()
export class InstructionService {
  constructor(
    @InjectModel(Instruction)
    private instructionModel: typeof Instruction,
  ) {}

  create(dto: InstructionDto): Promise<Instruction> {
    return this.instructionModel.create(dto);
  }

  createBulk(dto: InstructionDto[]): Promise<Instruction[]> {
    return this.instructionModel.bulkCreate(dto);
  }

  findAll(): Promise<Instruction[]> {
    return this.instructionModel.findAll();
  }

  findOne(id: string): Promise<Instruction> {
    return this.instructionModel.findByPk(id);
  }

  update(
    id: string,
    dto: UpdateLegoInstructionDto,
  ): Promise<[number, Instruction[]]> {
    return this.instructionModel.update(dto, {
      where: { id },
      returning: true,
    });
  }

  remove(id: string): Promise<number> {
    return this.instructionModel.destroy({ where: { id } });
  }
}
