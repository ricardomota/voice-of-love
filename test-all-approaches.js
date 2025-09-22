#!/usr/bin/env node

// Test all possible waitlist approaches
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://awodornqrhssfbkgjgfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b2Rvcm5xcmhzc2Zia2dqZ2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTk4MDAsImV4cCI6MjA2OTM3NTgwMH0.ryFB-d-Fu5xe3lRDUd8K98YjMJRoiYysKQ-sVxK6Vg8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testOriginalFunction() {
  console.log('🧪 Testing original waitlist-signup function...');
  
  try {
    const response = await fetch('https://awodornqrhssfbkgjgfx.supabase.co/functions/v1/waitlist-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test-original-' + Date.now() + '@example.com'
      })
    });

    const responseText = await response.text();
    
    if (response.status === 201 && responseText.includes('"ok":true')) {
      console.log('✅ Original function works!');
      return true;
    } else {
      console.log('❌ Original function failed:', response.status, responseText);
      return false;
    }
  } catch (error) {
    console.log('❌ Original function error:', error.message);
    return false;
  }
}

async function testSimpleFunction() {
  console.log('🧪 Testing waitlist-simple function...');
  
  try {
    const response = await fetch('https://awodornqrhssfbkgjgfx.supabase.co/functions/v1/waitlist-simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test-simple-' + Date.now() + '@example.com'
      })
    });

    const responseText = await response.text();
    
    if (response.status === 201 && responseText.includes('"ok":true')) {
      console.log('✅ Simple function works!');
      return true;
    } else {
      console.log('❌ Simple function failed:', response.status, responseText);
      return false;
    }
  } catch (error) {
    console.log('❌ Simple function error:', error.message);
    return false;
  }
}

async function testDirectInsert() {
  console.log('🧪 Testing direct database insert...');
  
  const testEmail = 'test-direct-' + Date.now() + '@example.com';
  
  try {
    const { data: insertData, error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: testEmail,
        full_name: 'Direct Test User'
      });
    
    if (insertError) {
      console.log('❌ Direct insert failed:', insertError.message);
      return false;
    } else {
      console.log('✅ Direct insert works!');
      
      // Clean up
      await supabase
        .from('waitlist')
        .delete()
        .eq('email', testEmail);
      
      return true;
    }
  } catch (error) {
    console.log('❌ Direct insert error:', error.message);
    return false;
  }
}

async function testDirectInsertWithAllFields() {
  console.log('🧪 Testing direct insert with all fields...');
  
  const testEmail = 'test-all-fields-' + Date.now() + '@example.com';
  
  try {
    const { data: insertData, error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: testEmail,
        full_name: 'All Fields Test User',
        user_id: null,
        status: 'queued',
        primary_interest: 'general',
        how_did_you_hear: 'website',
        requested_at: new Date().toISOString()
      });
    
    if (insertError) {
      console.log('❌ All fields insert failed:', insertError.message);
      return false;
    } else {
      console.log('✅ All fields insert works!');
      
      // Clean up
      await supabase
        .from('waitlist')
        .delete()
        .eq('email', testEmail);
      
      return true;
    }
  } catch (error) {
    console.log('❌ All fields insert error:', error.message);
    return false;
  }
}

async function testAlternativeStatusValues() {
  console.log('🧪 Testing alternative status values...');
  
  const statusOptions = ['pending', 'active', 'waiting', 'confirmed', 'new'];
  let success = false;
  
  for (const status of statusOptions) {
    const testEmail = `test-status-${status}-${Date.now()}@example.com`;
    
    try {
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert({
          email: testEmail,
          full_name: 'Status Test User',
          user_id: null,
          status: status,
          primary_interest: 'general',
          how_did_you_hear: 'website',
          requested_at: new Date().toISOString()
        });
      
      if (!insertError) {
        console.log(`✅ Status '${status}' works!`);
        success = true;
        
        // Clean up
        await supabase
          .from('waitlist')
          .delete()
          .eq('email', testEmail);
        
        break;
      } else {
        console.log(`❌ Status '${status}' failed:`, insertError.message);
      }
    } catch (error) {
      console.log(`❌ Status '${status}' error:`, error.message);
    }
  }
  
  return success;
}

async function runAllTests() {
  console.log('🚀 Testing All Waitlist Approaches');
  console.log('='.repeat(50));
  
  const results = {
    originalFunction: await testOriginalFunction(),
    simpleFunction: await testSimpleFunction(),
    directInsert: await testDirectInsert(),
    allFieldsInsert: await testDirectInsertWithAllFields(),
    alternativeStatus: await testAlternativeStatusValues()
  };
  
  console.log('\n📊 TEST RESULTS:');
  console.log('='.repeat(30));
  console.log(`Original Function:     ${results.originalFunction ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Simple Function:       ${results.simpleFunction ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Direct Insert:         ${results.directInsert ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`All Fields Insert:     ${results.allFieldsInsert ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Alternative Status:    ${results.alternativeStatus ? '✅ PASS' : '❌ FAIL'}`);
  
  const workingApproaches = Object.entries(results).filter(([_, result]) => result);
  
  if (workingApproaches.length > 0) {
    console.log('\n🎉 WORKING APPROACHES FOUND:');
    workingApproaches.forEach(([approach, _]) => {
      console.log(`✅ ${approach}`);
    });
    
    console.log('\n📋 RECOMMENDATIONS:');
    if (results.originalFunction) {
      console.log('1. Deploy the original waitlist-signup function');
    }
    if (results.simpleFunction) {
      console.log('2. Deploy the waitlist-simple function as fallback');
    }
    if (results.directInsert || results.allFieldsInsert || results.alternativeStatus) {
      console.log('3. Update frontend to use direct database insert');
    }
  } else {
    console.log('\n❌ NO WORKING APPROACHES FOUND');
    console.log('📋 Required fixes:');
    console.log('1. Run URGENT_DATABASE_FIX.sql in Supabase SQL Editor');
    console.log('2. Deploy waitlist-signup function in Supabase Dashboard');
  }
  
  return workingApproaches.length > 0;
}

runAllTests();
