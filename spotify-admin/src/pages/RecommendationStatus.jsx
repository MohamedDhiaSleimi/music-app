import axios from "axios";
import { useEffect, useState } from "react";

const RECOMMENDATION_API_BASE_URL =
  import.meta.env.VITE_RECOMMENDATION_API_BASE_URL ||
  "http://localhost:4003/api/recommendation";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

function RecommendationStatus() {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackfilling, setIsBackfilling] = useState(false);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${RECOMMENDATION_API_BASE_URL}/status`
      );
      setStatus(response.data);
    } catch (error) {
      console.log("error", error);
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleBackfill = async () => {
    setIsBackfilling(true);
    try {
      await axios.post(`${RECOMMENDATION_API_BASE_URL}/backfill`);
      await fetchStatus();
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsBackfilling(false);
    }
  };

  const isFunctional = status?.assetsLoaded === true;

  return (
    <div>
      <div className="flex items-center justify-between mr-5">
        <p>Recommendation Status</p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackfill}
            disabled={isBackfilling}
            className="px-4 py-2 bg-white border border-black text-sm font-medium drop-shadow-[-4px_4px_#00ff5b] disabled:opacity-60"
          >
            {isBackfilling ? "Backfilling..." : "Run Backfill"}
          </button>
          <button
            onClick={fetchStatus}
            className="px-4 py-2 bg-white border border-black text-sm font-medium drop-shadow-[-4px_4px_#00ff5b]"
          >
            Refresh
          </button>
        </div>
      </div>
      <hr />
      {isLoading ? (
        <p className="mt-4 text-sm">Loading status...</p>
      ) : status ? (
        <div className="mt-4 flex flex-col gap-4 mr-5">
          <div className="flex items-center gap-3">
            <span className="font-semibold">Functional:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isFunctional ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"
              }`}
            >
              {isFunctional ? "Yes" : "No"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-gray-300 bg-gray-50 p-4">
              <p className="text-xs uppercase text-gray-500">Features extracted</p>
              <p className="text-2xl font-semibold">
                {status.featureCount ?? "-"}
              </p>
            </div>
            <div className="border border-gray-300 bg-gray-50 p-4">
              <p className="text-xs uppercase text-gray-500">Last extracted</p>
              <p className="text-sm font-semibold">
                {formatDate(status.lastFeatureAt)}
              </p>
            </div>
            <div className="border border-gray-300 bg-gray-50 p-4">
              <p className="text-xs uppercase text-gray-500">Assets loaded</p>
              <p className="text-sm font-semibold">
                {status.assetsLoaded ? "Loaded" : "Not loaded"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm">Status unavailable.</p>
      )}
    </div>
  );
}

export default RecommendationStatus;
