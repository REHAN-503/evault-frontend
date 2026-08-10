import { USE_MOCK } from './client';
// import * as liveNotifications from './live/notifications'; // To be added by backend team
import * as mockNotifications from './mock/notifications';

const notifications = USE_MOCK ? mockNotifications : {}; // Fallback to {} for live until implemented

export const getUserNotifications = notifications.getUserNotifications;
export const markAsRead = notifications.markAsRead;
export const markAllAsRead = notifications.markAllAsRead;
