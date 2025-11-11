import { useState } from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import { Language, getTranslation } from '../i18n/translations';

export interface UserInfo {
  name: string;
  email: string;
  dob: string;
}

interface UserInfoPageProps {
  onSubmit: (userInfo: UserInfo) => void;
  language: Language;
}

export function UserInfoPage({ onSubmit, language }: UserInfoPageProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', email: '', dob: '' });
  const [error, setError] = useState('');

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo.name || !userInfo.email || !userInfo.dob) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    // Basit e-posta doğrulaması
    if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    setError('');
    onSubmit(userInfo);
  };

  return (
    <div className="min-h-screen starfield flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-amber-500/30 rounded-lg p-8 animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-decorative text-amber-400 glow-text mb-2">
              {t('userInfoTitle')}
            </h1>
            <p className="text-slate-300">
              {t('userInfoDescription')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-amber-400/80 mb-2">
                {t('userName')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/50" size={20} />
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={userInfo.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/50 border-2 border-amber-500/30 rounded-lg pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:border-amber-500/60 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-400/80 mb-2">
                {t('userEmail')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/50" size={20} />
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/50 border-2 border-amber-500/30 rounded-lg pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:border-amber-500/60 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-amber-400/80 mb-2">
                {t('userDob')}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/50" size={20} />
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  value={userInfo.dob}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/50 border-2 border-amber-500/30 rounded-lg pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:border-amber-500/60 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-semibold py-3 rounded-lg transition-all transform hover:scale-105"
            >
              {t('continue')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
