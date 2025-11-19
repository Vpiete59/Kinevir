import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-kinevir-light-gray/30 via-white to-kinevir-medium-blue/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-kinevir-medium-blue mb-2">Kinevir</h1>
          <p className="text-kinevir-dark-blue/70">Plateforme de physiothérapie</p>
        </div>
        <LoginForm />
        <div className="mt-6 p-4 bg-kinevir-light-blue/10 rounded-lg border border-kinevir-light-blue">
          <p className="text-sm text-kinevir-dark-blue text-center">
            <strong>Compte praticien :</strong> virgile.pieterwas@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
