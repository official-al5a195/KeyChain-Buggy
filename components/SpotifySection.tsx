import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { triggerNotification } from './NotificationSystem';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  theme: 'dark' | 'immy' | 'light';
  email: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  addedBy: string;
  addedByAvatar: string;
  timestamp: Date;
  loved: boolean;
  genre: string;
  mood: 'happy' | 'romantic' | 'chill' | 'energetic' | 'nostalgic';
}

interface SpotifySectionProps {
  currentUser: UserProfile;
  otherUser: UserProfile | null;
}

export function SpotifySection({ currentUser, otherUser }: SpotifySectionProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [newSong, setNewSong] = useState({ title: '', artist: '', genre: '', mood: 'romantic' as Song['mood'] });
  const [isAddingSong, setIsAddingSong] = useState(false);

  const moodEmojis = {
    happy: '😊',
    romantic: '💕',
    chill: '😌',
    energetic: '⚡',
    nostalgic: '🌅'
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = () => {
    const saved = localStorage.getItem('gardenPlaylistUs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((s: any) => ({
          ...s,
          timestamp: new Date(s.timestamp)
        }));
        setSongs(parsed);
      } catch (error) {
        console.error('Error loading songs:', error);
        setSongs([]);
      }
    } else {
      setSongs([]);
    }
  };

  const saveSongs = (updatedSongs: Song[]) => {
    localStorage.setItem('gardenPlaylistUs', JSON.stringify(updatedSongs));
    setSongs(updatedSongs);
  };

  const addSong = () => {
    if (!newSong.title.trim() || !newSong.artist.trim()) return;

    const song: Song = {
      id: Date.now().toString(),
      title: newSong.title.trim(),
      artist: newSong.artist.trim(),
      addedBy: currentUser.name,
      addedByAvatar: currentUser.avatar,
      timestamp: new Date(),
      loved: false,
      genre: newSong.genre.trim() || 'Unknown',
      mood: newSong.mood
    };

    const updatedSongs = [song, ...songs];
    saveSongs(updatedSongs);
    setNewSong({ title: '', artist: '', genre: '', mood: 'romantic' });
    setIsAddingSong(false);

    // Trigger notification
    if (otherUser) {
      triggerNotification({
        type: 'music',
        title: 'New Song Added',
        message: `${currentUser.name} added "${song.title}" by ${song.artist} to Us`,
        from: currentUser.name
      });
    }
  };

  const toggleLove = (songId: string) => {
    const updatedSongs = songs.map(song => 
      song.id === songId ? { ...song, loved: !song.loved } : song
    );
    saveSongs(updatedSongs);
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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Our Playlist 🎵</h1>
        <p className="text-muted-foreground">
          Share the soundtrack of your love story
        </p>
        <div className="flex justify-center gap-4 mt-3">
          <Badge variant="secondary">{songs.length} songs</Badge>
          <Badge variant="secondary">💕 Us</Badge>
        </div>
      </motion.div>

      {/* Add Song Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💕</span>
              Add to Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isAddingSong ? (
              <Button
                onClick={() => setIsAddingSong(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                🎵 Add a Song
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Song title..."
                    value={newSong.title}
                    onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                    autoFocus
                  />
                  <Input
                    placeholder="Artist name..."
                    value={newSong.artist}
                    onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Genre (optional)..."
                    value={newSong.genre}
                    onChange={(e) => setNewSong({ ...newSong, genre: e.target.value })}
                  />
                  <div className="flex gap-2">
                    {Object.entries(moodEmojis).map(([mood, emoji]) => (
                      <Button
                        key={mood}
                        onClick={() => setNewSong({ ...newSong, mood: mood as Song['mood'] })}
                        variant={newSong.mood === mood ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={addSong}
                    disabled={!newSong.title.trim() || !newSong.artist.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    Add Song 🎶
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAddingSong(false);
                      setNewSong({ title: '', artist: '', genre: '', mood: 'romantic' });
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Single Playlist Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="ring-2 ring-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-3xl">💕</span>
              <div>
                <h2>Us</h2>
                <p className="text-sm text-muted-foreground font-normal">
                  Songs that remind us of each other
                </p>
                <Badge variant="secondary" className="mt-1">
                  {songs.length} songs
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {songs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🎵</div>
                <h3 className="font-medium mb-2">No songs yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your first song to start building your shared playlist!
                </p>
                <Button
                  onClick={() => setIsAddingSong(true)}
                  variant="outline"
                  size="sm"
                >
                  Add Your First Song
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                <AnimatePresence>
                  {songs.map((song, index) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ delay: index * 0.03 }}
                      layout
                    >
                      <div className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors duration-200 group">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium truncate">{song.title}</h4>
                              <span className="text-lg flex-shrink-0">{moodEmojis[song.mood]}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate mb-2">
                              by {song.artist}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs px-2 py-0">
                                {song.genre}
                              </Badge>
                              <span>•</span>
                              <span className="truncate">{song.addedByAvatar} {song.addedBy}</span>
                              <span>•</span>
                              <span>{formatTime(song.timestamp)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <motion.button
                              onClick={() => toggleLove(song.id)}
                              className={`p-2 rounded-full transition-colors duration-200 ${
                                song.loved
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100'
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <motion.span
                                animate={song.loved ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 0.3 }}
                                className="text-base"
                              >
                                {song.loved ? '❤️' : '🤍'}
                              </motion.span>
                            </motion.button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity p-2 h-auto"
                            >
                              <span className="text-base">▶️</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Floating music notes */}
      <div className="fixed inset-0 pointer-events-none">
        {['🎵', '🎶', '🎼', '🎤', '🎧'].map((note, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          >
            {note}
          </motion.div>
        ))}
      </div>
    </div>
  );
}