export interface WikiPage {
  id: number;
  title: string;
  content: string | null;
  parentId: number | null;
  baseLanguage: string;
  createdByUsername: string;
  updatedByUsername: string;
  children: WikiPageTreeNode[];
  availableLanguages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WikiPageTreeNode {
  id: number;
  title: string;
  parentId: number | null;
  children: WikiPageTreeNode[];
}

export interface CreateWikiPageRequest {
  title: string;
  content: string;
  parentId: number | null;
  baseLanguage: string;
}
