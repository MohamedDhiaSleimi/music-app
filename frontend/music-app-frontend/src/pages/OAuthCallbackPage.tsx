import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { AuthResponse } from "../types/auth.types";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasRun = useRef(false); // guard flag

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");
    const username = searchParams.get("username");
    const profileImageUrl = searchParams.get("profileImageUrl");
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      navigate("/login?error=" + encodeURIComponent(error), { replace: true });
      return;
    }

    if (token && userId && email && username) {
      const authData: AuthResponse = {
        token,
        userId,
        email,
        username,
        profileImageUrl: profileImageUrl || undefined,
      };

      login(authData);
      navigate("/", { replace: true });
    } else {
      navigate("/login?error=Authentication failed", { replace: true });
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/85 border border-slate-200 rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mb-4"></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Completing sign in...
          </h2>
          <p className="text-slate-600">Please wait while we redirect you.</p>
        </div>
      </div>
    </div>
  );
}
