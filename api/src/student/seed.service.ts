import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/course/course.entity';
import { Student } from 'src/student/student.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly log = new Logger(SeedService.name);
  // private configService: ConfigService;
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly dataSource: DataSource,
  ) {}

  onModuleInit() {
    // this.configService = this.moduleRef.get(ConfigService, { strict: false });
    // console.log(this.configService.get('NODE_ENV'));
  }

  async seedDatabase() {
    this.log.log('Seeding database...');

    await this.ensureTablesExist();

    // Verifica e cria tabelas se necessário
    await this.studentRepository.query('TRUNCATE TABLE "student" CASCADE');
    await this.courseRepository.query('TRUNCATE TABLE "course" CASCADE');

    // Insere os cursos
    const course1 = this.courseRepository.create({
      name: 'Método TOP Programador',
    });
    const course2 = this.courseRepository.create({
      name: 'Formação Nodejs',
    });

    await this.courseRepository.save([course1, course2]);

    // Insere os estudantes
    await this.studentRepository.save(
      this.studentRepository.create({
        name: 'Zezin',
        course: course1,
      }),
    );
    this.log.log('Database seeded successfully!');
  }

  private async ensureTablesExist() {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();

      // Verifica se a tabela "course" existe
      const courseTableExists = await queryRunner.hasTable('course');
      if (!courseTableExists) {
        Logger.log('Criando tabela "course"...');
        await queryRunner.query(`
          CREATE TABLE "course" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR NOT NULL
          )
        `);
      }

      // Verifica se a tabela "student" existe
      const studentTableExists = await queryRunner.hasTable('student');
      if (!studentTableExists) {
        Logger.log('Criando tabela "student"...');
        await queryRunner.query(`
          CREATE TABLE "student" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR NOT NULL,
            "courseId" INTEGER,
            CONSTRAINT "FK_student_course" FOREIGN KEY ("courseId") REFERENCES "course" ("id")
          )
        `);
      }
    } finally {
      await queryRunner.release();
    }
  }
}
