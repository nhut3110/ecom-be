import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  CreateCommentDto,
  CreateReactionDto,
  ReportCommentDto,
} from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';
import { UserData } from 'src/decorators/user-data.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/reaction')
  reactToComment(
    @UserData('id') userId: string,
    @Body() createReactionDto: CreateReactionDto,
  ) {
    return this.commentsService.reactToComment(
      userId,
      createReactionDto.commentId,
      createReactionDto.type,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/report')
  reportComment(
    @UserData('id') userId: string,
    @Body() reportCommentDto: ReportCommentDto,
  ) {
    return this.commentsService.reportComment(reportCommentDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'imageFiles', maxCount: 3 }]))
  create(
    @UserData('id') userId: string,
    @UploadedFiles() files: { imageFiles?: Express.Multer.File[] },
    @Body() createCommentDto: CreateCommentDto,
  ) {
    createCommentDto.imageFiles = files.imageFiles;
    return this.commentsService.create({ ...createCommentDto, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @UserData('id') userId: string,
    @Query('productId') productId?: string,
  ) {
    return this.commentsService.findAll(userId, productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'imageFiles', maxCount: 5 }]))
  update(
    @UserData('id') userId: string,
    @Param('id') id: string,
    @UploadedFiles() files: { imageFiles?: Express.Multer.File[] },
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    updateCommentDto.imageFiles = files.imageFiles;
    return this.commentsService.update(id, userId, updateCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@UserData('id') userId: string, @Param('id') id: string) {
    return this.commentsService.remove(id, userId);
  }
}
