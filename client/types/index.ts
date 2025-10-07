export interface Comment {
  id: string;
  author_name: string;
  created_at: string;
  content: string;
  post_id: string;
  session_id: string;
}

export interface Post {
  id: string;
  author_name: string;
  created_at: string;
  title: string;
  content: string;
  likes: number;
  comments_count: number;
  tag: string;
  session_id: string;
  liked_by_user?: boolean;
}

export interface Guideline {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
}

export interface Stat {
  id: number;
  label: string;
  value: string;
}

export interface ReportReason {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Report {
  id: string;
  created_at: string;
  post_id: string;
  reason_id: string;
  additional_info: string | null;
  status: "pending" | "resolved";
  posts: Post; // For joined data
}
