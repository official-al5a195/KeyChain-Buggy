import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  theme: 'dark' | 'immy' | 'light';
  email: string;
}

interface UserLoginProps {
  onUserLogin: (user: UserProfile) => void;
}

export function UserLogin({ onUserLogin }: UserLoginProps) {
  const [mode, setMode] = useState<'select' | 'create'>('select');
  const [existingUsers, setExistingUsers] = useState<UserProfile[]>([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    avatar: '🐰',
    theme: 'immy' as 'dark' | 'immy' | 'light',
    id: 'Keychain'
  });

  const availableAvatars = ['🐰', '🐨', '🦋', '🌸', '💕', '✨', '🌿', '🌺', '💖', '🐛', '🌙', '⭐'];
  const themeOptions = [
    { id: 'dark', name: 'Mystical', emoji: '🌙', description: 'Deep purples & magical vibes' },
    { id: 'immy', name: 'Keychain', emoji: '🐰', description: 'Laurel green, baby pink & sugar white' },
    { id: 'light', name: 'Bug', emoji: '🐨', description: 'Wood brown & nature greens' }
  ];

  useEffect(() => {
    // Load existing users from localStorage
    const users: UserProfile[] = [];
    
    ['Keychain', 'Bug'].forEach(userId => {
      const savedUser = localStorage.getItem(`user_${userId}`);
      if (savedUser) {
        try {
          users.push(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error loading user:', error);
        }
      }
    });
    
    // Sort users so Keychain (Partner 1) comes first
    users.sort((a, b) => a.id === 'Keychain' ? -1 : 1);
    setExistingUsers(users);
    
    // If no users exist, go to create mode
    if (users.length === 0) {
      setMode('create');
    }
  }, []);

  const handleUserSelect = (user: UserProfile) => {
    onUserLogin(user);
  };

  const handleCreateUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    const user: UserProfile = {
      ...newUser,
      id: existingUsers.length === 0 ? 'Keychain' : 'Bug'
    };

    // Save user to localStorage
    localStorage.setItem(`user_${user.id}`, JSON.stringify(user));
    
    onUserLogin(user);
  };

  const getThemeBackground = () => {
    switch (newUser.theme) {
      case 'dark':
        return 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900';
      case 'immy':
        return 'bg-gradient-to-br from-emerald-50 via-pink-50 to-white';
      case 'light':
        return 'bg-gradient-to-br from-amber-50 via-green-50 to-yellow-50';
      default:
        return 'bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900';
    }
  };

  const getTextColor = () => {
    return newUser.theme === 'dark' ? 'text-white' : 'text-gray-800';
  };

  if (mode === 'select' && existingUsers.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-white mb-2">
                Welcome Back, Lovebirds! 💕
              </CardTitle>
              <CardDescription className="text-pink-100 text-lg">
                Choose your profile to enter your shared enchanted garden
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {existingUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Button
                      onClick={() => handleUserSelect(user)}
                      className="w-full p-6 bg-white/5 hover:bg-white/15 border border-white/20 hover:border-white/40 transition-all duration-200"
                      variant="ghost"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="text-4xl">{user.avatar}</div>
                        <div className="flex-1 text-left">
                          <div className="text-white font-medium text-xl">{user.name}</div>
                          <div className="text-pink-200 text-sm">{user.email}</div>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                              {themeOptions.find(t => t.id === user.theme)?.name} {themeOptions.find(t => t.id === user.theme)?.emoji}
                            </Badge>
                            {user.id === 'Keychain' && (
                              <Badge variant="secondary" className="bg-pink-500/20 text-pink-200 border-pink-400/30">
                                Partner 1 💕
                              </Badge>
                            )}
                            {user.id === 'Bug' && (
                              <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                                Partner 2 💖
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-2xl opacity-60">
                          →
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
              
              {existingUsers.length < 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <div className="text-pink-200 text-sm mb-3">
                    {existingUsers.length === 0 
                      ? "Create profiles for both partners" 
                      : "Add your partner's profile"}
                  </div>
                  <Button
                    onClick={() => setMode('create')}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                  >
                    {existingUsers.length === 0 
                      ? "Create First Profile 💖" 
                      : "Add Partner's Profile 💕"}
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${getThemeBackground()}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className={`bg-white/10 backdrop-blur-lg border-white/20 ${newUser.theme !== 'dark' ? 'bg-white/80' : ''}`}>
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl mb-2 ${getTextColor()}`}>
              {existingUsers.length === 0 
                ? "Create Your Profile 🌟" 
                : "Add Your Partner 💕"}
            </CardTitle>
            <CardDescription className={newUser.theme === 'dark' ? 'text-pink-100' : 'text-gray-600'}>
              {existingUsers.length === 0 
                ? "Set up your enchanted garden experience" 
                : "Complete your couple's garden by adding your partner"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${getTextColor()}`}>
                {existingUsers.length === 0 ? "Your Name" : "Partner's Name"}
              </label>
              <Input
                type="text"
                placeholder={existingUsers.length === 0 ? "Enter your name..." : "Enter your partner's name..."}
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className={`${newUser.theme === 'dark' ? 'bg-white/10 border-white/30 text-white placeholder-pink-200' : 'bg-white/50 border-gray-300'}`}
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${getTextColor()}`}>
                {existingUsers.length === 0 ? "Your Email" : "Partner's Email"}
              </label>
              <Input
                type="email"
                placeholder={existingUsers.length === 0 ? "your@email.com" : "partner@email.com"}
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className={`${newUser.theme === 'dark' ? 'bg-white/10 border-white/30 text-white placeholder-pink-200' : 'bg-white/50 border-gray-300'}`}
              />
            </div>

            {/* Avatar Selection */}
            <div className="space-y-3">
              <label className={`text-sm font-medium ${getTextColor()}`}>
                Choose {existingUsers.length === 0 ? "Your" : "Partner's"} Avatar
              </label>
              <div className="grid grid-cols-6 gap-2">
                {availableAvatars.map((avatar) => (
                  <motion.button
                    key={avatar}
                    onClick={() => setNewUser({ ...newUser, avatar })}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      newUser.avatar === avatar
                        ? 'border-primary bg-primary/20 scale-110'
                        : 'border-white/20 hover:border-white/40 hover:scale-105'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl">{avatar}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div className="space-y-3">
              <label className={`text-sm font-medium ${getTextColor()}`}>
                Choose {existingUsers.length === 0 ? "Your" : "Partner's"} Preferred Theme
              </label>
              <div className="grid gap-2">
                {themeOptions.map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => setNewUser({ ...newUser, theme: theme.id as any })}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      newUser.theme === theme.id
                        ? 'border-primary bg-primary/20'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{theme.emoji}</span>
                      <div>
                        <div className={`font-medium ${getTextColor()}`}>{theme.name}</div>
                        <div className={`text-sm ${newUser.theme === 'dark' ? 'text-pink-200' : 'text-gray-600'}`}>
                          {theme.description}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleCreateUser}
              disabled={!newUser.name.trim() || !newUser.email.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-3"
            >
              {existingUsers.length === 0 
                ? "Enter Your Garden 🌺" 
                : "Complete Your Couple's Garden 💖"}
            </Button>

            {existingUsers.length > 0 && (
              <Button
                onClick={() => setMode('select')}
                variant="ghost"
                className={`w-full ${newUser.theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Back to Profile Selection
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}