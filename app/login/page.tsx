"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (password === 'admin') {
        router.push('/dashboard');
      } else {
        setError('Incorrect password. Please try again.');
        setIsLoading(false);
      }
    }, 800); // Add slight delay for loading effect
  };

  const handleKeyDown = (e:any) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-4xl p-10 ">
        <Card className="overflow-hidden border-0 shadow-xl rounded-xl bg-white/80 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl" />
          
          <CardHeader className="text-center relative z-10 pb-0">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-600/10 flex items-center justify-center mb-2">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Admin Portal</CardTitle>
            <CardDescription className="text-gray-500 mt-2">
              Enter your password to access the dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10 pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-12 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  autoFocus
                />
                {error && (
                  <p className="text-red-500 text-sm font-medium pl-1 flex items-center space-x-1">
                    {error}
                  </p>
                )}
              </div>
              
              <Button 
                onClick={handleLogin}
                disabled={isLoading} 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-blue-500/20"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Login to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-500">
                Protected area. Authorized personnel only.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}