import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../student/student.entity';

@Entity() // Decorador obrigatório
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Student, (student) => student.course)
  students: Student[];
}
