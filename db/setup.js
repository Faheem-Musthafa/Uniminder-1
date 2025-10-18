/**
 * UniMinder Database Setup Script (Node.js)
 * 
 * This script sets up the complete database schema for UniMinder
 * Run with: node db/setup.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.blue}▶${colors.reset} ${msg}`),
};

// Validate environment variables
function validateEnv() {
  const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    log.error(`Missing environment variables: ${missing.join(', ')}`);
    log.info('Please set these in your .env file');
    process.exit(1);
  }
}

// Initialize Supabase client
function initSupabase() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    log.success('Connected to Supabase');
    return supabase;
  } catch (error) {
    log.error('Failed to connect to Supabase');
    console.error(error);
    process.exit(1);
  }
}

// Execute SQL file
async function executeSqlFile(supabase, filePath, description) {
  try {
    log.step(`Executing: ${description}`);
    
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      log.warn(`File not found: ${filePath}`);
      return false;
    }
    
    const sql = fs.readFileSync(fullPath, 'utf8');
    
    // Split by semicolons but keep them, then filter out empty statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
      .map(s => s + ';');
    
    for (const statement of statements) {
      if (statement.trim() === ';') continue;
      
      const { error } = await supabase.rpc('exec_sql', { sql_string: statement }).single();
      
      if (error) {
        // Some errors are expected (e.g., "already exists")
        if (!error.message.includes('already exists') && 
            !error.message.includes('duplicate')) {
          throw error;
        }
      }
    }
    
    log.success(`Completed: ${description}`);
    return true;
  } catch (error) {
    log.error(`Failed: ${description}`);
    console.error(error.message);
    return false;
  }
}

// Create helper function in database for executing SQL
async function createExecFunction(supabase) {
  const { error } = await supabase.rpc('exec_sql', { 
    sql_string: `
      CREATE OR REPLACE FUNCTION exec_sql(sql_string text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql_string;
      END;
      $$;
    `
  });
  
  if (error && !error.message.includes('already exists')) {
    log.warn('Could not create exec_sql function. Using direct queries.');
  }
}

// Main setup function
async function setup() {
  console.log('\n🚀 UniMinder Database Setup');
  console.log('═'.repeat(50));
  console.log('');
  
  // Validate environment
  validateEnv();
  
  // Initialize Supabase
  const supabase = initSupabase();
  
  // Create helper function
  await createExecFunction(supabase);
  
  // Define migration files in order
  const migrations = [
    { file: '01_init_schema.sql', description: 'Core schema setup' },
    { file: '02_verification_tables.sql', description: 'Verification system' },
    { file: '03_posts_tables.sql', description: 'Posts and content' },
    { file: '04_messaging_tables.sql', description: 'Messaging system' },
    { file: '05_mentorship_tables.sql', description: 'Mentorship and connections' },
    { file: '06_notifications_tables.sql', description: 'Notifications system' },
    { file: '07_moderation_tables.sql', description: 'Moderation and safety' },
    { file: '08_functions_triggers.sql', description: 'Functions and triggers' },
    { file: '09_rls_policies.sql', description: 'Row Level Security' },
    { file: '10_realtime_storage.sql', description: 'Realtime configuration' },
  ];
  
  log.info('Running database migrations...');
  console.log('');
  
  let successCount = 0;
  for (const migration of migrations) {
    const success = await executeSqlFile(supabase, migration.file, migration.description);
    if (success) successCount++;
  }
  
  console.log('');
  console.log('═'.repeat(50));
  
  if (successCount === migrations.length) {
    log.success('All migrations completed successfully!');
  } else {
    log.warn(`${successCount}/${migrations.length} migrations completed`);
    log.info('Some migrations may have been skipped or failed');
  }
  
  console.log('');
  log.info('Next steps:');
  console.log('  1. Verify tables in Supabase dashboard');
  console.log('  2. Configure Storage buckets:');
  console.log('     - avatars (public)');
  console.log('     - verification-documents (private)');
  console.log('     - post-attachments (public)');
  console.log('     - message-attachments (private)');
  console.log('  3. Set up realtime subscriptions in your app');
  console.log('  4. Run npm run dev to start the application');
  console.log('');
}

// Run setup
setup().catch(error => {
  log.error('Setup failed');
  console.error(error);
  process.exit(1);
});
