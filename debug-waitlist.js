#!/usr/bin/env node

// Debug script to test waitlist function
const testEmail = `debug-${Date.now()}@example.com`;

console.log('🔍 Testing waitlist function...');
console.log('📧 Test email:', testEmail);
console.log('🌐 Function URL: https://awodornqrhssfbkgjgfx.supabase.co/functions/v1/waitlist-signup');
console.log('');

async function testWaitlist() {
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

    // Check if function is deployed with new code
    if (responseText.includes('"code":"DB_ERROR"')) {
      console.log('✅ Function is deployed with new code (has diagnostic error code)');
      console.log('❌ Database schema issue - run the SQL fixes');
    } else if (responseText.includes('"error":"INTERNAL_ERROR"')) {
      console.log('❌ Function is NOT deployed with new code');
      console.log('🚨 URGENT: Deploy the function in Supabase Dashboard');
    } else if (responseText.includes('"ok":true')) {
      console.log('🎉 SUCCESS! Waitlist is working!');
    } else {
      console.log('❓ Unknown response format');
    }

  } catch (error) {
    console.error('💥 Network error:', error.message);
  }
}

testWaitlist();
