import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { InstructionService } from './lego_instructions.service';
import { CreateLegoInstructionDto } from './dto/create-lego_instruction.dto';
import { UpdateLegoInstructionDto } from './dto/update-lego_instruction.dto';

@Controller('instructions')
export class InstructionController {
  constructor(private readonly instructionService: InstructionService) {}

  @Post('bulk')
  createBulk(@Body() createInstructionDto: CreateLegoInstructionDto[]) {
    return this.instructionService.createBulk(createInstructionDto);
  }

  @Post()
  create(@Body() createInstructionDto: CreateLegoInstructionDto) {
    return this.instructionService.create(createInstructionDto);
  }

  @Get()
  findAll() {
    return this.instructionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instructionService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateInstructionDto: UpdateLegoInstructionDto,
  ) {
    return this.instructionService.update(id, updateInstructionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instructionService.remove(id);
  }
}
