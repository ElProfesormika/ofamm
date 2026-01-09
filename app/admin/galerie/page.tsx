"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { ImageUpload } from "@/components/ImageUpload";
import { LogOut, Plus, Edit, Trash2, Save, X, ArrowLeft } from "lucide-react";

interface GalerieItem {
  id: string;
  title?: string;
  image: string;
}

export default function GalerieAdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [galerie, setGalerie] = useState<GalerieItem[]>([]);
  const [editingGalerieItem, setEditingGalerieItem] = useState<GalerieItem | null>(null);
  const [newGalerieItem, setNewGalerieItem] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/content");
      const data = await response.json();
      setContent(data);
      setGalerie(data.galerie || []);
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
            setEditingGalerieItem(null);
            setNewGalerieItem(false);
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

  const handleSaveGalerieItem = async (item: GalerieItem) => {
    if (!content) return;
    const updatedGalerie = item.id && galerie.find((g) => g.id === item.id)
      ? galerie.map((g) => (g.id === item.id ? item : g))
      : [...galerie, { ...item, id: Date.now().toString() }];
    const nextContent = { ...content, galerie: updatedGalerie };
    setGalerie(updatedGalerie);
    setContent(nextContent);
    await handleSaveContent(nextContent);
  };

  const handleDeleteGalerieItem = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return;
    const updatedGalerie = galerie.filter((g) => g.id !== id);
    const nextContent = { ...content, galerie: updatedGalerie };
    setGalerie(updatedGalerie);
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
                Gestion de la Galerie
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
                  setNewGalerieItem(true);
                  setEditingGalerieItem({
                    id: "",
                    image: "",
                    title: "",
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter une image
              </button>
            </div>

            {(newGalerieItem || editingGalerieItem) && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {newGalerieItem ? "Nouvelle image" : "Modifier l'image"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Titre (optionnel)
                    </label>
                    <input
                      type="text"
                      value={editingGalerieItem?.title || ""}
                      onChange={(e) =>
                        setEditingGalerieItem({ ...editingGalerieItem!, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <ImageUpload
                      value={editingGalerieItem?.image}
                      onChange={(url) =>
                        setEditingGalerieItem({ ...editingGalerieItem!, image: url })
                      }
                      label="Image"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => editingGalerieItem && handleSaveGalerieItem(editingGalerieItem)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </button>
                    <button
                      onClick={() => {
                        setEditingGalerieItem(null);
                        setNewGalerieItem(false);
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galerie.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  {item.image && (
                    <div className="relative aspect-square mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title || "Image"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {item.title && (
                    <p className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
                      {item.title}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingGalerieItem(item)}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                    >
                      <Edit className="w-3 h-3" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteGalerieItem(item.id)}
                      className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
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

