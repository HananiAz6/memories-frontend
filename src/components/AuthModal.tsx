import React, { useState } from 'react';
import { User } from '../types/travel';
import { DEMO_EXPLORERS } from '../data/initialData';
import { X, Lock, Mail, Compass, User as UserIcon, Sparkles } from 'lucide-react';
import { playHapticSound } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  theme,
  onLogin,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    playHapticSound('post');
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: 'New explorer eager to share journeys and trails.',
      homeBase: 'Global Nomad',
      travelStyle: 'Slow Travel',
      totalTrips: 1,
      countriesVisited: 1,
      joinedDate: 'Just now',
    };
    onLogin(newUser);
    onClose();
  };

  const handleSelectDemoUser = (user: User) => {
    playHapticSound('toggle');
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl transition-all ${
          theme === 'dark'
            ? 'bg-[#1C1F23] border-[#2E343B] text-stone-100'
            : 'bg-white border-[#E6E0D5] text-stone-900'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-current transition-colors"
          aria-label="Close auth dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Lockup from IMG_5491 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FAB76D] text-stone-950 mb-3 shadow">
            <Compass className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight">
            {isSignUp ? 'Create your passport' : 'Welcome back'}
          </h2>
          <p className="text-xs text-stone-400 font-mono mt-1">
            {isSignUp ? 'join a community of fellow explorers.' : 'sign in to your memory keeper.'}
          </p>
        </div>

        {/* Quick Demo Explorer Switcher (Convenient & Instant!) */}
        <div className="mb-6 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-stone-200 dark:border-stone-800">
          <p className="text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#FAB76D]" />
            Quick Sign-In As Explorer:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_EXPLORERS.map((u) => (
              <button
                key={u.id}
                onClick={() => handleSelectDemoUser(u)}
                className={`flex items-center gap-2 p-2 rounded-xl text-left border text-xs transition-all ${
                  theme === 'dark'
                    ? 'border-stone-700/80 bg-stone-900/60 hover:border-[#FAB76D] hover:bg-stone-800'
                    : 'border-stone-200 bg-white hover:border-[#2C8287] hover:bg-stone-50'
                }`}
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                />
                <span className="truncate font-medium">{u.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-stone-200/60 dark:border-stone-800"></div>
          <span className="flex-shrink mx-3 text-[10px] font-mono uppercase tracking-widest text-stone-400">or manual credentials</span>
          <div className="flex-grow border-t border-stone-200/60 dark:border-stone-800"></div>
        </div>

        {/* Form matching IMG_5491 */}
        <form onSubmit={handleCustomSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-stone-400 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Walter Motsi"
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border transition-all outline-hidden ${
                    theme === 'dark'
                      ? 'bg-[#181B1E] border-stone-700 focus:border-[#FAB76D] text-stone-100 placeholder-stone-500'
                      : 'bg-[#FBF9F5] border-stone-300 focus:border-[#2C8287] text-stone-900 placeholder-stone-400'
                  }`}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono tracking-wider uppercase text-stone-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="explorer@memories.app"
                className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border transition-all outline-hidden ${
                  theme === 'dark'
                    ? 'bg-[#181B1E] border-stone-700 focus:border-[#FAB76D] text-stone-100 placeholder-stone-500'
                    : 'bg-[#FBF9F5] border-stone-300 focus:border-[#2C8287] text-stone-900 placeholder-stone-400'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono tracking-wider uppercase text-stone-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border transition-all outline-hidden ${
                  theme === 'dark'
                    ? 'bg-[#181B1E] border-stone-700 focus:border-[#FAB76D] text-stone-100 placeholder-stone-500'
                    : 'bg-[#FBF9F5] border-stone-300 focus:border-[#2C8287] text-stone-900 placeholder-stone-400'
                }`}
              />
            </div>
          </div>

          {/* Primary Submit Button - Amber button from IMG_5491 */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-[#FAB76D] hover:bg-[#EF853F] hover:text-white text-stone-950 transition-all shadow-sm cursor-pointer mt-2"
          >
            {isSignUp ? 'Create Explorer Account' : 'Sign In'}
          </button>

          {/* Google Sign In option from screenshot */}
          <button
            type="button"
            onClick={() => handleSelectDemoUser(DEMO_EXPLORERS[0])}
            className={`w-full py-2 px-4 text-xs font-medium rounded-xl border flex items-center justify-center gap-2 transition-colors ${
              theme === 'dark'
                ? 'bg-stone-800/60 border-stone-700 hover:bg-stone-800 text-stone-200'
                : 'bg-white border-stone-300 hover:bg-stone-50 text-stone-700 shadow-2xs'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </form>

        {/* Toggle between sign in and sign up */}
        <div className="mt-5 text-center text-xs text-stone-400">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-[#EF853F] hover:underline font-semibold"
              >
                Sign in
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-[#EF853F] hover:underline font-semibold"
              >
                Sign up
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
