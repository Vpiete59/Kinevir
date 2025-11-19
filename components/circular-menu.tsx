'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, FileText, User, Activity, Video, Heart, LogIn } from 'lucide-react';
import { useAuth } from './auth/auth-provider';
import { Button } from './ui/button';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'appointment',
    label: 'Prendre rendez-vous',
    icon: Calendar,
    href: '/appointment',
    color: 'bg-kinevir-medium-blue hover:bg-kinevir-medium-blue/90',
  },
  {
    id: 'program',
    label: 'Mon programme',
    icon: FileText,
    href: '/program',
    color: 'bg-kinevir-light-blue hover:bg-kinevir-light-blue/90',
  },
  {
    id: 'account',
    label: 'Mon compte',
    icon: User,
    href: '/account',
    color: 'bg-kinevir-light-gray hover:bg-kinevir-light-gray/90',
  },
  {
    id: 'pathologies',
    label: 'Pathologies',
    icon: Activity,
    href: '/pathologies',
    color: 'bg-kinevir-orange hover:bg-kinevir-orange/90',
  },
  {
    id: 'teleconsultation',
    label: 'Ma téléconsultation',
    icon: Video,
    href: '/teleconsultation',
    color: 'bg-kinevir-dark-blue hover:bg-kinevir-dark-blue/90',
  },
  {
    id: 'wellness',
    label: 'Santé et bien-être',
    icon: Heart,
    href: '/wellness',
    color: 'bg-kinevir-medium-blue hover:bg-kinevir-medium-blue/90',
  },
];

export function CircularMenu() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  const getItemPosition = (index: number, total: number) => {
    const angle = (index * 360) / total - 90;
    const radius = 180;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-kinevir-light-gray/30 via-white to-kinevir-medium-blue/20" />

      <div className="absolute top-4 right-4 flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-kinevir-dark-blue">{user.email}</span>
            <Button
              onClick={() => signOut()}
              variant="outline"
              size="sm"
              className="border-kinevir-medium-blue text-kinevir-medium-blue hover:bg-kinevir-medium-blue/10"
            >
              Déconnexion
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-kinevir-medium-blue text-kinevir-medium-blue hover:bg-kinevir-medium-blue/10"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Connexion
            </Button>
          </Link>
        )}
      </div>

      <div className="relative w-[500px] h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-kinevir-medium-blue/20">
            <div className="text-center">
              <h2 className="text-xl font-bold text-kinevir-medium-blue">Kinevir</h2>
              <p className="text-xs text-kinevir-dark-blue/70">Physiothérapie</p>
            </div>
          </div>
        </div>

        {menuItems.map((item, index) => {
          const { x, y } = getItemPosition(index, menuItems.length);
          const Icon = item.icon;
          const isHovered = hoveredItem === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              className="absolute"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                transition: 'transform 0.3s ease-out',
              }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div
                className={`
                  w-28 h-28 rounded-full shadow-xl
                  flex flex-col items-center justify-center
                  transition-all duration-300 ease-out
                  ${item.color}
                  ${isHovered ? 'scale-110 shadow-2xl' : 'scale-100'}
                  cursor-pointer
                  border-4 border-white
                `}
              >
                <Icon className="w-8 h-8 text-white mb-2" />
                <span className="text-xs text-white font-medium text-center px-2 leading-tight">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
