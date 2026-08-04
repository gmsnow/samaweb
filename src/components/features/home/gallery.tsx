"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Maximize2 } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { galleryItems } from "@/data/content";

export function Gallery() {
  const t = useTranslations("gallery");
  const locale = useLocale();
  const [active, setActive] = React.useState<string | null>(null);
  const activeItem = galleryItems.find((g) => g.id === active);

  return (
    <section id="gallery" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="columns-2 gap-4 space-y-4 lg:columns-4">
          {galleryItems.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              onClick={() => setActive(item.id)}
              className="group relative block w-full overflow-hidden rounded-2xl"
              aria-label={`${t("lightbox")}: ${
                locale === "ar" ? item.title.ar : item.title.en
              }`}
            >
              <div className={`relative w-full overflow-hidden ${item.ratio}`}>
                <Image
                  src={item.src}
                  alt={locale === "ar" ? item.title.ar : item.title.en}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-start text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div>
                  <p className="text-sm font-semibold">
                    {locale === "ar" ? item.title.ar : item.title.en}
                  </p>
                  <p className="text-xs text-white/70">
                    {locale === "ar" ? item.category.ar : item.category.en}
                  </p>
                </div>
                <Maximize2 className="h-4 w-4" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={() => setActive(null)}>
        <DialogContent className="max-w-4xl overflow-hidden border-0 bg-transparent p-0 shadow-none">
          <AnimatePresence mode="wait">
            {activeItem ? (
              <motion.figure
                key={activeItem.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                className="overflow-hidden rounded-2xl"
              >
                <div className="relative h-[70vh]">
                  <Image
                    src={activeItem.src}
                    alt={locale === "ar" ? activeItem.title.ar : activeItem.title.en}
                    fill
                    className="object-contain"
                  />
                </div>
                <figcaption className="glass-strong mt-2 rounded-2xl px-4 py-3 text-center">
                  <p className="font-semibold">
                    {locale === "ar" ? activeItem.title.ar : activeItem.title.en}
                  </p>
                  {activeItem.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {locale === "ar" ? activeItem.description.ar : activeItem.description.en}
                    </p>
                  ) : null}
                </figcaption>
              </motion.figure>
            ) : null}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
}
