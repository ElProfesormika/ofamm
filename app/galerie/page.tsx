import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/data";
import Image from "next/image";

export default async function GaleriePage() {
  const content = await getContent();
  const galerie = content.galerie || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Galerie
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Explorez nos moments forts en images.
          </p>

          {galerie.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                La galerie est vide pour le moment. Revenez bientôt !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galerie.map((item: any) => (
                <div
                  key={item.id}
                  className="relative aspect-square overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 group cursor-pointer"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title || "Image de la galerie"}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  {item.title && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white font-semibold">{item.title}</p>
                    </div>
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

