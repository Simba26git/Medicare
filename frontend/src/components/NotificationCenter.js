import React, { useState, useEffect } from 'react';
import apiService from '../utils/api';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await apiService.getNotifications();
      if (response.success) {
        setNotifications(response.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await apiService.markNotificationAsRead(notificationId);
      if (response.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, read: true }
              : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await apiService.deleteNotification(notificationId);
      if (response.success) {
        setNotifications(prev => 
          prev.filter(notif => notif.id !== notificationId)
        );
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reminder': return '⏰';
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return '📢';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5a50.38 50.38 0 00-.1-3.967C16.4 4.8 12.6 1.4 8.2 1.1a7.94 7.94 0 00-4.3.9c-2.4 1.3-4 3.7-4.3 6.4-.2 2.1.4 4.1 1.6 5.8L5 17h5m5 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex space-x-1">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                              title="Mark as read"
                            >
                              ✓
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button
                onClick={() => {
                  // Mark all as read
                  notifications.forEach(notif => {
                    if (!notif.read) {
                      markAsRead(notif.id);
                    }
                  });
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
