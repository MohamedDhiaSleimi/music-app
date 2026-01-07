export interface Activity {
  _id: string;
  userId: string;
  type: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
