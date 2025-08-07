import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { triggerNotification } from './NotificationSystem';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  theme: 'dark' | 'immy' | 'light';
  email: string;
}

interface Affirmation {
  id: string;
  text: string;
  author: string;
  authorAvatar: string;
  timestamp: Date;
  hearts: number;
  loved: boolean;
}

interface AffirmationsSectionProps {
  currentUser: UserProfile;
  otherUser: UserProfile | null;
}

export function AffirmationsSection({ currentUser, otherUser }: AffirmationsSectionProps) {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [newAffirmation, setNewAffirmation] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  const lovePrompts = [
    "You make my heart skip a beat when...",
    "I love how you...",
    "You're amazing because...",
    "My favorite thing about you is...",
    "You make me smile when...",
    "I'm grateful for you because...",
    "You're special to me because...",
    "I admire how you...",
  ];

  useEffect(() => {
    loadAffirmations();
  }, []);

  const loadAffirmations = () => {
    const saved = localStorage.getItem('gardenAffirmations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp)
        }));
        setAffirmations(parsed.sort((a: Affirmation, b: Affirmation) => 
          b.timestamp.getTime() - a.timestamp.getTime()
        ));
      } catch (error) {
        console.error('Error loading affirmations:', error);
      }
    }
  };

  const saveAffirmations = (updatedAffirmations: Affirmation[]) => {
    localStorage.setItem('gardenAffirmations', JSON.stringify(updatedAffirmations));
    setAffirmations(updatedAffirmations);
  };

  const handleSubmit = () => {
    if (!newAffirmation.trim()) return;

    const affirmation: Affirmation = {
      id: Date.now().toString(),
      text: newAffirmation.trim(),
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      timestamp: new Date(),
      hearts: 0,
      loved: false
    };

    const updated = [affirmation, ...affirmations];
    saveAffirmations(updated);
    setNewAffirmation('');
    setIsWriting(false);

    // Trigger notification for other user
    if (otherUser) {
      triggerNotification({
        type: 'affirmation',
        title: 'New Love Note',
        message: `${currentUser.name} sent you a sweet message: "${newAffirmation.slice(0, 50)}${newAffirmation.length > 50 ? '...' : ''}"`,
        from: currentUser.name
      });
    }
  };

  const toggleLove = (id: string) => {
    const updated = affirmations.map(affirmation => {
      if (affirmation.id === id) {
        const newLoved = !affirmation.loved;
        return {
          ...affirmation,
          loved: newLoved,
          hearts: newLoved ? affirmation.hearts + 1 : Math.max(0, affirmation.hearts - 1)
        };
      }
      return affirmation;
    });
    saveAffirmations(updated);
  };

  const getRandomPrompt = () => {
    return lovePrompts[Math.floor(Math.random() * lovePrompts.length)];
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Love Notes 💌</h1>
        <p className="text-muted-foreground">
          Share sweet affirmations and loving messages
        </p>
      </motion.div>

      {/* Write New Affirmation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{currentUser.avatar}</span>
              Write a Love Note
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isWriting ? (
              <div className="space-y-3">
                <Button
                  onClick={() => setIsWriting(true)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                >
                  ✍️ Write Something Sweet
                </Button>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Need inspiration?</p>
                  <Button
                    onClick={() => {
                      setNewAffirmation(getRandomPrompt());
                      setIsWriting(true);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    💡 Get a Prompt
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea
                  value={newAffirmation}
                  onChange={(e) => setNewAffirmation(e.target.value)}
                  placeholder="Write your loving message here..."
                  className="min-h-[120px] resize-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={!newAffirmation.trim()}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                  >
                    Send Love 💕
                  </Button>
                  <Button
                    onClick={() => {
                      setIsWriting(false);
                      setNewAffirmation('');
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {newAffirmation.length}/500 characters
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Affirmations Feed */}
      <div className="space-y-4">
        <AnimatePresence>
          {affirmations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">💕</div>
              <h3 className="text-xl font-medium mb-2">No love notes yet</h3>
              <p className="text-muted-foreground">
                Be the first to share something sweet!
              </p>
            </motion.div>
          ) : (
            affirmations.map((affirmation, index) => (
              <motion.div
                key={affirmation.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                layout
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{affirmation.authorAvatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {affirmation.author}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(affirmation.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-foreground leading-relaxed mb-4">
                          {affirmation.text}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <motion.button
                            onClick={() => toggleLove(affirmation.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors duration-200 ${
                              affirmation.loved
                                ? 'bg-red-100 text-red-600 border border-red-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.span
                              animate={affirmation.loved ? { scale: [1, 1.3, 1] } : {}}
                              transition={{ duration: 0.3 }}
                              className="text-lg"
                            >
                              {affirmation.loved ? '❤️' : '🤍'}
                            </motion.span>
                            <span className="text-sm font-medium">
                              {affirmation.hearts}
                            </span>
                          </motion.button>
                          
                          <div className="flex gap-1">
                            {['💕', '✨', '🌸', '💖'].map((emoji, i) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 0.3, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="text-lg"
                              >
                                {emoji}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Floating love elements */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          >
            💕
          </motion.div>
        ))}
      </div>
    </div>
  );
}