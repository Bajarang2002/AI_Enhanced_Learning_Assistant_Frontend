export interface EpochRecord {
  epoch: number;
  train_loss: number;
  train_acc: number;
  val_loss: number;
  val_acc: number;
  raw_token_acc?: number;
}

export interface ModelMetrics {
  id?: number;
  model_type: string;
  dataset_name?: string;
  dataset_size_kb?: number;
  vocab_size?: number;
  epochs?: number;
  final_loss: number;
  final_accuracy: number;
  val_loss: number;
  val_accuracy: number;
  history?: EpochRecord[];
  history_json?: string;
  trained_at?: string;
  model_filepath?: string;
}

export interface TrainingResult {
  success: boolean;
  message: string;
  results: ModelMetrics;
}

export interface TrainingHistoryRun {
  id: number;
  model_type: string;
  dataset_name: string;
  epochs: number;
  final_loss: number;
  final_accuracy: number;
  val_accuracy: number;
  trained_at: string;
}
