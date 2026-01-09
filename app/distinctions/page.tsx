"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { CallToActionButtons } from "@/components/CallToActionButtons";
import Image from "next/image";
import { Award, Filter, X, Calendar } from "lucide-react";

interface Distinction {
  id: string;
  title: string;
  description?: string;
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
    jan: 0, fév: 1, mar: 2, avr: 3, mai: 4, jun: 5,
    jul: 6, aoû: 7, sep: 8, oct: 9, nov: 10, déc: 11,
  };
  
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
        // Just year
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

export default function DistinctionsPage() {
  const [distinctions, setDistinctions] = useState<Distinction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<DateFilter>("all");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        setDistinctions(data.distinctions || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching distinctions:", error);
        setLoading(false);
      });
  }, []);

  // Filtrer par date (récentes = dernières 5 ans, anciennes = plus de 5 ans)
  const filteredDistinctions = distinctions.filter((distinction) => {
    if (selectedFilter === "all") return true;
    
    const date = parseDate(distinction.date || "");
    if (!date) return selectedFilter === "all";
    
    const now = new Date();
    const fiveYearsAgo = new Date(now.getFullYear() - 5, 0, 1);
    
    if (selectedFilter === "recent") {
      return date >= fiveYearsAgo;
    } else {
      return date < fiveYearsAgo;
    }
  });

  const getFilterCount = (filter: DateFilter): number => {
    if (filter === "all") return distinctions.length;
    
    const now = new Date();
    const fiveYearsAgo = new Date(now.getFullYear() - 5, 0, 1);
    
    return distinctions.filter((d) => {
      const date = parseDate(d.date || "");
      if (!date) return false;
      return filter === "recent" ? date >= fiveYearsAgo : date < fiveYearsAgo;
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
                Nos Distinctions
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4"></div>
              <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Découvrez les distinctions et reconnaissances reçues par O&apos;FAMM.
              </p>
            </div>
          </ScrollAnimation>

          {/* Filtres */}
          <ScrollAnimation animationType="fade" delay={200}>
            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                {[
                  { value: "all" as DateFilter, label: "Toutes" },
                  { value: "recent" as DateFilter, label: "Récentes (5 dernières années)" },
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
          ) : filteredDistinctions.length === 0 ? (
            <ScrollAnimation animationType="fade" delay={200}>
              <div className="text-center py-20">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {selectedFilter === "all"
                    ? "Aucune distinction pour le moment. Revenez bientôt !"
                    : `Aucune distinction ${selectedFilter === "recent" ? "récente" : "ancienne"} pour le moment.`}
                </p>
                {selectedFilter !== "all" && (
                  <button
                    onClick={() => setSelectedFilter("all")}
                    className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Voir toutes les distinctions
                  </button>
                )}
              </div>
            </ScrollAnimation>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDistinctions.map((distinction, index) => (
                <ScrollAnimation
                  key={distinction.id}
                  animationType="scale"
                  delay={index * 100}
                >
                  <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover-lift hover-glow relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {distinction.image && (
                      <div className="relative w-full h-56 mb-4 rounded-xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 shadow-md group-hover:shadow-xl">
                        <Image
                          src={distinction.image}
                          alt={distinction.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {distinction.title}
                    </h3>
                    
                    {distinction.date && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-medium">Date:</span> {distinction.date}
                      </p>
                    )}
                    
                    {distinction.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {distinction.description}
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
