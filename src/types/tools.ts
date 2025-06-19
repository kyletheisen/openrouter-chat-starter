export interface Tool {
  name: string;
  description: string;
  execute: (params?: any) => Promise<string>;
}

export interface ToolResponse {
  result: string;
  error?: string;
} 