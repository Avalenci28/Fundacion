// Quick test for Supabase storage upload
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

import supabase from './lib/supabase.js';

async function testUpload() {
  console.log('Testing Supabase storage upload...');

  if (!supabase) {
    console.error('Supabase client is null');
    process.exit(1);
  }

  // Create a simple test buffer (1x1 transparent PNG)
  const pngBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
    0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);

  const fileName = `gallery/test_${Date.now()}.png`;

  console.log('Uploading to:', fileName);

  try {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, pngBuffer, { contentType: 'image/png', upsert: true });

    if (error) {
      console.error('Upload error:', error);
    } else {
      console.log('Upload success:', data);
    }
  } catch (err) {
    console.error('Upload exception:', err);
  }
}

testUpload();
