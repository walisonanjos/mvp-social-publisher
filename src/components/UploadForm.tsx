'use client'

import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const UPLOAD_PRESET = 'zupltfoo'; // Corretamente definido!
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Por favor, selecione um arquivo primeiro.');
      return;
    }
    // O bloco de verificação foi removido daqui.

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || 'Falha no upload.');
      }

      alert(`Upload bem-sucedido! URL do vídeo: ${data.secure_url}`);
      
    } catch (error) {
      console.error('Erro no processo de upload:', error);
      alert('Erro ao fazer upload: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h3>Fazer Upload de Vídeo</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="file-upload">Selecione o vídeo:</label>
          <input
            id="file-upload"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Enviando...' : 'Fazer Upload'}
        </button>
      </form>
    </div>
  );
}