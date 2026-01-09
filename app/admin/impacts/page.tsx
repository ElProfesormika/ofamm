"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { ImageUpload } from "@/components/ImageUpload";
import { LogOut, Plus, Edit, Trash2, Save, X, ArrowLeft } from "lucide-react";

interface Impact {
  id: string;
  continent?: string;
  pays?: string;
  ville?: string;
  description?: string;
  image?: string;
}

export default function ImpactsAdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [editingImpact, setEditingImpact] = useState<Impact | null>(null);
  const [newImpact, setNewImpact] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/content");
      const data = await response.json();
      setContent(data);
      setImpacts(data.impacts || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async (nextContent?: any) => {
    const payload = nextContent ?? content;
    if (!payload) {
      console.error("Admin: No payload to save");
      return;
    }
    try {
      console.log("Admin: Sending PUT request to /api/content");
      console.log("Admin: Payload impacts:", payload.impacts?.length || 0);
      
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      
      console.log("Admin: Response status:", response.status);
      const contentType = response.headers.get("content-type");
      console.log("Admin: Response Content-Type:", contentType);
      
      const responseText = await response.text();
      console.log("Admin: Response text (first 500 chars):", responseText.substring(0, 500));
      
      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          try {
            const result = JSON.parse(responseText);
            console.log("Admin: Save successful");
            setContent(payload);
            await fetchData();
            setEditingImpact(null);
            setNewImpact(false);
          } catch (jsonError) {
            console.error("Admin: Error parsing JSON response:", jsonError);
            alert(`Erreur lors de la sauvegarde: Réponse invalide du serveur`);
          }
        } else {
          console.error("Admin: Response is not JSON");
          alert(`Erreur lors de la sauvegarde: Le serveur a retourné une réponse non-JSON`);
        }
      } else {
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = JSON.parse(responseText);
            console.error("Admin: Save failed:", errorData);
            alert(`Erreur lors de la sauvegarde: ${errorData.error || errorData.details || "Erreur inconnue"}`);
          } catch (jsonError) {
            console.error("Admin: Error parsing error response:", jsonError);
            alert(`Erreur lors de la sauvegarde: ${response.status} ${response.statusText}`);
          }
        } else {
          console.error("Admin: Error response is not JSON");
          alert(`Erreur lors de la sauvegarde: ${response.status} ${response.statusText} - Réponse non-JSON`);
        }
      }
    } catch (error) {
      console.error("Admin: Error saving content:", error);
      alert(`Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    }
  };

  const handleSaveImpact = async (impact: Impact) => {
    if (!content) return;
    const updatedImpacts = impact.id && impacts.find((i) => i.id === impact.id)
      ? impacts.map((i) => (i.id === impact.id ? impact : i))
      : [...impacts, { ...impact, id: Date.now().toString() }];
    const nextContent = { ...content, impacts: updatedImpacts };
    setImpacts(updatedImpacts);
    setContent(nextContent);
    await handleSaveContent(nextContent);
  };

  const handleDeleteImpact = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet impact ?")) return;
    const updatedImpacts = impacts.filter((i) => i.id !== id);
    const nextContent = { ...content, impacts: updatedImpacts };
    setImpacts(updatedImpacts);
    setContent(nextContent);
    await handleSaveContent(nextContent);
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
                Gestion des Impacts
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

          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setNewImpact(true);
                  setEditingImpact({
                    id: "",
                    continent: "",
                    pays: "",
                    ville: "",
                    description: "",
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter un impact
              </button>
            </div>

            {(newImpact || editingImpact) && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {newImpact ? "Nouvel impact" : "Modifier l'impact"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Continent
                    </label>
                    <input
                      type="text"
                      value={editingImpact?.continent || ""}
                      onChange={(e) =>
                        setEditingImpact({ ...editingImpact!, continent: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Pays
                    </label>
                    <input
                      type="text"
                      value={editingImpact?.pays || ""}
                      onChange={(e) =>
                        setEditingImpact({ ...editingImpact!, pays: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={editingImpact?.ville || ""}
                      onChange={(e) =>
                        setEditingImpact({ ...editingImpact!, ville: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Description (optionnel)
                    </label>
                    <textarea
                      value={editingImpact?.description || ""}
                      onChange={(e) =>
                        setEditingImpact({ ...editingImpact!, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <ImageUpload
                      value={editingImpact?.image}
                      onChange={(url) =>
                        setEditingImpact({ ...editingImpact!, image: url })
                      }
                      label="Image (optionnel)"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => editingImpact && handleSaveImpact(editingImpact)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </button>
                    <button
                      onClick={() => {
                        setEditingImpact(null);
                        setNewImpact(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {impacts.map((impact) => (
                <div
                  key={impact.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  {impact.image && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={impact.image}
                        alt={impact.continent || impact.pays || "Impact"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {impact.continent || impact.pays || impact.ville || "Impact"}
                  </h3>
                  {impact.continent && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span className="font-medium">Continent:</span> {impact.continent}
                    </p>
                  )}
                  {impact.pays && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span className="font-medium">Pays:</span> {impact.pays}
                    </p>
                  )}
                  {impact.ville && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-medium">Ville:</span> {impact.ville}
                    </p>
                  )}
                  {impact.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {impact.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingImpact(impact)}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteImpact(impact.id)}
                      className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}






