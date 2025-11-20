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
    { href: '/pathologies', label: 'Pathologies' },
    { href: '/appointments', label: 'Rendez-vous' },
    { href: '/exercises', label: 'Exercices' },
    { href: '/wellness', label: 'Bien-être' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="text-xl font-semibold text-cyan-600">Kinevir</span>
          </Link>

          {/* Navigation principale - Centre */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-600 hover:text-cyan-600 font-medium transition-colors ${
                  pathname === link.href ? 'text-cyan-600' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Authentification - Droite */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : user ? (
              <>
                {/* Bouton Espace Praticien (si praticien ou admin) */}
                {(profile?.role === 'practitioner' || profile?.role === 'admin') && (
                  <Link
                    href="/practitioner"
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-cyan-600 border border-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="font-medium">Espace Praticien</span>
                  </Link>
                )}

                {/* Email utilisateur */}
                <span className="hidden lg:block text-sm text-gray-600">
                  {user.email}
                </span>

                {/* Menu utilisateur */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 px-4 py-2 text-cyan-600 border border-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">Mon compte</span>
                  </button>

                  {showMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {profile?.first_name} {profile?.last_name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                          {profile?.role && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs bg-cyan-50 text-cyan-700 rounded font-medium capitalize">
                              {profile.role}
                            </span>
                          )}
                        </div>

                        {profile?.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setShowMenu(false)}
                          >
                            <span>🔧</span>
                            <span>Admin</span>
                          </Link>
                        )}

                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowMenu(false)}
                        >
                          <span>👤</span>
                          <span>Mon profil</span>
                        </Link>

                        <Link
                          href="/appointments/my-appointments"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowMenu(false)}
                        >
                          <span>📅</span>
                          <span>Mes rendez-vous</span>
                        </Link>

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={() => {
                              setShowMenu(false)
                              signOut()
                            }}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                          >
                            <span>🚪</span>
                            <span>Déconnexion</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-cyan-600 font-medium transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium transition-colors"
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