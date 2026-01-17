import { createClient } from '@supabase/supabase-js'

// Replace these with your Supabase project URL and anon key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

let supabase = null
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
} catch (err) {
  console.warn('Supabase initialization failed:', err.message)
  // Provide a fallback mock object so app doesn't crash
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: async () => ({ error: 'Supabase not configured' }),
      signInWithPassword: async () => ({ error: 'Supabase not configured' }),
      signOut: async () => ({ error: 'Supabase not configured' }),
      signInWithOAuth: async () => ({ error: 'Supabase not configured' }),
    },
  }
}

export { supabase }
