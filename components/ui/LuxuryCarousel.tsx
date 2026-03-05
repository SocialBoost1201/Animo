'use client'

import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface LuxuryCarouselProps {
  slides: ReactNode[]
  options?: any
  autoplay?: boolean
}

export function LuxuryCarousel({ slides, options, autoplay = false }: LuxuryCarouselProps) {
  const plugins = autoplay ? [Autoplay({ delay: 5000, stopOnInteraction: false })] : []
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, align: 'start', skipSnaps: false, ...options },
    plugins
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true) // init assume mostly true if many items

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  if (!slides || slides.length === 0) return null

  return (
    <div className="relative w-full">
      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-6">
          {slides.map((slide, index) => (
            <div 
              className="flex-[0_0_80%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0 pl-6" 
              key={index}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center gap-6 mt-16 md:mt-24">
        <button
          className={`w-12 h-12 flex items-center justify-center border border-[#c9a86a]/30 rounded-full text-[#c9a86a] transition-all duration-700 ${!canScrollPrev ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#c9a86a] hover:text-white'}`}
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 stroke-[1px]" />
        </button>
        
        {/* Pagination Dots (Line style for luxury) */}
        <div className="flex gap-3">
          {emblaApi?.scrollSnapList().map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-[1px] transition-all duration-700 ease-out ${
                index === selectedIndex ? 'bg-[#c9a86a] w-12' : 'bg-[#c9a86a]/20 w-4 hover:bg-[#c9a86a]/60'
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>

        <button
          className={`w-12 h-12 flex items-center justify-center border border-[#c9a86a]/30 rounded-full text-[#c9a86a] transition-all duration-700 ${!canScrollNext ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#c9a86a] hover:text-white'}`}
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 stroke-[1px]" />
        </button>
      </div>
    </div>
  )
}
