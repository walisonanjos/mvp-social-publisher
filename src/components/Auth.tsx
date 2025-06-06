'use client' // Muito importante! Informa ao Next.js que este é um componente de cliente.

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      alert('Cadastro realizado! Verifique seu e-mail para confirmar.')
    } catch (error) {
      alert('Erro ao cadastrar: ' + (error as Error).message)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      alert('Login bem-sucedido! Redirecionando...')
      // O redirecionamento ou atualização do estado da página acontecerá automaticamente
      // em uma etapa futura quando configurarmos o listener de autenticação.
    } catch (error) {
      alert('Erro no login: ' + (error as Error).message)
    }
  }

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