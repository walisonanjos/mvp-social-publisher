import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configura o Cloudinary com as credenciais do ambiente
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }

  try {
    // Converte o arquivo para um buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Faz o upload do arquivo para o Cloudinary
    // O 'data:;base64,' é um prefixo necessário para o upload via buffer
    const response = await cloudinary.uploader.upload(`data:${file.type};base64,${buffer.toString('base64')}`, {
      resource_type: 'video', // Especifica que estamos enviando um vídeo
      folder: 'social_videos', // Opcional: organiza os vídeos em uma pasta no Cloudinary
    });

    // Retorna a URL segura do vídeo que foi feito o upload
    return NextResponse.json({ url: response.secure_url });

  } catch (error) {
    console.error("Erro no upload para o Cloudinary:", error);
    return NextResponse.json({ error: "Erro ao fazer upload do arquivo." }, { status: 500 });
  }
}