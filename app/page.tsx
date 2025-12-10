import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSlider } from "@/components/HeroSlider";
import { getSlides } from "@/lib/data";

export default async function Home() {
  const slides = await getSlides();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSlider slides={slides} />
        
        {/* Section Services */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Nos Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Stratégie Digitale
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Accompagnement dans votre transformation digitale avec des stratégies sur mesure.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Médiastratégie
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Optimisation de votre présence médiatique et de votre communication.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Formation & Accompagnement
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Programmes de formation pour jeunes et femmes en marketing digital.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section À propos */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                À propos d&apos;O&apos;FAMM
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                O&apos;FAMM, ou Obé Mawussé Fantodji, est une femme data commerciale et médiastratégiste au Togo, 
                reconnue pour son expertise en stratégie digitale et en prospection.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Elle est la fondatrice de O&apos;FAMM, une organisation qui accompagne des jeunes et des femmes 
                dans leur développement professionnel et leur autonomie grâce à des programmes de formation 
                et de marketing digital. O&apos;FAMM a également été lauréate de Women in Tech 2024.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

