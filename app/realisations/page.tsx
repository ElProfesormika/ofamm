"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { CallToActionButtons } from "@/components/CallToActionButtons";
import Image from "next/image";
import { Calendar, CheckCircle, Filter, X } from "lucide-react";

interface Realisation {
  id: string;
  title: string;
  description: string;
  image?: string;
  date?: string;
}

// Fonction pour parser une date
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  const formats = [
    /(\d{1,2})\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/i,
    /(\d{1,2})\s+(jan|fév|mar|avr|mai|jun|jul|aoû|sep|oct|nov|déc)\s+(\d{4})/i,
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    /(\d{4})-(\d{1,2})-(\d{1,2})/,
    /(\d{4})/,
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
      } else if (match[1] && match[1].length === 4) {
        return new Date(parseInt(match[1]), 0, 1);
      }
    }
  }
  
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    return new Date(parsed);
  }
  
  return null;
}

type DateFilter = "all" | "recent" | "old";

export default function RealisationsPage() {
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<DateFilter>("all");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        setRealisations(data.realisations || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching realisations:", error);
        setLoading(false);
      });
  }, []);

  // Filtrer par date (récentes = dernières 3 ans, anciennes = plus de 3 ans)
  const filteredRealisations = realisations.filter((realisation) => {
    if (selectedFilter === "all") return true;
    
    const date = parseDate(realisation.date || "");
    if (!date) return false;
    
    const now = new Date();
    const threeYearsAgo = new Date(now.getFullYear() - 3, 0, 1);
    
    if (selectedFilter === "recent") {
      return date >= threeYearsAgo;
    } else {
      return date < threeYearsAgo;
    }
  });

  const getFilterCount = (filter: DateFilter): number => {
    if (filter === "all") return realisations.length;
    
    const now = new Date();
    const threeYearsAgo = new Date(now.getFullYear() - 3, 0, 1);
    
    return realisations.filter((r) => {
      const date = parseDate(r.date || "");
      if (!date) return false;
      return filter === "recent" ? date >= threeYearsAgo : date < threeYearsAgo;
    }).length;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <ScrollAnimation animationType="fade" delay={100}>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Nos Réalisations
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4"></div>
              <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Découvrez les projets que nous avons menés à bien et les succès de nos clients.
              </p>
            </div>
          </ScrollAnimation>

          {/* Filtres */}
          <ScrollAnimation animationType="fade" delay={200}>
            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                {[
                  { value: "all" as DateFilter, label: "Toutes" },
                  { value: "recent" as DateFilter, label: "Récentes (3 dernières années)" },
                  { value: "old" as DateFilter, label: "Anciennes" },
                ].map((filter) => {
                  const isActive = selectedFilter === filter.value;
                  const count = getFilterCount(filter.value);

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
                      <Calendar className="w-4 h-4" />
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
          ) : filteredRealisations.length === 0 ? (
            <ScrollAnimation animationType="fade" delay={200}>
              <div className="text-center py-20">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {selectedFilter === "all"
                    ? "Aucune réalisation pour le moment. Revenez bientôt !"
                    : `Aucune réalisation ${selectedFilter === "recent" ? "récente" : "ancienne"} pour le moment.`}
                </p>
                {selectedFilter !== "all" && (
                  <button
                    onClick={() => setSelectedFilter("all")}
                    className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Voir toutes les réalisations
                  </button>
                )}
              </div>
            </ScrollAnimation>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRealisations.map((realisation, index) => (
                <ScrollAnimation
                  key={realisation.id}
                  animationType="scale"
                  delay={index * 150}
                >
                  <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover-lift">
                    {realisation.image && (
                      <div className="relative h-64 w-full overflow-hidden">
                        <Image
                          src={realisation.image}
                          alt={realisation.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          unoptimized={realisation.image?.startsWith("data:image/") || realisation.image?.startsWith("/uploads/")}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {realisation.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {realisation.description}
                      </p>
                      {realisation.date && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{realisation.date}</span>
                        </div>
                      )}
                    </div>
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
