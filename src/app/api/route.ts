import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configura o Cloudinary com as credenciais do ambiente
// Este passo acontece uma vez quando a função é "carregada"
console.log("LOG: Configurando Cloudinary...");
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("LOG: Configuração do Cloudinary concluída.");


export async function POST(request: Request) {
  console.log("LOG: Função POST iniciada.");

  try {
    const formData = await request.formData();
    console.log("LOG: FormData recebido.");

    const file = formData.get('file') as File;
    console.log("LOG: Arquivo extraído do FormData.");

    if (!file) {
      console.error("LOG DE ERRO: Nenhum arquivo encontrado no FormData.");
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }
    console.log(`LOG: Arquivo recebido - Nome: ${file.name}, Tamanho: ${file.size}`);
    // Converte o arquivo para um buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log("LOG: Arquivo convertido para buffer.");

    // Faz o upload do arquivo para o Cloudinary
    console.log("LOG: Enviando para o Cloudinary...");
    const response = await cloudinary.uploader.upload(`data:${file.type};base64,${buffer.toString('base64')}`, {
      resource_type: 'video',
      folder: 'social_videos',
    });
    console.log("LOG: Resposta recebida do Cloudinary.");

    // Retorna a URL segura do vídeo que foi feito o upload
    return NextResponse.json({ url: response.secure_url });

  } catch (error) {
    console.error("LOG DE ERRO DENTRO DO CATCH:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}