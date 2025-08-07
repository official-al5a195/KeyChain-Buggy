import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface PasscodeEntryProps {
  onAuthenticated: () => void;
}

export function PasscodeEntry({ onAuthenticated }: PasscodeEntryProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passcode === '1207') {
      onAuthenticated();
    } else {
      setError('Invalid passcode. Try again.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPasscode('');
    }
  };

  // Floating hearts
  const floatingHearts = [];
  for (let i = 0; i < 12; i++) {
    const randomDelay = Math.random() * 5;
    const randomX = Math.random() * 100;
    const randomDuration = 4 + Math.random() * 2;

    floatingHearts.push(
      <motion.div
        key={`heart-${i}`}
        className="absolute text-2xl pointer-events-none select-none opacity-30"
        style={{
          left: `${randomX}%`,
          top: '100%',
        }}
        animate={{
          y: [0, -window.innerHeight - 100],
          opacity: [0, 0.6, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: randomDuration,
          delay: randomDelay,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        💕
      </motion.div>
    );
  }

  // Blooming flowers
  const bloomingFlowers = [];
  for (let i = 0; i < 20; i++) {
    const randomDelay = Math.random() * 8;
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const randomDuration = 3 + Math.random() * 2;
    const flowers = ['🌸', '🌺', '🌷', '🌻', '🌹', '💐', '🏵️'];
    const flower = flowers[Math.floor(Math.random() * flowers.length)];

    bloomingFlowers.push(
      <motion.div
        key={`flower-${i}`}
        className="absolute text-3xl pointer-events-none select-none"
        style={{
          left: `${randomX}%`,
          top: `${randomY}%`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.2, 1],
          opacity: [0, 0.8, 0.4],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: randomDuration,
          delay: randomDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {flower}
      </motion.div>
    );
  }

  // Magical fireflies
  const fireflies = [];
  for (let i = 0; i < 25; i++) {
    const randomDelay = Math.random() * 6;
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const randomDuration = 2 + Math.random() * 3;

    fireflies.push(
      <motion.div
        key={`firefly-${i}`}
        className="absolute text-sm pointer-events-none select-none"
        style={{
          left: `${randomX}%`,
          top: `${randomY}%`,
        }}
        animate={{
          x: [0, 20, -20, 10, 0],
          y: [0, -15, 15, -10, 0],
          opacity: [0.3, 1, 0.5, 1, 0.3],
          scale: [0.8, 1.2, 0.9, 1.1, 0.8],
        }}
        transition={{
          duration: randomDuration,
          delay: randomDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ✨
      </motion.div>
    );
  }

  // Floating petals
  const floatingPetals = [];
  for (let i = 0; i < 15; i++) {
    const randomDelay = Math.random() * 4;
    const randomX = Math.random() * 100;
    const randomDuration = 6 + Math.random() * 3;
    const petals = ['🌸', '🌺', '🌷'];
    const petal = petals[Math.floor(Math.random() * petals.length)];

    floatingPetals.push(
      <motion.div
        key={`petal-${i}`}
        className="absolute text-lg pointer-events-none select-none opacity-40"
        style={{
          left: `${randomX}%`,
          top: '-50px',
        }}
        animate={{
          y: [0, window.innerHeight + 100],
          x: [0, Math.sin(i) * 50],
          rotate: [0, 360],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: randomDuration,
          delay: randomDelay,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {petal}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background animations */}
      <div className="fixed inset-0 pointer-events-none">
        {floatingHearts}
        {bloomingFlowers}
        {fireflies}
        {floatingPetals}
      </div>

      {/* Enhanced decorative elements */}
      <motion.div 
        className="absolute top-10 left-10 text-6xl opacity-20"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🌹
      </motion.div>
      
      <motion.div 
        className="absolute top-20 right-20 text-4xl opacity-30"
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        ✨
      </motion.div>
      
      <motion.div 
        className="absolute bottom-20 left-20 text-5xl opacity-25"
        animate={{ 
          x: [0, 10, -10, 0],
          y: [0, -5, 5, 0],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🦋
      </motion.div>
      
      <motion.div 
        className="absolute bottom-10 right-10 text-6xl opacity-20"
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        💖
      </motion.div>

      {/* Additional magical elements */}
      <motion.div 
        className="absolute top-1/2 left-10 text-3xl opacity-40"
        animate={{ 
          rotate: [0, 360],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        🌟
      </motion.div>
      
      <motion.div 
        className="absolute top-1/3 right-10 text-3xl opacity-40"
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🧚‍♀️
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <Card className={`w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg border-white/20 ${isShaking ? 'animate-wiggle' : ''}`}>
          <CardHeader className="text-center">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🌹
            </motion.div>
            <CardTitle className="text-2xl text-white">
              Enchanted Love Garden
            </CardTitle>
            <CardDescription className="text-pink-100">
              Enter the secret passcode to access your magical garden
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter passcode..."
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setError('');
                  }}
                  className="bg-white/10 border-white/30 text-white placeholder-pink-200 text-center text-lg"
                  maxLength={4}
                  autoFocus
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-300 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-3"
                disabled={passcode.length !== 4}
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center justify-center gap-2"
                >
                  Enter Garden 🗝️
                </motion.span>
              </Button>
            </form>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-6 text-center"
            >
              <p className="text-pink-200 text-sm">
                Hint: When love begins ✨
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}