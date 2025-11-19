import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function PageLayout({ children, title, description }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-kinevir-light-gray/30 via-white to-kinevir-medium-blue/10">
      <header className="border-b border-kinevir-light-gray bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-kinevir-medium-blue hover:bg-kinevir-medium-blue/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-kinevir-medium-blue">{title}</h1>
            {description && (
              <p className="text-sm text-kinevir-dark-blue/70">{description}</p>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
