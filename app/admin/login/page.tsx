"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  // Prérempli l'identifiant pour éviter les erreurs de saisie
  const [username, setUsername] = useState("OFAMM2026");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Trim values before sending
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();

      if (!trimmedUsername || !trimmedPassword) {
        setError("Veuillez remplir tous les champs");
        setLoading(false);
        return;
      }

      console.log("=== CLIENT: Sending login request ===");
      console.log("Username:", trimmedUsername);
      console.log("Password length:", trimmedPassword.length);
      console.log("Password value check:", trimmedPassword === "obe@_001" ? "MATCH" : "NO MATCH");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important: inclure les cookies dans la requête
        body: JSON.stringify({ 
          username: trimmedUsername, 
          password: trimmedPassword 
        }),
      });

      console.log("=== CLIENT: Response received ===");
      console.log("Status:", response.status);
      console.log("OK:", response.ok);
      console.log("Status Text:", response.statusText);

      // Vérifier si la réponse est OK avant de parser le JSON
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erreur de connexion" }));
        console.log("=== CLIENT: Login failed (HTTP error) ===");
        console.log("Error:", errorData.error);
        setError(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        console.log("=== CLIENT: Login successful ===");
        console.log("Cookie should be set by server (httpOnly, not visible in document.cookie)");
        
        // Note: httpOnly cookies are not accessible via JavaScript
        // The cookie is set by the server in the response headers
        // We trust the server response and redirect immediately
        console.log("Redirecting to /admin...");
        
        // Utiliser window.location.replace pour forcer un rechargement complet
        // Cela garantit que le cookie sera lu par le middleware lors de la nouvelle requête
        window.location.replace("/admin");
      } else {
        console.log("=== CLIENT: Login failed ===");
        console.log("Error:", data.error);
        setError(data.error || "Identifiants invalides. Vérifiez votre identifiant et mot de passe.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Erreur inattendue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            Connexion Admin
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
              >
                Identifiant
              </label>
              <input
                type="text"
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

