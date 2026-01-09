"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { CallToActionButtons } from "@/components/CallToActionButtons";
import Image from "next/image";
import { Calendar, MapPin, Clock, Filter, X } from "lucide-react";

type EventFilter = "all" | "past" | "upcoming";

interface Evenement {
  id: string;
  title: string;
  description: string;
  image?: string;
  date?: string;
  location?: string;
}

// Fonction pour parser une date et déterminer si elle est passée
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  // Essayer différents formats de date
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
        // Format avec mois en lettres
        const day = parseInt(match[1]);
        const month = months[match[2].toLowerCase()];
        const year = parseInt(match[3]);
        return new Date(year, month, day);
      } else if (match[2] && !isNaN(parseInt(match[2]))) {
        // Format numérique
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
  
  // Si aucun format ne correspond, essayer Date.parse
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

export default function EvenementsPage() {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<EventFilter>("all");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        setEvenements(data.evenements || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, []);

  // Filtrer les événements
  const filteredEvenements = evenements.filter((evenement) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "past") return isEventPast(evenement.date);
    if (selectedFilter === "upcoming") return !isEventPast(evenement.date);
    return true;
  });

  const filterOptions: { value: EventFilter; label: string }[] = [
    { value: "all", label: "Tous" },
    { value: "upcoming", label: "À venir" },
    { value: "past", label: "Passés" },
  ];

  const getFilterCount = (filter: EventFilter): number => {
    if (filter === "all") return evenements.length;
    if (filter === "past") return evenements.filter((e) => isEventPast(e.date)).length;
    if (filter === "upcoming") return evenements.filter((e) => !isEventPast(e.date)).length;
    return 0;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <ScrollAnimation animationType="fade" delay={100}>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Événements
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4"></div>
              <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Découvrez nos événements passés et à venir.
              </p>
            </div>
          </ScrollAnimation>

          {/* Filtres */}
          <ScrollAnimation animationType="fade" delay={200}>
            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                {filterOptions.map((filter) => {
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
                      <Filter className="w-4 h-4" />
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
          ) : filteredEvenements.length === 0 ? (
            <ScrollAnimation animationType="fade" delay={200}>
              <div className="text-center py-20">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {selectedFilter === "all"
                    ? "Aucun événement pour le moment. Revenez bientôt !"
                    : `Aucun événement ${selectedFilter === "past" ? "passé" : "à venir"} pour le moment.`}
                </p>
                {selectedFilter !== "all" && (
                  <button
                    onClick={() => setSelectedFilter("all")}
                    className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Voir tous les événements
                  </button>
                )}
              </div>
            </ScrollAnimation>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredEvenements.map((evenement, index) => {
                const isPast = isEventPast(evenement.date);
                return (
                  <ScrollAnimation
                    key={evenement.id}
                    animationType={index % 2 === 0 ? "slide-left" : "slide-right"}
                    delay={index * 150}
                  >
                    <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover-lift relative">
                      {/* Badge Passé/À venir */}
                      {evenement.date && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
                            isPast
                              ? "bg-gray-500/90 text-white"
                              : "bg-green-500/90 text-white"
                          }`}>
                            {isPast ? "Passé" : "À venir"}
                          </span>
                        </div>
                      )}
                      
                      {evenement.image && (
                        <div className="relative h-64 w-full overflow-hidden">
                          <Image
                            src={evenement.image}
                            alt={evenement.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            unoptimized={evenement.image?.startsWith("data:image/") || evenement.image?.startsWith("/uploads/")}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                          <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-gray-900/90 rounded-full backdrop-blur-sm">
                            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 inline mr-1" />
                            <span className="text-xs font-semibold text-gray-900 dark:text-white">Événement</span>
                          </div>
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {evenement.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                          {evenement.description}
                        </p>
                        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          {evenement.date && (
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="font-medium">{evenement.date}</span>
                            </div>
                          )}
                          {evenement.location && (
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="font-medium">{evenement.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollAnimation>
                );
              })}
            </div>
          )}
        </div>

        <CallToActionButtons />
      </main>
      <Footer />
    </div>
  );
}
