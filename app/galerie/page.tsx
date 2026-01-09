import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { CallToActionButtons } from "@/components/CallToActionButtons";
import { getContent } from "@/lib/data";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

export default async function GaleriePage() {
  const content = await getContent();
  const galerie = content.galerie || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <ScrollAnimation animationType="fade" delay={100}>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Galerie
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4"></div>
              <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Explorez nos moments forts en images.
              </p>
            </div>
          </ScrollAnimation>

          {galerie.length === 0 ? (
            <ScrollAnimation animationType="fade" delay={200}>
              <div className="text-center py-20">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  La galerie est vide pour le moment. Revenez bientôt !
                </p>
              </div>
            </ScrollAnimation>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galerie.map((item: any, index: number) => (
                <ScrollAnimation
                  key={item.id}
                  animationType="scale"
                  delay={index * 50}
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700 group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift">
                    {item.image && (
                      <>
                        <Image
                          src={item.image}
                          alt={item.title || "Image de la galerie"}
                          fill
                          className="object-cover group-hover:scale-125 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </>
                    )}
                    {item.title && (
                      <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white font-semibold text-sm drop-shadow-lg">{item.title}</p>
                      </div>
                    )}
                    {/* Overlay effect */}
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-300"></div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          )}
        </div>

        <CallToActionButtons />
      </main>
      <Footer />
    </div>
  );
}

