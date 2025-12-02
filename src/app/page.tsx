'use client';

import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Gallery from "@/components/gallery";

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
    <div className="min-h-screen pb-10 bg-gray-50">

      {/* NAVBAR ESTILO APPLE FOTOS */}
      <header className="
        sticky top-0 z-50 
        backdrop-blur-lg 
        bg-white/70 
        border-b 
        border-gray-200 
        shadow-sm
      ">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">

          {/* TÍTULO */}
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Fotos
          </h1>

          {/* BOTÓN */}
          <button
            onClick={() => refetch()}
            className="
              px-4 py-2 
              rounded-xl 
              bg-white 
              border border-gray-300 
              shadow-sm 
              hover:bg-gray-100 
              active:scale-95 
              transition
            "
          >
            Actualizar
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

