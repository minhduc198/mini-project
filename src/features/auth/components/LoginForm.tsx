'use client';

import { TextFieldInput } from '@/src/components/TextFieldInput';
import { Button } from '@/src/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2, LogIn, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { login } from '../api/services';
import { LoginFormValues, loginSchema } from '../schemas';
import { toast } from '@/src/lib/toast';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: loginMutate } = useMutation({
    mutationFn: (values: LoginFormValues) => login(values.email, values.password),
    onSuccess: data => {
      const token = data.data.token;
      if (!token) {
        setIsLoading(false);
        return;
      }

      localStorage.setItem('access_token', token);
      document.cookie = `access_token=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      window.location.href = '/';
      setIsLoading(false);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      toast.error(message);
      setIsLoading(false);
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (values: LoginFormValues) => {
    setIsLoading(true);
    loginMutate(values);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <Zap size={17} className="text-white" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-white">Mini CRM</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1.5">Welcome back</h1>
        <p className="text-sm text-white/40">Sign in to your account to continue</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextFieldInput name="email" label="Email" type="email" placeholder="you@example.com" />

          <TextFieldInput
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            rightElement={
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowPassword(v => !v)}
                className="text-white/30 hover:text-white/60 transition-colors h-auto p-0 px-0 hover:bg-transparent"
                tabIndex={-1}>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </Button>
            }
          />

          <Button
            id="login-submit-btn"
            type="submit"
            variant="ghost"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-lg shadow-violet-500/25 transition-all duration-200 mt-2 text-white">
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <LogIn size={15} />}
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </FormProvider>

      <p className="mt-6 text-center text-sm text-white/30">
        Do not have an account?{' '}
        <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}
