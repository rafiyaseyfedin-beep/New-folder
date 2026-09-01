import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qlohjtrqkpnjjducdlgu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsb2hqdHJxa3BuampkdWNkbGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MjkwNjAsImV4cCI6MjEwMzQwNTA2MH0.63WjT5OHhnv7sZJ6eTVS3VAgIzlCw2WTwNdZugD40nM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
