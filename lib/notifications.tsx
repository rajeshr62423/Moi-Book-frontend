"use client";

import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, removeNotification } from "@/redux/notification/thunk";
import { useAuth } from "@/lib/auth";

/**
 * Fetches the signed-in user's notifications once auth is ready and a user
 * is present. Must be mounted inside AuthProvider.
 */
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isReady } = useAuth();
  const fetchedForUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isReady || !user) return;
    if (fetchedForUserId.current === user.id) return;
    fetchedForUserId.current = user.id;
    dispatch(fetchNotifications());
  }, [isReady, user, dispatch]);

  return <>{children}</>;
}

export function useNotifications() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, unreadCount, loading, loaded, error } = useSelector((state: RootState) => state.notification);

  const refetch = useCallback(() => dispatch(fetchNotifications()), [dispatch]);
  const markRead = useCallback((id: string) => dispatch(markNotificationRead(id)), [dispatch]);
  const markAllRead = useCallback(() => dispatch(markAllNotificationsRead()), [dispatch]);
  const remove = useCallback((id: string) => dispatch(removeNotification(id)), [dispatch]);

  return { items, unreadCount, loading, loaded, error, refetch, markRead, markAllRead, remove };
}
