import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rydimguxavcnoeccjnqh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZGltZ3V4YXZjbm9lY2NqbnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMzE2MTEsImV4cCI6MjA2NjkwNzYxMX0.ZJ1LOCZ22kWbYdhKHTzwvPlsXbfHJiM6wH3MLwUPApE'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})