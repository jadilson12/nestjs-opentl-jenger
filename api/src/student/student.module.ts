import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/course/course.entity';
import { SeedService } from './seed.service';
import { StudentsController } from './student.controller';
import { Student } from './student.entity';
import { StudentsRepository } from './student.repository';
import { StudentsService } from './student.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Student])],
  controllers: [StudentsController],
  providers: [StudentsService, SeedService, StudentsRepository],
  exports: [SeedService],
})
export class StudantModule {}
