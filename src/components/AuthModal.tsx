import React, { useState } from 'react';
import { User } from '../types/travel';
import { Lock, Mail, Compass, User as UserIcon } from 'lucide-react';
import { api, setToken, toUser } from '../utils/api';
import { playHapticSound } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  theme: 'dark' | 'light';
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, theme, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const inputCls = `w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-hidden ${
    theme === 'dark'
      ? 'bg-[#181B1E] border-stone-700 focus:border-[#FAB76D] text-stone-100 placeholder-stone-500'
      : 'bg-[#FBF9F5] border-stone-300 focus:border-[#2C8287] text-stone-900 placeholder-stone-400'
  }`;
  const labelCls = 'block text-[11px] font-mono tracking-wider uppercase text-stone-400 mb-1';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = isSignUp ? { name, email, password } : { email, password };
      const { token, user } = await api(`/auth/${isSignUp ? 'register' : 'login'}`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setToken(token);
      playHapticSound('post');
      onLogin(toUser(user));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div
        className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl ${
          theme === 'dark' ? 'bg-[#1C1F23] border-[#2E343B] text-stone-100' : 'bg-white border-[#E6E0D5] text-stone-900'
        }`}
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FAB76D] text-stone-950 mb-3">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-stone-400 font-mono mt-1">
            {isSignUp ? 'join your friends on Memories.' : 'sign in to see your memories.'}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className={labelCls}>Username</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. hanani" className={inputCls} />
              </div>
            </div>
          )}
          <div>
            <label className={labelCls}>Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="min. 6 characters" className={inputCls} />
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs font-semibold rounded-xl bg-[#FAB76D] hover:bg-[#EF853F] hover:text-white text-stone-950 transition-all disabled:opacity-60"
          >
            {loading ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-stone-400">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-[#EF853F] hover:underline font-semibold"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
};