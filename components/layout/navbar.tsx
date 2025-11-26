'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/components/auth/auth-provider'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { LogIn, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, profile, loading, signOut } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/pathologies', label: 'Pathologies' },
    { href: '/appointment', label: 'Rendez-vous' },
    { href: '/exercises', label: 'Exercices' },
    { href: '/wellness', label: 'Bien-être' },
  ]

  const isActiveLink = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/logo-k.webp"
                alt="Kinevir"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="relative h-8 w-24 flex-shrink-0">
              <Image
                src="/logo-titre.webp"
                alt="Kinevir"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Navigation principale - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActiveLink(link.href)
                    ? 'bg-[#4A9BA5]/10 text-[#4A9BA5]'
                    : 'text-gray-500 hover:text-[#4A9BA5] hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Authentification - Droite */}
          <div className="flex items-center gap-3">
            {/* Menu burger mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-[#4A9BA5] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {loading ? (
              <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse"></div>
            ) : user ? (
              <>
                {/* Bouton Espace Praticien (si praticien ou admin) */}
                {(profile?.role === 'practitioner' || profile?.role === 'admin') && (
                  <Link
                    href="/practitioner"
                    className="hidden lg:flex items-center gap-2 px-4 py-2 text-[#4A9BA5] border border-[#4A9BA5] rounded-lg hover:bg-[#4A9BA5]/5 transition-all duration-200 text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>Espace Praticien</span>
                  </Link>
                )}

                {/* Menu utilisateur */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4A9BA5] text-white rounded-lg hover:bg-[#3d8a93] transition-all duration-200 text-sm font-medium shadow-sm"
                  >
                    <span className="hidden sm:inline">{profile?.first_name || 'Mon compte'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 overflow-hidden">
                        <div className="px-4 py-3 bg-gradient-to-r from-[#4A9BA5]/5 to-transparent border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {profile?.first_name} {profile?.last_name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{user.email}</p>
                          {profile?.role && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs bg-[#4A9BA5]/10 text-[#4A9BA5] rounded-full font-medium capitalize">
                              {profile.role}
                            </span>
                          )}
                        </div>

                        <div className="py-1">
                          {profile?.role === 'admin' && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setShowMenu(false)}
                            >
                              <span className="text-base">🔧</span>
                              <span>Administration</span>
                            </Link>
                          )}

                          <Link
                            href="/account"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowMenu(false)}
                          >
                            <span className="text-base">👤</span>
                            <span>Mon profil</span>
                          </Link>

                          <Link
                            href="/program"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowMenu(false)}
                          >
                            <span className="text-base">📋</span>
                            <span>Mon programme</span>
                          </Link>

                          <Link
                            href="/appointments/my-appointments"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowMenu(false)}
                          >
                            <span className="text-base">📅</span>
                            <span>Mes rendez-vous</span>
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 pt-1">
                          <button
                            onClick={() => {
                              setShowMenu(false)
                              signOut()
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                          >
                            <span className="text-base">🚪</span>
                            <span>Déconnexion</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#4A9BA5] text-white rounded-lg hover:bg-[#3d8a93] transition-all duration-200 text-sm font-medium shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Connexion</span>
              </Link>
            )}
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActiveLink(link.href)
                    ? 'bg-[#4A9BA5]/10 text-[#4A9BA5]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#4A9BA5]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 mx-4 mt-4 px-4 py-3 bg-[#4A9BA5] text-white rounded-lg text-sm font-medium justify-center"
              >
                <LogIn className="w-4 h-4" />
                <span>Connexion</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}