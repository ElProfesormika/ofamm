"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface NavItem {
  href?: string;
  label: string;
  submenu?: { href: string; label: string }[];
}

interface MobileMenuProps {
  navItems: NavItem[];
  pathname: string;
  onClose: () => void;
}

export function MobileMenu({ navItems, pathname, onClose }: MobileMenuProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  return (
    <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 max-h-[calc(100vh-80px)] overflow-y-auto">
      <div className="container mx-auto px-4 py-4 sm:py-6 flex flex-col gap-3 sm:gap-4">
        {navItems.map((item, index) => {
          if ("submenu" in item) {
            const isOpen = openSubmenu === item.label;
            return (
              <div key={item.label} className="border-b border-gray-100 dark:border-gray-800 pb-2 last:border-b-0">
                <button
                  onClick={() => setOpenSubmenu(isOpen ? null : item.label)}
                  className="flex items-center justify-between w-full text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2 transition-colors"
                >
                  <span>{item.label}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && item.submenu && (
                  <div className="ml-3 sm:ml-4 mt-2 mb-2 flex flex-col gap-2 border-l-2 border-blue-200 dark:border-blue-800 pl-3 sm:pl-4">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={() => {
                          onClose();
                          setOpenSubmenu(null);
                        }}
                        className={`text-sm sm:text-base py-1.5 transition-colors ${
                          pathname === subItem.href
                            ? "text-blue-600 dark:text-blue-400 font-semibold"
                            : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
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
          return (
            <Link
              key={item.href || index}
              href={item.href || "#"}
              onClick={onClose}
              className={`text-base sm:text-lg font-medium py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-colors ${
                pathname === item.href
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

