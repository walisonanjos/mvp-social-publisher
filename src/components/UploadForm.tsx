// COPIE E COLE ISTO EM: src/components/UploadForm.tsx

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

// Define o tipo das "props" que o componente aceita
type UploadFormProps = {
  onUploadSuccess: () => void;
};

export default function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const UPLOAD_PRESET = 'zupltfoo';
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;
  
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor, selecione um arquivo primeiro.');
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      // 1. UPLOAD PARA O CLOUDINARY
      const cloudinaryResponse = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });
      const cloudinaryData = await cloudinaryResponse.json();
      const videoUrl = cloudinaryData.secure_url;
      if (!videoUrl) throw new Error('Falha no upload para o Cloudinary.');

      // 2. PEGA O USUÁRIO ATUAL
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado.');

      // 3. INSERE NA TABELA 'videos'
      const { error: supabaseError } = await supabase
        .from('videos')
        .insert([{ video_url: videoUrl, user_id: user.id }]);
      if (supabaseError) throw supabaseError;

      // 4. SUCESSO E AVISA O "PAI"
      alert('Sucesso! Vídeo enviado e registrado!');
      onUploadSuccess(); // <-- AVISANDO A PÁGINA PARA ATUALIZAR A LISTA

    } catch (error) {
      console.error('Erro no processo de upload:', error);
      alert('Ocorreu um erro: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
      setFile(null);
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} disabled={isLoading} />
      <button onClick={handleUpload} disabled={isLoading || !file}>
        {isLoading ? 'Enviando...' : 'Enviar Vídeo'}
      </button>
    </div>
  );
}