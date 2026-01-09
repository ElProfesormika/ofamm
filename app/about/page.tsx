import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { CallToActionButtons } from "@/components/CallToActionButtons";
import { TimelineSection } from "./TimelineSection";
import { getContent } from "@/lib/data";
import { Award, Target, Users, Heart } from "lucide-react";

export default async function AboutPage() {
  const content = await getContent();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimation animationType="fade" delay={100}>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                  {content.about.title}
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animationType="fade" delay={200}>
              <div className="mb-12">
                <div className="p-4 sm:p-6 md:p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="prose prose-sm sm:prose-base md:prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                    {content.about.content}
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animationType="fade" delay={300}>
              <div className="mb-12">
                <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Notre Parcours</h2>
                  <TimelineSection timeline={content.timeline || []} />
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animationType="scale" delay={300}>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 shadow-lg hover-lift">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                      Prix WOMEN IN TECH 2024 - Togo Digital Awards
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      O&apos;FAMM a été récompensée par le Prix WOMEN IN TECH 2024 au Togo Digital Awards, 
                      reconnaissant son excellence et son impact dans le domaine de la technologie et du digital au Togo.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Values section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <ScrollAnimation animationType="slide-left" delay={400}>
                <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover-lift text-center">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Mission</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Data Commerciale appliquée à la Prospection Intelligente
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation animationType="scale" delay={500}>
                <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover-lift text-center">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Vision</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bâtir des marques solides et rentables grâce à la data et au marketing digital
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation animationType="slide-right" delay={600}>
                <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover-lift text-center">
                  <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Valeurs</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Foi, courage, constance et impact social
                  </p>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>

        <CallToActionButtons />
      </main>
      <Footer />
    </div>
  );
}

