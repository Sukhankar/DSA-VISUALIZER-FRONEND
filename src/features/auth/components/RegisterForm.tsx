import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { ErrorMessage } from '../../../components/ui/ErrorMessage';
import { getErrorMessage } from '../../../utils/errorUtils';
import { UserPlus, Mail, User as UserIcon, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors: typeof fieldErrors = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3 || username.length > 50) {
      errors.username = 'Username must be between 3 and 50 characters';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      setSuccessMessage('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { state: { registeredEmail: email.trim() } });
      }, 1500);
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

      {successMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <Input
        id="register-username"
        type="text"
        label="Username"
        placeholder="alex_dev"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={fieldErrors.username}
        leftIcon={<UserIcon className="w-4 h-4 text-slate-400" />}
        autoComplete="username"
        required
      />

      <Input
        id="register-email"
        type="email"
        label="Email Address"
        placeholder="alex@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
        leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
        autoComplete="email"
        required
      />

      <Input
        id="register-password"
        type="password"
        label="Password"
        placeholder="Minimum 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
        autoComplete="new-password"
        required
      />

      <Input
        id="register-confirm-password"
        type="password"
        label="Confirm Password"
        placeholder="Re-enter password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={fieldErrors.confirmPassword}
        leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
        autoComplete="new-password"
        required
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isSubmitting}
        leftIcon={<UserPlus className="w-4 h-4" />}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Create Account
      </Button>

      <div className="text-center pt-2 text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
          Sign in
        </Link>
      </div>
    </form>
  );
};
