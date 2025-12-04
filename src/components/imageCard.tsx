'use client';

import React from "react";
import api from "@/lib/api";
import { motion } from "framer-motion";

type Resource = {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format?: string;
  bytes?: number;
};

export default function ImageCard({
  r,
  onDeleted,
}: {
  r: Resource;
  onDeleted?: () => void;
}) {
  const handleDelete = async () => {
    try {
      const id = encodeURIComponent(r.public_id);
      await api.delete(`/cloudinary/file/${id}`);
      onDeleted?.();
    } catch (err) {
      alert("Error eliminando archivo");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group"
    >
      {/* Vista previa */}
      <div className="relative">
        {r.resource_type === "image" ? (
          <img
            src={r.secure_url}
            alt={r.public_id}
            className="w-full h-52 object-cover"
          />
        ) : (
          <video controls className="w-full h-52 object-cover">
            <source src={r.secure_url} />
          </video>
        )}

        {/* Overlay al pasar el mouse */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
          <a
            href={r.secure_url}
            download
            className="bg-white px-3 py-1 rounded-md text-sm font-semibold shadow hover:bg-gray-200"
          >
            Descargar
          </a>

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-3 py-1 rounded-md text-sm shadow hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* Texto */}
      <div className="p-3 text-sm">
        <div className="font-semibold truncate">{r.public_id}</div>
        <div className="text-gray-500">
          {r.format?.toUpperCase()} •{" "}
          {r.bytes ? `${(r.bytes / 1024).toFixed(0)} KB` : ""}
        </div>
      </div>
    </motion.div>
  );
}
