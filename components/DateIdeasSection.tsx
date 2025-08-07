import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin, DollarSign, Mail, Star } from 'lucide-react';
import { triggerNotification } from './NotificationSystem';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  theme: 'dark' | 'immy' | 'light';
  email: string;
}

interface DateIdea {
  id: string;
  title: string;
  description: string;
  category: 'romantic' | 'adventure' | 'cozy' | 'creative' | 'outdoor' | 'foodie';
  location: string;
  estimatedCost: 'free' | 'low' | 'medium' | 'high';
  duration: string;
  bestTime: 'morning' | 'afternoon' | 'evening' | 'anytime';
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'anytime';
  createdBy: string;
  createdByAvatar: string;
  timestamp: Date;
  rating: number;
  notes: string;
  scheduled?: Date;
  completed: boolean;
  photos: string[];
}

interface DateIdeasSectionProps {
  currentUser: UserProfile;
  otherUser: UserProfile | null;
}

export function DateIdeasSection({ currentUser, otherUser }: DateIdeasSectionProps) {
  const [dateIdeas, setDateIdeas] = useState<DateIdea[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    category: 'romantic' as DateIdea['category'],
    location: '',
    estimatedCost: 'medium' as DateIdea['estimatedCost'],
    duration: '',
    bestTime: 'anytime' as DateIdea['bestTime'],
    season: 'anytime' as DateIdea['season'],
    notes: ''
  });

  const categories = [
    { id: 'romantic', emoji: '💕', label: 'Romantic', color: 'bg-pink-100 text-pink-800' },
    { id: 'adventure', emoji: '🏞️', label: 'Adventure', color: 'bg-green-100 text-green-800' },
    { id: 'cozy', emoji: '🏠', label: 'Cozy', color: 'bg-orange-100 text-orange-800' },
    { id: 'creative', emoji: '🎨', label: 'Creative', color: 'bg-purple-100 text-purple-800' },
    { id: 'outdoor', emoji: '🌳', label: 'Outdoor', color: 'bg-blue-100 text-blue-800' },
    { id: 'foodie', emoji: '🍽️', label: 'Foodie', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const costOptions = [
    { id: 'free', emoji: '🆓', label: 'Free' },
    { id: 'low', emoji: '💰', label: '$' },
    { id: 'medium', emoji: '💰💰', label: '$$' },
    { id: 'high', emoji: '💰💰💰', label: '$$$' }
  ];

  const timeOptions = [
    { id: 'morning', emoji: '🌅', label: 'Morning' },
    { id: 'afternoon', emoji: '☀️', label: 'Afternoon' },
    { id: 'evening', emoji: '🌆', label: 'Evening' },
    { id: 'anytime', emoji: '🕐', label: 'Anytime' }
  ];

  const seasonOptions = [
    { id: 'spring', emoji: '🌸', label: 'Spring' },
    { id: 'summer', emoji: '☀️', label: 'Summer' },
    { id: 'fall', emoji: '🍂', label: 'Fall' },
    { id: 'winter', emoji: '❄️', label: 'Winter' },
    { id: 'anytime', emoji: '🌍', label: 'Anytime' }
  ];

  const sampleIdeas: Partial<DateIdea>[] = [
    {
      title: "Stargazing Picnic",
      description: "Pack a cozy blanket, some snacks, and find a quiet spot to watch the stars together.",
      category: 'romantic',
      location: "Local park or countryside",
      estimatedCost: 'low',
      duration: "2-3 hours",
      bestTime: 'evening',
      season: 'anytime'
    },
    {
      title: "Cooking Challenge",
      description: "Pick a cuisine neither of you has tried cooking and attempt to make it together!",
      category: 'creative',
      location: "Home kitchen",
      estimatedCost: 'medium',
      duration: "2-4 hours",
      bestTime: 'anytime',
      season: 'anytime'
    },
    {
      title: "Sunrise Hike",
      description: "Wake up early and hike to a beautiful viewpoint to watch the sunrise together.",
      category: 'adventure',
      location: "Local hiking trail",
      estimatedCost: 'free',
      duration: "3-4 hours",
      bestTime: 'morning',
      season: 'spring'
    }
  ];

  useEffect(() => {
    loadDateIdeas();
  }, []);

  const loadDateIdeas = () => {
    const saved = localStorage.getItem('dateIdeas');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((idea: any) => ({
          ...idea,
          timestamp: new Date(idea.timestamp),
          scheduled: idea.scheduled ? new Date(idea.scheduled) : undefined
        }));
        setDateIdeas(parsed.sort((a: DateIdea, b: DateIdea) => 
          b.timestamp.getTime() - a.timestamp.getTime()
        ));
      } catch (error) {
        console.error('Error loading date ideas:', error);
      }
    } else {
      // Add sample ideas on first load
      const initialIdeas = sampleIdeas.map((idea, index) => ({
        id: `sample-${index}`,
        ...idea,
        createdBy: 'Garden Bot',
        createdByAvatar: '🤖',
        timestamp: new Date(Date.now() - index * 86400000),
        rating: 0,
        notes: '',
        completed: false,
        photos: []
      } as DateIdea));
      setDateIdeas(initialIdeas);
    }
  };

  const saveDateIdeas = (updatedIdeas: DateIdea[]) => {
    localStorage.setItem('dateIdeas', JSON.stringify(updatedIdeas));
    setDateIdeas(updatedIdeas);
  };

  const createDateIdea = () => {
    if (!newIdea.title.trim() || !newIdea.description.trim()) return;

    const idea: DateIdea = {
      id: Date.now().toString(),
      title: newIdea.title.trim(),
      description: newIdea.description.trim(),
      category: newIdea.category,
      location: newIdea.location.trim(),
      estimatedCost: newIdea.estimatedCost,
      duration: newIdea.duration.trim(),
      bestTime: newIdea.bestTime,
      season: newIdea.season,
      createdBy: currentUser.name,
      createdByAvatar: currentUser.avatar,
      timestamp: new Date(),
      rating: 0,
      notes: newIdea.notes.trim(),
      completed: false,
      photos: []
    };

    const updated = [idea, ...dateIdeas];
    saveDateIdeas(updated);
    
    setNewIdea({
      title: '',
      description: '',
      category: 'romantic',
      location: '',
      estimatedCost: 'medium',
      duration: '',
      bestTime: 'anytime',
      season: 'anytime',
      notes: ''
    });
    setIsCreating(false);

    // Trigger notification
    if (otherUser) {
      triggerNotification({
        type: 'date',
        title: 'New Date Idea',
        message: `${currentUser.name} created a new date idea: "${idea.title}"`,
        from: currentUser.name
      });
    }
  };

  const updateRating = (id: string, rating: number) => {
    const updated = dateIdeas.map(idea => 
      idea.id === id ? { ...idea, rating } : idea
    );
    saveDateIdeas(updated);
  };

  const toggleCompleted = (id: string) => {
    const updated = dateIdeas.map(idea => 
      idea.id === id ? { ...idea, completed: !idea.completed } : idea
    );
    saveDateIdeas(updated);
  };

  const scheduleDate = (id: string, date: Date) => {
    const updated = dateIdeas.map(idea => 
      idea.id === id ? { ...idea, scheduled: date } : idea
    );
    saveDateIdeas(updated);
  };

  const shareViaEmail = (idea: DateIdea) => {
    const subject = `Date Idea: ${idea.title} 💕`;
    const body = `
Hey! I found this amazing date idea for us:

🌟 ${idea.title}
📝 ${idea.description}

📍 Location: ${idea.location || 'TBD'}
💰 Cost: ${costOptions.find(c => c.id === idea.estimatedCost)?.label}
⏰ Best Time: ${timeOptions.find(t => t.id === idea.bestTime)?.label}
🕐 Duration: ${idea.duration || 'Flexible'}
🌍 Season: ${seasonOptions.find(s => s.id === idea.season)?.label}

${idea.notes ? `Notes: ${idea.notes}` : ''}

What do you think? Let's plan this! 💕

Sent from our Enchanted Love Garden 🌹
    `.trim();

    const mailtoLink = `mailto:${otherUser?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);

    // Trigger notification
    if (otherUser) {
      triggerNotification({
        type: 'date',
        title: 'Date Idea Shared',
        message: `${currentUser.name} shared "${idea.title}" via email`,
        from: currentUser.name
      });
    }
  };

  const filteredIdeas = dateIdeas.filter(idea => 
    filterCategory === 'all' || idea.category === filterCategory
  );

  const completedCount = dateIdeas.filter(idea => idea.completed).length;
  const avgRating = dateIdeas.length > 0 
    ? dateIdeas.reduce((sum, idea) => sum + idea.rating, 0) / dateIdeas.length 
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Date Ideas 💡</h1>
        <p className="text-muted-foreground">
          Plan amazing adventures and romantic moments together
        </p>
        <div className="flex justify-center gap-2 mt-3">
          <Badge variant="secondary">{dateIdeas.length} ideas</Badge>
          <Badge variant="outline">{completedCount} completed</Badge>
          {avgRating > 0 && (
            <Badge variant="outline">
              ⭐ {avgRating.toFixed(1)} avg rating
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        <Button
          onClick={() => setFilterCategory('all')}
          variant={filterCategory === 'all' ? "default" : "outline"}
          size="sm"
        >
          🌟 All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setFilterCategory(category.id)}
            variant={filterCategory === category.id ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap"
          >
            {category.emoji} {category.label}
          </Button>
        ))}
      </motion.div>

      {/* Create New Idea */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{currentUser.avatar}</span>
              Create Date Idea
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isCreating ? (
              <Button
                onClick={() => setIsCreating(true)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              >
                ✨ New Date Idea
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Date idea title..."
                    value={newIdea.title}
                    onChange={(e) => setNewIdea(prev => ({ ...prev, title: e.target.value }))}
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Location..."
                      value={newIdea.location}
                      onChange={(e) => setNewIdea(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>

                <Textarea
                  placeholder="Describe your date idea..."
                  value={newIdea.description}
                  onChange={(e) => setNewIdea(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[100px]"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Duration (e.g., 2-3 hours)"
                      value={newIdea.duration}
                      onChange={(e) => setNewIdea(prev => ({ ...prev, duration: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <div className="flex gap-1 flex-wrap">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          onClick={() => setNewIdea(prev => ({ ...prev, category: category.id as any }))}
                          variant={newIdea.category === category.id ? "default" : "outline"}
                          size="sm"
                        >
                          {category.emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Cost
                    </label>
                    <div className="flex gap-1">
                      {costOptions.map((cost) => (
                        <Button
                          key={cost.id}
                          onClick={() => setNewIdea(prev => ({ ...prev, estimatedCost: cost.id as any }))}
                          variant={newIdea.estimatedCost === cost.id ? "default" : "outline"}
                          size="sm"
                        >
                          {cost.emoji}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Best Time</label>
                    <div className="flex gap-1 flex-wrap">
                      {timeOptions.map((time) => (
                        <Button
                          key={time.id}
                          onClick={() => setNewIdea(prev => ({ ...prev, bestTime: time.id as any }))}
                          variant={newIdea.bestTime === time.id ? "default" : "outline"}
                          size="sm"
                        >
                          {time.emoji}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Season</label>
                    <div className="flex gap-1 flex-wrap">
                      {seasonOptions.map((season) => (
                        <Button
                          key={season.id}
                          onClick={() => setNewIdea(prev => ({ ...prev, season: season.id as any }))}
                          variant={newIdea.season === season.id ? "default" : "outline"}
                          size="sm"
                        >
                          {season.emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <Textarea
                  placeholder="Additional notes or special instructions..."
                  value={newIdea.notes}
                  onChange={(e) => setNewIdea(prev => ({ ...prev, notes: e.target.value }))}
                  className="min-h-[80px]"
                />

                <div className="flex gap-2">
                  <Button
                    onClick={createDateIdea}
                    disabled={!newIdea.title.trim() || !newIdea.description.trim()}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                  >
                    Create Idea ✨
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCreating(false);
                      setNewIdea({
                        title: '',
                        description: '',
                        category: 'romantic',
                        location: '',
                        estimatedCost: 'medium',
                        duration: '',
                        bestTime: 'anytime',
                        season: 'anytime',
                        notes: ''
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

      {/* Date Ideas List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredIdeas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-xl font-medium mb-2">No date ideas yet</h3>
              <p className="text-muted-foreground">
                Create your first date idea and start planning!
              </p>
            </motion.div>
          ) : (
            filteredIdeas.map((idea, index) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                layout
              >
                <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${
                  idea.completed ? 'bg-green-50 border-green-200' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={categories.find(c => c.id === idea.category)?.color}>
                            {categories.find(c => c.id === idea.category)?.emoji} {categories.find(c => c.id === idea.category)?.label}
                          </Badge>
                          {idea.completed && (
                            <Badge className="bg-green-100 text-green-800">
                              ✅ Completed
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          {idea.title}
                          {idea.scheduled && (
                            <Badge variant="outline" className="text-xs">
                              📅 Scheduled
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>{idea.createdByAvatar}</span>
                          <span>{idea.createdBy}</span>
                          <span>•</span>
                          <span>{idea.timestamp.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Rating */}
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => updateRating(idea.id, star)}
                              className="text-lg hover:scale-110 transition-transform"
                            >
                              {star <= idea.rating ? '⭐' : '☆'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-foreground leading-relaxed mb-4">
                      {idea.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      {idea.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="truncate">{idea.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>{costOptions.find(c => c.id === idea.estimatedCost)?.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{idea.duration || 'Flexible'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {timeOptions.find(t => t.id === idea.bestTime)?.emoji}
                        <span>{timeOptions.find(t => t.id === idea.bestTime)?.label}</span>
                      </div>
                    </div>

                    {idea.notes && (
                      <div className="p-3 bg-muted/50 rounded-lg mb-4">
                        <p className="text-sm text-muted-foreground italic">{idea.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => toggleCompleted(idea.id)}
                          variant={idea.completed ? "default" : "outline"}
                          size="sm"
                        >
                          {idea.completed ? '✅ Done' : '📝 Mark Done'}
                        </Button>
                        
                        <Button
                          onClick={() => shareViaEmail(idea)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Mail className="w-4 h-4" />
                          Share
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        {seasonOptions.find(s => s.id === idea.season)?.emoji}
                        <span className="text-sm text-muted-foreground">
                          {seasonOptions.find(s => s.id === idea.season)?.label}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Floating elements */}
      <div className="fixed inset-0 pointer-events-none">
        {['💡', '💕', '🌟', '📅', '✨'].map((element, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${12 + i * 18}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 3.5 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.6,
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