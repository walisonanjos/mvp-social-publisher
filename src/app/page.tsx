import Auth from '@/components/Auth'

export default function Home() {
  // Por enquanto, esta página simplesmente renderiza o componente de autenticação.
  // No futuro, vamos adicionar lógica aqui para mostrar o conteúdo principal
  // do app se o usuário já estiver logado.
  return (
    <main>
      <h1>Minha Plataforma de Posts</h1>
      <Auth />
    </main>
  )
}