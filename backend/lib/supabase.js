import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env if not already loaded
if (!process.env.SUPABASE_URL) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

console.log('[supabase.js] SUPABASE_URL:', supabaseUrl);
console.log('[supabase.js] SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'SET' : 'NOT SET');

let supabase
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase not configured - image upload disabled. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env')
  supabase = null
} else {
  console.log('Supabase configured, initializing client for URL:', supabaseUrl);
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export { supabase }
export default supabase

