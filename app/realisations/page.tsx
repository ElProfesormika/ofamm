import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/data";
import Image from "next/image";

export default async function RealisationsPage() {
  const content = await getContent();
  const realisations = content.realisations || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Nos Réalisations
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Découvrez les projets que nous avons menés à bien et les succès de nos clients.
          </p>

          {realisations.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Aucune réalisation pour le moment. Revenez bientôt !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {realisations.map((realisation: any) => (
                <div
                  key={realisation.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
                >
                  {realisation.image && (
                    <div className="relative h-64 w-full overflow-hidden">
                      <Image
                        src={realisation.image}
                        alt={realisation.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {realisation.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {realisation.description}
                    </p>
                    {realisation.date && (
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {realisation.date}
                      </p>
                    )}
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

