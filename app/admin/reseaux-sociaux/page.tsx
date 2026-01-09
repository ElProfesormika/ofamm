"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { LogOut, Save, ArrowLeft, Facebook, Twitter, Instagram, Linkedin, Youtube, Music } from "lucide-react";

interface ReseauxSociaux {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

const reseauxConfig = [
  { key: "facebook" as keyof ReseauxSociaux, label: "Facebook", icon: Facebook, color: "hover:text-blue-600 dark:hover:text-blue-400" },
  { key: "twitter" as keyof ReseauxSociaux, label: "Twitter / X", icon: Twitter, color: "hover:text-blue-400 dark:hover:text-blue-300" },
  { key: "instagram" as keyof ReseauxSociaux, label: "Instagram", icon: Instagram, color: "hover:text-pink-600 dark:hover:text-pink-400" },
  { key: "linkedin" as keyof ReseauxSociaux, label: "LinkedIn", icon: Linkedin, color: "hover:text-blue-700 dark:hover:text-blue-300" },
  { key: "youtube" as keyof ReseauxSociaux, label: "YouTube", icon: Youtube, color: "hover:text-red-600 dark:hover:text-red-400" },
  { key: "tiktok" as keyof ReseauxSociaux, label: "TikTok", icon: Music, color: "hover:text-black dark:hover:text-white" },
];

export default function ReseauxSociauxAdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reseauxSociaux, setReseauxSociaux] = useState<ReseauxSociaux>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/content");
      const data = await response.json();
      setContent(data);
      setReseauxSociaux(data.reseauxSociaux || {});
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    const nextContent = { ...content, reseauxSociaux };
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextContent),
      });
      if (response.ok) {
        setContent(nextContent);
        alert("Réseaux sociaux enregistrés avec succès !");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/admin")}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gestion des Réseaux Sociaux
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Ajoutez les liens vers vos réseaux sociaux. Ces liens apparaîtront dans le footer du site.
                Laissez un champ vide si vous ne souhaitez pas afficher ce réseau social.
              </p>

              <div className="space-y-6">
                {reseauxConfig.map((reseau) => {
                  const Icon = reseau.icon;
                  return (
                    <div key={reseau.key}>
                      <label className="flex items-center gap-3 mb-2 text-gray-900 dark:text-white">
                        <Icon className={`w-5 h-5 ${reseau.color}`} />
                        <span className="font-medium">{reseau.label}</span>
                      </label>
                      <input
                        type="url"
                        value={reseauxSociaux[reseau.key] || ""}
                        onChange={(e) =>
                          setReseauxSociaux({
                            ...reseauxSociaux,
                            [reseau.key]: e.target.value,
                          })
                        }
                        placeholder={`https://${reseau.key === "facebook" ? "facebook.com" : reseau.key === "twitter" ? "twitter.com" : reseau.key === "instagram" ? "instagram.com" : reseau.key === "linkedin" ? "linkedin.com" : reseau.key === "youtube" ? "youtube.com" : "tiktok.com"}/votre-profil`}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Save className="w-5 h-5" />
                  Enregistrer les réseaux sociaux
                </button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Aperçu des réseaux sociaux configurés :
              </h3>
              <div className="flex flex-wrap gap-3">
                {reseauxConfig.map((reseau) => {
                  if (!reseauxSociaux[reseau.key]) return null;
                  const Icon = reseau.icon;
                  return (
                    <a
                      key={reseau.key}
                      href={reseauxSociaux[reseau.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${reseau.color} transition-colors`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{reseau.label}</span>
                    </a>
                  );
                })}
                {Object.values(reseauxSociaux).filter(Boolean).length === 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Aucun réseau social configuré pour le moment.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

