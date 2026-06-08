import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              user_name: username,
            }
          }
        });
        if (error) throw error;
      }
      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isLogin ? 'Welcome back' : 'Create an account'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-[var(--color-accent-coral)]/10 border border-[var(--color-accent-coral)]/20 text-[var(--color-accent-coral)] text-sm">
            {error}
          </div>
        )}

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Username</label>
            <input 
              type="text" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
              placeholder="e.g. promptmaster"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Email</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Password</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
        </Button>

        <p className="text-center text-sm text-[var(--color-text-muted)] mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium font-display"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </form>
    </Modal>
  );
};
