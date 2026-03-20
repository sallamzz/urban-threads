'use client'

import { useState, FormEvent } from 'react'
import { useUser } from '@/context/UserContext'
import { Button } from './Button'

export function OnboardingModal() {
  const { showOnboarding, completeOnboarding } = useUser()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!showOnboarding) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!displayName.trim() || !email.trim()) {
      setError('Please fill in all fields.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setIsSubmitting(true)
    await completeOnboarding(displayName.trim(), email.trim())
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-navy-800 border border-navy-700 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl animate-modal-in">
        {/* Logo/Brand */}
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl text-white tracking-wide">UrbanThreads</h1>
          <div className="h-0.5 w-12 bg-gold-500 mx-auto mt-2" />
        </div>

        <h2 className="font-display text-2xl text-white mb-1">Welcome</h2>
        <p className="text-navy-500 text-sm mb-6">
          Join UrbanThreads and earn loyalty points on every purchase. Enter your details to get started.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Alex Johnson"
              className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-navy-500 focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-navy-500 focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2"
            size="lg"
          >
            {isSubmitting ? 'Setting up your account...' : 'Start Shopping & Earning Points'}
          </Button>
        </form>

        <p className="text-xs text-navy-500 text-center mt-4">
          No password needed. Your loyalty points are linked to your email.
        </p>
      </div>
    </div>
  )
}
