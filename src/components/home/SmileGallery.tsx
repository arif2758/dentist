"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Star 
} from "lucide-react";
import styles from "@/styles/styles.module.css";

const TRANSFORMATIONS = [
  {
    id: 1,
    title: "ফুল মাউথ স্মাইল ডিজাইন ও ভিনিয়ার্স",
    patient: "নুসরাত জাহান, ২৭ বছর",
    treatment: "৬ টি সামনের দাঁতে ন্যানো-সিরামিক ভিনিয়ারিং",
    duration: "২ টি সেশন",
    beforeText: "দাঁতের মাঝে অতিরিক্ত ফাঁকা ও এনামেল হলুদ ছিল",
    afterText: "নিখুঁত সমান, উজ্জ্বল ও স্বাভাবিক প্রাকৃতিক হাসি",
    rating: 5,
    tag: "কসমেটিক ডেন্টিস্ট্রি",
  },
  {
    id: 2,
    title: "সিঙ্গেল সিটিং রুট ক্যানেল ও জিরকোনিয়া ক্রাউন",
    patient: "তানভীর হাসান, ৩৫ বছর",
    treatment: "লোয়ার মোলার (#৪৬) রুট ক্যানেল ও ক্রাউন",
    duration: "১ দিন",
    beforeText: "তীব্র রাতের ব্যথা ও দাঁতের গভীর ক্যাভিটি",
    afterText: "সম্পূর্ণ ব্যথামুক্ত ও খাবার চিবানোর স্বাভাবিক শক্তি",
    rating: 5,
    tag: "রুট ক্যানেল",
  },
  {
    id: 3,
    title: "অদৃশ্যমান ইনভিজিবল অ্যালাইনার্স ট্রান্সফর্মেশন",
    patient: "ফারিহা ইসলাম, ২১ বছর",
    treatment: "মেটাল ছাড়া ক্লিয়ার অ্যালাইনার থেরাপি",
    duration: "৭ মাস",
    beforeText: "সামনের দুটি দাঁত অস্বাভাবিকভাবে উঁচু ও বাঁকা ছিল",
    afterText: "পারফেক্ট সোজা হাসি, কোনো তার ছাড়াই সুন্দর দাঁত",
    rating: 5,
    tag: "অর্থোডন্টিক্স",
  },
  {
    id: 4,
    title: "স্থায়ী ডেন্টাল ইমপ্ল্যান্ট প্লেসমেন্ট",
    patient: "মো: রফিকুল আলম, ৫২ বছর",
    treatment: "টাইটানিয়াম রুট ইমপ্ল্যান্ট ও পার্মানেন্ট ক্যাপ",
    duration: "৩ মাস হিলিং",
    beforeText: "একটি মোলার দাঁত হারানোর কারণে খেতে সমস্যা হচ্ছিল",
    afterText: "প্রাকৃতিক দাঁতের সমকক্ষ শক্তি ও টেকসই ফলাফল",
    rating: 5,
    tag: "ইমপ্ল্যান্ট সার্জারি",
  },
];

export function SmileGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <section id="gallery" className="py-6 sm:py-10 bg-[var(--antd-bg-layout)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 antd-tag antd-tag-blue py-1 px-3 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>বাস্তব সফল কেস স্টাডিজ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--antd-text)]">
              আমাদের রোগীদের স্মাইল ট্রান্সফর্মেশন গ্যালারি
            </h2>
            <p className="text-sm sm:text-base text-[var(--antd-text-secondary)]">
              গত ৩০ বছরে ২৫,০০০+ রোগীর হাসির সৌন্দর্য ও কার্যক্ষমতা ফিরিয়ে দেওয়ার কয়েকটি চমৎকার উদাহরণ।
            </p>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={scrollPrev}
              aria-label="Previous slide"
              className="antd-btn antd-btn-default w-9 h-9 p-0 rounded-full flex items-center justify-center shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next slide"
              className="antd-btn antd-btn-default w-9 h-9 p-0 rounded-full flex items-center justify-center shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embla Viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {TRANSFORMATIONS.map((item) => (
              <div
                key={item.id}
                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4"
              >
                <article className="antd-card antd-card-bordered h-full p-6 flex flex-col justify-between hover:border-[var(--antd-primary-border)] transition-all shadow-xs">
                  <div className="space-y-4">
                    
                    {/* Tag & Stars */}
                    <div className="flex items-center justify-between">
                      <span className="antd-tag antd-tag-blue py-0.5 px-2 text-[11px] font-bold">
                        {item.tag}
                      </span>
                      <div className="flex text-[var(--antd-warning)]">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-[var(--antd-text)]">
                      {item.title}
                    </h3>

                    {/* Patient detail */}
                    <p className="text-xs text-[var(--antd-text-secondary)]">
                      {item.patient} • সময় লেগেছে: <span className="font-semibold text-[var(--antd-text)]">{item.duration}</span>
                    </p>

                    {/* Before & After Cards */}
                    <div className="space-y-2 pt-2">
                      <div className="p-3 rounded-xl bg-[var(--antd-bg-layout)] border border-[var(--antd-border-split)] text-xs">
                        <span className="font-bold text-[var(--antd-error)] block mb-0.5">
                          পূর্বের অবস্থা:
                        </span>
                        <p className="text-[var(--antd-text-secondary)]">{item.beforeText}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--antd-primary-bg)] border border-[var(--antd-primary-border)] text-xs">
                        <span className="font-bold text-[var(--antd-primary)] block mb-0.5">
                          চিকিৎসার পরের ফলাফল:
                        </span>
                        <p className="text-[var(--antd-text)] font-medium">{item.afterText}</p>
                      </div>
                    </div>

                  </div>

                  <div className="pt-4 mt-4 border-t border-[var(--antd-border-split)] text-xs text-[var(--antd-text-secondary)] flex items-center justify-between">
                    <span>চিকিৎসা: {item.treatment}</span>
                    <span className="text-[var(--antd-primary)] font-semibold">১০০% সফল</span>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel indicator dots */}
        <div className="flex justify-center gap-1.5 mt-8">
          {TRANSFORMATIONS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === selectedIndex ? "w-6 bg-[var(--antd-primary)]" : "w-2 bg-[var(--antd-border)]"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
