'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/auth-provider'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { user, profile, loading, signOut } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/pathologies', label: 'Pathologies' },
    { href: '/appointments', label: 'Prendre RDV' },
    { href: '/exercises', label: 'Exercices' },
    { href: '/about', label: 'À propos' },
  ]

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Kinevir</span>
            </Link>
          </div>

          {/* Navigation principale */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                  pathname === link.href ? 'text-blue-600' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Authentification */}
          <div className="flex items-center">
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {profile?.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {profile?.first_name || user.email?.split('@')[0]}
                    </p>
                    {profile?.role && (
                      <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                        {profile?.role && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md font-medium">
                            {profile.role === 'admin' && '👑 Administrateur'}
                            {profile.role === 'practitioner' && '👨‍⚕️ Praticien'}
                            {profile.role === 'patient' && '🧑 Patient'}
                          </span>
                        )}
                      </div>

                      {profile?.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowMenu(false)}
                        >
                          <span className="text-lg">🔧</span>
                          <span>Panel Admin</span>
                        </Link>
                      )}

                      {profile?.role === 'practitioner' && (
                        <Link
                          href="/practitioner"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowMenu(false)}
                        >
                          <span className="text-lg">👨‍⚕️</span>
                          <span>Espace praticien</span>
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowMenu(false)}
                      >
                        <span className="text-lg">👤</span>
                        <span>Mon profil</span>
                      </Link>

                      <Link
                        href="/appointments/my-appointments"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowMenu(false)}
                      >
                        <span className="text-lg">📅</span>
                        <span>Mes rendez-vous</span>
                      </Link>

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={() => {
                            setShowMenu(false)
                            signOut()
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <span className="text-lg">🚪</span>
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}