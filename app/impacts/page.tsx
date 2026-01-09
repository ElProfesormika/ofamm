"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { CallToActionButtons } from "@/components/CallToActionButtons";
import Image from "next/image";
import { Globe, MapPin, Filter, X } from "lucide-react";

interface Impact {
  id: string;
  continent?: string;
  pays?: string;
  ville?: string;
  description?: string;
  image?: string;
}

export default function ImpactsPage() {
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContinent, setSelectedContinent] = useState<string>("all");
  const [selectedPays, setSelectedPays] = useState<string>("all");
  const [selectedVille, setSelectedVille] = useState<string>("all");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        setImpacts(data.impacts || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching impacts:", error);
        setLoading(false);
      });
  }, []);

  // Extraire les valeurs uniques pour les filtres
  const continents = Array.from(new Set(impacts.map(i => i.continent).filter(Boolean))) as string[];
  const pays = Array.from(new Set(impacts.map(i => i.pays).filter(Boolean))) as string[];
  const villes = Array.from(new Set(impacts.map(i => i.ville).filter(Boolean))) as string[];

  // Filtrer les impacts
  const filteredImpacts = impacts.filter((impact) => {
    if (selectedContinent !== "all" && impact.continent !== selectedContinent) return false;
    if (selectedPays !== "all" && impact.pays !== selectedPays) return false;
    if (selectedVille !== "all" && impact.ville !== selectedVille) return false;
    return true;
  });

  const hasActiveFilters = selectedContinent !== "all" || selectedPays !== "all" || selectedVille !== "all";

  const resetFilters = () => {
    setSelectedContinent("all");
    setSelectedPays("all");
    setSelectedVille("all");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <ScrollAnimation animationType="fade" delay={100}>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Nos Impacts
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4"></div>
              <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Découvrez l&apos;impact d&apos;O&apos;FAMM à travers les continents, pays et villes.
              </p>
            </div>
          </ScrollAnimation>

          {/* Filtres */}
          {(continents.length > 0 || pays.length > 0 || villes.length > 0) && (
            <ScrollAnimation animationType="fade" delay={200}>
              <div className="mb-12">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtrer par localisation</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {continents.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Continent
                        </label>
                        <select
                          value={selectedContinent}
                          onChange={(e) => setSelectedContinent(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">Tous les continents</option>
                          {continents.map((continent) => (
                            <option key={continent} value={continent}>
                              {continent} ({impacts.filter(i => i.continent === continent).length})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {pays.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Pays
                        </label>
                        <select
                          value={selectedPays}
                          onChange={(e) => setSelectedPays(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">Tous les pays</option>
                          {pays.map((p) => (
                            <option key={p} value={p}>
                              {p} ({impacts.filter(i => i.pays === p).length})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {villes.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Ville
                        </label>
                        <select
                          value={selectedVille}
                          onChange={(e) => setSelectedVille(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">Toutes les villes</option>
                          {villes.map((v) => (
                            <option key={v} value={v}>
                              {v} ({impacts.filter(i => i.ville === v).length})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {hasActiveFilters && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={resetFilters}
                        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Réinitialiser les filtres
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </ScrollAnimation>
          )}

          {loading ? (
            <div className="text-center py-20">
              <div className="text-gray-600 dark:text-gray-400">Chargement...</div>
            </div>
          ) : filteredImpacts.length === 0 ? (
            <ScrollAnimation animationType="fade" delay={200}>
              <div className="text-center py-20">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {hasActiveFilters
                    ? "Aucun impact ne correspond aux filtres sélectionnés."
                    : "Aucun impact pour le moment. Revenez bientôt !"}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Voir tous les impacts
                  </button>
                )}
              </div>
            </ScrollAnimation>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImpacts.map((impact, index) => (
                <ScrollAnimation
                  key={impact.id}
                  animationType="scale"
                  delay={index * 100}
                >
                  <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover-lift hover-glow relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {impact.image && (
                      <div className="relative w-full h-56 mb-4 rounded-xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 shadow-md group-hover:shadow-xl">
                        <Image
                          src={impact.image}
                          alt={impact.continent || impact.pays || impact.ville || "Impact"}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {impact.continent && (
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-semibold">Continent:</span>
                          <span>{impact.continent}</span>
                        </div>
                      )}
                      {impact.pays && (
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-semibold">Pays:</span>
                          <span>{impact.pays}</span>
                        </div>
                      )}
                      {impact.ville && (
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="font-semibold">Ville:</span>
                          <span>{impact.ville}</span>
                        </div>
                      )}
                    </div>
                    
                    {impact.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                        {impact.description}
                      </p>
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
