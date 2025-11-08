export interface ChatResponse {
  rich: {
    id: string;
    type: string;
    lifecycle: string;
    children: any[];
    timestamp: string;
    visible: boolean;
    interactive: boolean;
    data: {
      content: string;
      markdown: boolean;
      code_language: string | null;
      font_size: number | null;
      font_weight: string | null;
      text_align: string | null;
    };
  } | null;

  simple: {
    type: string;
    semantic_type: string | null;
    metadata: any | null;
    text: string;
  } | null;

  conversation_id: string;
  request_id: string;
  timestamp: number;
}
