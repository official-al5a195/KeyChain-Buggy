import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Calendar, Heart, Image, MapPin } from 'lucide-react';
import { triggerNotification } from './NotificationSystem';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  theme: 'dark' | 'immy' | 'light';
  email: string;
}

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  timestamp: Date;
  photos: string[];
  location?: string;
  mood: 'happy' | 'love' | 'excited' | 'peaceful' | 'grateful' | 'nostalgic';
  tags: string[];
  hearts: number;
  loved: boolean;
}

interface DiarySectionProps {
  currentUser: UserProfile;
  otherUser: UserProfile | null;
}

export function DiarySection({ currentUser, otherUser }: DiarySectionProps) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'mine' | 'theirs'>('all');
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    location: '',
    mood: 'happy' as DiaryEntry['mood'],
    tags: '',
    photos: [] as string[]
  });

  const moodOptions = [
    { id: 'happy', emoji: '😊', label: 'Happy' },
    { id: 'love', emoji: '💕', label: 'In Love' },
    { id: 'excited', emoji: '🎉', label: 'Excited' },
    { id: 'peaceful', emoji: '😌', label: 'Peaceful' },
    { id: 'grateful', emoji: '🙏', label: 'Grateful' },
    { id: 'nostalgic', emoji: '🌅', label: 'Nostalgic' }
  ];

  const prompts = [
    "What made you smile today?",
    "Describe a perfect moment you shared together...",
    "What are you grateful for right now?",
    "Write about a memory that makes your heart flutter...",
    "What's something small that brought you joy today?",
    "Describe the way they make you feel...",
    "What's a dream you have for your future together?",
    "Write about a place that's special to both of you...",
  ];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const saved = localStorage.getItem('diaryEntries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        setEntries(parsed.sort((a: DiaryEntry, b: DiaryEntry) => 
          b.timestamp.getTime() - a.timestamp.getTime()
        ));
      } catch (error) {
        console.error('Error loading diary entries:', error);
      }
    }
  };

  const saveEntries = (updatedEntries: DiaryEntry[]) => {
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
    setEntries(updatedEntries);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // In a real app, you would upload to a server
    // For demo purposes, we'll use data URLs
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setNewEntry(prev => ({
          ...prev,
          photos: [...prev.photos, dataUrl]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setNewEntry(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const submitEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;

    const entry: DiaryEntry = {
      id: Date.now().toString(),
      title: newEntry.title.trim(),
      content: newEntry.content.trim(),
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      timestamp: new Date(),
      photos: newEntry.photos,
      location: newEntry.location.trim() || undefined,
      mood: newEntry.mood,
      tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      hearts: 0,
      loved: false
    };

    const updated = [entry, ...entries];
    saveEntries(updated);
    
    setNewEntry({
      title: '',
      content: '',
      location: '',
      mood: 'happy',
      tags: '',
      photos: []
    });
    setIsWriting(false);

    // Trigger notification
    if (otherUser) {
      triggerNotification({
        type: 'diary',
        title: 'New Diary Entry',
        message: `${currentUser.name} wrote a new diary entry: "${entry.title}"`,
        from: currentUser.name
      });
    }
  };

  const toggleLove = (id: string) => {
    const updated = entries.map(entry => {
      if (entry.id === id) {
        const newLoved = !entry.loved;
        return {
          ...entry,
          loved: newLoved,
          hearts: newLoved ? entry.hearts + 1 : Math.max(0, entry.hearts - 1)
        };
      }
      return entry;
    });
    saveEntries(updated);
  };

  const getRandomPrompt = () => {
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const filteredEntries = entries.filter(entry => {
    if (viewMode === 'mine') return entry.author === currentUser.name;
    if (viewMode === 'theirs') return entry.author !== currentUser.name;
    return true;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'just now';
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
        <h1 className="text-3xl font-bold mb-2">Love Diary 📖</h1>
        <p className="text-muted-foreground">
          Capture and share your precious memories together
        </p>
        <div className="flex justify-center gap-2 mt-3">
          <Badge variant="secondary">{entries.length} entries</Badge>
          <Badge variant="outline">{entries.reduce((sum, e) => sum + e.hearts, 0)} hearts</Badge>
        </div>
      </motion.div>

      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center gap-2"
      >
        {[
          { id: 'all', label: 'All Entries', emoji: '📚' },
          { id: 'mine', label: 'My Entries', emoji: currentUser.avatar },
          { id: 'theirs', label: `${otherUser?.name || 'Their'} Entries`, emoji: otherUser?.avatar || '💕' }
        ].map((option) => (
          <Button
            key={option.id}
            onClick={() => setViewMode(option.id as any)}
            variant={viewMode === option.id ? "default" : "outline"}
            size="sm"
          >
            {option.emoji} {option.label}
          </Button>
        ))}
      </motion.div>

      {/* Write New Entry */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{currentUser.avatar}</span>
              Write a Memory
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isWriting ? (
              <div className="space-y-3">
                <Button
                  onClick={() => setIsWriting(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  ✍️ New Entry
                </Button>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Need inspiration?</p>
                  <Button
                    onClick={() => {
                      setNewEntry(prev => ({ ...prev, content: getRandomPrompt() }));
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
                <div className="space-y-3">
                  <Input
                    placeholder="Entry title..."
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    autoFocus
                  />
                  
                  <Textarea
                    placeholder="Write your memory here..."
                    value={newEntry.content}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-[120px] resize-none"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Location (optional)"
                        value={newEntry.location}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, location: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                    
                    <Input
                      placeholder="Tags (comma separated)"
                      value={newEntry.tags}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>

                  {/* Mood Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mood</label>
                    <div className="flex gap-2 flex-wrap">
                      {moodOptions.map((mood) => (
                        <Button
                          key={mood.id}
                          onClick={() => setNewEntry(prev => ({ ...prev, mood: mood.id as any }))}
                          variant={newEntry.mood === mood.id ? "default" : "outline"}
                          size="sm"
                        >
                          {mood.emoji} {mood.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Photos
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="text-sm text-muted-foreground file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-muted file:text-muted-foreground hover:file:bg-muted/80"
                    />
                    
                    {newEntry.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {newEntry.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={photo}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-20 object-cover rounded-md"
                            />
                            <Button
                              onClick={() => removePhoto(index)}
                              variant="destructive"
                              size="sm"
                              className="absolute -top-1 -right-1 w-6 h-6 p-0 rounded-full"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={submitEntry}
                    disabled={!newEntry.title.trim() || !newEntry.content.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    Save Memory 💾
                  </Button>
                  <Button
                    onClick={() => {
                      setIsWriting(false);
                      setNewEntry({
                        title: '',
                        content: '',
                        location: '',
                        mood: 'happy',
                        tags: '',
                        photos: []
                      });
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

      {/* Diary Entries */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredEntries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-medium mb-2">No entries yet</h3>
              <p className="text-muted-foreground">
                Start writing your love story!
              </p>
            </motion.div>
          ) : (
            filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                layout
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="bg-muted/30">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{entry.authorAvatar}</span>
                        <div>
                          <CardTitle className="text-xl">{entry.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(entry.timestamp)}</span>
                            <span>•</span>
                            <span>{formatTime(entry.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {moodOptions.find(m => m.id === entry.mood)?.emoji}
                        </span>
                        <Badge variant="secondary">
                          {entry.author}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <p className="text-foreground leading-relaxed mb-4 whitespace-pre-wrap">
                      {entry.content}
                    </p>

                    {/* Location */}
                    {entry.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{entry.location}</span>
                      </div>
                    )}

                    {/* Photos */}
                    {entry.photos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        {entry.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Memory ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => {
                              // In a real app, you would open a lightbox
                              window.open(photo, '_blank');
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    {entry.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-4">
                        {entry.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <motion.button
                        onClick={() => toggleLove(entry.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                          entry.loved
                            ? 'bg-red-100 text-red-600 border border-red-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.span
                          animate={entry.loved ? { scale: [1, 1.3, 1] } : {}}
                          transition={{ duration: 0.3 }}
                          className="text-lg"
                        >
                          {entry.loved ? '❤️' : '🤍'}
                        </motion.span>
                        <span className="text-sm font-medium">{entry.hearts}</span>
                      </motion.button>

                      <div className="text-xs text-muted-foreground">
                        {moodOptions.find(m => m.id === entry.mood)?.label}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Floating diary elements */}
      <div className="fixed inset-0 pointer-events-none">
        {['📖', '✍️', '💕', '📝', '🌸'].map((element, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${15 + i * 17}%`,
              top: `${25 + i * 12}%`,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 8, -8, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
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