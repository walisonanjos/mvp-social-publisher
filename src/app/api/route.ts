import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const response = await cloudinary.uploader.upload(`data:${file.type};base64,${buffer.toString('base64')}`, {
      resource_type: 'video',
      folder: 'social_videos',
    });

    return NextResponse.json({ url: response.secure_url });

  } catch (error) {
    console.error("ERRO NO UPLOAD REAL:", error);
    return NextResponse.json({ error: "Erro ao fazer upload do arquivo." }, { status: 500 });
  }
}