#!/usr/bin/env node

// Direct database fix using Supabase client
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://awodornqrhssfbkgjgfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b2Rvcm5xcmhzc2Zia2dqZ2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTk4MDAsImV4cCI6MjA2OTM3NTgwMH0.ryFB-d-Fu5xe3lRDUd8K98YjMJRoiYysKQ-sVxK6Vg8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDatabase() {
  console.log('🔧 Attempting to fix database schema...');
  
  try {
    // Try to execute the SQL fixes using RPC
    console.log('📝 Step 1: Dropping check constraint...');
    
    // First, let's try to get the current table structure
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('exec_sql', { 
        sql: `SELECT conname, contype FROM pg_constraint WHERE conrelid = 'public.waitlist'::regclass AND conname LIKE '%status%'` 
      });
    
    if (tableError) {
      console.log('⚠️ Cannot access constraint info directly:', tableError.message);
    } else {
      console.log('📊 Current constraints:', tableInfo);
    }
    
    // Try to fix the schema by attempting the insert and handling the error
    console.log('📝 Step 2: Testing current insert behavior...');
    
    const testEmail = `fix-test-${Date.now()}@example.com`;
    const { data: insertData, error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: testEmail,
        full_name: 'Fix Test User',
        status: 'queued'  // Try with explicit status
      });
    
    if (insertError) {
      console.log('❌ Insert failed with:', insertError.message);
      
      if (insertError.message.includes('check constraint')) {
        console.log('🚨 Check constraint issue confirmed - manual SQL fix required');
        console.log('📋 Please run this SQL in Supabase SQL Editor:');
        console.log('');
        console.log('ALTER TABLE public.waitlist DROP CONSTRAINT IF EXISTS waitlist_status_check;');
        console.log('ALTER TABLE public.waitlist ALTER COLUMN user_id DROP NOT NULL;');
        console.log('ALTER TABLE public.waitlist ALTER COLUMN status SET DEFAULT \'queued\';');
        console.log('ALTER TABLE public.waitlist ALTER COLUMN primary_interest SET DEFAULT \'general\';');
        console.log('ALTER TABLE public.waitlist ALTER COLUMN how_did_you_hear SET DEFAULT \'website\';');
        console.log('ALTER TABLE public.waitlist ALTER COLUMN requested_at SET DEFAULT NOW();');
        console.log('');
      }
    } else {
      console.log('✅ Insert succeeded! Database may already be fixed.');
      
      // Clean up test data
      await supabase
        .from('waitlist')
        .delete()
        .eq('email', testEmail);
    }
    
  } catch (error) {
    console.error('💥 Database fix error:', error.message);
  }
}

async function testAfterFix() {
  console.log('🧪 Testing after potential fix...');
  
  const testEmail = `test-after-fix-${Date.now()}@example.com`;
  
  try {
    const { data: insertData, error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: testEmail,
        full_name: 'Test After Fix'
      });
    
    if (insertError) {
      console.log('❌ Still failing:', insertError.message);
      return false;
    } else {
      console.log('✅ Database fix successful!');
      
      // Clean up
      await supabase
        .from('waitlist')
        .delete()
        .eq('email', testEmail);
      
      return true;
    }
  } catch (error) {
    console.error('💥 Test error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Taking full ownership of waitlist fix...\n');
  
  await fixDatabase();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  const dbFixed = await testAfterFix();
  
  if (dbFixed) {
    console.log('\n🎉 Database is fixed! Now testing edge function...');
    
    // Test edge function
    const response = await fetch('https://awodornqrhssfbkgjgfx.supabase.co/functions/v1/waitlist-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test-edge-' + Date.now() + '@example.com'
      })
    });
    
    const responseText = await response.text();
    console.log('📊 Edge function status:', response.status);
    console.log('📄 Edge function response:', responseText);
    
    if (response.status === 201 && responseText.includes('"ok":true')) {
      console.log('🎉 EVERYTHING IS WORKING! Waitlist is fully functional!');
    } else {
      console.log('⚠️ Database fixed but function needs deployment');
    }
  } else {
    console.log('\n❌ Database fix needed - please run the SQL manually');
  }
}

main();
