import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface Notification {
  id: string;
  type: 'affirmation' | 'diary' | 'date' | 'heart' | 'koala' | 'music';
  title: string;
  message: string;
  timestamp: Date;
  from: string;
  read: boolean;
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('gardenNotifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(parsed);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }

    // Listen for new notifications
    const handleNewNotification = (event: CustomEvent) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        ...event.detail,
        timestamp: new Date(),
        read: false
      };
      
      setNotifications(prev => {
        const updated = [newNotification, ...prev].slice(0, 20); // Keep last 20 notifications
        localStorage.setItem('gardenNotifications', JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener('gardenNotification' as any, handleNewNotification);
    
    return () => {
      window.removeEventListener('gardenNotification' as any, handleNewNotification);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('gardenNotifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('gardenNotifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('gardenNotifications');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'affirmation': return '💌';
      case 'diary': return '📖';
      case 'date': return '💡';
      case 'heart': return '💖';
      case 'koala': return '🐨';
      case 'music': return '🎵';
      default: return '💕';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'affirmation': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'diary': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'date': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'heart': return 'bg-red-100 text-red-800 border-red-200';
      case 'koala': return 'bg-green-100 text-green-800 border-green-200';
      case 'music': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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

  const handleEmailNotification = (notification: Notification) => {
    const subject = `${notification.title} - Enchanted Love Garden`;
    const body = `${notification.message}\n\nSent from your Enchanted Love Garden 💕\nTime: ${notification.timestamp.toLocaleString()}`;
    
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  return (
    <>
      {/* Notification Bell */}
      {unreadCount > 0 && (
        <motion.button
          onClick={() => setShowNotifications(true)}
          className="fixed top-4 left-4 z-50 bg-card border-2 border-border rounded-full p-3 shadow-lg hover:scale-110 transition-transform duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.5 }}
        >
          <div className="relative">
            <span className="text-xl">🔔</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          </div>
        </motion.button>
      )}

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotifications && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowNotifications(false)}
            />
            
            {/* Notification Panel */}
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed left-4 top-4 bottom-4 w-80 bg-card border border-border rounded-lg shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg">Garden Messages</h3>
                  <Button
                    onClick={() => setShowNotifications(false)}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    ✕
                  </Button>
                </div>
                
                {notifications.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={markAllAsRead}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Mark all read
                    </Button>
                    <Button
                      onClick={clearNotifications}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </div>

              <div className="overflow-y-auto h-full pb-20">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <div className="text-4xl mb-4">💕</div>
                    <p>No messages yet</p>
                    <p className="text-sm mt-1">Your garden notifications will appear here</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            !notification.read ? 'border-primary/50 bg-primary/5' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="text-xl">{getNotificationIcon(notification.type)}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getNotificationColor(notification.type)}`}
                                  >
                                    {notification.type}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTime(notification.timestamp)}
                                  </span>
                                </div>
                                <h4 className="font-medium text-sm text-foreground mb-1">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  From: {notification.from}
                                </p>
                                
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEmailNotification(notification);
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                  >
                                    📧 Email
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Helper function to trigger notifications from other components
export const triggerNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
  const event = new CustomEvent('gardenNotification', { detail: notification });
  window.dispatchEvent(event);
};