#!/usr/bin/env node

// Test database directly using Supabase client
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://awodornqrhssfbkgjgfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b2Rvcm5xcmhzc2Zia2dqZ2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTk4MDAsImV4cCI6MjA2OTM3NTgwMH0.ryFB-d-Fu5xe3lRDUd8K98YjMJRoiYysKQ-sVxK6Vg8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('🔍 Testing database directly...');
  
  const testEmail = `direct-test-${Date.now()}@example.com`;
  
  try {
    // Test 1: Try to insert directly (should fail with RLS)
    console.log('📝 Test 1: Direct insert (should fail with RLS)...');
    const { data: insertData, error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: testEmail,
        full_name: 'Direct Test User'
      });
    
    if (insertError) {
      console.log('❌ Direct insert failed (expected):', insertError.message);
    } else {
      console.log('✅ Direct insert succeeded:', insertData);
    }
    
    // Test 2: Check if duplicate check function works
    console.log('📝 Test 2: Duplicate check function...');
    const { data: duplicateData, error: duplicateError } = await supabase
      .rpc('check_waitlist_duplicate', { email_to_check: testEmail });
    
    if (duplicateError) {
      console.log('❌ Duplicate check failed:', duplicateError.message);
    } else {
      console.log('✅ Duplicate check result:', duplicateData);
    }
    
    // Test 3: Check table structure
    console.log('📝 Test 3: Table structure...');
    const { data: tableData, error: tableError } = await supabase
      .from('waitlist')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.log('❌ Table query failed:', tableError.message);
    } else {
      console.log('✅ Table accessible, sample data:', tableData);
    }
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
  }
}

testDatabase();
