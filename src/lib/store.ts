import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// STRICT ALIAS PATH: Connects directly to your existing src/lib/supabase.ts
import { supabase } from '@/lib/supabase';

export interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "bot";
  image?: string; // Base64 image data
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface NcmcCardInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  issuingBank: string;
  cardBalance: number;
  isLinked: boolean;
  autoTopUp: boolean;
  cardNickName?: string;
  lastSyncedAt?: number | null;
}

export interface TransitTicketRecord {
  id: string;
  category: "metro" | "bus" | "auto" | "pass";
  type: string;
  network: string;
  origin?: string;
  destination?: string;
  route?: string;
  driver?: string;
  ticketId?: string;
  fare: number;
  dateString?: string;
  timestamp: number;
  status?: "Active" | "Completed" | "Validated";
}

interface AppState {
  appLang: string;
  setAppLang: (lang: string) => void;
  userName: string;
  setUserName: (name: string) => Promise<void> | void;
  walletBalance: number;
  karmaPoints: number;
  carbonSavedGrams: number;
  isInitialized: boolean;
  currentCity: string;
  
  // Persisted local UI state
  chatMessages: ChatMessage[];
  chatSessions: ChatSession[];
  activeChatId: string | null;
  bookedRide: any | null;
  rideHistory: TransitTicketRecord[];
  addRideHistory: (item: TransitTicketRecord) => void;
  profilePictureUrl: string | null;
  
  // Settings
  privacyLiveLocation: boolean;
  privacyCamera: boolean;
  
  addMoney: (amount: number) => Promise<void>;
  deductBalance: (amount: number) => Promise<void>;
  addKarma: (points: number) => Promise<void>;
  setCurrentCity: (cityId: string) => void;
  fetchUserData: () => Promise<void>;
  
  // UI State setters
  addChatMessage: (msg: ChatMessage) => void;
  startNewChat: () => void;
  loadChatSession: (sessionId: string) => void;
  deleteChatSession: (sessionId: string) => void;
  setBookedRide: (ride: any | null) => void;
  setProfilePictureUrl: (url: string | null) => Promise<void> | void;
  setPrivacyLiveLocation: (val: boolean) => void;
  setPrivacyCamera: (val: boolean) => void;
  activePass: { name: string; boundDeviceId: string; expiry: number; lastMigratedAt: number | null } | null;
  setActivePass: (pass: any) => void;
  mockDeviceToggle: boolean;
  setMockDeviceToggle: (val: boolean) => void;
  
  // Emergency Contacts
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (contact: Omit<EmergencyContact, "id">) => void;
  removeEmergencyContact: (id: string) => void;
  updateEmergencyContact: (contact: EmergencyContact) => void;

