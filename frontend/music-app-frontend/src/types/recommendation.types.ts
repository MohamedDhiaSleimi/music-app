export interface RecommendationHit {
  id?: string;
  name: string;
  artists?: string;
  year?: number;
  popularity?: number;
  distance?: number;
  features?: Record<string, number>;
}
