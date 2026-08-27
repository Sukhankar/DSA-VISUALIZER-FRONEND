import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { ErrorMessage } from '../../../components/ui/ErrorMessage';
import { getErrorMessage } from '../../../utils/errorUtils';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {apiError && (
        <ErrorMessage
          message={apiError}
          onRetry={() => setApiError(null)}
        />
      )}

      <Input
        id="login-email"
        type="email"
        label="Email Address"
        placeholder="user@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
        leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
        autoComplete="email"
        required
      />

      <Input
        id="login-password"
        type="password"
        label="Password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
        autoComplete="current-password"
        required
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isSubmitting}
        leftIcon={<LogIn className="w-4 h-4" />}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Sign In
      </Button>

      <div className="text-center pt-2 text-xs text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
          Create one now
        </Link>
      </div>
    </form>
  );
};
