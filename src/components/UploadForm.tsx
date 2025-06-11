// src/components/UploadForm.tsx

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

type UploadFormProps = {
  onUploadSuccess: () => void;
};

const initialTargets = {
  instagram: false,
  facebook: false,
  youtube: false,
  tiktok: false,
  kwai: false,
};

// --- MUDANÇA PRINCIPAL AQUI ---
// Definimos os horários fixos
const timeSlots = ['09:00', '11:00', '13:00', '15:00', '17:00'];

export default function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState(''); // O estado continua o mesmo
  const [socialTargets, setSocialTargets] = useState(initialTargets);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const UPLOAD_PRESET = 'zupltfoo';
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSocialTargets(prevTargets => ({ ...prevTargets, [name]: checked }));
  };
  
  const handleUpload = async () => {
    if (!file || !scheduleDate || !scheduleTime) {
      alert('Por favor, selecione um arquivo, uma data e uma hora de agendamento.');
      return;
    }
    setIsLoading(true);

    const scheduled_at = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const cloudinaryResponse = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
      const cloudinaryData = await cloudinaryResponse.json();
      const videoUrl = cloudinaryData.secure_url;
      if (!videoUrl) throw new Error('Falha no upload para o Cloudinary.');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado.');

      const { error: supabaseError } = await supabase
        .from('videos')
        .insert([{ 
          video_url: videoUrl, 
          user_id: user.id,
          title: title,
          description: description,
          scheduled_at: scheduled_at,
          target_instagram: socialTargets.instagram,
          target_facebook: socialTargets.facebook,
          target_youtube: socialTargets.youtube,
          target_tiktok: socialTargets.tiktok,
          target_kwai: socialTargets.kwai,
        }]);
      if (supabaseError) throw supabaseError;

      alert('Sucesso! Seu vídeo foi agendado.');
      onUploadSuccess();

    } catch (error) {
      console.error('Erro no processo de agendamento:', error);
      alert('Ocorreu um erro: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
      setFile(null);
      setTitle('');
      setDescription('');
      setScheduleDate('');
      setScheduleTime('');
      setSocialTargets(initialTargets);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label>Vídeo</label><br/>
        <input type="file" accept="video/*" onChange={handleFileChange} disabled={isLoading} />
      </div>
      <div>
        <label htmlFor="title">Título</label><br/>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '8px' }}/>
      </div>
      <div>
        <label htmlFor="description">Descrição</label><br/>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '8px', minHeight: '80px' }}/>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <label htmlFor="scheduleDate">Data do Agendamento</label><br/>
          <input id="scheduleDate" type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} style={{ padding: '8px' }} />
        </div>
        <div>
          <label htmlFor="scheduleTime">Hora do Agendamento</label><br/>
          {/* --- MUDANÇA PRINCIPAL AQUI --- */}
          <select 
            id="scheduleTime" 
            value={scheduleTime} 
            onChange={(e) => setScheduleTime(e.target.value)} 
            style={{ padding: '8px', minWidth: '120px' }}
          >
            <option value="" disabled>Selecione a hora</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label>Postar em:</label><br/>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '5px' }}>
          {Object.keys(initialTargets).map(key => (
            <label key={key}>
              <input type="checkbox" name={key} checked={socialTargets[key as keyof typeof socialTargets]} onChange={handleTargetChange} />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>
      </div>
      <button onClick={handleUpload} disabled={isLoading || !file}>
        {isLoading ? 'Agendando...' : 'Agendar Post'}
      </button>
    </div>
  );
}