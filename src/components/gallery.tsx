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
  url?: string;
  resource_type: "image" | "video";
  format?: string;
  bytes?: number;
};

export default function Gallery({ images, onDeleted }: {
  images: Resource[];
  onDeleted?: () => void;
}) {
  const [selected, setSelected] = useState<Resource | null>(null);

  {/* DELETE */}
  const deleteFile = async (public_id: string) => {
    try {
      const id = encodeURIComponent(public_id);
      await api.delete(`/cloudinary/file/${id}`);
      onDeleted?.();
      setSelected(null);
    } catch (e) {
      console.error(e);
      alert("Error eliminando el archivo");
    }
  };

  return (
    <>
      {/* GRID */}
      <motion.div
        layout
        className="
          columns-2 sm:columns-3 md:columns-4 
          gap-3 space-y-3
        "
      >
        {images.map((item) => (
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
                className="
                  w-full object-cover rounded-xl 
                  transition-all duration-200 
                  group-hover:brightness-90 group-hover:scale-[1.02]
                "
              />
            ) : (
              <video
                src={item.secure_url}
                muted
                className="
                  w-full rounded-xl 
                  transition-all duration-200 
                  group-hover:brightness-90 group-hover:scale-[1.02]
                "
              />
            )}
            {/* BADGE DE TIPO */}
            <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
              {item.resource_type === "image" ? "IMG" : "VIDEO"}
            </span>
          </motion.div>
        ))}
      </motion.div>

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
            {/* CONTENEDOR CENTRAL */}
            <div
              className="relative max-w-[95%] max-h-[80%]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* MEDIA */}
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

            {/* BOTONES CENTRADOS */}
            <div className="mt-6 flex gap-4 justify-center w-full">

              {/* DESCARGAR */}
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
                <Download className='size-4'/>
              </button>

              {/* ELIMINAR CON SWEETALERT */}
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
                    const id = encodeURIComponent(selected.public_id);
                    await api.delete(`/cloudinary/file/${id}`);
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
                <Trash2 className='size-5'/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
