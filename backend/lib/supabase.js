import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

let supabase
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase not configured - image upload disabled. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env')
  supabase = null
} else {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export { supabase }
export default supabase

