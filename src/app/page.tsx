'use client';

import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Gallery from "@/components/gallery";
import { GalleryHorizontal, RefreshCw } from "lucide-react";

async function fetchFiles() {
  const res = await api.get("/cloudinary/files");
  return res.data;
}

export default function GalleryPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["files"],
    queryFn: fetchFiles,
  });

  const onDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["files"] });
  };

  return (
    <div className="min-h-screen pb-10 bg-gray-50 dark:bg-black/20">

      {/* NAVBAR */}
      <header className="
        sticky top-0
        backdrop-blur-lg 
        bg-white/70 
        dark:bg-black/20
        border-b 
        border-gray-200 
        shadow-sm
        dark:border-gray-700
        ">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">

          {/* TÍTULO */}
          <h1 className="flex items-center gap-2 text-3xl font-semibold text-gray-900 dark:text-gray-100 ">
            <GalleryHorizontal className="size-8"/>
            Album
          </h1>

          {/* BOTÓN */}
          <button
            onClick={() => refetch()}
            className="
              px-4 py-2 
              rounded-xl 
              text-gray-100
              bg-blue-600
              shadow-sm
              hover:bg-blue-700
              active:scale-95
              transition
            "
          >
            <RefreshCw className='size-5'/>
          </button>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-6xl mx-auto px-4 mt-6">

        {/* LOADING */}
        {isLoading && (
          <div className="text-center text-lg text-gray-600 mt-10">
            Cargando…
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="text-center text-red-500 mt-10">
            Error cargando elementos
          </div>
        )}

        {/* GALLERY */}
        {data && (
          <Gallery images={data} onDeleted={onDeleted} />
        )}
      </div>
    </div>
  );
}

