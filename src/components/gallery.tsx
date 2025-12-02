"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Gallery({ images, onDeleted }: any) {
  const [selected, setSelected] = useState<any>(null);

  return (
    <>
      {/* GRID ESTILO APPLE */}
      <motion.div
        layout
        className="
          columns-2 sm:columns-3 md:columns-4 
          gap-3 space-y-3
        "
      >
        {images.map((img: any) => (
          <motion.div
            key={img.public_id}
            layout
            className="relative overflow-hidden rounded-xl cursor-pointer group"
            onClick={() => setSelected(img)}
          >
            <Image
              src={img.url}
              alt="photo"
              width={500}
              height={500}
              className="
                w-full object-cover rounded-xl 
                transition-all duration-200 
                group-hover:brightness-90 group-hover:scale-[1.02]
              "
            />
          </motion.div>
        ))}
      </motion.div>

      {/* LIGHTBOX (VISOR) */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={selected.url}
              alt="selected"
              className="max-w-[95%] max-h-[90%] rounded-xl shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
