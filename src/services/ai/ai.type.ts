// Khớp 1:1 với DTO backend bạn gửi

// ----- Requests -----
export interface ChatRequest {
  question: string;
  mode?: 'mix';             // BE đang luôn set "mix" => optional cho FE
  topK?: number;            // 1..50 (mặc định 5)
  forceReindex?: boolean;   // mặc định false
}

// (BE có ChatMessage nhưng controller hiện không dùng tới)
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

// ----- Responses -----
export interface ChatResponse {
  answer: string;
  processingTime?: number;
  timestamp?: string; // BE trả LocalDateTime -> FE nhận string ISO
}

export type AnalysisType = 'palm' | 'face';

export interface ImageAnalysisResponse {
  analysisResult: string;
  analysisType: AnalysisType;
  processingTime?: number;
  timestamp?: string;
}

// ----- Wrapper chung của BE -----
export interface SingleResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
