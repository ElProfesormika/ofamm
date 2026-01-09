"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, TikTok } from "lucide-react";
import { ScrollAnimation } from "./ScrollAnimation";

interface ReseauxSociaux {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

export function Footer() {
  const [reseauxSociaux, setReseauxSociaux] = useState<ReseauxSociaux>({});

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        setReseauxSociaux(data.reseauxSociaux || {});
      })
      .catch((error) => {
        console.error("Error fetching social networks:", error);
      });
  }, []);

  const socialLinks = [
    { key: "facebook", icon: Facebook, href: reseauxSociaux.facebook, label: "Facebook", color: "hover:text-blue-600 dark:hover:text-blue-400" },
    { key: "twitter", icon: Twitter, href: reseauxSociaux.twitter, label: "Twitter", color: "hover:text-blue-400 dark:hover:text-blue-300" },
    { key: "instagram", icon: Instagram, href: reseauxSociaux.instagram, label: "Instagram", color: "hover:text-pink-600 dark:hover:text-pink-400" },
    { key: "linkedin", icon: Linkedin, href: reseauxSociaux.linkedin, label: "LinkedIn", color: "hover:text-blue-700 dark:hover:text-blue-300" },
    { key: "youtube", icon: Youtube, href: reseauxSociaux.youtube, label: "YouTube", color: "hover:text-red-600 dark:hover:text-red-400" },
    { key: "tiktok", icon: TikTok, href: reseauxSociaux.tiktok, label: "TikTok", color: "hover:text-black dark:hover:text-white" },
  ].filter((link) => link.href);
  return (
    <footer className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <ScrollAnimation animationType="fade" delay={100}>
            <div>
              <div className="mb-3 sm:mb-4">
                <Link href="/" className="inline-block group">
                  <div className="relative w-32 h-16 sm:w-40 sm:h-20 md:w-48 md:h-24 bg-transparent dark:bg-white dark:rounded-lg dark:p-2 dark:shadow-sm transition-all duration-300">
                    <Image
                      src="/logo_ofamm_footer.png"
                      alt="O'FAMM Logo"
                      fill
                      className="object-contain transition-opacity duration-300 group-hover:opacity-80 p-1"
                      priority
                    />
                  </div>
                </Link>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Freelance en Communication Digitale & Stratégie Marketing - Première Femme Data Commerciale du Togo
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animationType="slide-left" delay={200}>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                Liens rapides
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    À propos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animationType="scale" delay={300}>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                Suivez-nous
              </h4>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.key}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 ${social.color} hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg`}
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
                {socialLinks.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aucun réseau social configuré
                  </p>
                )}
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animationType="slide-right" delay={400}>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                Informations légales
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link
                    href="/cgu"
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    Conditions Générales d&apos;Utilisation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/politique-de-confidentialite"
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mentions-legales"
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    Mentions légales
                  </Link>
                </li>
              </ul>
            </div>
          </ScrollAnimation>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <ScrollAnimation animationType="fade" delay={500}>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} O&apos;FAMM. Tous droits réservés.
            </p>
          </ScrollAnimation>
        </div>
      </div>
    </footer>
  );
}

