"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { ImageUpload } from "@/components/ImageUpload";
import { LogOut, Plus, Edit, Trash2, Save, X, ArrowLeft } from "lucide-react";

interface Produit {
  id: string;
  title: string;
  description?: string;
  prix?: string;
  image?: string;
}

export default function BoutiqueAdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [editingProduit, setEditingProduit] = useState<Produit | null>(null);
  const [newProduit, setNewProduit] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/content");
      const data = await response.json();
      setContent(data);
      setProduits(data.produits || []);
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
      console.log("Admin: Payload produits:", payload.produits?.length || 0);
      
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
            setEditingProduit(null);
            setNewProduit(false);
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

  const handleSaveProduit = async (produit: Produit) => {
    if (!content) return;
    const updatedProduits = produit.id && produits.find((p) => p.id === produit.id)
      ? produits.map((p) => (p.id === produit.id ? produit : p))
      : [...produits, { ...produit, id: Date.now().toString() }];
    const nextContent = { ...content, produits: updatedProduits };
    setProduits(updatedProduits);
    setContent(nextContent);
    await handleSaveContent(nextContent);
  };

  const handleDeleteProduit = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
    const updatedProduits = produits.filter((p) => p.id !== id);
    const nextContent = { ...content, produits: updatedProduits };
    setProduits(updatedProduits);
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
                Gestion de la Boutique
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
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Les visiteurs pourront commander vos produits en cliquant sur le bouton &quot;Commander via WhatsApp&quot; qui les redirigera vers le numéro <strong>+228 93 10 14 30</strong>.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setNewProduit(true);
                  setEditingProduit({
                    id: "",
                    title: "",
                    description: "",
                    prix: "",
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter un produit
              </button>
            </div>

            {(newProduit || editingProduit) && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {newProduit ? "Nouveau produit" : "Modifier le produit"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Titre
                    </label>
                    <input
                      type="text"
                      value={editingProduit?.title || ""}
                      onChange={(e) =>
                        setEditingProduit({ ...editingProduit!, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Description (optionnel)
                    </label>
                    <textarea
                      value={editingProduit?.description || ""}
                      onChange={(e) =>
                        setEditingProduit({ ...editingProduit!, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Prix (optionnel)
                    </label>
                    <input
                      type="text"
                      value={editingProduit?.prix || ""}
                      onChange={(e) =>
                        setEditingProduit({ ...editingProduit!, prix: e.target.value })
                      }
                      placeholder="Ex: 50 000 FCFA"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <ImageUpload
                      value={editingProduit?.image}
                      onChange={(url) =>
                        setEditingProduit({ ...editingProduit!, image: url })
                      }
                      label="Image (optionnel)"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => editingProduit && handleSaveProduit(editingProduit)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </button>
                    <button
                      onClick={() => {
                        setEditingProduit(null);
                        setNewProduit(false);
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
              {produits.map((produit) => (
                <div
                  key={produit.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  {produit.image && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={produit.image}
                        alt={produit.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {produit.title}
                  </h3>
                  {produit.prix && (
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {produit.prix}
                    </p>
                  )}
                  {produit.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {produit.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingProduit(produit)}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteProduit(produit.id)}
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






