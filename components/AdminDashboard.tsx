"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "./Header";
import { ImageUpload } from "./ImageUpload";
import { LogOut, Plus, Edit, Trash2, Save, X } from "lucide-react";

interface Slide {
  id: string;
  title: string;
  description: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
}

interface Realisation {
  id: string;
  title: string;
  description: string;
  image?: string;
  date?: string;
}

interface Evenement {
  id: string;
  title: string;
  description: string;
  image?: string;
  date?: string;
  location?: string;
}

interface GalerieItem {
  id: string;
  title?: string;
  image: string;
}

interface Partenaire {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  type?: string;
}

interface Pub {
  id: string;
  title: string;
  description: string;
  image?: string;
  date?: string;
  link?: string;
}

interface Article {
  id: string;
  title: string;
  description: string;
  excerpt?: string;
  content?: string;
  image?: string;
  date?: string;
  author?: string;
}

interface Content {
  about: {
    title: string;
    content: string;
  };
  legal: {
    cgu: string;
    privacy: string;
    mentions?: string;
  };
  services: Service[];
  realisations: Realisation[];
  evenements: Evenement[];
  galerie: GalerieItem[];
  partenaires: Partenaire[];
  blog: {
    pubs: Pub[];
    articles: Article[];
  };
}

export function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"slides" | "content">("slides");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingRealisation, setEditingRealisation] = useState<Realisation | null>(null);
  const [editingEvenement, setEditingEvenement] = useState<Evenement | null>(null);
  const [editingGalerieItem, setEditingGalerieItem] = useState<GalerieItem | null>(null);
  const [newSlide, setNewSlide] = useState(false);
  const [newService, setNewService] = useState(false);
  const [newRealisation, setNewRealisation] = useState(false);
  const [newEvenement, setNewEvenement] = useState(false);
  const [newGalerieItem, setNewGalerieItem] = useState(false);
  const [editingPartenaire, setEditingPartenaire] = useState<Partenaire | null>(null);
  const [editingPub, setEditingPub] = useState<Pub | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [newPartenaire, setNewPartenaire] = useState(false);
  const [newPub, setNewPub] = useState(false);
  const [newArticle, setNewArticle] = useState(false);
  const [blogSubTab, setBlogSubTab] = useState<"pubs" | "articles">("pubs");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slidesRes, contentRes] = await Promise.all([
        fetch("/api/slides"),
        fetch("/api/content"),
      ]);

      const slidesData = await slidesRes.json();
      const contentData = await contentRes.json();

      setSlides(slidesData);
      setContent({
        ...contentData,
        legal: contentData.legal || { cgu: "", privacy: "", mentions: "" },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleSaveSlide = async (slide: Slide) => {
    try {
      const method = slide.id && slides.find((s) => s.id === slide.id) ? "PUT" : "POST";
      const response = await fetch("/api/slides", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slide),
      });

      if (response.ok) {
        await fetchData();
        setEditingSlide(null);
        setNewSlide(false);
      }
    } catch (error) {
      console.error("Error saving slide:", error);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce slide ?")) return;

    try {
      const response = await fetch(`/api/slides?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
    }
  };

  const handleSaveContent = async (updatedContent?: Content) => {
    const payload = updatedContent ?? content;
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
        setEditingService(null);
        setNewService(false);
      }
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  const handleSaveService = async (service: Service) => {
    if (!content) return;

    const updatedServices = service.id && content.services.find((s) => s.id === service.id)
      ? content.services.map((s) => (s.id === service.id ? service : s))
      : [...content.services, { ...service, id: Date.now().toString() }];

    const nextContent = { ...content, services: updatedServices };
    setContent(nextContent);
    await handleSaveContent(nextContent);
  };

  const handleDeleteService = async (id: string) => {
    if (!content || !confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return;

    const updatedServices = content.services.filter((s) => s.id !== id);
    const nextContent = { ...content, services: updatedServices };
    setContent(nextContent);
    await handleSaveContent(nextContent);
  };

  // Handlers for Réalisations
  const handleSaveRealisation = async (realisation: Realisation) => {
    if (!content) return;
    const updatedRealisations = realisation.id && content.realisations.find((r) => r.id === realisation.id)
      ? content.realisations.map((r) => (r.id === realisation.id ? realisation : r))
      : [...content.realisations, { ...realisation, id: Date.now().toString() }];
    const nextContent = { ...content, realisations: updatedRealisations };
    setContent(nextContent);
    await handleSaveContent(nextContent);
  };

  const handleDeleteRealisation = async (id: string) => {
    if (!content || !confirm("Êtes-vous sûr de vouloir supprimer cette réalisation ?")) return;
    const updatedRealisations = content.realisations.filter((r) => r.id !== id);
    const nextContent = { ...content, realisations: updatedRealisations };
    setContent(nextContent);
    await handleSaveContent(nextContent);
  };

  // Handlers for Événements
  const handleSaveEvenement = async (evenement: Evenement) => {
    if (!content) return;
    const updatedEvenements = evenement.id && content.evenements.find((e) => e.id === evenement.id)
      ? content.evenements.map((e) => (e.id === evenement.id ? evenement : e))
      : [...content.evenements, { ...evenement, id: Date.now().toString() }];
    const nextContent = { ...content, evenements: updatedEvenements };
    setContent(nextContent);
    await handleSaveContent(nextContent);
  };

  const handleDeleteEvenement = async (id: string) => {
    if (!content || !confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) return;
    const updatedEvenements = content.evenements.filter((e) => e.id !== id);
    const nextContent = { ...content, evenements: updatedEvenements };
    setContent(nextContent);
    await handleSaveContent(nextContent);
  };

  // Handlers for Galerie
  const handleSaveGalerieItem = async (item: GalerieItem) => {
    if (!content) return;
    const updatedGalerie = item.id && content.galerie.find((g) => g.id === item.id)
      ? content.galerie.map((g) => (g.id === item.id ? item : g))
      : [...content.galerie, { ...item, id: Date.now().toString() }];
    const nextContent = { ...content, galerie: updatedGalerie };
    setContent(nextContent);
    await handleSaveContent(nextContent);
  };

  const handleDeleteGalerieItem = async (id: string) => {
    if (!content || !confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
    const updatedGalerie = content.galerie.filter((g) => g.id !== id);
    const nextContent = { ...content, galerie: updatedGalerie };
    setContent(nextContent);
    await handleSaveContent(nextContent);
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Administration
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("slides")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                activeTab === "slides"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-500"
              }`}
            >
              Slides d&apos;accueil
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                activeTab === "content"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-500"
              }`}
            >
              Contenus & Légal
            </button>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link
              href="/admin/realisations"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Réalisations
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez vos réalisations et projets
              </p>
            </Link>
            <Link
              href="/admin/evenements"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Événements
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez vos événements
              </p>
            </Link>
            <Link
              href="/admin/galerie"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Galerie
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez votre galerie d&apos;images
              </p>
            </Link>
            <Link
              href="/admin/collaborations"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Collaborations
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez vos collaborations et leurs logos
              </p>
            </Link>
            <Link
              href="/admin/timeline"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Timeline
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez la timeline de la page À propos
              </p>
            </Link>
            <Link
              href="/admin/blog/pubs"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Publicités
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez vos publicités
              </p>
            </Link>
            <Link
              href="/admin/blog/articles"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Articles
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez vos articles de blog
              </p>
            </Link>
            <Link
              href="/admin/impacts"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Impacts
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez vos impacts (continents, pays, villes)
              </p>
            </Link>
            <Link
              href="/admin/distinctions"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Distinctions
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez vos distinctions et reconnaissances
              </p>
            </Link>
            <Link
              href="/admin/boutique"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Boutique
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez vos produits et services
              </p>
            </Link>
            <Link
              href="/admin/reseaux-sociaux"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Réseaux Sociaux
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez les liens vers vos réseaux sociaux dans le footer
              </p>
            </Link>
          </div>

          {/* Slides Tab */}
          {activeTab === "slides" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setNewSlide(true);
                    setEditingSlide({
                      id: "",
                      title: "",
                      description: "",
                      ctaText: "",
                      ctaLink: "",
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un slide
                </button>
              </div>

              {(newSlide || editingSlide) && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    {newSlide ? "Nouveau slide" : "Modifier le slide"}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                        Titre
                      </label>
                      <input
                        type="text"
                        value={editingSlide?.title || ""}
                        onChange={(e) =>
                          setEditingSlide({ ...editingSlide!, title: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                        Description
                      </label>
                      <textarea
                        value={editingSlide?.description || ""}
                        onChange={(e) =>
                          setEditingSlide({ ...editingSlide!, description: e.target.value })
                        }
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <ImageUpload
                        value={editingSlide?.image}
                        onChange={(url) =>
                          setEditingSlide({ ...editingSlide!, image: url })
                        }
                        label="Image du slide"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                          Texte du bouton
                        </label>
                        <input
                          type="text"
                          value={editingSlide?.ctaText || ""}
                          onChange={(e) =>
                            setEditingSlide({ ...editingSlide!, ctaText: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                          Lien du bouton
                        </label>
                        <input
                          type="text"
                          value={editingSlide?.ctaLink || ""}
                          onChange={(e) =>
                            setEditingSlide({ ...editingSlide!, ctaLink: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => editingSlide && handleSaveSlide(editingSlide)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Enregistrer
                      </button>
                      <button
                        onClick={() => {
                          setEditingSlide(null);
                          setNewSlide(false);
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slides.map((slide) => (
                  <div
                    key={slide.id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {slide.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {slide.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingSlide(slide)}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteSlide(slide.id)}
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
          )}

          {/* Content Tab */}
          {activeTab === "content" && content && (
            <div className="space-y-8">
              {/* About Section */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Section À propos
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Titre
                    </label>
                    <input
                      type="text"
                      value={content.about.title}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, title: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Contenu
                    </label>
                    <textarea
                      value={content.about.content}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, content: e.target.value },
                        })
                      }
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={() => content && handleSaveContent(content)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>

              {/* Section Légal */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Informations légales
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Conditions Générales d&apos;Utilisation (CGU)
                    </label>
                    <textarea
                      value={content.legal?.cgu || ""}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          legal: { ...content.legal, cgu: e.target.value },
                        })
                      }
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Politique de confidentialité
                    </label>
                    <textarea
                      value={content.legal?.privacy || ""}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          legal: { ...content.legal, privacy: e.target.value },
                        })
                      }
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Mentions légales
                    </label>
                    <textarea
                      value={content.legal?.mentions || ""}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          legal: { ...content.legal, mentions: e.target.value },
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={() => content && handleSaveContent(content)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>

              {/* Services Section */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Services
                  </h3>
                  <button
                    onClick={() => {
                      setNewService(true);
                      setEditingService({
                        id: "",
                        title: "",
                        description: "",
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un service
                  </button>
                </div>

                {(newService || editingService) && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                          Titre
                        </label>
                        <input
                          type="text"
                          value={editingService?.title || ""}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService!,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                          Description
                        </label>
                        <textarea
                          value={editingService?.description || ""}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService!,
                              description: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() =>
                            editingService && handleSaveService(editingService)
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          Enregistrer
                        </button>
                        <button
                          onClick={() => {
                            setEditingService(null);
                            setNewService(false);
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

                <div className="space-y-4">
                  {content.services.map((service) => (
                    <div
                      key={service.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                        {service.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {service.description}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingService(service)}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
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
          )}

          {/* Sections moved to separate pages - see app/admin/realisations/page.tsx */}
          {/* Réalisations Tab - REMOVED (code moved to separate page) */}
          {/* Événements Tab - REMOVED (code moved to separate page) */}
          {/* Galerie Tab - REMOVED (code moved to separate page) */}
          {/* Partenaires Tab - REMOVED (code moved to separate page) */}
          {/* Blog Tab - REMOVED (code moved to separate pages) */}
          {/* All removed code has been moved to separate admin pages */}
          {false && (
            null // Code removed - see separate admin pages
          )}
          {/* Removed sections: evenements, galerie, partenaires, blog - see app/admin pages */}
        </div>
      </main>
    </div>
  );
}

