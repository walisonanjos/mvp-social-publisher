'use client'

import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);

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

    // A lógica de upload para o Cloudinary virá aqui no próximo passo
    alert(`Arquivo selecionado: ${file.name}. Lógica de upload ainda não implementada.`);
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
          />
        </div>
        <button type="submit">Fazer Upload</button>
      </form>
    </div>
  );
}