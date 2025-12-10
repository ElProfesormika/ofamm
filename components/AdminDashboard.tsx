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
      setContent(contentData);
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

  const handleSaveContent = async () => {
    if (!content) return;

    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (response.ok) {
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

    setContent({ ...content, services: updatedServices });
    await handleSaveContent();
  };

  const handleDeleteService = async (id: string) => {
    if (!content || !confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return;

    const updatedServices = content.services.filter((s) => s.id !== id);
    setContent({ ...content, services: updatedServices });
    await handleSaveContent();
  };

  // Handlers for Réalisations
  const handleSaveRealisation = async (realisation: Realisation) => {
    if (!content) return;
    const updatedRealisations = realisation.id && content.realisations.find((r) => r.id === realisation.id)
      ? content.realisations.map((r) => (r.id === realisation.id ? realisation : r))
      : [...content.realisations, { ...realisation, id: Date.now().toString() }];
    setContent({ ...content, realisations: updatedRealisations });
    await handleSaveContent();
  };

  const handleDeleteRealisation = async (id: string) => {
    if (!content || !confirm("Êtes-vous sûr de vouloir supprimer cette réalisation ?")) return;
    const updatedRealisations = content.realisations.filter((r) => r.id !== id);
    setContent({ ...content, realisations: updatedRealisations });
    await handleSaveContent();
  };

  // Handlers for Événements
  const handleSaveEvenement = async (evenement: Evenement) => {
    if (!content) return;
    const updatedEvenements = evenement.id && content.evenements.find((e) => e.id === evenement.id)
      ? content.evenements.map((e) => (e.id === evenement.id ? evenement : e))
      : [...content.evenements, { ...evenement, id: Date.now().toString() }];
    setContent({ ...content, evenements: updatedEvenements });
    await handleSaveContent();
  };

  const handleDeleteEvenement = async (id: string) => {
    if (!content || !confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) return;
    const updatedEvenements = content.evenements.filter((e) => e.id !== id);
    setContent({ ...content, evenements: updatedEvenements });
    await handleSaveContent();
  };

  // Handlers for Galerie
  const handleSaveGalerieItem = async (item: GalerieItem) => {
    if (!content) return;
    const updatedGalerie = item.id && content.galerie.find((g) => g.id === item.id)
      ? content.galerie.map((g) => (g.id === item.id ? item : g))
      : [...content.galerie, { ...item, id: Date.now().toString() }];
    setContent({ ...content, galerie: updatedGalerie });
    await handleSaveContent();
  };

  const handleDeleteGalerieItem = async (id: string) => {
    if (!content || !confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
    const updatedGalerie = content.galerie.filter((g) => g.id !== id);
    setContent({ ...content, galerie: updatedGalerie });
    await handleSaveContent();
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
                Gérez votre galerie d'images
              </p>
            </Link>
            <Link
              href="/admin/partenaires"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Partenaires
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez vos partenaires et leurs logos
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
                    onClick={handleSaveContent}
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
          {/* Réalisations Tab - REMOVED */}
          {false && activeTab === "realisations" && content && (
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
                        Date (optionnel)
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.realisations.map((realisation) => (
                  <div
                    key={realisation.id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {realisation.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {realisation.description}
                    </p>
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
          )}

          {/* Événements Tab - REMOVED */}
          {false && activeTab === "evenements" && content && (
            <div className="space-y-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.evenements.map((evenement) => (
                  <div
                    key={evenement.id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {evenement.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {evenement.description}
                    </p>
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
                ))}
              </div>
            </div>
          )}

          {/* Galerie Tab - REMOVED */}
          {false && activeTab === "galerie" && content && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setNewGalerieItem(true);
                    setEditingGalerieItem({
                      id: "",
                      title: "",
                      image: "",
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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {content.galerie.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    {item.image && (
                      <div className="relative aspect-square mb-2 rounded overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title || "Image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {item.title && (
                      <p className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
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
          )}

          {/* Partenaires Tab - REMOVED */}
          {false && activeTab === "partenaires" && content && (
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
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un partenaire
                </button>
              </div>

              {(newPartenaire || editingPartenaire) && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    {newPartenaire ? "Nouveau partenaire" : "Modifier le partenaire"}
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
                        Description
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
                        Site web (URL)
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.partenaires.map((partenaire) => (
                  <div
                    key={partenaire.id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {partenaire.name}
                    </h3>
                    {partenaire.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {partenaire.description}
                      </p>
                    )}
                    <div className="flex gap-2">
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
          )}

          {/* Blog Tab - REMOVED */}
          {false && activeTab === "blog" && content && (
            <div className="space-y-4">
              {/* Sous-onglets Blog */}
              <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setBlogSubTab("pubs")}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    blogSubTab === "pubs"
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  Publicités
                </button>
                <button
                  onClick={() => setBlogSubTab("articles")}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    blogSubTab === "articles"
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  Articles
                </button>
              </div>

              {/* Publicités */}
              {blogSubTab === "pubs" && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setNewPub(true);
                        setEditingPub({
                          id: "",
                          title: "",
                          description: "",
                          date: "",
                          link: "",
                        });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter une publicité
                    </button>
                  </div>

                  {(newPub || editingPub) && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                        {newPub ? "Nouvelle publicité" : "Modifier la publicité"}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                            Titre
                          </label>
                          <input
                            type="text"
                            value={editingPub?.title || ""}
                            onChange={(e) =>
                              setEditingPub({ ...editingPub!, title: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                            Description
                          </label>
                          <textarea
                            value={editingPub?.description || ""}
                            onChange={(e) =>
                              setEditingPub({ ...editingPub!, description: e.target.value })
                            }
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <ImageUpload
                            value={editingPub?.image}
                            onChange={(url) =>
                              setEditingPub({ ...editingPub!, image: url })
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
                              value={editingPub?.date || ""}
                              onChange={(e) =>
                                setEditingPub({ ...editingPub!, date: e.target.value })
                              }
                              placeholder="Ex: 15 Mars 2024"
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                              Lien (URL)
                            </label>
                            <input
                              type="url"
                              value={editingPub?.link || ""}
                              onChange={(e) =>
                                setEditingPub({ ...editingPub!, link: e.target.value })
                              }
                              placeholder="https://..."
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => editingPub && handleSavePub(editingPub)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            Enregistrer
                          </button>
                          <button
                            onClick={() => {
                              setEditingPub(null);
                              setNewPub(false);
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
                    {content.blog.pubs.map((pub) => (
                      <div
                        key={pub.id}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                          {pub.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {pub.description}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingPub(pub)}
                            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeletePub(pub.id)}
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

              {/* Articles */}
              {blogSubTab === "articles" && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setNewArticle(true);
                        setEditingArticle({
                          id: "",
                          title: "",
                          description: "",
                          excerpt: "",
                          content: "",
                          date: "",
                          author: "",
                        });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter un article
                    </button>
                  </div>

                  {(newArticle || editingArticle) && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                        {newArticle ? "Nouvel article" : "Modifier l'article"}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                            Titre
                          </label>
                          <input
                            type="text"
                            value={editingArticle?.title || ""}
                            onChange={(e) =>
                              setEditingArticle({ ...editingArticle!, title: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                            Extrait (résumé)
                          </label>
                          <textarea
                            value={editingArticle?.excerpt || editingArticle?.description || ""}
                            onChange={(e) =>
                              setEditingArticle({ ...editingArticle!, excerpt: e.target.value, description: e.target.value })
                            }
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                            Contenu complet
                          </label>
                          <textarea
                            value={editingArticle?.content || ""}
                            onChange={(e) =>
                              setEditingArticle({ ...editingArticle!, content: e.target.value })
                            }
                            rows={8}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <ImageUpload
                            value={editingArticle?.image}
                            onChange={(url) =>
                              setEditingArticle({ ...editingArticle!, image: url })
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
                              value={editingArticle?.date || ""}
                              onChange={(e) =>
                                setEditingArticle({ ...editingArticle!, date: e.target.value })
                              }
                              placeholder="Ex: 15 Mars 2024"
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                              Auteur
                            </label>
                            <input
                              type="text"
                              value={editingArticle?.author || ""}
                              onChange={(e) =>
                                setEditingArticle({ ...editingArticle!, author: e.target.value })
                              }
                              placeholder="Ex: O'FAMM"
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => editingArticle && handleSaveArticle(editingArticle)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            Enregistrer
                          </button>
                          <button
                            onClick={() => {
                              setEditingArticle(null);
                              setNewArticle(false);
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
                    {content.blog.articles.map((article) => (
                      <div
                        key={article.id}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {article.excerpt || article.description}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingArticle(article)}
                            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

