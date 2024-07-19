// src/user/user.controller.ts
import { Controller, Get, Patch, Body, Param, UseGuards, UploadedFile, UseInterceptors, ParseIntPipe, Req, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.userService.getProfile(+id);
  }

  @Get()
  getAllUsers() {
    // console.log("1 - getAllUsers")
    return this.userService.getAllUsers();
  }


  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: RequestWithUser,
  ): Promise<any> {
    const user = req.user as any; // JWT'den gelen kullanıcı bilgisi
    if (user.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return this.userService.updateProfile(id, updateProfileDto, file);
  }

}