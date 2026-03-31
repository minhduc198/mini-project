'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, UserPlus, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TextFieldInput } from '@/src/components/TextFieldInput';
import { Button } from '@/src/components/ui/button';
import { register } from '../api/services';
import { RegisterFormValues, registerSchema } from '../schemas';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/src/lib/toast';

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit } = methods;

  const { mutate: registerMutate } = useMutation({
    mutationFn: (values: RegisterFormValues) => register(values.email, values.password),
    onSuccess: () => {
      toast.success('Account created! Please sign in.');
      router.push('/login');
      setIsLoading(false);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      toast.error(message);
      setIsLoading(false);
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    setIsLoading(true);
    registerMutate(values);
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
        <h1 className="text-2xl font-bold text-white mb-1.5">Create account</h1>
        <p className="text-sm text-white/40">Sign up to get started with Mini CRM</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextFieldInput name="email" label="Email" type="email" placeholder="you@example.com" />

          <TextFieldInput
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 6 characters"
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

          <TextFieldInput
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Repeat your password"
            rightElement={
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowConfirm(v => !v)}
                className="text-white/30 hover:text-white/60 transition-colors h-auto p-0 px-0 hover:bg-transparent"
                tabIndex={-1}>
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </Button>
            }
          />

          <Button
            id="register-submit-btn"
            type="submit"
            variant="ghost"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-lg shadow-violet-500/25 transition-all duration-200 mt-2 text-white">
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </FormProvider>

      <p className="mt-6 text-center text-sm text-white/30">
        Already have an account?{' '}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
