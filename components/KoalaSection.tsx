import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { triggerNotification } from './NotificationSystem';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  theme: 'dark' | 'immy' | 'light';
  email: string;
}

interface KoalaStats {
  happiness: number;
  hunger: number;
  energy: number;
  health: number;
  lastFed: Date;
  lastPlayed: Date;
  lastSlept: Date;
  level: number;
  experience: number;
  name: string;
}

interface Activity {
  id: string;
  type: 'feed' | 'play' | 'sleep' | 'pet';
  timestamp: Date;
  performedBy: string;
  performedByAvatar: string;
  message: string;
}

interface KoalaSectionProps {
  currentUser: UserProfile;
  otherUser: UserProfile | null;
}

export function KoalaSection({ currentUser, otherUser }: KoalaSectionProps) {
  const [koalaStats, setKoalaStats] = useState<KoalaStats>({
    happiness: 80,
    hunger: 60,
    energy: 70,
    health: 90,
    lastFed: new Date(Date.now() - 3600000), // 1 hour ago
    lastPlayed: new Date(Date.now() - 1800000), // 30 min ago
    lastSlept: new Date(Date.now() - 7200000), // 2 hours ago
    level: 1,
    experience: 0,
    name: 'Cuddles'
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [actionCooldown, setActionCooldown] = useState<{[key: string]: number}>({});

  const koalaMoods = {
    happy: { emoji: '🐨😊', description: 'Cuddles is feeling great!' },
    sad: { emoji: '🐨😢', description: 'Cuddles needs some love' },
    hungry: { emoji: '🐨🍃', description: 'Cuddles is hungry' },
    sleepy: { emoji: '🐨😴', description: 'Cuddles is getting sleepy' },
    playful: { emoji: '🐨🎾', description: 'Cuddles wants to play!' },
    sick: { emoji: '🐨🤧', description: 'Cuddles is not feeling well' }
  };

  const actions = [
    {
      id: 'feed',
      name: 'Feed Eucalyptus',
      emoji: '🍃',
      description: 'Give Cuddles some fresh eucalyptus leaves',
      cooldown: 30000, // 30 seconds
      effects: { hunger: -30, happiness: +10, health: +5 }
    },
    {
      id: 'play',
      name: 'Play Together',
      emoji: '🎾',
      description: 'Play catch with Cuddles',
      cooldown: 45000, // 45 seconds
      effects: { happiness: +20, energy: -15, hunger: +10 }
    },
    {
      id: 'sleep',
      name: 'Nap Time',
      emoji: '😴',
      description: 'Help Cuddles take a peaceful nap',
      cooldown: 60000, // 1 minute
      effects: { energy: +30, happiness: +10, hunger: +5 }
    },
    {
      id: 'pet',
      name: 'Give Pets',
      emoji: '🤗',
      description: 'Show Cuddles some love with gentle pets',
      cooldown: 20000, // 20 seconds
      effects: { happiness: +15, health: +5 }
    }
  ];

  useEffect(() => {
    loadKoalaData();
    
    // Simulate stat decay over time
    const interval = setInterval(() => {
      setKoalaStats(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 1),
        energy: Math.max(0, prev.energy - 0.5),
        happiness: Math.max(0, prev.happiness - 0.3)
      }));
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadKoalaData = () => {
    const savedStats = localStorage.getItem('koalaStats');
    const savedActivities = localStorage.getItem('koalaActivities');
    
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setKoalaStats({
          ...parsed,
          lastFed: new Date(parsed.lastFed),
          lastPlayed: new Date(parsed.lastPlayed),
          lastSlept: new Date(parsed.lastSlept)
        });
      } catch (error) {
        console.error('Error loading koala stats:', error);
      }
    }

    if (savedActivities) {
      try {
        const parsed = JSON.parse(savedActivities).map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp)
        }));
        setActivities(parsed.slice(0, 20)); // Keep last 20 activities
      } catch (error) {
        console.error('Error loading activities:', error);
      }
    }
  };

  const saveKoalaData = (newStats: KoalaStats, newActivities: Activity[]) => {
    localStorage.setItem('koalaStats', JSON.stringify(newStats));
    localStorage.setItem('koalaActivities', JSON.stringify(newActivities));
  };

  const performAction = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (!action) return;

    // Check cooldown
    const now = Date.now();
    const lastAction = actionCooldown[actionId];
    if (lastAction && now - lastAction < action.cooldown) {
      return;
    }

    // Update stats
    const newStats = { ...koalaStats };
    Object.entries(action.effects).forEach(([stat, change]) => {
      if (stat in newStats) {
        (newStats as any)[stat] = Math.max(0, Math.min(100, (newStats as any)[stat] + change));
      }
    });

    // Update experience and level
    newStats.experience += 10;
    if (newStats.experience >= newStats.level * 100) {
      newStats.level += 1;
      newStats.experience = 0;
    }

    // Update last action times
    const actionTimeMap: {[key: string]: keyof KoalaStats} = {
      feed: 'lastFed',
      play: 'lastPlayed',
      sleep: 'lastSlept'
    };
    
    if (actionTimeMap[actionId]) {
      newStats[actionTimeMap[actionId]] = new Date() as any;
    }

    // Create activity record
    const activity: Activity = {
      id: Date.now().toString(),
      type: actionId as any,
      timestamp: new Date(),
      performedBy: currentUser.name,
      performedByAvatar: currentUser.avatar,
      message: `${currentUser.name} ${action.name.toLowerCase()}ed Cuddles`
    };

    const newActivities = [activity, ...activities];
    
    setKoalaStats(newStats);
    setActivities(newActivities);
    setActionCooldown(prev => ({ ...prev, [actionId]: now }));
    setSelectedAction(actionId);
    
    setTimeout(() => setSelectedAction(null), 2000);

    saveKoalaData(newStats, newActivities);

    // Trigger notification for other user
    if (otherUser) {
      triggerNotification({
        type: 'koala',
        title: 'Koala Care Update',
        message: `${currentUser.name} ${action.name.toLowerCase()}ed Cuddles! ${action.emoji}`,
        from: currentUser.name
      });
    }
  };

  const getKoalaMood = () => {
    if (koalaStats.health < 30) return koalaMoods.sick;
    if (koalaStats.hunger > 80) return koalaMoods.hungry;
    if (koalaStats.energy < 20) return koalaMoods.sleepy;
    if (koalaStats.happiness > 80) return koalaMoods.playful;
    if (koalaStats.happiness < 40) return koalaMoods.sad;
    return koalaMoods.happy;
  };

  const getStatColor = (value: number) => {
    if (value >= 70) return 'text-green-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatBgColor = (value: number) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  const isActionOnCooldown = (actionId: string) => {
    const lastAction = actionCooldown[actionId];
    const action = actions.find(a => a.id === actionId);
    if (!lastAction || !action) return false;
    
    return Date.now() - lastAction < action.cooldown;
  };

  const getCooldownTime = (actionId: string) => {
    const lastAction = actionCooldown[actionId];
    const action = actions.find(a => a.id === actionId);
    if (!lastAction || !action) return 0;
    
    const remaining = action.cooldown - (Date.now() - lastAction);
    return Math.max(0, Math.ceil(remaining / 1000));
  };

  const currentMood = getKoalaMood();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Koala Garden 🐨</h1>
        <p className="text-muted-foreground">
          Take care of Cuddles together and watch them grow!
        </p>
      </motion.div>

      {/* Koala Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Card className="overflow-hidden">
          <CardContent className="p-8 bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            {/* Tree Branch Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="text-8xl transform rotate-12 absolute top-4 right-8">🌳</div>
              <div className="text-4xl absolute bottom-8 left-12">🍃</div>
              <div className="text-3xl absolute top-12 left-16">🦋</div>
            </div>
            
            <div className="relative z-10 text-center">
              {/* Koala Character */}
              <motion.div
                animate={selectedAction ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="text-9xl mb-4"
              >
                {currentMood.emoji}
              </motion.div>
              
              {/* Koala Info */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{koalaStats.name}</h2>
                <p className="text-muted-foreground">{currentMood.description}</p>
                <div className="flex justify-center gap-4">
                  <Badge variant="secondary">Level {koalaStats.level}</Badge>
                  <Badge variant="outline">XP: {koalaStats.experience}/100</Badge>
                </div>
              </div>

              {/* Action Effects Display */}
              <AnimatePresence>
                {selectedAction && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-lg font-medium">
                      {actions.find(a => a.id === selectedAction)?.emoji} +10 XP
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Cuddles' Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Happiness', value: koalaStats.happiness, emoji: '😊', color: 'bg-yellow-500' },
                { name: 'Hunger', value: koalaStats.hunger, emoji: '🍃', color: 'bg-green-500', inverse: true },
                { name: 'Energy', value: koalaStats.energy, emoji: '⚡', color: 'bg-blue-500' },
                { name: 'Health', value: koalaStats.health, emoji: '❤️', color: 'bg-red-500' }
              ].map((stat) => (
                <div key={stat.name} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{stat.emoji}</span>
                    <span className="font-medium">{stat.name}</span>
                  </div>
                  <Progress 
                    value={stat.inverse ? 100 - stat.value : stat.value} 
                    className="h-3"
                  />
                  <div className={`text-sm font-medium ${getStatColor(stat.inverse ? 100 - stat.value : stat.value)}`}>
                    {Math.round(stat.value)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Care Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {actions.map((action) => {
                const onCooldown = isActionOnCooldown(action.id);
                const cooldownTime = getCooldownTime(action.id);
                
                return (
                  <motion.div key={action.id} whileHover={{ scale: onCooldown ? 1 : 1.05 }}>
                    <Button
                      onClick={() => performAction(action.id)}
                      disabled={onCooldown}
                      className="w-full h-auto p-4 flex flex-col gap-2"
                      variant={selectedAction === action.id ? "default" : "outline"}
                    >
                      <span className="text-2xl">{action.emoji}</span>
                      <span className="font-medium">{action.name}</span>
                      {onCooldown && (
                        <span className="text-xs text-muted-foreground">
                          {cooldownTime}s
                        </span>
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-4xl mb-2">🐨</div>
                <p>No activities yet. Start caring for Cuddles!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {activities.slice(0, 10).map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="text-2xl">{activity.performedByAvatar}</span>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(activity.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Floating elements */}
      <div className="fixed inset-0 pointer-events-none">
        {['🍃', '🦋', '🌿', '🐛', '🌸'].map((element, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-30"
            style={{
              left: `${15 + i * 20}%`,
              top: `${25 + i * 15}%`,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeInOut",
            }}
          >
            {element}
          </motion.div>
        ))}
      </div>
    </div>
  );
}