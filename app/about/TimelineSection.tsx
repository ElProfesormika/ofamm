"use client";

import { TimelineModal } from "@/components/TimelineModal";

interface TimelineItem {
  id: string;
  year: string;
  position: "above" | "below";
  title: string;
  shortDescription: string;
  details: string[];
}

interface TimelineSectionProps {
  timeline: TimelineItem[];
}

export function TimelineSection({ timeline }: TimelineSectionProps) {
  // Grouper les éléments par année
  const timelineByYear = timeline.reduce((acc, item) => {
    if (!acc[item.year]) {
      acc[item.year] = { above: null, below: null };
    }
    acc[item.year][item.position] = item;
    return acc;
  }, {} as Record<string, { above: TimelineItem | null; below: TimelineItem | null }>);

  // Trier les années
  const years = Object.keys(timelineByYear).sort();

  if (years.length === 0) {
    return null;
  }

  return (
    <div className="relative py-16">
      {/* Ligne bleue horizontale */}
      <div className="absolute top-1/2 left-8 right-8 h-1 bg-blue-600 transform -translate-y-1/2 z-0"></div>

      {/* Points de la timeline */}
      <div className="relative flex justify-around items-center">
        {years.map((year) => {
          const items = timelineByYear[year];
          return (
            <div key={year} className="flex flex-col items-center relative z-10 flex-1">
              {/* Contenu au-dessus de la ligne */}
              {items.above && (
                <div className="text-center mb-6">
                  <TimelineModal
                    title={`${items.above.title} - ${year}`}
                    content={items.above.details}
                    trigger={
                      <div className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-blue-600 rounded-md shadow-sm">
                        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">
                          {items.above.title}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {items.above.shortDescription}
                        </div>
                      </div>
                    }
                  />
                </div>
              )}

              {/* Rectangle année si pas d'élément au-dessus */}
              {!items.above && (
                <div className="text-center mb-6">
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Année
                  </div>
                  <div className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-blue-600 rounded-md shadow-sm">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {year}
                    </div>
                  </div>
                </div>
              )}

              {/* Cercle sur la ligne */}
              <div className="w-5 h-5 bg-blue-600 rounded-full border-4 border-white dark:border-gray-800 shadow-md relative z-10"></div>

              {/* Contenu en-dessous de la ligne */}
              {items.below && (
                <div className="text-center mt-6">
                  <TimelineModal
                    title={`${items.below.title} - ${year}`}
                    content={items.below.details}
                    trigger={
                      <div className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          {items.below.title}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {items.below.shortDescription}
                        </div>
                      </div>
                    }
                  />
                </div>
              )}

              {/* Rectangle année si pas d'élément en-dessous */}
              {!items.below && (
                <div className="text-center mt-6">
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Année
                  </div>
                  <div className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-blue-600 rounded-md shadow-sm">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {year}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}







