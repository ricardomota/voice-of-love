#!/usr/bin/env node

// Monitor script to check when fixes are applied
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://awodornqrhssfbkgjgfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b2Rvcm5xcmhzc2Zia2dqZ2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTk4MDAsImV4cCI6MjA2OTM3NTgwMH0.ryFB-d-Fu5xe3lRDUd8K98YjMJRoiYysKQ-sVxK6Vg8';

const supabase = createClient(supabaseUrl, supabaseKey);

let testCount = 0;
const maxTests = 20; // Stop after 20 tests

async function testDatabase() {
  const testEmail = `monitor-db-${Date.now()}@example.com`;
  
  try {
    const { data: insertData, error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: testEmail,
        full_name: 'Monitor Test User'
      });
    
    if (insertError) {
      if (insertError.message.includes('check constraint')) {
        return { status: 'constraint_error', message: 'Database constraint still blocking inserts' };
      } else {
        return { status: 'other_error', message: insertError.message };
      }
    } else {
      // Clean up
      await supabase
        .from('waitlist')
        .delete()
        .eq('email', testEmail);
      
      return { status: 'success', message: 'Database insert working!' };
    }
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

async function testEdgeFunction() {
  try {
    const response = await fetch('https://awodornqrhssfbkgjgfx.supabase.co/functions/v1/waitlist-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'monitor-edge-' + Date.now() + '@example.com'
      })
    });

    const responseText = await response.text();
    
    if (response.status === 201 && responseText.includes('"ok":true')) {
      return { status: 'success', message: 'Edge function working!' };
    } else if (response.status === 500 && responseText.includes('"code":"DB_ERROR"')) {
      return { status: 'db_error', message: 'Function deployed but database issue' };
    } else if (response.status === 500 && responseText.includes('"error":"INTERNAL_ERROR"')) {
      return { status: 'not_deployed', message: 'Function not deployed with new code' };
    } else {
      return { status: 'unexpected', message: `Status: ${response.status}, Response: ${responseText}` };
    }
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

async function runTest() {
  testCount++;
  const timestamp = new Date().toLocaleTimeString();
  
  console.log(`\n🧪 Test #${testCount} at ${timestamp}`);
  console.log('='.repeat(40));
  
  // Test database
  console.log('📊 Testing database...');
  const dbResult = await testDatabase();
  console.log(`   ${dbResult.status === 'success' ? '✅' : '❌'} ${dbResult.message}`);
  
  // Test edge function
  console.log('📊 Testing edge function...');
  const funcResult = await testEdgeFunction();
  console.log(`   ${funcResult.status === 'success' ? '✅' : '❌'} ${funcResult.message}`);
  
  // Check if both are working
  if (dbResult.status === 'success' && funcResult.status === 'success') {
    console.log('\n🎉🎉🎉 SUCCESS! WAITLIST IS FULLY WORKING! 🎉🎉🎉');
    console.log('✅ Database: Fixed');
    console.log('✅ Function: Deployed');
    console.log('✅ Ready for production!');
    console.log('\n🌐 Test on www.eterna.chat now!');
    process.exit(0);
  } else {
    console.log('\n⏳ Still waiting for fixes...');
    
    if (dbResult.status === 'constraint_error') {
      console.log('📋 Database fix needed: Run URGENT_DATABASE_FIX.sql');
    }
    if (funcResult.status === 'not_deployed') {
      console.log('📋 Function deployment needed: Deploy waitlist-signup function');
    }
  }
}

async function startMonitoring() {
  console.log('🚀 Starting waitlist fix monitoring...');
  console.log('This will test every 10 seconds until both fixes are applied.');
  console.log('Press Ctrl+C to stop.\n');
  
  // Run first test immediately
  await runTest();
  
  // Then run every 10 seconds
  const interval = setInterval(async () => {
    if (testCount >= maxTests) {
      console.log('\n⏰ Maximum tests reached. Stopping monitoring.');
      clearInterval(interval);
      process.exit(1);
    }
    await runTest();
  }, 10000);
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n👋 Monitoring stopped. Run "node test-after-fixes.js" to test manually.');
  process.exit(0);
});

startMonitoring();
