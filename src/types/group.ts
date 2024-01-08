export interface AddGroup {
  name: string;
  time: number;
  startTimeQuiz: string;
  endTimeQuiz: string;
}

export interface AddQuestion {
  groupId: number;
  questionId: number;
}
