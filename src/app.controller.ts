import { Request } from 'express';
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AccessTokenGuard } from './common/guards/accessToken.guard';

@Controller()
export class AppController {}
