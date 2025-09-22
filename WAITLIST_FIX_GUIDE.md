# Waitlist Fix Guide

## Current Issue
The waitlist function is returning 500 Internal Server Error because:
1. The updated function code hasn't been deployed to Supabase
2. The database schema may have constraints that prevent the minimal insert

## Step 1: Deploy the Updated Function

### Option A: Via Supabase Dashboard
1. Go to https://supabase.com/dashboard/project/awodornqrhssfbkgjgfx/functions
2. Find the `waitlist-signup` function
3. Click "Deploy" or "Redeploy"
4. Make sure the function code matches what's in `supabase/functions/waitlist-signup/index.ts`

### Option B: Via CLI (if you have access)
```bash
npx supabase functions deploy waitlist-signup --project-ref awodornqrhssfbkgjgfx
```

## Step 2: Fix Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Make user_id nullable if it's not already
ALTER TABLE public.waitlist ALTER COLUMN user_id DROP NOT NULL;

-- Add default for status if it's required
ALTER TABLE public.waitlist ALTER COLUMN status SET DEFAULT 'queued';

-- Ensure the table allows minimal inserts
-- Check current constraints
SELECT conname, contype, confrelid::regclass 
FROM pg_constraint 
WHERE conrelid = 'public.waitlist'::regclass;
```

## Step 3: Test the Function

1. Open `test-current-function.html` in your browser
2. Click "Test Waitlist Function"
3. You should see:
   - Status 201 with `{"ok":true,"message":"SUCCESS"}` for new emails
   - Status 200 with `{"ok":true,"message":"ALREADY_EXISTS"}` for duplicate emails

## Step 4: Test on Live Site

1. Go to www.eterna.chat
2. Try to join the waitlist with a test email
3. It should work without the "We couldn't sign you up" error

## Expected Function Behavior

The function should:
- Accept emails without authentication
- Insert only `email` and `full_name` columns
- Return 201 for successful new signups
- Return 200 for duplicate emails
- Return 400 for invalid emails
- Return 500 only for actual database errors

## Troubleshooting

If still getting 500 errors:
1. Check Supabase logs in the dashboard
2. Verify the function is using the service role key
3. Ensure RLS policies allow the service role to insert
4. Check that all required columns have defaults or are nullable
