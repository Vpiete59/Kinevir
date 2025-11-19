'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        toast({
          title: 'Compte créé',
          description: 'Vous pouvez maintenant vous connecter.',
        });
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        toast({
          title: 'Connexion réussie',
          description: 'Redirection en cours...',
        });
        setTimeout(() => {
          router.push('/');
        }, 500);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-kinevir-medium-blue">
          {isSignUp ? 'Créer un compte' : 'Se connecter'}
        </CardTitle>
        <CardDescription>
          {isSignUp
            ? 'Créez votre compte Kinevir pour accéder à tous les services'
            : 'Connectez-vous à votre compte Kinevir'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-kinevir-medium-blue hover:bg-kinevir-medium-blue/90"
            disabled={loading}
          >
            {loading
              ? 'Chargement...'
              : isSignUp
              ? 'Créer un compte'
              : 'Se connecter'}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? 'Déjà un compte ? Se connecter'
              : 'Pas encore de compte ? Créer un compte'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
