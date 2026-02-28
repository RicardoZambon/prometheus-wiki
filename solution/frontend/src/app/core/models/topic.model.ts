export interface Topic {
  id: number;
  title: string;
  content: string;
  status: string;
  viewCount: number;
  authorUsername: string;
  categoryName: string;
  tags: string[];
  answerCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTopicRequest {
  title: string;
  content: string;
  categoryId: number;
  tagIds: number[];
}

export interface Answer {
  id: number;
  content: string;
  authorUsername: string;
  isSolution: boolean;
  isAiGenerated: boolean;
  aiProvider: string | null;
  upvoteCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}
