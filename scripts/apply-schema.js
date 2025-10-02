import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applySchema() {
  try {
    console.log('🚀 Starting schema migration...');
    
    // Read the schema file
    const schemaPath = join(process.cwd(), 'db', 'complete_schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Schema file loaded, applying changes...');
    
    // Execute the schema
    const { error } = await supabase.rpc('exec_sql', {
      sql: schema
    });
    
    if (error) {
      // If exec_sql doesn't exist, try direct execution
      console.log('⚠️  exec_sql function not available, trying direct execution...');
      
      console.log('Please run the schema manually in Supabase SQL Editor');
    } else {
      console.log('✅ Schema applied successfully!');
    }
    
    // Verify tables exist
    console.log('🔍 Verifying table creation...');
    
    const tables = [
      'profiles', 'posts', 'post_interactions', 'post_comments',
      'conversations', 'conversation_participants', 'messages', 
      'message_reads', 'mentorship_connections', 'notifications',
      'user_preferences', 'reports'
    ];
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(0);
      
      if (error) {
        console.log(`❌ Table '${table}' not accessible: ${error.message}`);
      } else {
        console.log(`✅ Table '${table}' exists and accessible`);
      }
    }
    
    console.log('\n🎉 Schema migration completed!');
    console.log('📋 Next steps:');
    console.log('  1. Verify tables in Supabase dashboard');
    console.log('  2. Run: npm run dev');
    console.log('  3. Test the new features');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Handle manual SQL execution
console.log('📋 MANUAL SCHEMA APPLICATION REQUIRED');
console.log('Please copy the content of db/complete_schema.sql');
console.log('and run it in the Supabase SQL Editor at:');
console.log(`${supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/')}/sql/new`);
console.log('\nAfter running the SQL, press Enter to verify tables...');

process.stdin.once('data', () => {
  applySchema();
});
