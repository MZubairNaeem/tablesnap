export type ResponseStatus = "pending" | "approved" | "rejected";

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  brand_color: string;
  reward_text: string | null;
  reward_code: string | null;
  reward_terms: string | null;
  created_at: string;
}

export interface Question {
  id: string;
  business_id: string;
  text: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Response {
  id: string;
  business_id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  consent: boolean;
  status: ResponseStatus;
  created_at: string;
}

export interface Answer {
  id: string;
  response_id: string;
  question_id: string;
  video_url: string | null;
  text_answer: string | null;
  skipped: boolean;
  created_at: string;
}

export interface ResponseWithAnswers extends Response {
  answers: Answer[];
}
