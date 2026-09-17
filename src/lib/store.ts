import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// STRICT ALIAS PATH: Connects directly to your existing src/lib/supabase.ts
import { supabase } from '@/lib/supabase';

export interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface AppState {
  appLang: string;
  setAppLang: (lang: string) => void;
  userName: string;
  walletBalance: number;
  karmaPoints: number;
  carbonSavedGrams: number;
  isInitialized: boolean;
  currentCity: string;
  
  // Persisted local UI state
  chatMessages: ChatMessage[];
  bookedRide: any | null;
  rideHistory: any[];
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
  setBookedRide: (ride: any | null) => void;
  setProfilePictureUrl: (url: string) => void;
  setPrivacyLiveLocation: (val: boolean) => void;
  setPrivacyCamera: (val: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userName: "Guest",
      walletBalance: 0,
      karmaPoints: 0,
      carbonSavedGrams: 0,
      isInitialized: false,
      currentCity: "bengaluru",
      
      chatMessages: [],
      bookedRide: null,
      rideHistory: [],
      profilePictureUrl: null,
      
      privacyLiveLocation: true,
      privacyCamera: true,
      appLang: "en",
      setAppLang: (lang: string) => set({ appLang: lang }),
      
      setCurrentCity: (cityId: string) => {
        set({ currentCity: cityId });
      },

      addChatMessage: (msg: ChatMessage) => {
        set((state) => ({ chatMessages: [...state.chatMessages, msg] }));
      },
      
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

      setProfilePictureUrl: (url: string) => {
        set({ profilePictureUrl: url });
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
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            const { data, error } = await supabase
              .from('commuter_profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            if (data) {
              set({
                userName: data.full_name || user.email?.split('@')[0] || "Commuter",
                walletBalance: Number(data.wallet_balance) || 0,
                karmaPoints: data.karma_points || 0,
                carbonSavedGrams: data.carbon_saved_grams || 0,
              });
            } else if (error && error.code === 'PGRST116') {
              // Profile row doesn't exist yet for this auth user, create it automatically
              const newProfile = {
                id: user.id,
                full_name: user.email?.split('@')[0] || "Ajay M.", 
                wallet_balance: 0,
                karma_points: 0,
                carbon_saved_grams: 0,
              };
              await supabase.from('commuter_profiles').insert(newProfile);
              
              set({
                userName: newProfile.full_name,
                walletBalance: 0,
                karmaPoints: 0,
                carbonSavedGrams: 0,
              });
            }
          } else {
            // Guest User: DO NOT wipe their locally earned karma points or wallet balance!
            // Only set userName to Guest if it's not already set.
            const currentState = get();
            if (!currentState.userName || currentState.userName === "") {
              set({ userName: "Guest" });
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
        appLang: state.appLang
      }),
    }
  )
);