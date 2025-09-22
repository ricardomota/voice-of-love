import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WaitlistFormData {
  email: string;
  fullName: string;
  message?: string;
  primaryInterest?: string;
}

export default function WaitlistSectionFixed() {
  const [formData, setFormData] = useState<WaitlistFormData>({
    email: '',
    fullName: '',
    message: '',
    primaryInterest: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'duplicate'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Strategy 1: Try the original edge function
      console.log('🔄 Trying original waitlist-signup function...');
      const { data: result, error } = await supabase.functions.invoke('waitlist-signup', {
        body: {
          email: formData.email,
          full_name: formData.fullName,
          message: formData.message || null,
          primary_interest: formData.primaryInterest || null,
        },
      });

      if (error) {
        console.log('❌ Original function failed:', error);
        throw error;
      }

      if (result?.ok) {
        if (result.message === 'ALREADY_EXISTS') {
          setSubmitStatus('duplicate');
        } else {
          setSubmitStatus('success');
        }
        return;
      }

    } catch (originalError) {
      console.log('⚠️ Original function failed, trying fallback...');
      
      try {
        // Strategy 2: Try direct database insert (may fail due to RLS)
        console.log('🔄 Trying direct database insert...');
        const { data: directResult, error: directError } = await supabase
          .from('waitlist')
          .insert({
            email: formData.email.trim().toLowerCase(),
            full_name: formData.fullName || 'Anonymous User',
            user_id: null,
            status: 'queued',
            primary_interest: formData.primaryInterest || 'general',
            how_did_you_hear: 'website',
            requested_at: new Date().toISOString()
          });

        if (directError) {
          console.log('❌ Direct insert failed:', directError);
          
          // Strategy 3: Try with different status values
          console.log('🔄 Trying with alternative status values...');
          const statusOptions = ['pending', 'active', 'waiting', 'confirmed', 'new'];
          let success = false;
          
          for (const status of statusOptions) {
            const { error: statusError } = await supabase
              .from('waitlist')
              .insert({
                email: formData.email.trim().toLowerCase(),
                full_name: formData.fullName || 'Anonymous User',
                user_id: null,
                status: status,
                primary_interest: formData.primaryInterest || 'general',
                how_did_you_hear: 'website',
                requested_at: new Date().toISOString()
              });
            
            if (!statusError) {
              success = true;
              break;
            }
          }
          
          if (success) {
            setSubmitStatus('success');
            return;
          }
          
          // Strategy 4: Try the simple function if it exists
          console.log('🔄 Trying waitlist-simple function...');
          const { data: simpleResult, error: simpleError } = await supabase.functions.invoke('waitlist-simple', {
            body: {
              email: formData.email,
              full_name: formData.fullName,
            },
          });

          if (simpleError) {
            console.log('❌ Simple function also failed:', simpleError);
            throw new Error('All signup methods failed. Please try again later.');
          }

          if (simpleResult?.ok) {
            if (simpleResult.message === 'ALREADY_EXISTS') {
              setSubmitStatus('duplicate');
            } else {
              setSubmitStatus('success');
            }
            return;
          }
          
          throw new Error('All signup methods failed. Please try again later.');
        }

        setSubmitStatus('success');

      } catch (fallbackError) {
        console.error('❌ All fallback methods failed:', fallbackError);
        setSubmitStatus('error');
        setErrorMessage('We couldn\'t sign you up right now. Please try again or check your connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Join the Voice of Love Waitlist
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-blue-100">
          Be the first to experience AI-powered voice conversations that bring people closer together.
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="fullName"
              placeholder="Your name (optional)"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <select
              name="primaryInterest"
              value={formData.primaryInterest}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="general">General Interest</option>
              <option value="relationships">Relationships</option>
              <option value="family">Family</option>
              <option value="friendship">Friendship</option>
              <option value="business">Business</option>
            </select>
          </div>

          <div className="mb-6">
            <textarea
              name="message"
              placeholder="Tell us what you're most excited about (optional)"
              value={formData.message}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Joining Waitlist...' : 'Join the Waitlist'}
          </button>

          {submitStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-500/20 border border-green-400 rounded-lg">
              <p className="text-green-200">🎉 Successfully joined the waitlist! We'll be in touch soon.</p>
            </div>
          )}

          {submitStatus === 'duplicate' && (
            <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-400 rounded-lg">
              <p className="text-yellow-200">✅ You're already on our waitlist! We'll be in touch soon.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-400 rounded-lg">
              <p className="text-red-200">{errorMessage}</p>
            </div>
          )}
        </form>

        <div className="mt-8 text-sm text-blue-200">
          <p>By joining, you agree to receive updates about Voice of Love.</p>
          <p>We respect your privacy and will never share your information.</p>
        </div>
      </div>
    </div>
  );
}
