"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const submenuTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout | null }>({});
  const submenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/about", label: "À propos" },
    { href: "/services", label: "Services" },
    { href: "/realisations", label: "Réalisations" },
    { href: "/collaborations", label: "Collaborations" },
    { 
      label: "Impact et Exploit",
      submenu: [
        { href: "/impacts", label: "Impacts" },
        { href: "/distinctions", label: "Distinctions" },
      ]
    },
    { href: "/boutique", label: "Boutique" },
    { 
      label: "Blog",
      submenu: [
        { href: "/blog/pubs", label: "Pubs" },
        { href: "/blog/articles", label: "Articles" },
      ]
    },
    { href: "/evenements", label: "Événements" },
    { href: "/galerie", label: "Galerie" },
    { href: "/contact", label: "Contact" },
  ];

  const handleSubmenuEnter = (label: string) => {
    if (submenuTimeoutRef.current[label]) {
      clearTimeout(submenuTimeoutRef.current[label]!);
      submenuTimeoutRef.current[label] = null;
    }
    setOpenSubmenu(label);
  };

  const handleSubmenuLeave = (label: string) => {
    submenuTimeoutRef.current[label] = setTimeout(() => {
      setOpenSubmenu(null);
    }, 200); // Délai de 200ms avant de fermer
  };

  useEffect(() => {
    const timeouts = submenuTimeoutRef.current;
    return () => {
      Object.values(timeouts).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <nav className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <Link 
          href="/" 
          className="relative group flex-shrink-0 transition-opacity duration-300 hover:opacity-80"
        >
          <div className="relative w-24 h-12 sm:w-28 sm:h-14 md:w-32 md:h-16 lg:w-36 lg:h-18 rounded-md overflow-hidden p-1 bg-white dark:bg-white">
            <div className="relative w-full h-full">
              <Image
                src="/logo_ofamm_navbar.png"
                alt="O'FAMM"
                fill
                className="object-contain rounded-md"
                priority
              />
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4 2xl:gap-6 flex-wrap justify-end">
          {navItems.map((item, index) => {
            if ("submenu" in item) {
              // Menu avec sous-menu
              const isOpen = openSubmenu === item.label;
              const isActive = item.submenu?.some(subItem => pathname === subItem.href || pathname.startsWith(subItem.href + "/"));
              return (
                <div
                  key={item.label}
                  ref={(el) => { submenuRefs.current[item.label] = el; }}
                  className="relative group"
                  onMouseEnter={() => handleSubmenuEnter(item.label)}
                  onMouseLeave={() => handleSubmenuLeave(item.label)}
                >
                  <button className="flex items-center gap-1 text-sm xl:text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
                    {item.label}
                    <ChevronDown className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {(isOpen || isActive) && item.submenu && (
                    <div 
                      className="absolute top-full left-0 pt-2 w-48 z-50 min-w-max"
                      onMouseEnter={() => handleSubmenuEnter(item.label)}
                      onMouseLeave={() => handleSubmenuLeave(item.label)}
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 animate-scale-in backdrop-blur-sm">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`block px-4 py-2 text-sm transition-all duration-200 hover:translate-x-1 whitespace-nowrap ${
                              pathname === subItem.href
                                ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-600"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                            style={{ animationDelay: `${subIndex * 50}ms` }}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            // Menu simple
            return (
              <Link
                key={item.href || index}
                href={item.href}
                className={`relative transition-colors group text-sm xl:text-base whitespace-nowrap ${
                  pathname === item.href
                    ? "text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                  pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </Link>
            );
          })}
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <MobileMenu 
            navItems={navItems} 
            pathname={pathname} 
            onClose={() => setMobileMenuOpen(false)} 
          />
        </div>
      )}
    </header>
  );
}

