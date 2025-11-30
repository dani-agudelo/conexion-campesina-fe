import { create } from 'zustand';

export const useNotifications = create((set) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  
  addNotification: (notification) => set((state) => {
    const newNotification = {
      ...notification,
      id: notification.id || Date.now().toString(),
      timestamp: notification.timestamp || new Date().toISOString(),
      read: false,
    };
    
    return {
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    };
  }),
  
  markAsRead: (notificationId) => set((state) => {
    const updated = state.notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    
    const newUnreadCount = updated.filter((notif) => !notif.read).length;
    
    return {
      notifications: updated,
      unreadCount: newUnreadCount,
    };
  }),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
    unreadCount: 0,
  })),
  
  clearNotifications: () => set({
    notifications: [],
    unreadCount: 0,
  }),
  
  setConnected: (isConnected) => set({ isConnected }),
}));

