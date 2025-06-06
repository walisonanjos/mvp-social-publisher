'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'
import UploadForm from './UploadForm';  

export default function Auth() {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const supabase = createClient()

  // useEffect para verificar a sessão do usuário quando o componente carrega
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    getSession()

    // Listener para mudanças no estado de autenticação (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Limpa o listener quando o componente é desmontado
    return () => subscription.unsubscribe()
  }, []) // A dependência pode ser vazia, pois supabase.auth não muda.


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      alert('Cadastro realizado! Verifique seu e-mail para confirmar.')
    } catch (error) {
      alert('Erro ao cadastrar: ' + (error as Error).message)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      // A tela vai atualizar automaticamente por causa do listener onAuthStateChange
    } catch (error) {
      alert('Erro no login: ' + (error as Error).message)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    // A tela vai atualizar automaticamente
  }

  // Se não houver sessão (usuário não logado), mostra o formulário
  if (!session) {
    return (
      <div> {/* <<< CORREÇÃO AQUI: Um único div que engloba tudo */}
        <form>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button type="submit" onClick={handleSignIn}>
            Entrar
          </button>
          <button type="submit" onClick={handleSignUp}>
            Cadastrar
          </button>
        </form>
      </div>
    )
  }

 // Se houver uma sessão (usuário logado), mostra a mensagem de boas-vindas
return (
  <div>
    <h2>Bem-vindo(a), {session.user.email}!</h2>
    <button onClick={handleSignOut}>Sair</button>
    <hr />
    <UploadForm /> {/* <<<--- ADICIONE O NOVO COMPONENTE AQUI */}
  </div>
)