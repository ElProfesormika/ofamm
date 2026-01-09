"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { ImageUpload } from "@/components/ImageUpload";
import { LogOut, Plus, Edit, Trash2, Save, X, ArrowLeft } from "lucide-react";

interface Distinction {
  id: string;
  title: string;
  description?: string;
  date?: string;
  image?: string;
}

export default function DistinctionsAdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [distinctions, setDistinctions] = useState<Distinction[]>([]);
  const [editingDistinction, setEditingDistinction] = useState<Distinction | null>(null);
  const [newDistinction, setNewDistinction] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/content");
      const data = await response.json();
      setContent(data);
      setDistinctions(data.distinctions || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async (nextContent?: any) => {
    const payload = nextContent ?? content;
    if (!payload) return;
    try {
      console.log("Admin: Sending PUT request to /api/content");
      console.log("Payload distinctions:", payload.distinctions?.length || 0);
      
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      console.log("Admin: Response status:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log("Admin: Save successful");
        setContent(payload);
        await fetchData();
        setEditingDistinction(null);
        setNewDistinction(false);
      } else {
        const errorData = await response.json();
        console.error("Admin: Save failed:", errorData);
        alert(`Erreur lors de la sauvegarde: ${errorData.error || errorData.details || "Erreur inconnue"}`);
      }
    } catch (error) {
      console.error("Admin: Error saving content:", error);
      alert(`Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    }
  };

  const handleSaveDistinction = async (distinction: Distinction) => {
    if (!content) return;
    const updatedDistinctions = distinction.id && distinctions.find((d) => d.id === distinction.id)
      ? distinctions.map((d) => (d.id === distinction.id ? distinction : d))
      : [...distinctions, { ...distinction, id: Date.now().toString() }];
    const nextContent = { ...content, distinctions: updatedDistinctions };
    setDistinctions(updatedDistinctions);
    setContent(nextContent);
    await handleSaveContent(nextContent);
  };

  const handleDeleteDistinction = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette distinction ?")) return;
    const updatedDistinctions = distinctions.filter((d) => d.id !== id);
    const nextContent = { ...content, distinctions: updatedDistinctions };
    setDistinctions(updatedDistinctions);
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
                Gestion des Distinctions
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
                  setNewDistinction(true);
                  setEditingDistinction({
                    id: "",
                    title: "",
                    description: "",
                    date: "",
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter une distinction
              </button>
            </div>

            {(newDistinction || editingDistinction) && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {newDistinction ? "Nouvelle distinction" : "Modifier la distinction"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Titre (ex: Miss Bibliothèque)
                    </label>
                    <input
                      type="text"
                      value={editingDistinction?.title || ""}
                      onChange={(e) =>
                        setEditingDistinction({ ...editingDistinction!, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Description (optionnel)
                    </label>
                    <textarea
                      value={editingDistinction?.description || ""}
                      onChange={(e) =>
                        setEditingDistinction({ ...editingDistinction!, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Date (optionnel)
                    </label>
                    <input
                      type="text"
                      value={editingDistinction?.date || ""}
                      onChange={(e) =>
                        setEditingDistinction({ ...editingDistinction!, date: e.target.value })
                      }
                      placeholder="Ex: 2024"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <ImageUpload
                      value={editingDistinction?.image}
                      onChange={(url) =>
                        setEditingDistinction({ ...editingDistinction!, image: url })
                      }
                      label="Image (optionnel)"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => editingDistinction && handleSaveDistinction(editingDistinction)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </button>
                    <button
                      onClick={() => {
                        setEditingDistinction(null);
                        setNewDistinction(false);
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
              {distinctions.map((distinction) => (
                <div
                  key={distinction.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  {distinction.image && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={distinction.image}
                        alt={distinction.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {distinction.title}
                  </h3>
                  {distinction.date && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-medium">Date:</span> {distinction.date}
                    </p>
                  )}
                  {distinction.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {distinction.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingDistinction(distinction)}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteDistinction(distinction.id)}
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






