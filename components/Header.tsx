"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [blogMenuOpen, setBlogMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/about", label: "À propos" },
    { href: "/services", label: "Services" },
    { href: "/realisations", label: "Réalisations" },
    { href: "/evenements", label: "Événements" },
    { href: "/galerie", label: "Galerie" },
    { href: "/partenaires", label: "Partenaires" },
    { 
      label: "Blog",
      submenu: [
        { href: "/blog/pubs", label: "Pubs" },
        { href: "/blog/articles", label: "Articles" },
      ]
    },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
          O&apos;FAMM
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => {
            if ("submenu" in item) {
              // Menu avec sous-menu (Blog)
              return (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setBlogMenuOpen(true)}
                  onMouseLeave={() => setBlogMenuOpen(false)}
                >
                  <button className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {item.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {(blogMenuOpen || pathname.startsWith("/blog")) && item.submenu && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`block px-4 py-2 transition-colors ${
                            pathname === subItem.href
                              ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
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
                className={`transition-colors ${
                  pathname === item.href
                    ? "text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <MobileMenu 
          navItems={navItems} 
          pathname={pathname} 
          onClose={() => setMobileMenuOpen(false)} 
        />
      )}
    </header>
  );
}