  // Physical NCMC Card
  ncmcCard: NcmcCardInfo;
  setNcmcCard: (card: Partial<NcmcCardInfo>) => void;
  linkNcmcCard: (card: Omit<NcmcCardInfo, "isLinked">) => void;
  unlinkNcmcCard: () => void;
  topUpNcmcCard: (amount: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userName: "Guest",
      setUserName: async (name: string) => {
        set({ userName: name });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.auth.updateUser({ data: { full_name: name } });
            await supabase.from('commuter_profiles').update({ full_name: name }).eq('id', user.id);
          }
        } catch (e) {
          // unauthenticated or offline
        }
      },
      walletBalance: 0,
      karmaPoints: 0,
      carbonSavedGrams: 0,
      isInitialized: false,
      currentCity: "bengaluru",
      
      chatMessages: [],
      chatSessions: [],
      activeChatId: null,
      bookedRide: null,
      rideHistory: [
        {
          id: "NMM-849201",
          category: "metro",
          type: "Namma Metro QR Token (Purple Line)",
          network: "BMRCL Namma Metro",
          origin: "Indiranagar",
          destination: "Kempegowda Station (Majestic)",
          route: "Indiranagar ➔ Majestic (9 Stations)",
          ticketId: "NMM-849201",
          fare: 30,
          dateString: "Today, 09:15 AM",
          timestamp: Date.now() - 7200000,
          status: "Completed"
        },
        {
          id: "BMTC-402B-89",
          category: "bus",
          type: "BMTC Express Ticket (Route 402-B)",
          network: "BMTC Bengaluru",
          origin: "Yelahanka Satellite Town",
          destination: "Kempegowda Bus Station (Platform 22)",
          route: "Route 402-B Express Corridor",
          ticketId: "BMTC-402B-89",
          fare: 25,
          dateString: "Yesterday, 05:45 PM",
          timestamp: Date.now() - 54000000,
          status: "Completed"
        },
        {
          id: "ONDC-194028",
          category: "auto",
          type: "Namma Yatri Auto (Zero Surge)",
          network: "ONDC Beckn Open Network",
          origin: "Yelahanka NES Office",
          destination: "Yelahanka Junction Railway Station",
          route: "NES Office ➔ Yelahanka Junction",
          driver: "Manjunath S. (KA-04-AB-4819)",
          ticketId: "PIN: 8492",
          fare: 45,
          dateString: "Yesterday, 02:20 PM",
          timestamp: Date.now() - 68000000,
          status: "Completed"
        }
      ],
      profilePictureUrl: null,
      
      privacyLiveLocation: true,
      privacyCamera: true,
      activePass: null,
      setActivePass: (pass) => set({ activePass: pass }),
      mockDeviceToggle: false,
      setMockDeviceToggle: (val) => set({ mockDeviceToggle: val }),
      appLang: "en",
      setAppLang: (lang: string) => set({ appLang: lang }),
      
      emergencyContacts: [
        { id: "default-1", name: "Family Guardian", phone: "9876543210", relation: "Family" },
        { id: "default-2", name: "Women Helpline", phone: "1091", relation: "Safety Helpline" }
      ],
      addEmergencyContact: (contact) => set((state) => ({
        emergencyContacts: [...state.emergencyContacts, { ...contact, id: Date.now().toString() }]
      })),
      removeEmergencyContact: (id) => set((state) => ({
        emergencyContacts: state.emergencyContacts.filter((c) => c.id !== id)
      })),
      updateEmergencyContact: (contact) => set((state) => ({
        emergencyContacts: state.emergencyContacts.map((c) => c.id === contact.id ? contact : c)
      })),

      // Physical NCMC Card Initial State & Actions
      ncmcCard: {
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        issuingBank: "State Bank of India (SBI)",
        cardBalance: 0,
        isLinked: false,
        autoTopUp: true,
        cardNickName: "Primary NCMC Transit Card",
        lastSyncedAt: null,
      },
      setNcmcCard: (card) => set((state) => ({
        ncmcCard: { ...state.ncmcCard, ...card }
      })),
      linkNcmcCard: (card) => set((state) => ({
        ncmcCard: { ...state.ncmcCard, ...card, isLinked: true, lastSyncedAt: Date.now() }
      })),
      unlinkNcmcCard: () => set({
        ncmcCard: {
          cardNumber: "",
          cardHolder: "",
          expiryDate: "",
          issuingBank: "State Bank of India (SBI)",
          cardBalance: 0,
          isLinked: false,
          autoTopUp: true,
          cardNickName: "Primary NCMC Transit Card",
          lastSyncedAt: null,
        }
      }),
      topUpNcmcCard: (amount) => set((state) => ({
        ncmcCard: {
          ...state.ncmcCard,
          cardBalance: Math.round((state.ncmcCard.cardBalance + amount) * 100) / 100,
          lastSyncedAt: Date.now()
        }
      })),
      
      setCurrentCity: (cityId: string) => {
        set({ currentCity: cityId });
      },

      addChatMessage: (msg: ChatMessage) => set((state) => {
        const newMessages = [...state.chatMessages, msg];
        
        const newSessions = [...state.chatSessions];
        let activeId = state.activeChatId;
        
        // If this is the first real message (not a bot welcome), generate a session
        if (!activeId && newMessages.length > 1) {
          activeId = Date.now().toString();
          // Use first user message as title, or fallback
          const userMsgs = newMessages.filter(m => m.sender === 'user');
          const title = userMsgs.length > 0 ? userMsgs[0].text.substring(0, 30) + '...' : 'New Chat';
          
          newSessions.unshift({
            id: activeId,
            title,
            updatedAt: Date.now(),
            messages: newMessages
          });
        } else if (activeId) {
          // Update existing session
          const sessionIndex = newSessions.findIndex(s => s.id === activeId);
          if (sessionIndex >= 0) {
            newSessions[sessionIndex] = {
              ...newSessions[sessionIndex],
              updatedAt: Date.now(),
              messages: newMessages
            };
            // Move to top
            const updatedSession = newSessions.splice(sessionIndex, 1)[0];
            newSessions.unshift(updatedSession);
          }
        }
        
        return { chatMessages: newMessages, chatSessions: newSessions, activeChatId: activeId };
      }),
      
      startNewChat: () => set((state) => ({
        activeChatId: null,
        chatMessages: [{
          id: Date.now(),
          text: `Namaskara! 🙏 I'm Vanara AI. Ask me about transit routes, timings, or just tap the mic and speak!`,
          sender: "bot"
        }]
      })),
      
      loadChatSession: (sessionId: string) => set((state) => {
        const session = state.chatSessions.find(s => s.id === sessionId);
        if (session) {
          return { activeChatId: sessionId, chatMessages: session.messages };
        }
        return state;
      }),

      deleteChatSession: (sessionId: string) => set((state) => {
        const newSessions = state.chatSessions.filter(s => s.id !== sessionId);
        if (state.activeChatId === sessionId) {
          return {
            chatSessions: newSessions,
            activeChatId: null,
            chatMessages: [{
              id: Date.now(),
              text: `Namaskara! 🙏 I'm Vanara AI. Ask me about transit routes, timings, or just tap the mic and speak!`,
              sender: "bot"
            }]
          };
        }
        return { chatSessions: newSessions };
      }),
      
      setBookedRide: (ride: any | null) => {
        set((state) => {
          // If booking a new ride, add to history
          if (ride) {
            return { 
              bookedRide: ride, 
              rideHistory: [ride, ...state.rideHistory] 
            };
          }
          return { bookedRide: null };
        });
      },

      addRideHistory: (item: TransitTicketRecord) => {
        set((state) => ({
          rideHistory: [item, ...(state.rideHistory || [])]
        }));
      },

      setProfilePictureUrl: async (url: string | null) => {
        set({ profilePictureUrl: url });

        // 1. Resilient local cache keyed by user/account/last (survives logout storage clears)
        if (typeof window !== 'undefined') {
          try {
            const cache = JSON.parse(localStorage.getItem('bv_user_avatars') || '{}');
            if (url) {
              cache['last'] = url;
              const currentName = get().userName;
              if (currentName) cache[currentName] = url;
            } else {
              delete cache['last'];
            }
            localStorage.setItem('bv_user_avatars', JSON.stringify(cache));
          } catch (e) {
            console.warn("Avatar local cache write error:", e);
          }
        }

        // 2. Persist in cloud (Supabase Auth metadata & commuter_profiles) if user is authenticated
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            if (typeof window !== 'undefined' && url) {
              try {
                const cache = JSON.parse(localStorage.getItem('bv_user_avatars') || '{}');
                cache[user.id] = url;
                if (user.email) cache[user.email] = url;
                localStorage.setItem('bv_user_avatars', JSON.stringify(cache));
              } catch (e) {}
            }

            // Sync with Supabase Auth user_metadata
            await supabase.auth.updateUser({
              data: { avatar_url: url }
            });

            // Sync with commuter_profiles table if column exists
            await supabase
              .from('commuter_profiles')
              .update({ avatar_url: url })
              .eq('id', user.id);
          }
        } catch (e) {
          console.warn("Supabase avatar update notice:", e);
        }
      },
      
      setPrivacyLiveLocation: (val: boolean) => {
        set({ privacyLiveLocation: val });
      },
      
      setPrivacyCamera: (val: boolean) => {
        set({ privacyCamera: val });
      },

      // 1. SYNCED WALLET: Updates local state and instantly pushes to Supabase PostgreSQL
      addMoney: async (amount: number) => {
        set((state) => ({ walletBalance: state.walletBalance + amount }));
        
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const newBalance = get().walletBalance;
          await supabase
            .from('commuter_profiles')
            .update({ wallet_balance: newBalance })
            .eq('id', user.id);
        }
      },

      deductBalance: async (amount: number) => {
        set((state) => ({ walletBalance: Math.max(0, state.walletBalance - amount) }));
        
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const newBalance = get().walletBalance;
          await supabase
            .from('commuter_profiles')
            .update({ wallet_balance: newBalance })
            .eq('id', user.id);
        }
      },

      // 2. SYNCED KARMA: Updates local state and persists points to cloud profile
      addKarma: async (points: number) => {
        set((state) => ({ karmaPoints: state.karmaPoints + points }));
        
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const newKarma = get().karmaPoints;
          await supabase
            .from('commuter_profiles')
            .update({ karma_points: newKarma })
            .eq('id', user.id);
        }
      },

      // 3. MASTER CLOUD FETCHER: Pulls real user data on session load or auto-creates profile
      fetchUserData: async () => {
        try {
          // Stale blob URL cleanup (if user had an ephemeral blob URL from earlier sessions)
          const currentPic = get().profilePictureUrl;
          if (currentPic && currentPic.startsWith("blob:")) {
            let recovered: string | null = null;
            if (typeof window !== 'undefined') {
              try {
                const cache = JSON.parse(localStorage.getItem('bv_user_avatars') || '{}');
                if (cache['last'] && !cache['last'].startsWith('blob:')) {
                  recovered = cache['last'];
                }
              } catch (e) {}
            }
            set({ profilePictureUrl: recovered });
          }

          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            const { data, error } = await supabase
              .from('commuter_profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            // Determine avatar from multiple tiers:
            // 1. commuter_profiles table
            // 2. user.user_metadata (OAuth or updateUser)
            // 3. Local persistent bv_user_avatars cache
            let resolvedAvatar: string | null = null;
            if (data?.avatar_url && !data.avatar_url.startsWith('blob:')) {
              resolvedAvatar = data.avatar_url;
            } else if (user.user_metadata?.avatar_url && !user.user_metadata.avatar_url.startsWith('blob:')) {
              resolvedAvatar = user.user_metadata.avatar_url;
            } else if (user.user_metadata?.picture && !user.user_metadata.picture.startsWith('blob:')) {
              resolvedAvatar = user.user_metadata.picture;
            }

            if (!resolvedAvatar && typeof window !== 'undefined') {
              try {
                const cache = JSON.parse(localStorage.getItem('bv_user_avatars') || '{}');
                const fromCache = cache[user.id] || (user.email ? cache[user.email] : null) || cache['last'] || null;
                if (fromCache && !fromCache.startsWith('blob:')) {
                  resolvedAvatar = fromCache;
                }
              } catch (e) {}
            }

            // Fallback: If store already has a valid non-blob picture, keep it
            const existingPic = get().profilePictureUrl;
            if (!resolvedAvatar && existingPic && !existingPic.startsWith('blob:')) {
              resolvedAvatar = existingPic;
            }

            if (data) {
              set({
                userName: data.full_name || user.email?.split('@')[0] || "Commuter",
                walletBalance: Number(data.wallet_balance) || 0,
                karmaPoints: data.karma_points || 0,
                carbonSavedGrams: data.carbon_saved_grams || 0,
                ...(resolvedAvatar ? { profilePictureUrl: resolvedAvatar } : {}),
              });
            } else if (error && error.code === 'PGRST116') {
              // Profile row doesn't exist yet for this auth user, create it automatically
              const newProfile: any = {
                id: user.id,
                full_name: user.email?.split('@')[0] || "Guest", 
                wallet_balance: 0,
                karma_points: 0,
                carbon_saved_grams: 0,
              };
              if (resolvedAvatar) {
                newProfile.avatar_url = resolvedAvatar;
              }
              await supabase.from('commuter_profiles').insert(newProfile);
              
              set({
                userName: newProfile.full_name,
                walletBalance: 0,
                karmaPoints: 0,
                carbonSavedGrams: 0,
                ...(resolvedAvatar ? { profilePictureUrl: resolvedAvatar } : {}),
              });
            }

            // If we found an avatar, make sure it is cached locally under this user's ID
            if (resolvedAvatar && typeof window !== 'undefined') {
              try {
                const cache = JSON.parse(localStorage.getItem('bv_user_avatars') || '{}');
                cache[user.id] = resolvedAvatar;
                if (user.email) cache[user.email] = resolvedAvatar;
                cache['last'] = resolvedAvatar;
                localStorage.setItem('bv_user_avatars', JSON.stringify(cache));
              } catch (e) {}
            }
          } else {
            // Guest User: DO NOT wipe their locally earned karma points or wallet balance!
            // Only set userName to Guest if it's not already set.
            const currentState = get();
            if (!currentState.userName || currentState.userName === "" || currentState.userName === "JENNY") {
              set({ userName: "Guest" });
            }
            // Recover guest avatar if not currently set or if stale blob
            if (!currentState.profilePictureUrl || currentState.profilePictureUrl.startsWith('blob:')) {
              if (typeof window !== 'undefined') {
                try {
                  const cache = JSON.parse(localStorage.getItem('bv_user_avatars') || '{}');
                  if (cache['last'] && !cache['last'].startsWith('blob:')) {
                    set({ profilePictureUrl: cache['last'] });
                  }
                } catch (e) {}
              }
            }
          }
        } catch (error) {
          console.error("Supabase Fetch Error:", error);
        } finally {
          set({ isInitialized: true }); 
        }
      }
    }),
    {
      name: 'bharat-vision-storage',
      partialize: (state) => ({ 
        chatMessages: state.chatMessages, 
        chatSessions: state.chatSessions,
        activeChatId: state.activeChatId,
        bookedRide: state.bookedRide,
        rideHistory: state.rideHistory,
        profilePictureUrl: state.profilePictureUrl,
        privacyLiveLocation: state.privacyLiveLocation,
        privacyCamera: state.privacyCamera,
        currentCity: state.currentCity,
        karmaPoints: state.karmaPoints,
        walletBalance: state.walletBalance,
        carbonSavedGrams: state.carbonSavedGrams,
        userName: state.userName,
        appLang: state.appLang,
        activePass: state.activePass,
        ncmcCard: state.ncmcCard
      }),
    }
  )
);