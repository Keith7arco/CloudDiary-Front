'use client';

import React, { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const upload = async () => {
    if (!file) return alert("Selecciona un archivo");

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      await api.post("/cloudinary/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
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

        <button
          onClick={upload}
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          {uploading ? "Subiendo..." : "Subir"}
        </button>
      </div>
    </div>
  );
}
