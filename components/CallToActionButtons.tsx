"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Sparkles, Briefcase, Calendar, Image as ImageIcon, Handshake, ShoppingBag, Mail, Users, Target } from "lucide-react";
import { ScrollAnimation } from "./ScrollAnimation";

interface ActionButton {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "primary" | "secondary";
}

const pageActions: Record<string, ActionButton[]> = {
  "/": [
    { href: "/services", label: "Découvrir nos services", icon: Sparkles, variant: "primary" },
    { href: "/realisations", label: "Voir nos réalisations", icon: Briefcase, variant: "secondary" },
    { href: "/contact", label: "Nous contacter", icon: Mail, variant: "secondary" },
  ],
  "/about": [
    { href: "/services", label: "Nos services", icon: Sparkles, variant: "primary" },
    { href: "/realisations", label: "Nos réalisations", icon: Briefcase, variant: "secondary" },
    { href: "/contact", label: "Contactez-nous", icon: Mail, variant: "secondary" },
  ],
  "/services": [
    { href: "/contact", label: "Demander un devis", icon: Mail, variant: "primary" },
    { href: "/realisations", label: "Voir nos réalisations", icon: Briefcase, variant: "secondary" },
    { href: "/about", label: "En savoir plus", icon: Users, variant: "secondary" },
  ],
  "/realisations": [
    { href: "/services", label: "Nos services", icon: Sparkles, variant: "primary" },
    { href: "/contact", label: "Discutons de votre projet", icon: Mail, variant: "secondary" },
    { href: "/evenements", label: "Nos événements", icon: Calendar, variant: "secondary" },
  ],
  "/evenements": [
    { href: "/contact", label: "Participer à un événement", icon: Mail, variant: "primary" },
    { href: "/galerie", label: "Voir la galerie", icon: ImageIcon, variant: "secondary" },
    { href: "/services", label: "Nos services", icon: Sparkles, variant: "secondary" },
  ],
  "/galerie": [
    { href: "/evenements", label: "Nos événements", icon: Calendar, variant: "primary" },
    { href: "/realisations", label: "Nos réalisations", icon: Briefcase, variant: "secondary" },
    { href: "/contact", label: "Nous contacter", icon: Mail, variant: "secondary" },
  ],
  "/collaborations": [
    { href: "/contact", label: "Devenir partenaire", icon: Handshake, variant: "primary" },
    { href: "/services", label: "Nos services", icon: Sparkles, variant: "secondary" },
    { href: "/about", label: "À propos", icon: Users, variant: "secondary" },
  ],
  "/boutique": [
    { href: "/contact", label: "Besoin d'aide ?", icon: Mail, variant: "primary" },
    { href: "/services", label: "Nos services", icon: Sparkles, variant: "secondary" },
    { href: "/realisations", label: "Nos réalisations", icon: Briefcase, variant: "secondary" },
  ],
  "/contact": [
    { href: "/services", label: "Découvrir nos services", icon: Sparkles, variant: "primary" },
    { href: "/realisations", label: "Voir nos réalisations", icon: Briefcase, variant: "secondary" },
    { href: "/boutique", label: "Visiter la boutique", icon: ShoppingBag, variant: "secondary" },
  ],
  "/impacts": [
    { href: "/distinctions", label: "Nos distinctions", icon: Target, variant: "primary" },
    { href: "/realisations", label: "Nos réalisations", icon: Briefcase, variant: "secondary" },
    { href: "/contact", label: "Nous contacter", icon: Mail, variant: "secondary" },
  ],
  "/distinctions": [
    { href: "/impacts", label: "Nos impacts", icon: Target, variant: "primary" },
    { href: "/about", label: "À propos", icon: Users, variant: "secondary" },
    { href: "/contact", label: "Nous contacter", icon: Mail, variant: "secondary" },
  ],
  "/blog/articles": [
    { href: "/blog/pubs", label: "Voir les pubs", icon: ImageIcon, variant: "primary" },
    { href: "/services", label: "Nos services", icon: Sparkles, variant: "secondary" },
    { href: "/contact", label: "Nous contacter", icon: Mail, variant: "secondary" },
  ],
  "/blog/pubs": [
    { href: "/blog/articles", label: "Lire les articles", icon: Briefcase, variant: "primary" },
    { href: "/services", label: "Nos services", icon: Sparkles, variant: "secondary" },
    { href: "/contact", label: "Nous contacter", icon: Mail, variant: "secondary" },
  ],
  "/cgu": [
    { href: "/contact", label: "Nous contacter", icon: Mail, variant: "primary" },
    { href: "/services", label: "Nos services", icon: Sparkles, variant: "secondary" },
    { href: "/about", label: "À propos", icon: Users, variant: "secondary" },
  ],
  "/mentions-legales": [
    { href: "/contact", label: "Nous contacter", icon: Mail, variant: "primary" },
    { href: "/services", label: "Nos services", icon: Sparkles, variant: "secondary" },
    { href: "/about", label: "À propos", icon: Users, variant: "secondary" },
  ],
  "/politique-de-confidentialite": [
    { href: "/contact", label: "Nous contacter", icon: Mail, variant: "primary" },
    { href: "/services", label: "Nos services", icon: Sparkles, variant: "secondary" },
    { href: "/about", label: "À propos", icon: Users, variant: "secondary" },
  ],
};

export function CallToActionButtons() {
  const pathname = usePathname();
  const actions = pageActions[pathname] || pageActions["/"];

  if (actions.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimation animationType="fade" delay={100}>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              Prochaine action
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>
        </ScrollAnimation>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto px-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            const isPrimary = action.variant === "primary";
            
            return (
              <ScrollAnimation
                key={action.href}
                animationType="scale"
                delay={index * 100}
              >
                <Link
                  href={action.href}
                  className={`group inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    isPrimary
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{action.label}</span>
                  <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                    isPrimary ? "group-hover:translate-x-1" : "group-hover:translate-x-1"
                  }`} />
                </Link>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
}

