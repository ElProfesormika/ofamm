"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { ImageUpload } from "@/components/ImageUpload";
import { LogOut, Plus, Edit, Trash2, Save, X, ArrowLeft } from "lucide-react";

interface Partenaire {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  type?: string;
}

export default function PartenairesAdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [editingPartenaire, setEditingPartenaire] = useState<Partenaire | null>(null);
  const [newPartenaire, setNewPartenaire] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/content");
      const data = await response.json();
      setContent(data);
      setPartenaires(data.partenaires || []);
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
        method: "PUT",
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
            setEditingPartenaire(null);
            setNewPartenaire(false);
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

  const handleSavePartenaire = async (partenaire: Partenaire) => {
    if (!content) return;
    const updatedPartenaires = partenaire.id && partenaires.find((p) => p.id === partenaire.id)
      ? partenaires.map((p) => (p.id === partenaire.id ? partenaire : p))
      : [...partenaires, { ...partenaire, id: Date.now().toString() }];
    const nextContent = { ...content, partenaires: updatedPartenaires };
    setPartenaires(updatedPartenaires);
    setContent(nextContent);
    await handleSaveContent(nextContent);
  };

  const handleDeletePartenaire = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette collaboration ?")) return;
    const updatedPartenaires = partenaires.filter((p) => p.id !== id);
    const nextContent = { ...content, partenaires: updatedPartenaires };
    setPartenaires(updatedPartenaires);
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
                Gestion des Collaborations
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
                  setNewPartenaire(true);
                  setEditingPartenaire({
                    id: "",
                    name: "",
                    description: "",
                    website: "",
                    type: "",
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter une collaboration
              </button>
            </div>

            {(newPartenaire || editingPartenaire) && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {newPartenaire ? "Nouvelle collaboration" : "Modifier la collaboration"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={editingPartenaire?.name || ""}
                      onChange={(e) =>
                        setEditingPartenaire({ ...editingPartenaire!, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Description (optionnel)
                    </label>
                    <textarea
                      value={editingPartenaire?.description || ""}
                      onChange={(e) =>
                        setEditingPartenaire({ ...editingPartenaire!, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <ImageUpload
                      value={editingPartenaire?.logo}
                      onChange={(url) =>
                        setEditingPartenaire({ ...editingPartenaire!, logo: url })
                      }
                      label="Logo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Site web (URL optionnel)
                    </label>
                    <input
                      type="url"
                      value={editingPartenaire?.website || ""}
                      onChange={(e) =>
                        setEditingPartenaire({ ...editingPartenaire!, website: e.target.value })
                      }
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Type de collaboration
                    </label>
                    <select
                      value={editingPartenaire?.type || ""}
                      onChange={(e) =>
                        setEditingPartenaire({ ...editingPartenaire!, type: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="diplomatique">Diplomatique</option>
                      <option value="ambassades">Ambassades</option>
                      <option value="institutions">Institutions</option>
                      <option value="organismes">Organismes</option>
                      <option value="universites">Universités</option>
                      <option value="entreprises">Entreprises</option>
                      <option value="autres">Autres</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Catégorisez la collaboration pour faciliter le filtrage sur le site
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => editingPartenaire && handleSavePartenaire(editingPartenaire)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </button>
                    <button
                      onClick={() => {
                        setEditingPartenaire(null);
                        setNewPartenaire(false);
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
              {partenaires.map((partenaire) => (
                <div
                  key={partenaire.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center"
                >
                  {partenaire.logo && (
                    <div className="relative w-32 h-32 mb-4">
                      <Image
                        src={partenaire.logo}
                        alt={partenaire.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2 text-center text-gray-900 dark:text-white">
                    {partenaire.name}
                  </h3>
                  {partenaire.type && (
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2">
                      {partenaire.type}
                    </span>
                  )}
                  {partenaire.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                      {partenaire.description}
                    </p>
                  )}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => setEditingPartenaire(partenaire)}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeletePartenaire(partenaire.id)}
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

