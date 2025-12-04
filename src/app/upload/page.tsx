'use client';

import React, { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const router = useRouter();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
    setProgress(0);
  };

  const upload = async () => {
    if (!file) return alert("Selecciona un archivo");

    setUploading(true);
    setProgress(0);

    try {
      const form = new FormData();
      form.append("file", file);

      await api.post("/cloudinary/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },

        // Barra de progreso
        onUploadProgress: (e) => {
          if (e.total) {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          }
        },
      });

      router.push("/");
    } catch (e) {
      alert("Error subiendo archivo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-3xl mb-6 font-semibold">Subir Archivo</h2>

      <div className="bg-white p-6 dark:bg-black/20 rounded-xl shadow space-y-4">
        {/* Preview */}
        {preview && (
          <div className="rounded overflow-hidden shadow">
            {file?.type.startsWith("image") ? (
              <img src={preview} className="w-full h-64 object-cover" />
            ) : (
              <video src={preview} controls className="w-full" />
            )}
          </div>
        )}

        <input
          type="file"
          accept="image/*,video/*"
          onChange={onFileChange}
          className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700"
        />

        {/*BARRA DE PROGRESO*/}
        {uploading && (
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-600 h-4 transition-all duration-150"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {uploading && (
          <p className="text-center text-sm font-medium">
            Subiendo... {progress}%
          </p>
        )}

        <button
          onClick={upload}
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition disabled:bg-blue-400"
        >
          {uploading ? "Subiendo..." : "Subir"}
        </button>
      </div>
    </div>
  );
}
