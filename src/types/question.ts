import { QuestionType } from '../../prisma/generated/client-app';

export interface Question {
  questionDescription: string;
  questionType: QuestionType;
  answer: string;
}
