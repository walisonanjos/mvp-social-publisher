'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'
import UploadForm from './UploadForm'; // Linha corrigida, sem caracteres extras

export default function Auth() {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])


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
    } catch (error) {
      alert('Erro no login: ' + (error as Error).message)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  // Se não houver sessão, mostra o formulário de login/cadastro
  if (!session) {
    return (
      <div>
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

  // Se houver sessão, mostra a área do usuário logado
  return (
    <div>
      <h2>Bem-vindo(a), {session.user.email}!</h2>
      <button onClick={handleSignOut}>Sair</button>
      <hr />
      <UploadForm />
    </div>
  )
}