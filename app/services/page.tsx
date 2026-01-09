import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { CallToActionButtons } from "@/components/CallToActionButtons";
import { getContent } from "@/lib/data";
import { Sparkles, Target, Users, TrendingUp, Zap, Globe } from "lucide-react";

export default async function ServicesPage() {
  const content = await getContent();
  const serviceIcons = [Sparkles, Target, Users, TrendingUp, Zap, Globe];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <ScrollAnimation animationType="fade" delay={100}>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Nos Services
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Découvrez nos solutions pour votre transformation digitale
              </p>
            </div>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.services.map((service: any, index: number) => {
              const Icon = serviceIcons[index % serviceIcons.length];
              return (
                <ScrollAnimation
                  key={service.id}
                  animationType="scale"
                  delay={index * 150}
                >
                  <div className="group p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover-lift hover-glow relative overflow-hidden transition-all duration-300">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10 transition-all duration-300"></div>
                    
                    {/* Icon */}
                    <div className="mb-6 relative z-10">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
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
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </ScrollAnimation>
              );
            })}
          </div>
        </div>

        <CallToActionButtons />
      </main>
      <Footer />
    </div>
  );
}

