"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Plus, Edit, Trash2, Save, X, LogOut, ArrowLeft } from "lucide-react";

interface TimelineItem {
  id: string;
  year: string;
  position: "above" | "below";
  title: string;
  shortDescription: string;
  details: string[];
}

export default function TimelineAdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [newItem, setNewItem] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/content");
      const data = await response.json();
      setContent(data);
      setTimeline(data.timeline || []);
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
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setContent(payload);
        await fetchData();
        setEditingItem(null);
        setNewItem(false);
      }
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  const handleSaveItem = async (item: TimelineItem) => {
    if (!content) return;
    const updatedTimeline = item.id && timeline.find((t) => t.id === item.id)
      ? timeline.map((t) => (t.id === item.id ? item : t))
      : [...timeline, { ...item, id: Date.now().toString() }];
    const nextContent = { ...content, timeline: updatedTimeline };
    setTimeline(updatedTimeline);
    setContent(nextContent);
    await handleSaveContent(nextContent);
  };

  const handleDeleteItem = async (id: string) => {
    if (!content) return;
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément de la timeline ?")) return;
    const updatedTimeline = timeline.filter((t) => t.id !== id);
    const nextContent = { ...content, timeline: updatedTimeline };
    setTimeline(updatedTimeline);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
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
                Gestion de la Timeline
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

          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Éléments de la timeline
              </h2>
              <button
                onClick={() => {
                  setNewItem(true);
                  setEditingItem({
                    id: "",
                    year: "",
                    position: "below",
                    title: "",
                    shortDescription: "",
                    details: [],
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Ajouter un élément
              </button>
            </div>

            {timeline.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                Aucun élément dans la timeline. Cliquez sur &quot;Ajouter un élément&quot; pour commencer.
              </p>
            ) : (
              <div className="space-y-4">
                {timeline
                  .sort((a, b) => a.year.localeCompare(b.year))
                  .map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              Année: {item.year}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Position: {item.position === "above" ? "Au-dessus" : "En-dessous"}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">
                            {item.shortDescription}
                          </p>
                          <div className="text-sm text-gray-500 dark:text-gray-500">
                            {item.details.length} détail(s)
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            aria-label="Modifier"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {(editingItem || newItem) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {newItem ? "Nouvel élément" : "Modifier l'élément"}
                </h2>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setNewItem(false);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingItem) {
                    handleSaveItem(editingItem);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Année *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem?.year || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem!, year: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="2020"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Position *
                  </label>
                  <select
                    value={editingItem?.position || "below"}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem!,
                        position: e.target.value as "above" | "below",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="above">Au-dessus de la ligne</option>
                    <option value="below">En-dessous de la ligne</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Titre *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem?.title || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem!, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Début activité"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Description courte *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem?.shortDescription || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem!,
                        shortDescription: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Réseau d'affaires"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Détails (un par ligne) *
                  </label>
                  <textarea
                    required
                    value={editingItem?.details.join("\n") || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem!,
                        details: e.target.value.split("\n").filter((line) => line.trim()),
                      })
                    }
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Développement d'un puissant réseau d'affaires&#10;Animation de communautés digitales&#10;..."
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Chaque ligne correspond à un détail dans la modale
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setNewItem(false);
                    }}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
}

