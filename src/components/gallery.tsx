"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import Swal from "sweetalert2";
import { Download, Trash2 } from "lucide-react";

type Resource = {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video";
};

export default function Gallery({
  images,
  onDeleted,
}: {
  images: Resource[];
  onDeleted?: () => void;
}) {
  const [selected, setSelected] = useState<Resource | null>(null);

  /* 🔥 NUEVOS ESTADOS PARA TOGGLES */
  const [showImages, setShowImages] = useState(true);
  const [showVideos, setShowVideos] = useState(true);

  /* 🔥 FILTRO FINAL */
  const filteredImages = images.filter((file) => {
    if (file.resource_type === "image" && showImages) return true;
    if (file.resource_type === "video" && showVideos) return true;
    return false;
  });

  /* PAGINACIÓN, AHORA BASADA EN filteredImages */
  const perPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredImages.length / perPage) || 1;
  const startIndex = (currentPage - 1) * perPage;
  const pageImages = filteredImages.slice(startIndex, startIndex + perPage);

  return (
    <>
      {/* 🔥 TOGGLES MODERNOS */}
      <div className="flex justify-center gap-8 mb-6">

        {/* TOGGLE IMÁGENES */}
        <div className="flex items-center gap-2">
          <span>Imágenes</span>
          <button
            onClick={() => setShowImages(!showImages)}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 
              ${showImages ? "bg-blue-600" : "bg-gray-400"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300
                ${showImages ? "translate-x-6" : "translate-x-0"}`}
            ></span>
          </button>
        </div>

        {/* TOGGLE VIDEOS */}
        <div className="flex items-center gap-2">
          <span>Videos</span>
          <button
            onClick={() => setShowVideos(!showVideos)}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 
              ${showVideos ? "bg-yellow-600" : "bg-gray-400"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300
                ${showVideos ? "translate-x-6" : "translate-x-0"}`}
            ></span>
          </button>
        </div>

      </div>

      {/* PAGINACIÓN ARRIBA */}
      <div className="flex justify-center items-center gap-4 my-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-40"
        >
          Anterior
        </button>

        <span className="font-semibold">
          Página {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>

      {/* GRID MASONRY */}
      <motion.div
        key={`${currentPage}-${showImages}-${showVideos}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3"
      >
        {pageImages.map((item) => (
          <motion.div
            key={item.public_id}
            layout
            className="relative overflow-hidden rounded-xl cursor-pointer group"
            onClick={() => setSelected(item)}
          >
            {/* PREVIEW */}
            {item.resource_type === "image" ? (
              <Image
                src={item.secure_url}
                alt={item.public_id}
                width={500}
                height={500}
                className="w-full object-cover rounded-xl transition-all duration-200 group-hover:brightness-90 group-hover:scale-[1.02]"
              />
            ) : (
              <video
                src={item.secure_url}
                muted
                className="w-full rounded-xl transition-all duration-200 group-hover:brightness-90 group-hover:scale-[1.02]"
              />
            )}

            {/* BADGE */}
            <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
              {item.resource_type === "image" ? "IMG" : "VIDEO"}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* PAGINACIÓN ABAJO */}
      <div className="flex justify-center items-center gap-4 mt-10 mb-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-40"
        >
          Anterior
        </button>

        <span className="font-semibold">
          Página {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* MEDIA */}
            <div className="relative max-w-[95%] max-h-[80%]" onClick={(e) => e.stopPropagation()}>
              {selected.resource_type === "image" ? (
                <motion.img
                  src={selected.secure_url}
                  alt="selected"
                  className="max-h-[80vh] rounded-xl shadow-2xl"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                />
              ) : (
                <motion.video
                  src={selected.secure_url}
                  controls
                  className="max-h-[80vh] rounded-xl shadow-2xl"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                />
              )}
            </div>

            {/* BOTONES */}
            <div className="mt-6 flex gap-4 justify-center w-full">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(selected.secure_url);
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = selected.public_id.split("/").pop() || "file";
                    a.click();

                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error(err);
                    alert("Error descargando archivo");
                  }
                }}
                className="bg-white px-4 py-2 rounded-lg shadow text-black text-sm font-semibold hover:bg-gray-200"
              >
                <Download className="size-4" />
              </button>

              <button
                onClick={async () => {
                  const confirm = await Swal.fire({
                    title: "¿Eliminar archivo?",
                    text: "Esta acción no se puede deshacer",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, eliminar",
                    cancelButtonText: "Cancelar",
                    confirmButtonColor: "#d33",
                  });

                  if (!confirm.isConfirmed) return;

                  try {
                    await api.delete(`/cloudinary/file/${encodeURIComponent(selected.public_id)}`);
                    onDeleted?.();
                    setSelected(null);

                    Swal.fire({
                      title: "Eliminado",
                      icon: "success",
                      timer: 1200,
                      showConfirmButton: false,
                    });
                  } catch (err) {
                    Swal.fire("Error", "No se pudo eliminar", "error");
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg shadow text-sm hover:bg-red-700"
              >
                <Trash2 className="size-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
