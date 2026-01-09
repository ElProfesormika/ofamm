"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { ImageUpload } from "@/components/ImageUpload";
import { LogOut, Plus, Edit, Trash2, Save, X, ArrowLeft } from "lucide-react";

interface Realisation {
  id: string;
  title: string;
  description: string;
  image?: string;
  date?: string;
}

export default function RealisationsAdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [editingRealisation, setEditingRealisation] = useState<Realisation | null>(null);
  const [newRealisation, setNewRealisation] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/content");
      const data = await response.json();
      setContent(data);
      setRealisations(data.realisations || []);
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
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      
      console.log("Admin: Response status:", response.status);
      const contentType = response.headers.get("content-type");
      const responseText = await response.text();
      
      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          try {
            const result = JSON.parse(responseText);
            console.log("Admin: Save successful");
            setContent(payload);
            await fetchData();
            setEditingRealisation(null);
            setNewRealisation(false);
          } catch (jsonError) {
            console.error("Admin: Error parsing JSON:", jsonError);
            alert(`Erreur lors de la sauvegarde: Réponse invalide`);
          }
        } else {
          alert(`Erreur lors de la sauvegarde: Réponse non-JSON`);
        }
      } else {
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = JSON.parse(responseText);
            alert(`Erreur lors de la sauvegarde: ${errorData.error || errorData.details || "Erreur inconnue"}`);
          } catch (jsonError) {
            alert(`Erreur lors de la sauvegarde: ${response.status} ${response.statusText}`);
          }
        } else {
          alert(`Erreur lors de la sauvegarde: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error("Admin: Error saving content:", error);
      alert(`Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    }
  };

  const handleSaveRealisation = async (realisation: Realisation) => {
    if (!content) return;
    const updatedRealisations = realisation.id && realisations.find((r) => r.id === realisation.id)
      ? realisations.map((r) => (r.id === realisation.id ? realisation : r))
      : [...realisations, { ...realisation, id: Date.now().toString() }];
    const nextContent = { ...content, realisations: updatedRealisations };
    setRealisations(updatedRealisations);
    setContent(nextContent);
    await handleSaveContent(nextContent);
  };

  const handleDeleteRealisation = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réalisation ?")) return;
    const updatedRealisations = realisations.filter((r) => r.id !== id);
    const nextContent = { ...content, realisations: updatedRealisations };
    setRealisations(updatedRealisations);
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
                Gestion des Réalisations
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
                  setNewRealisation(true);
                  setEditingRealisation({
                    id: "",
                    title: "",
                    description: "",
                    date: "",
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter une réalisation
              </button>
            </div>

            {(newRealisation || editingRealisation) && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {newRealisation ? "Nouvelle réalisation" : "Modifier la réalisation"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Titre
                    </label>
                    <input
                      type="text"
                      value={editingRealisation?.title || ""}
                      onChange={(e) =>
                        setEditingRealisation({ ...editingRealisation!, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Description
                    </label>
                    <textarea
                      value={editingRealisation?.description || ""}
                      onChange={(e) =>
                        setEditingRealisation({ ...editingRealisation!, description: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <ImageUpload
                      value={editingRealisation?.image}
                      onChange={(url) =>
                        setEditingRealisation({ ...editingRealisation!, image: url })
                      }
                      label="Image"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Date
                    </label>
                    <input
                      type="text"
                      value={editingRealisation?.date || ""}
                      onChange={(e) =>
                        setEditingRealisation({ ...editingRealisation!, date: e.target.value })
                      }
                      placeholder="Ex: Janvier 2024"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => editingRealisation && handleSaveRealisation(editingRealisation)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </button>
                    <button
                      onClick={() => {
                        setEditingRealisation(null);
                        setNewRealisation(false);
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
              {realisations.map((realisation) => (
                <div
                  key={realisation.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  {realisation.image && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={realisation.image}
                        alt={realisation.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {realisation.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">
                    {realisation.description}
                  </p>
                  {realisation.date && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                      {realisation.date}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingRealisation(realisation)}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteRealisation(realisation.id)}
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

