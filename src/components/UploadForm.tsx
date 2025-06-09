// src/components/UploadForm.tsx

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient'; // 1. IMPORTAMOS NOSSO HELPER

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Suas constantes (ajuste o CLOUD_NAME e UPLOAD_PRESET se necessário)
  const UPLOAD_PRESET = 'zupltfoo';
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME; // Certifique-se que esta variável de ambiente está configurada na Netlify/Vercel
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;
  
  // Instância do cliente Supabase
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // 2. ESTA É A NOVA FUNÇÃO DE UPLOAD COMPLETA
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
      // ETAPA 1: FAZ O UPLOAD PARA O CLOUDINARY
      const cloudinaryResponse = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      const cloudinaryData = await cloudinaryResponse.json();
      const videoUrl = cloudinaryData.secure_url;

      if (!videoUrl) {
        throw new Error('Falha no upload para o Cloudinary. URL não encontrada.');
      }

      // ---- NOVA PARTE: SALVAR NO SUPABASE ----

      // ETAPA 2: PEGA O USUÁRIO ATUAL DO SUPABASE
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado. Não é possível salvar o vídeo.');
      }

      // ETAPA 3: INSERE OS DADOS NA TABELA 'videos'
      const { error: supabaseError } = await supabase
        .from('videos')
        .insert([
          { video_url: videoUrl, user_id: user.id }
        ]);

      if (supabaseError) {
        // Se der erro aqui, o vídeo foi para o Cloudinary mas não foi registrado.
        // Para um MVP, vamos apenas reportar o erro.
        throw supabaseError;
      }

      // ETAPA 4: SUCESSO TOTAL!
      alert('Sucesso! Vídeo enviado para o Cloudinary e registrado no banco de dados!');

    } catch (error) {
      console.error('Erro no processo de upload:', error);
      alert('Ocorreu um erro: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
      setFile(null); // Limpa o arquivo para o próximo upload
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