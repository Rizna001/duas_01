import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const NOTIFICATION_SOUNDS = [
  { id: 'adhan', name: 'Adhan', emoji: '🕌' },
  { id: 'bell', name: 'Bell', emoji: '🔔' },
  { id: 'chime', name: 'Chime', emoji: '🎵' },
  { id: 'gentle', name: 'Gentle', emoji: '🎶' },
  { id: 'none', name: 'No Sound', emoji: '🔇' },
];

export type ReminderDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type ReminderFrequency = 'daily' | 'weekly';

export interface CustomReminder {
  id: string;
  duaId: string;
  duaTitle: string;
  duaArabic: string;
  times: number;
  frequency: ReminderFrequency;
  time: string;
  days: ReminderDay[];
  sound: string;
  enabled: boolean;
  lastTriggered: string | null;
}

interface NotificationsContextType {
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  notificationTime: string;
  setNotificationTime: (time: string) => void;
  notificationSound: string;
  setNotificationSound: (sound: string) => void;
  lastNotification: string | null;
  requestPermission: () => Promise<boolean>;
  playSound: (soundId?: string) => void;
  customReminders: CustomReminder[];
  addReminder: (reminder: Omit<CustomReminder, 'id' | 'lastTriggered'>) => Promise<boolean>;
  removeReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  updateReminder: (id: string, updates: Partial<CustomReminder>) => void;
  sounds: typeof NOTIFICATION_SOUNDS;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Generate sound using Web Audio API
function generateTone(type: string, duration: number = 1) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    
    if (type === 'adhan') {
      // Adhan-like melody
      const notes = [440, 494, 523, 587, 523, 494, 440];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.3 + 0.28);
        osc.start(ctx.currentTime + i * 0.3);
        osc.stop(ctx.currentTime + i * 0.3 + 0.3);
      });
    } else if (type === 'bell') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = 'triangle';
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } else if (type === 'chime') {
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.2 + 0.4);
        osc.start(ctx.currentTime + i * 0.2);
        osc.stop(ctx.currentTime + i * 0.2 + 0.5);
      });
    } else if (type === 'gentle') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 350;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration * 1.5);
      osc.start();
      osc.stop(ctx.currentTime + duration * 1.5);
    }
  } catch (e) {
    console.log('Audio not supported');
  }
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('notificationsEnabled') === 'true';
    }
    return false;
  });

  const [notificationTime, setNotificationTimeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('notificationTime') || '08:00';
    }
    return '08:00';
  });

  const [notificationSound, setNotificationSoundState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('notificationSound') || 'adhan';
    }
    return 'adhan';
  });

  const [lastNotification, setLastNotification] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastNotification');
    }
    return null;
  });

  const [customReminders, setCustomReminders] = useState<CustomReminder[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customReminders');
      if (!saved) return [];

      const reminders = JSON.parse(saved) as Array<Omit<CustomReminder, 'frequency'> & { frequency: string }>;
      const today = new Date().toDateString();
      return reminders.map(reminder => ({
        ...reminder,
        frequency: reminder.frequency === 'specific_days' || reminder.frequency === 'custom'
          ? 'weekly'
          : reminder.frequency === 'weekly' && reminder.days.length === 0
            ? 'daily'
            : reminder.frequency === 'weekly'
              ? 'weekly'
              : 'daily',
        lastTriggered: reminder.lastTriggered === today
          ? `${today}|${reminder.time}`
          : reminder.lastTriggered,
      }));
    }
    return [];
  });

  useEffect(() => { localStorage.setItem('notificationsEnabled', String(notificationsEnabled)); }, [notificationsEnabled]);
  useEffect(() => { localStorage.setItem('notificationTime', notificationTime); }, [notificationTime]);
  useEffect(() => { localStorage.setItem('notificationSound', notificationSound); }, [notificationSound]);
  useEffect(() => { if (lastNotification) localStorage.setItem('lastNotification', lastNotification); }, [lastNotification]);
  useEffect(() => { localStorage.setItem('customReminders', JSON.stringify(customReminders)); }, [customReminders]);

  useEffect(() => {
    const hasEnabledReminders = customReminders.some(reminder => reminder.enabled);
    if (!notificationsEnabled && !hasEnabledReminders) return;

    const checkNotification = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const today = now.toDateString();
      if (notificationsEnabled && currentTime === notificationTime && lastNotification !== today) {
        sendDailyNotification();
        setLastNotification(today);
      }

      if ('Notification' in window && Notification.permission === 'granted') {
        const dayNames: ReminderDay[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const currentDay = dayNames[now.getDay()];
        const triggerKey = `${today}|${currentTime}`;
        const triggeredIds = new Set<string>();

        for (const reminder of customReminders) {
          if (!reminder.enabled || reminder.time !== currentTime || reminder.lastTriggered === triggerKey) continue;
          if (reminder.frequency === 'weekly' && !reminder.days.includes(currentDay)) continue;

          showNotification(
            reminder.duaTitle,
            reminder.duaArabic.substring(0, 100),
            '🤲',
            `reminder-${reminder.id}`,
          );
          if (reminder.sound !== 'none') playSound(reminder.sound);
          triggeredIds.add(reminder.id);
        }

        if (triggeredIds.size > 0) {
          setCustomReminders(prev => prev.map(reminder =>
            triggeredIds.has(reminder.id)
              ? { ...reminder, lastTriggered: triggerKey }
              : reminder,
          ));
        }
      }
    };

    checkNotification();
    const interval = setInterval(checkNotification, 30000);
    return () => clearInterval(interval);
  }, [notificationsEnabled, notificationTime, lastNotification, customReminders, notificationSound]);

  const playSound = (soundId?: string) => {
    const sound = soundId || notificationSound;
    if (sound !== 'none') {
      generateTone(sound);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestPermission();
      if (granted) {
        setNotificationsEnabled(true);
        showNotification('Notifications Enabled', 'You will receive daily duas at your scheduled time.', '🔔');
        playSound();
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const setNotificationTime = (time: string) => {
    setNotificationTimeState(time);
    if (notificationsEnabled) {
      showNotification('Time Updated', `Daily duas will be sent at ${time}`, '⏰');
    }
  };

  const setNotificationSound = (sound: string) => {
    setNotificationSoundState(sound);
    if (sound !== 'none') {
      generateTone(sound);
    }
  };

  const addReminder = async (reminder: Omit<CustomReminder, 'id' | 'lastTriggered'>): Promise<boolean> => {
    if (!await requestPermission()) return false;

    const newReminder: CustomReminder = {
      ...reminder,
      id: `reminder-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      lastTriggered: null,
    };
    setCustomReminders(prev => [...prev, newReminder]);
    return true;
  };

  const removeReminder = (id: string) => {
    setCustomReminders(prev => prev.filter(r => r.id !== id));
  };

  const toggleReminder = (id: string) => {
    setCustomReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const updateReminder = (id: string, updates: Partial<CustomReminder>) => {
    setCustomReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const sendDailyNotification = () => {
    const duas = [
      { title: 'Morning Remembrance', text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ' },
      { title: 'Seeking Forgiveness', text: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي' },
      { title: 'Protection', text: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ' },
      { title: 'Guidance', text: 'رَبِّ زِدْنِي عِلْمًا' },
      { title: 'Gratitude', text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ' },
    ];
    const randomDua = duas[Math.floor(Math.random() * duas.length)];
    showNotification(`Daily Dua: ${randomDua.title}`, randomDua.text, '🤲');
    if (notificationSound !== 'none') playSound();
  };

  const showNotification = (title: string, body: string, icon: string = '🤲', tag = 'daily-dua') => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${icon} ${title}`, { body, tag, requireInteraction: false });
    }
  };

  return (
    <NotificationsContext.Provider value={{
      notificationsEnabled, toggleNotifications, notificationTime, setNotificationTime,
      notificationSound, setNotificationSound, lastNotification, requestPermission,
      playSound, customReminders, addReminder, removeReminder, toggleReminder, updateReminder,
      sounds: NOTIFICATION_SOUNDS,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error('useNotifications must be used within NotificationsProvider');
  return context;
}

export { NOTIFICATION_SOUNDS };
