// src/components/VideoList.tsx

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';

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

  // NOVIDADE: FUNÇÃO PARA DELETAR UM VÍDEO
  const handleDelete = async (videoId: number) => {
    // Pede confirmação para o usuário antes de prosseguir
    if (!confirm('Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      // Executa o comando de delete no Supabase
      const { error } = await supabase
        .from('videos')
        .delete()
        .match({ id: videoId }); // Especifica qual 'id' deletar

      if (error) {
        throw error;
      }

      // ATUALIZA A LISTA NA TELA:
      // Filtramos o array de vídeos, mantendo apenas aqueles cujo id é DIFERENTE
      // do id do vídeo que acabamos de deletar.
      setVideos(currentVideos => currentVideos.filter(video => video.id !== videoId));
      alert('Vídeo excluído com sucesso!');

    } catch (error) {
      alert('Erro ao excluir o vídeo: ' + (error as Error).message);
    }
  };

  useEffect(() => {
    const getVideos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setVideos(data);
      } catch (error) {
        alert('Erro ao buscar os vídeos: ' + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    getVideos();
  }, []);

  if (loading) {
    return <p>Carregando seus vídeos...</p>;
  }
  
  if (videos.length === 0) {
    return <p>Você ainda não enviou nenhum vídeo.</p>;
  }

  return (
    <div>
      <h2>Seus Vídeos</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {videos.map((video) => (
          <div key={video.id} style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
            <video width="320" height="240" controls>
              <source src={video.video_url} type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </video>
            <p>Enviado em: {new Date(video.created_at).toLocaleDateString()}</p>
            
            {/* NOVIDADE: BOTÃO DE EXCLUIR */}
            <button 
              onClick={() => handleDelete(video.id)} 
              style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}