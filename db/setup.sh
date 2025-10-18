#!/bin/bash

# ============================================
# UniMinder Database Setup Script
# ============================================

set -e  # Exit on error

echo "🚀 Starting UniMinder Database Setup..."
echo "========================================"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✓ Environment variables loaded"
else
    echo "❌ Error: .env file not found"
    exit 1
fi

# Check required environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"
    exit 1
fi

# Extract database connection details
DB_HOST=$(echo $SUPABASE_URL | sed 's|https://||' | sed 's|\.supabase\.co||').supabase.co
PROJECT_ID=$(echo $SUPABASE_URL | sed 's|https://||' | sed 's|\.supabase\.co||')

echo "📊 Database: $PROJECT_ID"
echo ""

# Function to execute SQL file
execute_sql() {
    local file=$1
    local description=$2
    
    echo "⚙️  Executing: $description"
    
    if [ -f "$file" ]; then
        # Use Supabase CLI if available
        if command -v supabase &> /dev/null; then
            supabase db execute --file "$file" 2>&1 | grep -v "WARNING" || true
        else
            # Fallback to psql if available
            if command -v psql &> /dev/null; then
                PGPASSWORD=$SUPABASE_PASSWORD psql -h $DB_HOST -U postgres -d postgres -f "$file" 2>&1 | grep -v "NOTICE" || true
            else
                echo "   ⚠️  Skipping (requires Supabase CLI or psql)"
                return
            fi
        fi
        echo "   ✓ Completed"
    else
        echo "   ⚠️  File not found: $file"
    fi
}

# Execute setup scripts in order
echo "📝 Running database migrations..."
echo ""

execute_sql "db/01_init_schema.sql" "Core schema setup"
execute_sql "db/02_verification_tables.sql" "Verification system"
execute_sql "db/03_posts_tables.sql" "Posts and content"
execute_sql "db/04_messaging_tables.sql" "Messaging system"
execute_sql "db/05_mentorship_tables.sql" "Mentorship and connections"
execute_sql "db/06_notifications_tables.sql" "Notifications system"
execute_sql "db/07_moderation_tables.sql" "Moderation and safety"
execute_sql "db/08_functions_triggers.sql" "Functions and triggers"
execute_sql "db/09_rls_policies.sql" "Row Level Security"
execute_sql "db/10_realtime_storage.sql" "Realtime configuration"

echo ""
echo "✅ Database setup completed successfully!"
echo ""

# Optional: Load sample data
read -p "Would you like to load sample data? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "db/sample_data.sql" ]; then
        execute_sql "db/sample_data.sql" "Sample data"
        echo "✓ Sample data loaded"
    else
        echo "⚠️  Sample data file not found"
    fi
fi

echo ""
echo "========================================"
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Verify tables in Supabase dashboard"
echo "2. Configure Storage buckets:"
echo "   - avatars (public)"
echo "   - verification-documents (private)"
echo "   - post-attachments (public)"
echo "   - message-attachments (private)"
echo "3. Set up realtime subscriptions in your app"
echo "4. Run 'npm run dev' to start the application"
echo ""
