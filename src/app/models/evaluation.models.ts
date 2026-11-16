export interface EvaluationResult {
  success: boolean;
  score: number;
  score_100: number;
  grade: string;
  similarity_pct: number;
  coverage_pct: number;
  completeness_score: number;
  matched_concepts: string[];
  missing_concepts: string[];
  feedback_summary: string;
  recommendations: string[];
  ref_word_count: number;
  student_word_count: number;
  reference_answer: string;
  student_answer: string;
}
