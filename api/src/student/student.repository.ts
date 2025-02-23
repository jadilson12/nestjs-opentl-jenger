import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trace } from 'src/tracing/opentelemetry.decorator';
import { Repository } from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentsRepository {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  @Trace()
  async getStudents() {
    return await this.studentRepository
      .createQueryBuilder('student')
      .innerJoinAndSelect('student.course', 'course')
      .select(['student.id', 'student.name', 'course.name'])
      .getMany();
  }

  @Trace()
  async find() {
    return await this.studentRepository.find({
      relations: ['course'],
    });
  }
}
