import { describe, it, expect, vi, beforeEach } from 'vitest';
import { creditService } from '../creditService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
    rpc: vi.fn(),
    functions: {
      invoke: vi.fn(),
    },
  },
}));

describe('creditService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCreditBalance', () => {
    it('should return null when no balance exists', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      });
      
      (supabase.from as any) = mockFrom;

      const result = await creditService.getCreditBalance();

      expect(result).toBeNull();
      expect(mockFrom).toHaveBeenCalledWith('credit_balance');
    });

    it('should return balance data when it exists', async () => {
      const mockBalance = {
        user_id: 'test-user-id',
        credits_available: 100,
        credits_reserved: 0,
        lifetime_spent: 50,
        last_updated: new Date().toISOString(),
      };

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: mockBalance, error: null }),
        }),
      });
      
      (supabase.from as any) = mockFrom;

      const result = await creditService.getCreditBalance();

      expect(result).toEqual(mockBalance);
      expect(mockFrom).toHaveBeenCalledWith('credit_balance');
    });

    it('should return null and log error when database error occurs', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockError = { message: 'Database error', code: 'PGRST301' };

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: mockError }),
        }),
      });
      
      (supabase.from as any) = mockFrom;

      const result = await creditService.getCreditBalance();

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching credit balance:', mockError);
      
      consoleErrorSpy.mockRestore();
    });

    it('should use maybeSingle instead of single to prevent 406 errors', async () => {
      const maybeSingleSpy = vi.fn().mockResolvedValue({ data: null, error: null });
      
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          maybeSingle: maybeSingleSpy,
        }),
      });
      
      (supabase.from as any) = mockFrom;

      await creditService.getCreditBalance();

      expect(maybeSingleSpy).toHaveBeenCalled();
    });
  });

  describe('chargeCredits', () => {
    it('should return insufficient credits error when balance is too low', async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: {
          success: false,
          error: 'insufficient_credits',
          required: 100,
          available: 50,
        },
        error: null,
      });

      (supabase.rpc as any) = mockRpc;
      (supabase.auth.getUser as any) = vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user' } },
      });

      const result = await creditService.chargeCredits('voice_clone', 10);

      expect(result.success).toBe(false);
      expect(result.error).toBe('insufficient_credits');
    });

    it('should successfully charge credits when balance is sufficient', async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: {
          success: true,
          credits_charged: 100,
        },
        error: null,
      });

      (supabase.rpc as any) = mockRpc;
      (supabase.auth.getUser as any) = vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user' } },
      });

      const result = await creditService.chargeCredits('voice_clone', 10);

      expect(result.success).toBe(true);
    });
  });
});
