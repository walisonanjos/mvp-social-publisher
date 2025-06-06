'use client'

import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false); // Estado para controlar o loading

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

    setIsUploading(true); // Desabilita o botão

    // Cria um objeto FormData para enviar o arquivo
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Envia a requisição para a nossa API Route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Se a resposta não for OK, lança um erro com a mensagem do backend
        throw new Error(data.error || 'Falha no upload.');
      }

      // Se tudo deu certo, mostra a URL do vídeo retornado pelo backend
      alert(`Upload bem-sucedido! URL do vídeo: ${data.url}`);
      
    } catch (error) {
      console.error('Erro no processo de upload:', error);
      alert('Erro ao fazer upload: ' + (error as Error).message);
    } finally {
      setIsUploading(false); // Reabilita o botão, independentemente do resultado
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
            disabled={isUploading} // Desabilita o input durante o upload
          />
        </div>
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Enviando...' : 'Fazer Upload'}git add .
        </button>
      </form>
    </div>
  );
}