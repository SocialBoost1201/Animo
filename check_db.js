import { createClient } from '@supabase/supabase-js';

const url = 'https://nygsfetbfxngwfzbmryq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Z3NmZXRiZnhuZ3dmemJtcnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MTc4NzYsImV4cCI6MjA4ODI5Mzg3Nn0.0uZRwIJzF9UUX59tX9Hy1bVn2KTvk-E3cMHJ8IvJBCU';
const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('casts').select('id, name_kana').limit(1);
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Success:', data);
  }
}
check();
