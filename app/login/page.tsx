'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'
import { Sparkles, Lock } from 'lucide-react'

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mb-4">
            <Sparkles size={22} className="text-indigo-300" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            AI PDLC Workflow Tracker
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Enter your password to continue
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Lock size={15} className="text-slate-500" />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              autoFocus
              className="
                w-full rounded-xl border border-white/10 bg-white/5
                px-4 py-3 pl-9
                text-sm text-white placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                transition
              "
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="
              w-full rounded-xl bg-indigo-600 hover:bg-indigo-500
              px-4 py-3
              text-sm font-semibold text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
