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
    <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
        {navItems.map((item, index) => {
          if ("submenu" in item) {
            const isOpen = openSubmenu === item.label;
            return (
              <div key={item.label}>
                <button
                  onClick={() => setOpenSubmenu(isOpen ? null : item.label)}
                  className="flex items-center justify-between w-full text-gray-700 dark:text-gray-300"
                >
                  <span>{item.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={() => {
                          onClose();
                          setOpenSubmenu(null);
                        }}
                        className={`transition-colors ${
                          pathname === subItem.href
                            ? "text-blue-600 dark:text-blue-400 font-semibold"
                            : "text-gray-600 dark:text-gray-400"
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
              className={`transition-colors ${
                pathname === item.href
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300"
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

