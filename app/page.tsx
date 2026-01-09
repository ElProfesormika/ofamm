import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSlider } from "@/components/HeroSlider";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { CallToActionButtons } from "@/components/CallToActionButtons";
import { getSlides, getContent } from "@/lib/data";
import { Sparkles, Target, Users, TrendingUp } from "lucide-react";

export default async function Home() {
  const [slides, content] = await Promise.all([getSlides(), getContent()]);
  const services = content?.services || [];

  const serviceIcons = [Sparkles, Target, Users, TrendingUp];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSlider slides={slides} />
        
        {/* Section Services */}
        <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <ScrollAnimation animationType="fade" delay={100}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                Nos Services
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-12 rounded-full"></div>
            </ScrollAnimation>
            
            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {services.map((service: any, index: number) => {
                  const Icon = serviceIcons[index % serviceIcons.length];
                  return (
                    <ScrollAnimation
                      key={service.id}
                      animationType="scale"
                      delay={index * 100}
                    >
                      <div className="group p-8 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 hover-lift hover-glow relative overflow-hidden">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Icon */}
                        <div className="mb-6 relative z-10">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                            {Icon && <Icon className="w-8 h-8" />}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white relative z-10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 relative z-10 leading-relaxed">
                          {service.description}
                        </p>
                        
                        {/* Decorative corner */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
                      </div>
                    </ScrollAnimation>
                  );
                })}
              </div>
            ) : (
              <ScrollAnimation animationType="fade">
                <p className="text-center text-gray-600 dark:text-gray-400">
                  Aucun service n&apos;a encore été publié.
                </p>
              </ScrollAnimation>
            )}
          </div>
        </section>

        {/* Section Statistiques */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ScrollAnimation animationType="scale" delay={100}>
                  <div className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover-lift text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">2020</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Début d&apos;activité</div>
                  </div>
                </ScrollAnimation>
                <ScrollAnimation animationType="scale" delay={200}>
                  <div className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover-lift text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">75+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Jeunes et femmes formés</div>
                  </div>
                </ScrollAnimation>
                <ScrollAnimation animationType="scale" delay={300}>
                  <div className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover-lift text-center">
                    <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">100+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Entreprises accompagnées</div>
                  </div>
                </ScrollAnimation>
                <ScrollAnimation animationType="scale" delay={400}>
                  <div className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover-lift text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">2,8M+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">FCFA de CA cumulé</div>
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </div>
        </section>

        <CallToActionButtons />
      </main>
      <Footer />
    </div>
  );
}

