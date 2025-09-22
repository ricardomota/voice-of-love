#!/usr/bin/env node

// Comprehensive test after database and function fixes
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://awodornqrhssfbkgjgfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b2Rvcm5xcmhzc2Zia2dqZ2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTk4MDAsImV4cCI6MjA2OTM3NTgwMH0.ryFB-d-Fu5xe3lRDUd8K98YjMJRoiYysKQ-sVxK6Vg8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWaitlistFunction() {
  console.log('🔍 Testing waitlist edge function...');
  
  const testEmail = `test-${Date.now()}@example.com`;
  
  try {
    const response = await fetch('https://awodornqrhssfbkgjgfx.supabase.co/functions/v1/waitlist-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail
      })
    });

    const responseText = await response.text();
    
    console.log('📊 Response Status:', response.status);
    console.log('📄 Response Body:', responseText);
    console.log('');

    if (response.status === 201 && responseText.includes('"ok":true')) {
      console.log('🎉 SUCCESS! Waitlist function is working!');
      
      // Test duplicate email
      console.log('🔄 Testing duplicate email...');
      const duplicateResponse = await fetch('https://awodornqrhssfbkgjgfx.supabase.co/functions/v1/waitlist-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail
        })
      });
      
      const duplicateText = await duplicateResponse.text();
      console.log('📊 Duplicate Response Status:', duplicateResponse.status);
      console.log('📄 Duplicate Response Body:', duplicateText);
      
      if (duplicateResponse.status === 200 && duplicateText.includes('ALREADY_EXISTS')) {
        console.log('✅ Duplicate handling works correctly!');
      } else {
        console.log('❌ Duplicate handling needs work');
      }
      
    } else if (response.status === 500 && responseText.includes('"code":"DB_ERROR"')) {
      console.log('⚠️ Function is deployed but database has issues - run the SQL fix');
    } else if (response.status === 500 && responseText.includes('"error":"INTERNAL_ERROR"')) {
      console.log('❌ Function is NOT deployed - deploy in Supabase Dashboard');
    } else {
      console.log('❓ Unexpected response:', responseText);
    }

  } catch (error) {
    console.error('💥 Test error:', error.message);
  }
}

async function testDatabaseDirect() {
  console.log('🔍 Testing database directly...');
  
  const testEmail = `db-test-${Date.now()}@example.com`;
  
  try {
    // Test direct insert (should work after SQL fix)
    const { data: insertData, error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: testEmail,
        full_name: 'Database Test User'
      });
    
    if (insertError) {
      console.log('❌ Direct insert failed:', insertError.message);
      if (insertError.message.includes('check constraint')) {
        console.log('🚨 Run the URGENT_DATABASE_FIX.sql script!');
      }
    } else {
      console.log('✅ Direct insert succeeded!');
      
      // Test duplicate check
      const { data: duplicateData, error: duplicateError } = await supabase
        .rpc('check_waitlist_duplicate', { email_to_check: testEmail });
      
      if (duplicateError) {
        console.log('❌ Duplicate check failed:', duplicateError.message);
      } else {
        console.log('✅ Duplicate check result:', duplicateData);
      }
      
      // Clean up test data
      await supabase
        .from('waitlist')
        .delete()
        .eq('email', testEmail);
      
      console.log('🧹 Test data cleaned up');
    }
    
  } catch (error) {
    console.error('💥 Database test error:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Running comprehensive waitlist tests...\n');
  
  await testDatabaseDirect();
  console.log('\n' + '='.repeat(50) + '\n');
  await testWaitlistFunction();
  
  console.log('\n📋 Next Steps:');
  console.log('1. If database test failed: Run URGENT_DATABASE_FIX.sql in Supabase SQL Editor');
  console.log('2. If function test failed: Deploy waitlist-signup function in Supabase Dashboard');
  console.log('3. If both pass: Test on www.eterna.chat');
}

runAllTests();
