import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { triggerNotification } from './NotificationSystem';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  theme: 'dark' | 'immy' | 'light';
  email: string;
}

interface GameElement {
  id: string;
  type: 'heart' | 'bomb' | 'star' | 'flower';
  x: number;
  y: number;
  emoji: string;
  points: number;
  speed: number;
}

interface GameStats {
  score: number;
  hearts: number;
  level: number;
  lives: number;
  streak: number;
  highScore: number;
  gamesPlayed: number;
  totalHearts: number;
}

interface HeartGameSectionProps {
  currentUser: UserProfile;
  otherUser: UserProfile | null;
}

export function HeartGameSection({ currentUser, otherUser }: HeartGameSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameElements, setGameElements] = useState<GameElement[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    hearts: 0,
    level: 1,
    lives: 3,
    streak: 0,
    highScore: 0,
    gamesPlayed: 0,
    totalHearts: 0
  });
  const [gameTime, setGameTime] = useState(0);
  const [showCombo, setShowCombo] = useState<{ text: string; points: number } | null>(null);

  const elementTypes = [
    { type: 'heart', emoji: '💖', points: 10, weight: 40 },
    { type: 'star', emoji: '⭐', points: 25, weight: 20 },
    { type: 'flower', emoji: '🌸', points: 15, weight: 25 },
    { type: 'bomb', emoji: '💣', points: -20, weight: 15 }
  ];

  useEffect(() => {
    loadGameData();
  }, []);

  useEffect(() => {
    let gameInterval: NodeJS.Timeout;
    let elementInterval: NodeJS.Timeout;
    let timeInterval: NodeJS.Timeout;

    if (isPlaying) {
      // Game loop - move elements down (faster)
      gameInterval = setInterval(() => {
        setGameElements(prev => {
          const updated = prev
            .map(element => ({ ...element, y: element.y + element.speed }))
            .filter(element => element.y < window.innerHeight + 50);
          
          // Check if any elements reached the bottom (missed)
          const missed = prev.filter(el => el.y >= window.innerHeight - 100 && el.type !== 'bomb');
          if (missed.length > 0) {
            setGameStats(stats => ({
              ...stats,
              lives: Math.max(0, stats.lives - missed.length),
              streak: 0
            }));
          }
          
          return updated;
        });
      }, 30); // Much faster movement

      // Spawn new elements (faster)
      elementInterval = setInterval(() => {
        spawnElement();
      }, 600 - (gameStats.level * 30)); // Faster spawning at higher levels

      // Game timer
      timeInterval = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(gameInterval);
      clearInterval(elementInterval);
      clearInterval(timeInterval);
    };
  }, [isPlaying, gameStats.level]);

  // Check for game over
  useEffect(() => {
    if (isPlaying && gameStats.lives <= 0) {
      endGame();
    }
  }, [gameStats.lives, isPlaying]);

  const loadGameData = () => {
    const saved = localStorage.getItem('heartGameStats');
    if (saved) {
      try {
        setGameStats(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading game data:', error);
      }
    }
  };

  const saveGameData = (stats: GameStats) => {
    localStorage.setItem('heartGameStats', JSON.stringify(stats));
    setGameStats(stats);
  };

  const spawnElement = () => {
    const totalWeight = elementTypes.reduce((sum, type) => sum + type.weight, 0);
    let random = Math.random() * totalWeight;
    
    let selectedType = elementTypes[0];
    for (const type of elementTypes) {
      if (random <= type.weight) {
        selectedType = type;
        break;
      }
      random -= type.weight;
    }

    const element: GameElement = {
      id: Date.now().toString() + Math.random(),
      type: selectedType.type as any,
      x: Math.random() * (window.innerWidth - 60),
      y: -50,
      emoji: selectedType.emoji,
      points: selectedType.points,
      speed: 4 + gameStats.level * 0.8 // Faster speed
    };

    setGameElements(prev => [...prev, element]);
  };

  const handleElementClick = (elementId: string) => {
    const element = gameElements.find(el => el.id === elementId);
    if (!element) return;

    setGameElements(prev => prev.filter(el => el.id !== elementId));

    let newStats = { ...gameStats };
    
    if (element.type === 'bomb') {
      newStats.lives = Math.max(0, newStats.lives - 1);
      newStats.streak = 0;
      showComboMessage('BOMB!', element.points);
    } else {
      newStats.score += element.points;
      newStats.streak += 1;
      
      if (element.type === 'heart') {
        newStats.hearts += 1;
        newStats.totalHearts += 1;
      }

      // Combo bonuses
      if (newStats.streak >= 5) {
        const bonus = newStats.streak * 2;
        newStats.score += bonus;
        showComboMessage(`${newStats.streak}x COMBO! +${bonus}`, bonus);
      }

      // Level up
      if (newStats.score >= newStats.level * 100) {
        newStats.level += 1;
        showComboMessage('LEVEL UP!', 0);
      }
    }

    setGameStats(newStats);
  };

  const showComboMessage = (text: string, points: number) => {
    setShowCombo({ text, points });
    setTimeout(() => setShowCombo(null), 1500);
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameElements([]);
    setGameTime(0);
    setGameStats(prev => ({
      ...prev,
      score: 0,
      hearts: 0,
      level: 1,
      lives: 3,
      streak: 0
    }));
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    
    const finalStats = {
      ...gameStats,
      gamesPlayed: gameStats.gamesPlayed + 1,
      highScore: Math.max(gameStats.highScore, gameStats.score)
    };
    
    saveGameData(finalStats);

    // Trigger notification for high score
    if (gameStats.score > gameStats.highScore && otherUser) {
      triggerNotification({
        type: 'heart',
        title: 'New High Score!',
        message: `${currentUser.name} just scored ${gameStats.score} points in Heart Hunt! 🎉`,
        from: currentUser.name
      });
    }
  }, [gameStats, currentUser, otherUser]);

  const pauseGame = () => {
    setIsPlaying(false);
  };

  const resumeGame = () => {
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 select-none">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Heart Hunt 💖</h1>
        <p className="text-muted-foreground">
          Catch the hearts and avoid the bombs!
        </p>
      </motion.div>

      {/* Game Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Game Stats</span>
              <div className="flex gap-2">
                <Badge variant="secondary">High Score: {gameStats.highScore}</Badge>
                <Badge variant="outline">Games: {gameStats.gamesPlayed}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{gameStats.score}</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-500">{gameStats.hearts}</div>
                <div className="text-sm text-muted-foreground">Hearts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{gameStats.level}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{gameStats.lives}</div>
                <div className="text-sm text-muted-foreground">Lives</div>
              </div>
            </div>
            
            {gameStats.streak > 0 && (
              <div className="mt-4 text-center">
                <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500">
                  🔥 {gameStats.streak}x Streak
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Game Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            {!isPlaying ? (
              <div className="text-center space-y-4">
                {gameStats.gamesPlayed === 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium">How to Play</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="text-3xl">💖</div>
                        <div>Hearts: +10 pts</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl">⭐</div>
                        <div>Stars: +25 pts</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl">🌸</div>
                        <div>Flowers: +15 pts</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl">💣</div>
                        <div>Bombs: -1 life</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Game Over!</h3>
                    <p className="text-muted-foreground">
                      Final Score: {gameStats.score} | Time: {formatTime(gameTime)}
                    </p>
                  </div>
                )}
                
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-8 py-3"
                  size="lg"
                >
                  {gameStats.gamesPlayed === 0 ? 'Start Playing' : 'Play Again'} 🎮
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-4 text-lg">
                  <span>⏱️ {formatTime(gameTime)}</span>
                  <span>💖 {gameStats.hearts}</span>
                  <span>⚡ Level {gameStats.level}</span>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button onClick={pauseGame} variant="outline">
                    ⏸️ Pause
                  </Button>
                  <Button onClick={endGame} variant="destructive">
                    🛑 End Game
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Game Area */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-96 bg-gradient-to-b from-sky-100 to-pink-100 dark:from-sky-900/20 dark:to-pink-900/20 rounded-lg overflow-hidden border-2 border-border"
        >
          {/* Game Elements */}
          <AnimatePresence>
            {gameElements.map((element) => (
              <motion.button
                key={element.id}
                onClick={() => handleElementClick(element.id)}
                className="absolute text-4xl hover:scale-110 transition-transform duration-100 cursor-pointer"
                style={{
                  left: element.x,
                  top: element.y,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {element.emoji}
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Combo Display */}
          <AnimatePresence>
            {showCombo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -20 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10"
              >
                <div className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                  {showCombo.text}
                  {showCombo.points !== 0 && (
                    <div className="text-sm">+{showCombo.points}</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lives Display */}
          <div className="absolute top-4 left-4 flex gap-1">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="text-2xl">
                {i < gameStats.lives ? '❤️' : '🖤'}
              </span>
            ))}
          </div>

          {/* Score Display */}
          <div className="absolute top-4 right-4">
            <Badge variant="default" className="text-lg px-3 py-1">
              {gameStats.score}
            </Badge>
          </div>
        </motion.div>
      )}

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Your Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{gameStats.highScore}</div>
                <div className="text-sm text-muted-foreground">Best Score</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-pink-600">{gameStats.totalHearts}</div>
                <div className="text-sm text-muted-foreground">Total Hearts</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{gameStats.gamesPlayed}</div>
                <div className="text-sm text-muted-foreground">Games Played</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Floating hearts background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-20"
            style={{
              left: `${10 + i * 10}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          >
            💖
          </motion.div>
        ))}
      </div>
    </div>
  );
}