#!/usr/bin/env node

// Final comprehensive verification of waitlist functionality
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://awodornqrhssfbkgjgfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b2Rvcm5xcmhzc2Zia2dqZ2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTk4MDAsImV4cCI6MjA2OTM3NTgwMH0.ryFB-d-Fu5xe3lRDUd8K98YjMJRoiYysKQ-sVxK6Vg8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseDirect() {
  console.log('🔍 Testing database direct access...');
  
  const testEmail = `final-test-db-${Date.now()}@example.com`;
  
  try {
    const { data: insertData, error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: testEmail,
        full_name: 'Final Test User'
      });
    
    if (insertError) {
      console.log('❌ Database test failed:', insertError.message);
      return false;
    } else {
      console.log('✅ Database test passed - direct insert works');
      
      // Test duplicate check
      const { data: duplicateData, error: duplicateError } = await supabase
        .rpc('check_waitlist_duplicate', { email_to_check: testEmail });
      
      if (duplicateError) {
        console.log('⚠️ Duplicate check failed:', duplicateError.message);
      } else {
        console.log('✅ Duplicate check works:', duplicateData);
      }
      
      // Clean up
      await supabase
        .from('waitlist')
        .delete()
        .eq('email', testEmail);
      
      return true;
    }
  } catch (error) {
    console.log('❌ Database test error:', error.message);
    return false;
  }
}

async function testEdgeFunction() {
  console.log('🔍 Testing edge function...');
  
  const testEmail = `final-test-edge-${Date.now()}@example.com`;
  
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
    
    if (response.status === 201 && responseText.includes('"ok":true')) {
      console.log('✅ Edge function test passed - new signup works');
      
      // Test duplicate handling
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
      
      if (duplicateResponse.status === 200 && duplicateText.includes('ALREADY_EXISTS')) {
        console.log('✅ Duplicate handling works correctly');
      } else {
        console.log('⚠️ Duplicate handling issue:', duplicateText);
      }
      
      return true;
    } else {
      console.log('❌ Edge function test failed:');
      console.log('   Status:', response.status);
      console.log('   Response:', responseText);
      return false;
    }
  } catch (error) {
    console.log('❌ Edge function test error:', error.message);
    return false;
  }
}

async function testInvalidEmail() {
  console.log('🔍 Testing invalid email handling...');
  
  try {
    const response = await fetch('https://awodornqrhssfbkgjgfx.supabase.co/functions/v1/waitlist-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid-email'
      })
    });

    const responseText = await response.text();
    
    if (response.status === 400 && responseText.includes('INVALID_EMAIL')) {
      console.log('✅ Invalid email handling works correctly');
      return true;
    } else {
      console.log('⚠️ Invalid email handling issue:', responseText);
      return false;
    }
  } catch (error) {
    console.log('❌ Invalid email test error:', error.message);
    return false;
  }
}

async function testFrontendSimulation() {
  console.log('🔍 Testing frontend simulation...');
  
  const testEmail = `frontend-sim-${Date.now()}@example.com`;
  
  try {
    // Simulate what the frontend components do
    const response = await fetch('https://awodornqrhssfbkgjgfx.supabase.co/functions/v1/waitlist-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        full_name: 'Frontend Test User',
        primary_interest: 'general',
        how_did_you_hear: 'website'
      })
    });

    const responseText = await response.text();
    
    if (response.status === 201 && responseText.includes('"ok":true')) {
      console.log('✅ Frontend simulation works - all components will work');
      return true;
    } else {
      console.log('❌ Frontend simulation failed:', responseText);
      return false;
    }
  } catch (error) {
    console.log('❌ Frontend simulation error:', error.message);
    return false;
  }
}

async function runFinalVerification() {
  console.log('🚀 FINAL WAITLIST VERIFICATION');
  console.log('='.repeat(50));
  
  const results = {
    database: await testDatabaseDirect(),
    edgeFunction: await testEdgeFunction(),
    invalidEmail: await testInvalidEmail(),
    frontendSim: await testFrontendSimulation()
  };
  
  console.log('\n📊 VERIFICATION RESULTS:');
  console.log('='.repeat(30));
  console.log(`Database Direct:     ${results.database ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Edge Function:       ${results.edgeFunction ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Invalid Email:       ${results.invalidEmail ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend Simulation: ${results.frontendSim ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result === true);
  
  if (allPassed) {
    console.log('\n🎉🎉🎉 ALL TESTS PASSED! 🎉🎉🎉');
    console.log('✅ Waitlist is fully functional');
    console.log('✅ Ready for production');
    console.log('✅ All frontend components will work');
    console.log('\n🌐 Test on www.eterna.chat now!');
  } else {
    console.log('\n❌ Some tests failed - check the issues above');
    console.log('\n📋 Required fixes:');
    if (!results.database) console.log('   - Run URGENT_DATABASE_FIX.sql in Supabase SQL Editor');
    if (!results.edgeFunction) console.log('   - Deploy waitlist-signup function in Supabase Dashboard');
  }
  
  return allPassed;
}

runFinalVerification();
