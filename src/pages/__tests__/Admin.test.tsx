import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@/test/utils';
import { screen, waitFor } from '@testing-library/dom';
import Admin from '../Admin';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    rpc: vi.fn(),
  },
}));

vi.mock('@/components/admin/BetaAccessManager', () => ({
  BetaAccessManager: () => <div data-testid="beta-access-manager">Beta Access Manager</div>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate">{to}</div>,
  };
});

describe('Admin Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading spinner while checking admin access', () => {
    (supabase.auth.getUser as any) = vi.fn().mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    );

    render(<Admin />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should redirect non-admin users to home page', async () => {
    (supabase.auth.getUser as any) = vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    });

    (supabase.rpc as any) = vi.fn().mockResolvedValue({
      data: false,
      error: null,
    });

    render(<Admin />);

    await waitFor(() => {
      expect(screen.getByTestId('navigate')).toHaveTextContent('/');
    });
  });

  it('should show BetaAccessManager for admin users', async () => {
    (supabase.auth.getUser as any) = vi.fn().mockResolvedValue({
      data: { user: { id: 'admin-user-id' } },
    });

    (supabase.rpc as any) = vi.fn().mockResolvedValue({
      data: true,
      error: null,
    });

    render(<Admin />);

    await waitFor(() => {
      expect(screen.getByTestId('beta-access-manager')).toBeInTheDocument();
    });
  });

  it('should redirect when user is not logged in', async () => {
    (supabase.auth.getUser as any) = vi.fn().mockResolvedValue({
      data: { user: null },
    });

    render(<Admin />);

    await waitFor(() => {
      expect(screen.getByTestId('navigate')).toHaveTextContent('/');
    });
  });

  it('should handle RPC errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    (supabase.auth.getUser as any) = vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    });

    (supabase.rpc as any) = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'RPC error' },
    });

    render(<Admin />);

    await waitFor(() => {
      expect(screen.getByTestId('navigate')).toHaveTextContent('/');
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error checking admin access:',
      expect.any(Object)
    );

    consoleErrorSpy.mockRestore();
  });
});
