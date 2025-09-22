#!/usr/bin/env node

// Test the new waitlist-signup-v2 function
async function testWaitlistV2() {
  console.log('🧪 Testing waitlist-signup-v2 function...');
  
  const testEmail = `test-v2-${Date.now()}@example.com`;
  
  try {
    const response = await fetch('https://awodornqrhssfbkgjgfx.supabase.co/functions/v1/waitlist-signup-v2', {
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
      console.log('🎉 SUCCESS! Waitlist V2 function is working!');
      
      // Test duplicate email
      console.log('🔄 Testing duplicate email...');
      const duplicateResponse = await fetch('https://awodornqrhssfbkgjgfx.supabase.co/functions/v1/waitlist-signup-v2', {
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
        return true;
      } else {
        console.log('❌ Duplicate handling needs work');
        return false;
      }
      
    } else if (response.status === 500) {
      console.log('❌ Function returned 500 error:', responseText);
      return false;
    } else {
      console.log('❓ Unexpected response:', responseText);
      return false;
    }

  } catch (error) {
    console.error('💥 Test error:', error.message);
    return false;
  }
}

async function testInvalidEmail() {
  console.log('🧪 Testing invalid email handling...');
  
  try {
    const response = await fetch('https://awodornqrhssfbkgjgfx.supabase.co/functions/v1/waitlist-signup-v2', {
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
      console.log('✅ Invalid email handling works correctly!');
      return true;
    } else {
      console.log('❌ Invalid email handling issue:', responseText);
      return false;
    }
  } catch (error) {
    console.error('💥 Invalid email test error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Testing Waitlist V2 Function');
  console.log('='.repeat(40));
  
  const results = {
    validEmail: await testWaitlistV2(),
    invalidEmail: await testInvalidEmail()
  };
  
  console.log('\n📊 TEST RESULTS:');
  console.log('='.repeat(20));
  console.log(`Valid Email:    ${results.validEmail ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Invalid Email:  ${results.invalidEmail ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result === true);
  
  if (allPassed) {
    console.log('\n🎉 ALL TESTS PASSED! Waitlist V2 is working!');
    console.log('📋 Next step: Deploy this function and update frontend to use it');
  } else {
    console.log('\n❌ Some tests failed - function needs deployment or has issues');
  }
  
  return allPassed;
}

runTests();
