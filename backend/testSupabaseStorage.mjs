// Quick test for Supabase storage connectivity
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

import supabase from './lib/supabase.js';

async function testSupabaseStorage() {
  console.log('Testing Supabase storage...');
  console.log('Supabase client:', supabase);

  if (!supabase) {
    console.error('Supabase client is null - not configured');
    process.exit(1);
  }

  try {
    // Test listing buckets
    console.log('\n--- Testing list buckets ---');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.error('Bucket list error:', bucketError);
    } else {
      console.log('Available buckets:', buckets);
    }

    // Test listing files in 'images' bucket
    console.log('\n--- Testing list files in images bucket ---');
    const { data: files, error: filesError } = await supabase.storage.from('images').list();
    if (filesError) {
      console.error('Files list error:', filesError);
    } else {
      console.log('Files in images bucket:', files);
    }

    console.log('\n--- Done ---');
  } catch (error) {
    console.error('Test error:', error);
  }
}

testSupabaseStorage();
