"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { CallToActionButtons } from "@/components/CallToActionButtons";
import Image from "next/image";
import { ExternalLink, Handshake, Building2, Globe, Users, Filter, X } from "lucide-react";

type CollaborationType = "all" | "diplomatique" | "ambassades" | "institutions" | "organismes" | "universites" | "entreprises";

interface Partenaire {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  type?: string;
}

export default function CollaborationsPage() {
  const [collaborations, setCollaborations] = useState<Partenaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<CollaborationType>("all");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Public: Collaborations fetched:", data.partenaires?.length || 0);
        setCollaborations(data.partenaires || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Public: Error fetching collaborations:", error);
        setLoading(false);
      });
  }, []);

  // Map des types vers les catégories
  const typeMap: Record<string, CollaborationType> = {
    "diplomatique": "diplomatique",
    "ambassade": "ambassades",
    "ambassades": "ambassades",
    "institution": "institutions",
    "institutions": "institutions",
    "organisme": "organismes",
    "organismes": "organismes",
    "universite": "universites",
    "universites": "universites",
    "université": "universites",
    "universités": "universites",
    "entreprise": "entreprises",
    "entreprises": "entreprises",
  };

  // Normaliser le type pour le filtrage
  const normalizeType = (type?: string): CollaborationType => {
    if (!type) return "all";
    const normalized = type.toLowerCase().trim();
    return typeMap[normalized] || "all";
  };

  // Filtrer les collaborations
  const filteredCollaborations = selectedFilter === "all"
    ? collaborations
    : collaborations.filter((collab) => normalizeType(collab.type) === selectedFilter);

  const filterOptions: { value: CollaborationType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: "all", label: "Toutes", icon: Filter },
    { value: "diplomatique", label: "Diplomatique", icon: Globe },
    { value: "ambassades", label: "Ambassades", icon: Building2 },
    { value: "institutions", label: "Institutions", icon: Building2 },
    { value: "organismes", label: "Organismes", icon: Users },
    { value: "universites", label: "Universités", icon: Building2 },
    { value: "entreprises", label: "Entreprises", icon: Building2 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <ScrollAnimation animationType="fade" delay={100}>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Nos Collaborations
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4"></div>
              <p className="text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
                Découvrez nos collaborations qui nous accompagnent dans notre mission. 
                Nous collaborons avec des partenaires de différents horizons : <strong className="text-gray-900 dark:text-white">collaborations diplomatiques</strong> (ambassades, institutions, organismes), 
                universités, entreprises et bien d&apos;autres acteurs engagés.
              </p>
            </div>
          </ScrollAnimation>

          {/* Filtres */}
          <ScrollAnimation animationType="fade" delay={200}>
            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                {filterOptions.map((filter) => {
                  const Icon = filter.icon;
                  const isActive = selectedFilter === filter.value;
                  const count = filter.value === "all" 
                    ? collaborations.length 
                    : collaborations.filter((c) => normalizeType(c.type) === filter.value).length;

                  return (
                    <button
                      key={filter.value}
                      onClick={() => setSelectedFilter(filter.value)}
                      className={`group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{filter.label}</span>
                      {count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {selectedFilter !== "all" && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setSelectedFilter("all")}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </ScrollAnimation>

          {loading ? (
            <div className="text-center py-20">
              <div className="text-gray-600 dark:text-gray-400">Chargement...</div>
            </div>
          ) : filteredCollaborations.length === 0 ? (
            <ScrollAnimation animationType="fade" delay={200}>
              <div className="text-center py-20">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Handshake className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {selectedFilter === "all"
                    ? "Aucune collaboration pour le moment. Revenez bientôt !"
                    : `Aucune collaboration de type "${filterOptions.find(f => f.value === selectedFilter)?.label}" pour le moment.`}
                </p>
                {selectedFilter !== "all" && (
                  <button
                    onClick={() => setSelectedFilter("all")}
                    className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Voir toutes les collaborations
                  </button>
                )}
              </div>
            </ScrollAnimation>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCollaborations.map((partenaire, index) => (
                <ScrollAnimation
                  key={partenaire.id}
                  animationType="scale"
                  delay={index * 100}
                >
                  <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center hover-lift hover-glow relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Badge de type */}
                    {partenaire.type && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          {partenaire.type}
                        </span>
                      </div>
                    )}
                    
                    {partenaire.logo && (
                      <div className="relative w-40 h-40 mb-6 group-hover:scale-105 transition-transform duration-300">
                        <div className="absolute inset-0 bg-white dark:bg-white rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-200 group-hover:shadow-lg group-hover:border-blue-200 dark:group-hover:border-blue-300 transition-all duration-300">
                          <div className="relative w-full h-full">
                            <Image
                              src={partenaire.logo}
                              alt={partenaire.name}
                              fill
                              className="object-contain filter group-hover:drop-shadow-md transition-all duration-300"
                              unoptimized={partenaire.logo?.startsWith("data:image/") || partenaire.logo?.startsWith("/uploads/")}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {partenaire.name}
                    </h3>
                    {partenaire.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2 leading-relaxed">
                        {partenaire.description}
                      </p>
                    )}
                    {partenaire.website && (
                      <a
                        href={partenaire.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium group/link"
                      >
                        Visiter le site
                        <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    )}
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          )}
        </div>

        <CallToActionButtons />
      </main>
      <Footer />
    </div>
  );
}
