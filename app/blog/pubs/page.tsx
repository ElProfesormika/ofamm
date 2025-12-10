import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/data";
import Image from "next/image";
import { Calendar } from "lucide-react";

export default async function PubsPage() {
  const content = await getContent();
  const pubs = content.blog?.pubs || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Publicités
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Découvrez nos publicités et nos contenus.
          </p>

          {pubs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Aucune publicité pour le moment. Revenez bientôt !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pubs.map((pub: any) => (
                <div
                  key={pub.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
                >
                  {pub.image && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={pub.image}
                        alt={pub.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {pub.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {pub.description}
                    </p>
                    {pub.date && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{pub.date}</span>
                      </div>
                    )}
                    {pub.link && (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Lire la suite →
                      </a>
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

