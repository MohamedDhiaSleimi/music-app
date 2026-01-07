import axios from "axios";
import {
  RECOMMENDATION_API_BASE_URL,
  RECOMMENDATION_ENDPOINTS,
} from "../constants/api.constants";
import type { RecommendationHit } from "../types/recommendation.types";

const recommendationClient = axios.create({
  baseURL: RECOMMENDATION_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const recommendationApi = {
  getUserRecommendations: async (userId: string, limit = 20) => {
    const response = await recommendationClient.get(
      `${RECOMMENDATION_ENDPOINTS.USER}/${userId}`,
      {
        params: { limit },
      }
    );
    return response.data as {
      success: boolean;
      cluster: number;
      favoritesUsed: number;
      count: number;
      recommendations: RecommendationHit[];
    };
  },
};
