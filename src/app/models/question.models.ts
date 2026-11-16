export interface QuestionItem {
  question: string;
  answer: string;
}

export interface QuestionGenResponse {
  success: boolean;
  test_type: string;
  count: number;
  questions: QuestionItem[];
}
