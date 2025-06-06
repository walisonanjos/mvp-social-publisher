import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  console.log("--- INICIANDO DEBUG DE VARIÁVEIS DE AMBIENTE ---");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  console.log("Verificando NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:", cloudName ? `Encontrado (tamanho: ${cloudName.length})` : 'NÃO ENCONTRADO ou VAZIO');
  console.log("Verificando NEXT_PUBLIC_CLOUDINARY_API_KEY:", apiKey ? `Encontrado (tamanho: ${apiKey.length})` : 'NÃO ENCONTRADO ou VAZIO');
  console.log("Verificando CLOUDINARY_API_SECRET:", apiSecret ? `Encontrado (tamanho: ${apiSecret.length})` : 'NÃO ENCONTRADO ou VAZIO');

  console.log("--- FIM DO DEBUG DE VARIÁVEIS DE AMBIENTE ---");

  // Apenas para este teste, vamos retornar uma resposta de sucesso controlada.
  // Isso evita o erro "Unexpected end of JSON input" no frontend.
  return NextResponse.json({
    message: "Debug de variáveis de ambiente concluído. Verifique os logs da função na Vercel.",
    cloudNameExists: !!cloudName,
    apiKeyExists: !!apiKey,
    apiSecretExists: !!apiSecret,
  }, { status: 200 });
}