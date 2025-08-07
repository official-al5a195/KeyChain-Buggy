import React from 'react';
import { motion } from 'framer-motion';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  theme: 'dark' | 'immy' | 'light';
  email: string;
}

interface GardenNavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  currentUser: UserProfile;
}

interface NavigationItem {
  id: string;
  name: string;
  icon: string;
  emoji: string;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'affirmations',
    name: 'Love Notes',
    icon: '💌',
    emoji: '💕',
    description: 'Sweet messages'
  },
  {
    id: 'spotify',
    name: 'Our Playlist',
    icon: '🎵',
    emoji: '🎶',
    description: 'Shared music'
  },
  {
    id: 'koala',
    name: 'Koala Garden',
    icon: '🐨',
    emoji: '🌿',
    description: 'Pet care game'
  },
  {
    id: 'heartgame',
    name: 'Heart Hunt',
    icon: '💖',
    emoji: '✨',
    description: 'Collect hearts'
  },
  {
    id: 'diary',
    name: 'Love Diary',
    icon: '📖',
    emoji: '📝',
    description: 'Shared memories'
  },
  {
    id: 'dateideas',
    name: 'Date Ideas',
    icon: '💡',
    emoji: '📅',
    description: 'Plan together'
  }
];

export function GardenNavigation({ currentSection, onSectionChange, currentUser }: GardenNavigationProps) {
  const getThemeColors = () => {
    switch (currentUser.theme) {
      case 'dark':
        return {
          bg: 'bg-card/80',
          border: 'border-border/50',
          activeItem: 'bg-primary/20 text-primary',
          inactiveItem: 'text-muted-foreground hover:text-foreground',
          activeBorder: 'border-primary/50'
        };
      case 'immy':
        return {
          bg: 'bg-card/90',
          border: 'border-border/60',
          activeItem: 'bg-primary/20 text-primary',
          inactiveItem: 'text-muted-foreground hover:text-foreground',
          activeBorder: 'border-primary/50'
        };
      case 'light':
        return {
          bg: 'bg-card/90',
          border: 'border-border/60',
          activeItem: 'bg-primary/20 text-primary',
          inactiveItem: 'text-muted-foreground hover:text-foreground',
          activeBorder: 'border-primary/50'
        };
      default:
        return {
          bg: 'bg-card/80',
          border: 'border-border/50',
          activeItem: 'bg-primary/20 text-primary',
          inactiveItem: 'text-muted-foreground hover:text-foreground',
          activeBorder: 'border-primary/50'
        };
    }
  };

  const themeColors = getThemeColors();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`fixed bottom-0 left-0 right-0 z-50 ${themeColors.bg} backdrop-blur-lg border-t ${themeColors.border} p-2`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-6 gap-1">
          {navigationItems.map((item, index) => {
            const isActive = currentSection === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`relative p-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? `${themeColors.activeItem} border ${themeColors.activeBorder}` 
                    : `${themeColors.inactiveItem} hover:bg-accent/50`
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <motion.div
                    animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className="text-lg"
                  >
                    {item.icon}
                  </motion.div>
                  <span className="text-xs font-medium leading-tight text-center">
                    {item.name}
                  </span>
                  
                  {/* Floating emoji indicator */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, y: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        y: [0, -20, -30],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                      className="absolute -top-8 text-sm pointer-events-none"
                    >
                      {item.emoji}
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
        
        {/* User info bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center mt-2 gap-3 py-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentUser.avatar}</span>
            <span className="text-sm text-muted-foreground">{currentUser.name}</span>
            {currentUser.id === 'Keychain' && (
              <span className="text-xs bg-pink-500/20 text-pink-600 px-2 py-0.5 rounded-full">
                Partner 1
              </span>
            )}
            {currentUser.id === 'Bug' && (
              <span className="text-xs bg-purple-500/20 text-purple-600 px-2 py-0.5 rounded-full">
                Partner 2
              </span>
            )}
          </div>
          
          <div className="w-px h-4 bg-border/50" />
          
          <div className="flex items-center gap-1">
            {currentUser.theme === 'dark' && <span className="text-sm">🌙</span>}
            {currentUser.theme === 'immy' && <span className="text-sm">🐰</span>}
            {currentUser.theme === 'light' && <span className="text-sm">🐨</span>}
            <span className="text-xs text-muted-foreground capitalize">
              {currentUser.theme === 'immy' ? 'Keychain' : currentUser.theme === 'light' ? 'Bug' : 'Mystical'}
            </span>
          </div>
          
          <div className="w-px h-4 bg-border/50" />
          
          <div className="text-xs text-muted-foreground">
            💕 Enchanted Garden
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}