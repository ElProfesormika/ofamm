import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/data";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";

export default async function EvenementsPage() {
  const content = await getContent();
  const evenements = content.evenements || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Événements
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Découvrez nos événements passés et à venir.
          </p>

          {evenements.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Aucun événement pour le moment. Revenez bientôt !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {evenements.map((evenement: any) => (
                <div
                  key={evenement.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
                >
                  {evenement.image && (
                    <div className="relative h-64 w-full overflow-hidden">
                      <Image
                        src={evenement.image}
                        alt={evenement.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                      {evenement.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {evenement.description}
                    </p>
                    <div className="space-y-2">
                      {evenement.date && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-5 h-5" />
                          <span>{evenement.date}</span>
                        </div>
                      )}
                      {evenement.location && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-5 h-5" />
                          <span>{evenement.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

