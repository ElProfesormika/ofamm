"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { CallToActionButtons } from "@/components/CallToActionButtons";
import Image from "next/image";
import { ShoppingBag, MessageCircle } from "lucide-react";

export default function BoutiquePage() {
  const [produits, setProduits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const whatsappNumber = "+22893101430";
  const whatsappMessage = "Bonjour, je souhaite commander ce produit.";

  useEffect(() => {
    fetch("/api/content")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Public: Produits fetched:", data.produits?.length || 0);
        setProduits(data.produits || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Public: Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <ScrollAnimation animationType="fade" delay={100}>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Notre Boutique
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4"></div>
              <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Découvrez nos produits et services. Cliquez sur &quot;Commander&quot; pour passer votre commande via WhatsApp.
              </p>
            </div>
          </ScrollAnimation>

          {loading ? (
            <div className="text-center py-20">
              <div className="text-gray-600 dark:text-gray-400">Chargement...</div>
            </div>
          ) : produits.length === 0 ? (
            <ScrollAnimation animationType="fade" delay={200}>
              <div className="text-center py-20">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Aucun produit disponible pour le moment. Revenez bientôt !
                </p>
              </div>
            </ScrollAnimation>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {produits.map((produit: any, index: number) => (
                <ScrollAnimation
                  key={produit.id}
                  animationType="scale"
                  delay={index * 100}
                >
                  <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover-lift hover-glow relative overflow-hidden flex flex-col">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {produit.image && (
                      <div className="relative w-full h-56 mb-4 rounded-xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 shadow-md group-hover:shadow-xl">
                        <Image
                          src={produit.image}
                          alt={produit.title || "Produit"}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {produit.title}
                    </h3>
                    
                    {produit.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed flex-grow">
                        {produit.description}
                      </p>
                    )}
                    
                    {produit.prix && (
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                        {produit.prix}
                      </p>
                    )}
                    
                    <a
                      href={`https://wa.me/${whatsappNumber.replace(/\s/g, "")}?text=${encodeURIComponent(`${whatsappMessage} ${produit.title ? `Produit: ${produit.title}` : ""}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Commander via WhatsApp
                    </a>
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

