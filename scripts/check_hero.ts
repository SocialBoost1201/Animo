import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
if (!supabaseUrl || !supabaseServiceKey) process.exit(1);

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function test() {
  const { data, error } = await supabase.from('hero_media').select('*').order('sort_order', { ascending: true })
  console.log("Hero Media DB in Supabase:");
  console.log(JSON.stringify(data, null, 2));
}
test()
