import { createClient } from '@supabase/supabase-js';

// Debug the real issue - test with exact same credentials as live site
const supabaseUrl = 'https://awodornqrhssfbkgjgfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b2Rvcm5xcmhzc2Zia2dqZ2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTk4MDAsImV4cCI6MjA2OTM3NTgwMH0.ryFB-d-Fu5xe3lRDUd8K98YjMJRoiYysKQ-sVxK6Vg8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugRealIssue() {
  console.log('🔍 Debugging the real waitlist issue...\n');

  // Test 1: Check database schema
  console.log('📊 Testing database schema...');
  
  try {
    // Try to get table info
    const { data: tableInfo, error: tableError } = await supabase
      .from('waitlist')
      .select('*')
      .limit(1);

    if (tableError) {
      console.log(`   ❌ Table access error: ${tableError.message}`);
      console.log(`   📋 Code: ${tableError.code}`);
      console.log(`   📋 Details: ${tableError.details}`);
      console.log(`   📋 Hint: ${tableError.hint}`);
    } else {
      console.log(`   ✅ Table accessible`);
    }
  } catch (err) {
    console.log(`   ❌ Table exception: ${err.message}`);
  }

  // Test 2: Try different insert approaches
  console.log('\n📊 Testing different insert approaches...');
  
  const testEmail = `debug-${Date.now()}@example.com`;
  
  // Approach 1: Minimal insert
  console.log('   Testing minimal insert...');
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        email: testEmail,
        full_name: 'Debug Test'
      });

    if (error) {
      console.log(`     ❌ Minimal insert failed: ${error.message}`);
      console.log(`     📋 Code: ${error.code}`);
    } else {
      console.log(`     ✅ Minimal insert SUCCESS!`);
    }
  } catch (err) {
    console.log(`     ❌ Minimal insert exception: ${err.message}`);
  }

  // Approach 2: With status pending
  console.log('   Testing with status pending...');
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        email: `pending-${Date.now()}@example.com`,
        full_name: 'Pending Test',
        status: 'pending'
      });

    if (error) {
      console.log(`     ❌ Pending status failed: ${error.message}`);
      console.log(`     📋 Code: ${error.code}`);
    } else {
      console.log(`     ✅ Pending status SUCCESS!`);
    }
  } catch (err) {
    console.log(`     ❌ Pending status exception: ${err.message}`);
  }

  // Approach 3: Full insert as in frontend
  console.log('   Testing full frontend insert...');
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        email: `full-${Date.now()}@example.com`,
        full_name: 'Full Test',
        user_id: null,
        status: 'pending',
        primary_interest: 'general',
        how_did_you_hear: 'website',
        requested_at: new Date().toISOString()
      });

    if (error) {
      console.log(`     ❌ Full insert failed: ${error.message}`);
      console.log(`     📋 Code: ${error.code}`);
      console.log(`     📋 Details: ${error.details}`);
    } else {
      console.log(`     ✅ Full insert SUCCESS!`);
    }
  } catch (err) {
    console.log(`     ❌ Full insert exception: ${err.message}`);
  }

  // Test 3: Check what columns exist
  console.log('\n📊 Checking table structure...');
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .limit(0);

    if (error) {
      console.log(`   ❌ Structure check failed: ${error.message}`);
    } else {
      console.log(`   ✅ Structure check passed`);
    }
  } catch (err) {
    console.log(`   ❌ Structure check exception: ${err.message}`);
  }

  // Test 4: Check RLS policies
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

  console.log('\n🎯 NEXT STEPS:');
  console.log('Based on the results above, we can determine:');
  console.log('1. If it\'s a database constraint issue');
  console.log('2. If it\'s an RLS policy issue');
  console.log('3. If it\'s a column mismatch issue');
  console.log('4. If it\'s a deployment/caching issue');
}

debugRealIssue().catch(console.error);
