import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Authentication Components
import { PasscodeEntry } from '../components/PasscodeEntry';
import { UserLogin } from '../components/UserLogin';

// Main Feature Components
import { AffirmationsSection } from '../components/AffirmationsSection';
import { SpotifySection } from '../components/SpotifySection';
import { KoalaSection } from '../components/KoalaSection';
import { HeartGameSection } from '../components/HeartGameSection';
import { DiarySection } from '../components/DiarySection';
import { DateIdeasSection } from '../components/DateIdeasSection';

// System Components
import { GardenNavigation } from '../components/GardenNavigation';
import { NotificationSystem } from '../components/NotificationSystem';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  theme: 'dark' | 'immy' | 'light';
  email: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentSection, setCurrentSection] = useState<string>('affirmations');

  // Load authentication state from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('gardenAuth');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedAuth === 'true' && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setCurrentUser(user);
        document.documentElement.className = user.theme;
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
    localStorage.setItem('gardenAuth', 'true');
  };

  const handleUserLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    document.documentElement.className = user.theme;
  };

  const getOtherUser = (): UserProfile | null => {
    if (!currentUser) return null;
    
    const otherUserId = currentUser.id === 'Keychain' ? 'Bug' : 'Keychain';
    const savedOtherUser = localStorage.getItem(`user_${otherUserId}`);
    
    if (savedOtherUser) {
      try {
        return JSON.parse(savedOtherUser);
      } catch (error) {
        console.error('Error loading other user data:', error);
      }
    }
    
    // Return default other user if not found
    return {
      id: otherUserId,
      name: otherUserId,
      avatar: otherUserId === 'Keychain' ? '🐰' : '🐨',
      theme: otherUserId === 'Keychain' ? 'immy' : 'light',
      email: `${otherUserId.toLowerCase()}@enchantedgarden.love`
    };
  };

  const handleThemeChange = () => {
    if (!currentUser) return;
    
    const themes: ('dark' | 'immy' | 'light')[] = ['dark', 'immy', 'light'];
    const currentIndex = themes.indexOf(currentUser.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    const updatedUser = { ...currentUser, theme: nextTheme };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem(`user_${currentUser.id}`, JSON.stringify(updatedUser));
    document.documentElement.className = nextTheme;
  };

  // Background Animation Elements
  const getThemeElements = () => {
    if (!currentUser) return { elements: [], creatures: [], effects: [] };
    
    switch (currentUser.theme) {
      case 'dark':
        return {
          elements: ['🌸', '🦋', '🌺', '💕', '🌿', '✨', '🐛', '🌙', '⭐', '🌻', '🔮', '🧚‍♀️', '🌿', '🍃', '💜'],
          creatures: ['🦋', '🐛', '🐞', '🦗', '🕷️', '🐝', '🧚‍♀️', '🔥'],
          effects: ['✨', '💫', '🌟', '💎']
        };
      case 'immy':
        return {
          elements: ['🐰', '💝', '🌸', '💕', '🎀', '🌺', '✨', '💖', '🌷', '🌹', '💐', '🎁', '💌', '🦋', '☁️'],
          creatures: ['🐰', '🐰', '🐰', '🦋', '🌸', '💕', '🎀', '💖'],
          effects: ['💕', '💖', '💗', '💘']
        };
      case 'light':
        return {
          elements: ['🐨', '🌿', '🌳', '🍃', '🐛', '🦗', '🌻', '🍯', '🌾', '🌰', '🦋', '🐝', '🌲', '🍀', '🌱'],
          creatures: ['🐨', '🐛', '🦗', '🐞', '🕷️', '🐝', '🦋', '🐿️'],
          effects: ['🌿', '✨', '🍃', '💚']
        };
      default:
        return { elements: [], creatures: [], effects: [] };
    }
  };

  const renderFloatingElements = () => {
    const { elements, creatures, effects } = getThemeElements();
    const floatingElements = [];

    // Generate floating elements
    for (let i = 0; i < 25; i++) {
      const element = elements[Math.floor(Math.random() * elements.length)];
      const randomDelay = Math.random() * 10;
      const randomDuration = 6 + Math.random() * 4;
      const randomX = Math.random() * 100;
      const randomY = Math.random() * 100;

      floatingElements.push(
        <motion.div
          key={`element-${i}`}
          className="absolute text-lg pointer-events-none select-none"
          style={{
            left: `${randomX}%`,
            top: `${randomY}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, Math.random() * 40 - 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: randomDuration,
            delay: randomDelay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {element}
        </motion.div>
      );
    }

    // Generate theme creatures
    for (let i = 0; i < 8; i++) {
      const creature = creatures[Math.floor(Math.random() * creatures.length)];
      const randomDelay = Math.random() * 15;
      const randomDuration = 8 + Math.random() * 4;
      const randomX = Math.random() * 90;
      const randomY = Math.random() * 90;

      floatingElements.push(
        <motion.div
          key={`creature-${i}`}
          className="absolute text-2xl pointer-events-none select-none"
          style={{
            left: `${randomX}%`,
            top: `${randomY}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 30 - 15, 0],
            rotate: [0, Math.random() * 30 - 15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: randomDuration,
            delay: randomDelay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {creature}
        </motion.div>
      );
    }

    // Generate special effects
    for (let i = 0; i < 12; i++) {
      const effect = effects[Math.floor(Math.random() * effects.length)];
      const randomDelay = Math.random() * 12;
      const randomDuration = 4 + Math.random() * 2;
      const randomX = Math.random() * 100;
      const randomY = Math.random() * 100;

      floatingElements.push(
        <motion.div
          key={`effect-${i}`}
          className="absolute text-sm pointer-events-none select-none opacity-60"
          style={{
            left: `${randomX}%`,
            top: `${randomY}%`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: randomDuration,
            delay: randomDelay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {effect}
        </motion.div>
      );
    }

    return floatingElements;
  };

  const renderCurrentSection = () => {
    if (!currentUser) return null;

    const commonProps = {
      currentUser,
      otherUser: getOtherUser()
    };

    switch (currentSection) {
      case 'affirmations':
        return <AffirmationsSection {...commonProps} />;
      case 'spotify':
        return <SpotifySection {...commonProps} />;
      case 'koala':
        return <KoalaSection {...commonProps} />;
      case 'heartgame':
        return <HeartGameSection {...commonProps} />;
      case 'diary':
        return <DiarySection {...commonProps} />;
      case 'dateideas':
        return <DateIdeasSection {...commonProps} />;
      default:
        return <AffirmationsSection {...commonProps} />;
    }
  };

  // Authentication flow
  if (!isAuthenticated) {
    return <PasscodeEntry onAuthenticated={handleAuthentication} />;
  }

  if (!currentUser) {
    return <UserLogin onUserLogin={handleUserLogin} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background transition-colors duration-500">
      {/* Background Animation Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {renderFloatingElements()}
      </div>

      {/* Main Content */}
      <div className="relative z-10 pb-24 pt-4">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="animate-garden-entrance"
        >
          {renderCurrentSection()}
        </motion.main>
      </div>

      {/* Theme Change Button */}
      <motion.button
        onClick={handleThemeChange}
        className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-card border-2 border-border shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.95 }}
      >
        🎨
      </motion.button>

      {/* Navigation */}
      <GardenNavigation
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        currentUser={currentUser}
      />

      {/* Notification System */}
      <NotificationSystem />
    </div>
  );
}