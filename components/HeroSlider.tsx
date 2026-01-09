"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: string;
  title: string;
  description: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface HeroSliderProps {
  slides: Slide[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  if (!slides || slides.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">O&apos;FAMM</h1>
          <p className="text-xl md:text-2xl">
            Stratégie digitale et médiastratégie au Togo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] md:h-[800px] overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{ 
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-white/50 !w-3 !h-3",
          bulletActiveClass: "swiper-pagination-bullet-active !bg-white !w-8"
        }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={slides.length > 1}
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="h-full flex items-center justify-center relative overflow-hidden">
              {/* Gradient de fond par défaut */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 z-0"></div>
              
              {/* Image de fond */}
              {slide.image && (
                <div 
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              )}
              
              {/* Overlay avec gradient moderne */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 z-10"></div>
              
              {/* Effet de parallaxe subtil */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              
              {/* Contenu */}
              <div className="relative z-20 text-center text-white px-4 max-w-5xl mx-auto">
                <div className="animate-fade-in">
                  <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-2xl text-white">
                    {slide.title}
                  </h1>
                </div>
                <div className="animate-fade-in-delay">
                  <p className="text-xl md:text-3xl mb-10 font-light leading-relaxed drop-shadow-lg max-w-3xl mx-auto">
                    {slide.description}
                  </p>
                </div>
                {slide.ctaText && slide.ctaLink && (
                  <div className="animate-fade-in-delay-2">
                    <a
                      href={slide.ctaLink}
                      className="group relative inline-block px-10 py-4 bg-white text-blue-600 rounded-full font-bold text-lg overflow-hidden transition-all duration-300 shadow-2xl hover:shadow-blue-500/50"
                    >
                      <span className="relative z-10">{slide.ctaText}</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="absolute inset-0 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10 flex items-center justify-center">
                        {slide.ctaText}
                      </span>
                      <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100"></span>
                    </a>
                  </div>
                )}
              </div>

              {/* Décoration */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900/20 to-transparent z-10"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons - Design amélioré */}
      {slides.length > 1 && (
        <>
          <button 
            className="swiper-button-prev-custom absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 border border-white/20"
            aria-label="Slide précédent"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button 
            className="swiper-button-next-custom absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 border border-white/20"
            aria-label="Slide suivant"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}
    </div>
  );
}

