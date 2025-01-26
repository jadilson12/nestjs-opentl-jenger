import { Controller, Get } from '@nestjs/common';
import { StudentsService } from './student.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async getStudents() {
    return this.studentsService.getStudents();
  }
}
