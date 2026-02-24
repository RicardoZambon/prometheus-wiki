export interface Notification {
  id: number;
  type: string;
  referenceId: number;
  referenceType: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
