import { useEffect, useState } from "react";
import { apiFetch, readJson } from "../api.js";

export default function ProfilePage({ eyebrow, header, title }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await apiFetch("/api/profile");
        const data = await readJson(res);
        setProfile(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="app-screen">
        {header}
        <main className="app-main">
          <p className="page-subtitle">Loading profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-screen flex min-h-screen flex-col">
      {header}

      <main className="app-main flex-grow">
        <div className="glass-card mx-auto max-w-xl rounded-[2rem] p-8 text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-title mt-3">{title}</h1>
          {error && <p className="error-state mt-4 text-sm">{error}</p>}
          {profile && (
            <div className="mt-4 flex flex-col items-center">
              <img
                src={
                  profile.photoUrl ||
                  `https://placehold.co/400x400/2A1934/FFFFFF?text=${encodeURIComponent(profile.firstName)}`
                }
                alt={profile.firstName}
                className="h-40 w-40 rounded-full border-4 border-amber-300 object-cover shadow-2xl shadow-amber-950/30"
              />
              <p className="mt-4 text-2xl font-black text-white">
                {profile.firstName}
              </p>
              <p className="text-sm text-slate-400">{profile.email}</p>
              <span className="status-pill mt-4">{profile.role}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
