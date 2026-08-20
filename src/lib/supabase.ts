import { createClient } from "@supabase/supabase-js";
import { InterestTagType, GroupType, RsvpType } from "./schemas";
import { INITIAL_GROUPS } from "./seedData";

// Get Supabase URL and Anon Key from environment (supports both Vite and Next.js env formats)
const metaEnv = typeof import.meta !== "undefined" ? (import.meta as unknown as { env?: Record<string, string> }).env : undefined;

const supabaseUrl =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  metaEnv?.VITE_SUPABASE_URL ||
  "";

const supabaseAnonKey =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  metaEnv?.VITE_SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local fallback storage keys for seamless local operation
const LOCAL_STORAGE_RSVPS_KEY = "moveabroad_sg_rsvps";
const LOCAL_STORAGE_USER_KEY = "moveabroad_sg_user";

export interface UserProfile {
  id: string;
  email: string;
  interest_tags: InterestTagType[];
  created_at: string;
}

// Helper to simulate realistic network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async getCurrentUser(): Promise<UserProfile | null> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      return {
        id: user.id,
        email: user.email || "user@example.com",
        interest_tags: (profile?.interest_tags as InterestTagType[]) || [],
        created_at: profile?.created_at || new Date().toISOString(),
      };
    }

    // Local storage fallback
    const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async signInWithEmail(email: string): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      
      // Check if user session immediately exists (or return optimistic profile)
      const userId = (data && "user" in data && data.user ? (data.user as { id: string }).id : crypto.randomUUID());
      return {
        id: userId,
        email,
        interest_tags: [],
        created_at: new Date().toISOString(),
      };
    }

    await delay(350);
    // Demo / Local Auth
    const existing = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed.email === email) {
        return parsed;
      }
    }

    const newUser: UserProfile = {
      id: crypto.randomUUID(),
      email,
      interest_tags: [],
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  },

  async updateProfileInterests(userId: string, tags: InterestTagType[]): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          interest_tags: tags,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: userId,
        email: (await this.getCurrentUser())?.email || "",
        interest_tags: (data.interest_tags as InterestTagType[]) || [],
        created_at: data.created_at,
      };
    }

    await delay(250);
    const currentUser = await this.getCurrentUser();
    const updated: UserProfile = {
      id: userId,
      email: currentUser?.email || "keziah@moveabroad.sg",
      interest_tags: tags,
      created_at: currentUser?.created_at || new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
    return updated;
  },
};

export const groupsService = {
  async getGroups(): Promise<GroupType[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .order("next_event_at", { ascending: true, nullsFirst: false });

      if (!error && data && data.length > 0) {
        return data as GroupType[];
      }
    }

    // Default seeded group dataset
    return INITIAL_GROUPS;
  },

  async getUserRsvps(userId: string): Promise<RsvpType[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("rsvps")
        .select("*")
        .eq("user_id", userId);

      if (!error && data) {
        return data as RsvpType[];
      }
    }

    // Local storage fallback
    const raw = localStorage.getItem(`${LOCAL_STORAGE_RSVPS_KEY}_${userId}`);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  async saveRsvp(
    userId: string,
    groupId: string,
    status: "going" | "interested" | "cancelled",
    shouldSimulateFailure = false
  ): Promise<RsvpType> {
    if (shouldSimulateFailure) {
      await delay(400);
      throw new Error("Simulated network timeout connecting to Supabase database. Please retry.");
    }

    if (isSupabaseConfigured && supabase) {
      if (status === "cancelled") {
        const { error } = await supabase
          .from("rsvps")
          .delete()
          .match({ user_id: userId, group_id: groupId });
        if (error) throw error;
        return { user_id: userId, group_id: groupId, status: "cancelled" };
      } else {
        const payload = {
          user_id: userId,
          group_id: groupId,
          status,
          created_at: new Date().toISOString(),
        };
        const { data, error } = await supabase
          .from("rsvps")
          .upsert(payload)
          .select()
          .single();
        if (error) throw error;
        return data as RsvpType;
      }
    }

    await delay(300);
    // Local storage fallback
    const currentRsvps = await this.getUserRsvps(userId);
    const filtered = currentRsvps.filter((r) => r.group_id !== groupId);
    let updated: RsvpType[];

    if (status === "cancelled") {
      updated = filtered;
    } else {
      updated = [
        ...filtered,
        {
          user_id: userId,
          group_id: groupId,
          status,
          created_at: new Date().toISOString(),
        },
      ];
    }

    localStorage.setItem(
      `${LOCAL_STORAGE_RSVPS_KEY}_${userId}`,
      JSON.stringify(updated)
    );
    return { user_id: userId, group_id: groupId, status };
  },
};
