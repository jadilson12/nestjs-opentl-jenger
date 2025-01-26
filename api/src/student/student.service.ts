import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Trace } from 'src/tracing/opentelemetry.decorator';
import { StudentsRepository } from './student.repository';

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);
  private counter = 0;

  constructor(private readonly studentRepository: StudentsRepository) {}

  @Trace()
  async getStudents() {
    this.counter++;

    try {
      if (this.counter === 1) {
        const students = await this.studentRepository.find();
        const result = students.map((student) => ({
          id: student.id,
          name: student.name,
          course: student.course.name,
        }));

        return {
          students: result,
          message: 'this is from the really bad response',
        };
      }
    } catch (error) {
      this.logger.error(error);
    }

    try {
      if (this.counter === 2) {
        const students = await this.studentRepository.getStudents();

        return {
          students,
          message: 'this is the best response',
        };
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }

    this.counter = 0;
    this.logger.error('An error occurred while processing your request');
    throw new InternalServerErrorException();
  }
}
