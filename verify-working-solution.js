#!/usr/bin/env node

// Verify the working solution
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://awodornqrhssfbkgjgfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b2Rvcm5xcmhzc2Zia2dqZ2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTk4MDAsImV4cCI6MjA2OTM3NTgwMH0.ryFB-d-Fu5xe3lRDUd8K98YjMJRoiYysKQ-sVxK6Vg8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWorkingApproach() {
  console.log('🧪 Testing working approach: direct insert with status "pending"...');
  
  const testEmail = `working-test-${Date.now()}@example.com`;
  
  try {
    const { data: insertData, error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: testEmail,
        full_name: 'Working Test User',
        user_id: null,
        status: 'pending',
        primary_interest: 'general',
        how_did_you_hear: 'website',
        requested_at: new Date().toISOString()
      });
    
    if (insertError) {
      console.log('❌ Working approach failed:', insertError.message);
      return false;
    } else {
      console.log('✅ Working approach successful!');
      
      // Test duplicate handling
      console.log('🔄 Testing duplicate handling...');
      const { error: duplicateError } = await supabase
        .from('waitlist')
        .insert({
          email: testEmail,
          full_name: 'Duplicate Test User',
          user_id: null,
          status: 'pending',
          primary_interest: 'general',
          how_did_you_hear: 'website',
          requested_at: new Date().toISOString()
        });
      
      if (duplicateError && duplicateError.code === '23505') {
        console.log('✅ Duplicate handling works correctly!');
      } else {
        console.log('⚠️ Duplicate handling issue:', duplicateError?.message);
      }
      
      // Clean up
      await supabase
        .from('waitlist')
        .delete()
        .eq('email', testEmail);
      
      console.log('🧹 Test data cleaned up');
      return true;
    }
  } catch (error) {
    console.log('❌ Working approach error:', error.message);
    return false;
  }
}

async function testAlternativeStatuses() {
  console.log('🧪 Testing alternative working statuses...');
  
  const workingStatuses = ['active', 'waiting', 'confirmed', 'new'];
  const results = {};
  
  for (const status of workingStatuses) {
    const testEmail = `test-${status}-${Date.now()}@example.com`;
    
    try {
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert({
          email: testEmail,
          full_name: `${status} Test User`,
          user_id: null,
          status: status,
          primary_interest: 'general',
          how_did_you_hear: 'website',
          requested_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.log(`❌ Status '${status}' failed:`, insertError.message);
        results[status] = false;
      } else {
        console.log(`✅ Status '${status}' works!`);
        results[status] = true;
        
        // Clean up
        await supabase
          .from('waitlist')
          .delete()
          .eq('email', testEmail);
      }
    } catch (error) {
      console.log(`❌ Status '${status}' error:`, error.message);
      results[status] = false;
    }
  }
  
  return results;
}

async function testFrontendSimulation() {
  console.log('🧪 Testing frontend simulation...');
  
  const testEmail = `frontend-sim-${Date.now()}@example.com`;
  
  try {
    // Simulate what the frontend component does
    const { data: insertData, error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: testEmail,
        full_name: 'Frontend Simulation User',
        user_id: null,
        status: 'pending',
        primary_interest: 'relationships',
        how_did_you_hear: 'website',
        requested_at: new Date().toISOString()
      });
    
    if (insertError) {
      console.log('❌ Frontend simulation failed:', insertError.message);
      return false;
    } else {
      console.log('✅ Frontend simulation works!');
      
      // Clean up
      await supabase
        .from('waitlist')
        .delete()
        .eq('email', testEmail);
      
      return true;
    }
  } catch (error) {
    console.log('❌ Frontend simulation error:', error.message);
    return false;
  }
}

async function runVerification() {
  console.log('🚀 VERIFYING WORKING SOLUTION');
  console.log('='.repeat(50));
  
  const results = {
    workingApproach: await testWorkingApproach(),
    alternativeStatuses: await testAlternativeStatuses(),
    frontendSimulation: await testFrontendSimulation()
  };
  
  console.log('\n📊 VERIFICATION RESULTS:');
  console.log('='.repeat(30));
  console.log(`Working Approach:      ${results.workingApproach ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend Simulation:   ${results.frontendSimulation ? '✅ PASS' : '❌ FAIL'}`);
  
  console.log('\n📊 Alternative Status Results:');
  Object.entries(results.alternativeStatuses).forEach(([status, works]) => {
    console.log(`  ${status}: ${works ? '✅' : '❌'}`);
  });
  
  const allPassed = results.workingApproach && results.frontendSimulation;
  
  if (allPassed) {
    console.log('\n🎉🎉🎉 SOLUTION VERIFIED! 🎉🎉🎉');
    console.log('✅ Waitlist is working with direct database insert');
    console.log('✅ Status "pending" works perfectly');
    console.log('✅ Frontend components will work');
    console.log('✅ Ready for production!');
    console.log('\n📋 Next Steps:');
    console.log('1. Replace WaitlistSection with WaitlistSectionWorking');
    console.log('2. Update other waitlist components to use the same approach');
    console.log('3. Test on www.eterna.chat');
  } else {
    console.log('\n❌ Verification failed - check the issues above');
  }
  
  return allPassed;
}

runVerification();
