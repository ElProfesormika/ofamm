import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/data";

export default async function AboutPage() {
  const content = await getContent();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
              {content.about.title}
            </h1>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {content.about.content}
              </p>
            </div>

            <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Women in Tech 2024
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                O&apos;FAMM a été reconnue comme lauréate de Women in Tech 2024, 
                témoignant de son engagement et de son excellence dans le domaine de la technologie et du digital.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

