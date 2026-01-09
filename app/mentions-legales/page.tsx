import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { CallToActionButtons } from "@/components/CallToActionButtons";
import { getContent } from "@/lib/data";
import { Scale } from "lucide-react";

export default async function MentionsLegalesPage() {
  const content = await getContent();
  const legal = content.legal || {};

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <ScrollAnimation animationType="fade" delay={100}>
            <div className="text-center mb-12">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Scale className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Mentions légales
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animationType="fade" delay={200}>
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-line text-gray-700 dark:text-gray-200 leading-relaxed">
                {legal.mentions || "Les mentions légales seront bientôt disponibles."}
              </div>
            </div>
          </ScrollAnimation>
        </div>

        <CallToActionButtons />
      </main>
      <Footer />
    </div>
  );
}


