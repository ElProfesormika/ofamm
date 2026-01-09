"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { CallToActionButtons } from "@/components/CallToActionButtons";
import Image from "next/image";
import { Calendar, User, BookOpen, ArrowRight, Filter, X } from "lucide-react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  description: string;
  excerpt?: string;
  image?: string;
  date?: string;
  author?: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("all");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.blog?.articles || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
        setLoading(false);
      });
  }, []);

  // Extraire les auteurs uniques
  const authors = Array.from(new Set(articles.map(a => a.author).filter(Boolean))) as string[];
  
  // Extraire les années uniques
  const years = Array.from(new Set(
    articles
      .map(a => {
        if (!a.date) return null;
        const yearMatch = a.date.match(/\d{4}/);
        return yearMatch ? yearMatch[0] : null;
      })
      .filter(Boolean)
  )).sort((a, b) => parseInt(b!) - parseInt(a!)) as string[];

  // Filtrer les articles
  const filteredArticles = articles.filter((article) => {
    if (selectedAuthor !== "all" && article.author !== selectedAuthor) return false;
    if (selectedDate !== "all") {
      const yearMatch = article.date?.match(/\d{4}/);
      const articleYear = yearMatch ? yearMatch[0] : null;
      if (articleYear !== selectedDate) return false;
    }
    return true;
  });

  const hasActiveFilters = selectedAuthor !== "all" || selectedDate !== "all";

  const resetFilters = () => {
    setSelectedAuthor("all");
    setSelectedDate("all");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <ScrollAnimation animationType="fade" delay={100}>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Articles
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4"></div>
              <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Découvrez nos articles sur la stratégie digitale, le marketing et bien plus.
              </p>
            </div>
          </ScrollAnimation>

          {/* Filtres */}
          {(authors.length > 0 || years.length > 0) && (
            <ScrollAnimation animationType="fade" delay={200}>
              <div className="mb-12">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtrer les articles</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {authors.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Auteur
                        </label>
                        <select
                          value={selectedAuthor}
                          onChange={(e) => setSelectedAuthor(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">Tous les auteurs</option>
                          {authors.map((author) => (
                            <option key={author} value={author}>
                              {author} ({articles.filter(a => a.author === author).length})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {years.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Année
                        </label>
                        <select
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">Toutes les années</option>
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year} ({articles.filter(a => {
                                const yearMatch = a.date?.match(/\d{4}/);
                                return yearMatch ? yearMatch[0] === year : false;
                              }).length})
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
          ) : filteredArticles.length === 0 ? (
            <ScrollAnimation animationType="fade" delay={200}>
              <div className="text-center py-20">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {hasActiveFilters
                    ? "Aucun article ne correspond aux filtres sélectionnés."
                    : "Aucun article pour le moment. Revenez bientôt !"}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Voir tous les articles
                  </button>
                )}
              </div>
            </ScrollAnimation>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <ScrollAnimation
                  key={article.id}
                  animationType="scale"
                  delay={index * 150}
                >
                  <Link
                    href={`/blog/articles/${article.id}`}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 block hover-lift"
                  >
                    {article.image && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          unoptimized={article.image?.startsWith("data:image/") || article.image?.startsWith("/uploads/")}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                        {article.excerpt || article.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                          {article.date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{article.date}</span>
                            </div>
                          )}
                          {article.author && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{article.author}</span>
                            </div>
                          )}
                        </div>
                        <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
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
