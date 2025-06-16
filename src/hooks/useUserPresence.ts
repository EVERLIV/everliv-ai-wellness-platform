
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserPresence {
  user_id: string;
  user_name?: string;
  online_at: string;
  status?: 'online' | 'typing' | 'away';
}

export const useUserPresence = (roomId: string) => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [myPresence, setMyPresence] = useState<UserPresence | null>(null);

  useEffect(() => {
    if (!user || !roomId) return;

    const channel = supabase.channel(`presence_${roomId}`);

    // Set up presence tracking
    const userStatus: UserPresence = {
      user_id: user.id,
      user_name: user.email,
      online_at: new Date().toISOString(),
      status: 'online'
    };

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users: UserPresence[] = [];
        
        Object.keys(newState).forEach(key => {
          const presences = newState[key] as any[];
          if (presences.length > 0) {
            // Extract the actual presence data from the first presence object
            const presence = presences[0];
            if (presence.user_id && presence.online_at) {
              users.push(presence as UserPresence);
            }
          }
        });
        
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const presenceTrackStatus = await channel.track(userStatus);
          setMyPresence(userStatus);
          console.log('Presence tracking status:', presenceTrackStatus);
        }
      });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [user, roomId]);

  const updatePresence = async (updates: Partial<UserPresence>) => {
    if (!myPresence) return;
    
    const updatedPresence = { ...myPresence, ...updates };
    setMyPresence(updatedPresence);
    
    const channel = supabase.channel(`presence_${roomId}`);
    await channel.track(updatedPresence);
  };

  return {
    onlineUsers,
    myPresence,
    updatePresence,
    isOnline: onlineUsers.length > 0
  };
};
