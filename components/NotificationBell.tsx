'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Trash2, Settings, MoreHorizontal } from 'lucide-react';
import { useNotifications, Notification } from '../contexts/NotificationContext';
import { useTranslation } from '../hooks/useTranslation';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAllNotifications } = useNotifications();
  const t = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'progress': return '📈';
      case 'social': return '👥';
      case 'system': return '⚡';
      case 'reminder': return '⏰';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'text-yellow-400';
      case 'progress': return 'text-blue-400';
      case 'social': return 'text-green-400';
      case 'system': return 'text-purple-400';
      case 'reminder': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/70 hover:text-white transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl z-50">
          {/* Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
                  className="text-xs px-2 py-1 bg-white/20 rounded text-white hover:bg-white/30 transition-colors"
                >
                  {filter === 'all' ? 'All' : 'Unread'}
                </button>
                <button
                  onClick={markAllAsRead}
                  className="text-xs px-2 py-1 bg-blue-600 rounded text-white hover:bg-blue-700 transition-colors"
                >
                  Mark all read
                </button>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <div className="text-sm text-white/70">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center text-white/70">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors ${
                    !notification.read ? 'bg-blue-500/10' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">
                      {notification.icon || getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${getNotificationColor(notification.type)}`}>
                            {notification.title}
                          </h4>
                          <p className="text-xs text-white/70 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-white/50">
                              {formatTime(notification.timestamp)}
                            </span>
                            {notification.priority === 'high' && (
                              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                                High Priority
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-white/50 hover:text-green-400 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="p-1 text-white/50 hover:text-red-400 transition-colors"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-white/20">
              <div className="flex items-center justify-between">
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear all</span>
                </button>
                <button className="text-xs text-white/70 hover:text-white transition-colors flex items-center space-x-1">
                  <Settings className="w-3 h-3" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
