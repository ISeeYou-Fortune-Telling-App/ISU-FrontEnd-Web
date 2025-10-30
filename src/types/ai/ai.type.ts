export interface ChatQueryStreamRequest {
  question: string;
  topK?: number;
}

export type AnalysisType = 'palm' | 'face';

export interface ImageAnalysisResponse {
  analysisResult: string;
  analysisType: AnalysisType;
  processingTime: number;
  timestamp: string;
}
