"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { ImageUpload } from "@/components/ImageUpload";
import { LogOut, Plus, Edit, Trash2, Save, X, ArrowLeft, Filter } from "lucide-react";

type EventFilter = "all" | "past" | "upcoming";

// Fonction pour parser une date et déterminer si elle est passée
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  const formats = [
    /(\d{1,2})\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/i,
    /(\d{1,2})\s+(jan|fév|mar|avr|mai|jun|jul|aoû|sep|oct|nov|déc)\s+(\d{4})/i,
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    /(\d{4})-(\d{1,2})-(\d{1,2})/,
  ];
  
  const months: { [key: string]: number } = {
    janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
    juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11,
    jan: 0, fév: 1, mar: 2, avr: 3, jun: 5,
    jul: 6, aoû: 7, sep: 8, oct: 9, nov: 10, déc: 11,
  };
  
  // Gérer le cas spécial de "mai" qui est à la fois complet et abrégé
  months["mai"] = 4;
  
  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      if (match[2] && months[match[2].toLowerCase()] !== undefined) {
        const day = parseInt(match[1]);
        const month = months[match[2].toLowerCase()];
        const year = parseInt(match[3]);
        return new Date(year, month, day);
      } else if (match[2] && !isNaN(parseInt(match[2]))) {
        const parts = match[0].split(/[\/-]/);
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1;
          const year = parseInt(parts[2]);
          return new Date(year, month, day);
        }
      }
    }
  }
  
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    return new Date(parsed);
  }
  
  return null;
}

function isEventPast(dateStr?: string): boolean {
  if (!dateStr) return false;
  const eventDate = parseDate(dateStr);
  if (!eventDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  
  return eventDate < today;
}

interface Evenement {
  id: string;
  title: string;
  description: string;
  image?: string;
  date?: string;
  location?: string;
}

export default function EvenementsAdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [editingEvenement, setEditingEvenement] = useState<Evenement | null>(null);
  const [newEvenement, setNewEvenement] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<EventFilter>("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/content");
      const data = await response.json();
      setContent(data);
      setEvenements(data.evenements || []);
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
            setEditingEvenement(null);
            setNewEvenement(false);
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

  const handleSaveEvenement = async (evenement: Evenement) => {
    if (!content) return;
    const updatedEvenements = evenement.id && evenements.find((e) => e.id === evenement.id)
      ? evenements.map((e) => (e.id === evenement.id ? evenement : e))
      : [...evenements, { ...evenement, id: Date.now().toString() }];
    const nextContent = { ...content, evenements: updatedEvenements };
    setEvenements(updatedEvenements);
    setContent(nextContent);
    await handleSaveContent(nextContent);
  };

  const handleDeleteEvenement = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) return;
    const updatedEvenements = evenements.filter((e) => e.id !== id);
    const nextContent = { ...content, evenements: updatedEvenements };
    setEvenements(updatedEvenements);
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
                Gestion des Événements
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
            {/* Filtres */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrer par :</span>
                {[
                  { value: "all" as EventFilter, label: "Tous" },
                  { value: "upcoming" as EventFilter, label: "À venir" },
                  { value: "past" as EventFilter, label: "Passés" },
                ].map((filter) => {
                  const count = filter.value === "all" 
                    ? evenements.length 
                    : evenements.filter((e) => 
                        filter.value === "past" ? isEventPast(e.date) : !isEventPast(e.date)
                      ).length;
                  const isActive = selectedFilter === filter.value;
                  
                  return (
                    <button
                      key={filter.value}
                      onClick={() => setSelectedFilter(filter.value)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                      {filter.label}
                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setNewEvenement(true);
                  setEditingEvenement({
                    id: "",
                    title: "",
                    description: "",
                    date: "",
                    location: "",
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter un événement
              </button>
            </div>

            {(newEvenement || editingEvenement) && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {newEvenement ? "Nouvel événement" : "Modifier l'événement"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Titre
                    </label>
                    <input
                      type="text"
                      value={editingEvenement?.title || ""}
                      onChange={(e) =>
                        setEditingEvenement({ ...editingEvenement!, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Description
                    </label>
                    <textarea
                      value={editingEvenement?.description || ""}
                      onChange={(e) =>
                        setEditingEvenement({ ...editingEvenement!, description: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <ImageUpload
                      value={editingEvenement?.image}
                      onChange={(url) =>
                        setEditingEvenement({ ...editingEvenement!, image: url })
                      }
                      label="Image"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                        Date
                      </label>
                      <input
                        type="text"
                        value={editingEvenement?.date || ""}
                        onChange={(e) =>
                          setEditingEvenement({ ...editingEvenement!, date: e.target.value })
                        }
                        placeholder="Ex: 15 Mars 2024"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                        Lieu
                      </label>
                      <input
                        type="text"
                        value={editingEvenement?.location || ""}
                        onChange={(e) =>
                          setEditingEvenement({ ...editingEvenement!, location: e.target.value })
                        }
                        placeholder="Ex: Lomé, Togo"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => editingEvenement && handleSaveEvenement(editingEvenement)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </button>
                    <button
                      onClick={() => {
                        setEditingEvenement(null);
                        setNewEvenement(false);
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
              {evenements
                .filter((evenement) => {
                  if (selectedFilter === "all") return true;
                  if (selectedFilter === "past") return isEventPast(evenement.date);
                  if (selectedFilter === "upcoming") return !isEventPast(evenement.date);
                  return true;
                })
                .map((evenement) => {
                  const isPast = isEventPast(evenement.date);
                  return (
                    <div
                      key={evenement.id}
                      className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 relative"
                    >
                      {/* Badge Passé/À venir */}
                      {evenement.date && (
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            isPast
                              ? "bg-gray-500 text-white"
                              : "bg-green-500 text-white"
                          }`}>
                            {isPast ? "Passé" : "À venir"}
                          </span>
                        </div>
                      )}
                      
                      {evenement.image && (
                        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                          <Image
                            src={evenement.image}
                            alt={evenement.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                        {evenement.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">
                        {evenement.description}
                      </p>
                      {evenement.date && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">
                          📅 {evenement.date}
                        </p>
                      )}
                      {evenement.location && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                          📍 {evenement.location}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingEvenement(evenement)}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteEvenement(evenement.id)}
                          className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

