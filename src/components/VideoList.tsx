// src/components/VideoList.tsx

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';

// Definimos um tipo para nossos vídeos, para ter um código mais seguro e previsível
type Video = {
  id: number;
  created_at: string;
  video_url: string;
  user_id: string;
};

export default function VideoList() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Função assíncrona para buscar os vídeos
    const getVideos = async () => {
      try {
        setLoading(true);

        // Usamos o Supabase para fazer um 'select' na tabela 'videos'
        // A mágica acontece aqui: como temos as RLS policies ativas,
        // o Supabase automaticamente filtra e retorna APENAS os vídeos
        // que pertencem ao usuário que está logado.
        const { data, error } = await supabase
          .from('videos')
          .select('*') // Pega todas as colunas
          .order('created_at', { ascending: false }); // Ordena pelos mais recentes

        if (error) {
          throw error;
        }

        if (data) {
          setVideos(data);
        }
      } catch (error) {
        alert('Erro ao buscar os vídeos: ' + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getVideos();
  }, []); // O array vazio [] faz com que este efeito rode apenas uma vez, quando o componente é montado.

  // Se estiver carregando, mostramos uma mensagem
  if (loading) {
    return <p>Carregando seus vídeos...</p>;
  }
  
  // Se não houver vídeos, mostramos outra mensagem
  if (videos.length === 0) {
    return <p>Você ainda não enviou nenhum vídeo. Que tal enviar o primeiro?</p>;
  }

  // Se houver vídeos, mapeamos e exibimos cada um
  return (
    <div>
      <h2>Seus Vídeos</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {videos.map((video) => (
          <div key={video.id} style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '8px' }}>
            <video width="320" height="240" controls>
              <source src={video.video_url} type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </video>
            <p>Enviado em: {new Date(video.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}