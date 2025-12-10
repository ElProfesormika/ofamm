import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/data";
import Image from "next/image";

export default async function PartenairesPage() {
  const content = await getContent();
  const partenaires = content.partenaires || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Nos Partenaires
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Découvrez nos partenaires qui nous accompagnent dans notre mission.
          </p>

          {partenaires.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Aucun partenaire pour le moment. Revenez bientôt !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {partenaires.map((partenaire: any) => (
                <div
                  key={partenaire.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
                >
                  {partenaire.logo && (
                    <div className="relative w-32 h-32 mb-4">
                      <Image
                        src={partenaire.logo}
                        alt={partenaire.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white">
                    {partenaire.name}
                  </h3>
                  {partenaire.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                      {partenaire.description}
                    </p>
                  )}
                  {partenaire.website && (
                    <a
                      href={partenaire.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2"
                    >
                      Visiter le site
                    </a>
                  )}
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

