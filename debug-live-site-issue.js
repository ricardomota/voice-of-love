import { createClient } from '@supabase/supabase-js';

// Debug the real issue - test with exact same credentials as live site
const supabaseUrl = 'https://awodornqrhssfbkgjgfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b2Rvcm5xcmhzc2Zia2dqZ2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTk4MDAsImV4cCI6MjA2OTM3NTgwMH0.ryFB-d-Fu5xe3lRDUd8K98YjMJRoiYysKQ-sVxK6Vg8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugLiveSiteIssue() {
  console.log('🔍 Debugging the real live site issue...\n');

  // Test 1: Check if the database is actually working
  console.log('📊 Testing database connectivity...');
  
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        email: `debug-${Date.now()}@example.com`,
        full_name: 'Debug Test',
        user_id: null,
        status: 'pending',
        primary_interest: 'general',
        how_did_you_hear: 'website',
        requested_at: new Date().toISOString()
      });

    if (error) {
      console.log(`   ❌ Database insert failed: ${error.message}`);
      console.log(`   📋 Error code: ${error.code}`);
      console.log(`   📋 Details: ${error.details}`);
      console.log(`   📋 Hint: ${error.hint}`);
      
      // Test alternative statuses
      console.log('\n📊 Testing alternative statuses...');
      const alternatives = ['active', 'waiting', 'confirmed', 'new', 'registered'];
      
      for (const status of alternatives) {
        const { error: altError } = await supabase
          .from('waitlist')
          .insert({
            email: `alt-${Date.now()}-${status}@example.com`,
            full_name: 'Alt Test',
            user_id: null,
            status: status,
            primary_interest: 'general',
            how_did_you_hear: 'website',
            requested_at: new Date().toISOString()
          });
        
        if (altError) {
          console.log(`   ❌ ${status}: ${altError.message}`);
        } else {
          console.log(`   ✅ ${status}: SUCCESS!`);
          break;
        }
      }
    } else {
      console.log(`   ✅ Database insert SUCCESS!`);
      console.log(`   📋 Data:`, data);
    }
  } catch (err) {
    console.log(`   ❌ Database exception: ${err.message}`);
  }

  // Test 2: Check if we can read from waitlist
  console.log('\n📊 Testing read access...');
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .select('email, status')
      .limit(5);

    if (error) {
      console.log(`   ❌ Read failed: ${error.message}`);
    } else {
      console.log(`   ✅ Read successful: ${data?.length || 0} records`);
      if (data && data.length > 0) {
        console.log(`   📋 Sample records:`, data.slice(0, 2));
      }
    }
  } catch (err) {
    console.log(`   ❌ Read exception: ${err.message}`);
  }

  // Test 3: Check RLS policies
  console.log('\n📊 Testing RLS policies...');
  try {
    // Try to count records
    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`   ❌ Count failed: ${error.message}`);
      console.log(`   📋 This suggests RLS is blocking the count query`);
    } else {
      console.log(`   ✅ Count successful: ${count} records`);
    }
  } catch (err) {
    console.log(`   ❌ Count exception: ${err.message}`);
  }

  console.log('\n🎯 DIAGNOSIS:');
  console.log('If database insert works but the live site fails, the issue is:');
  console.log('1. Deployment delay - changes not yet live');
  console.log('2. Caching - old code still being served');
  console.log('3. Different environment - live site using different config');
  console.log('4. Different Supabase project - live site using different database');
}

debugLiveSiteIssue().catch(console.error);
