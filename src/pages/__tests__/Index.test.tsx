import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@/test/utils';
import { screen } from '@testing-library/dom';
import Index from '../Index';
import * as ReactRouterDom from 'react-router-dom';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
    loading: false,
  }),
}));

vi.mock('@/hooks/usePeople', () => ({
  usePeople: () => ({
    people: [],
    loading: false,
  }),
}));

vi.mock('@/hooks/useAppState', () => ({
  useAppState: () => ({
    appState: 'welcome',
    setAppState: vi.fn(),
    selectedPerson: null,
    setSelectedPerson: vi.fn(),
    conversationId: null,
    setConversationId: vi.fn(),
  }),
}));

vi.mock('@/hooks/useUsageTracking', () => ({
  useUsageTracking: () => ({
    trackEvent: vi.fn(),
  }),
}));

vi.mock('@/hooks/useSubscription', () => ({
  useSubscription: () => ({
    subscription: null,
    loading: false,
  }),
}));

vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    language: 'en',
    setLanguage: vi.fn(),
  }),
}));

vi.mock('@/utils/translations', () => ({
  t: (key: string) => key,
}));

describe('Index Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not auto-navigate when on /admin route', () => {
    const mockLocation = { pathname: '/admin' };
    vi.spyOn(ReactRouterDom, 'useLocation').mockReturnValue(mockLocation as any);

    const setAppStateSpy = vi.fn();
    vi.spyOn(require('@/hooks/useAppState'), 'useAppState').mockReturnValue({
      appState: 'welcome',
      setAppState: setAppStateSpy,
      selectedPerson: null,
      setSelectedPerson: vi.fn(),
      conversationId: null,
      setConversationId: vi.fn(),
    });

    render(<Index />);

    // Should not call setAppState to 'dashboard' when on /admin
    expect(setAppStateSpy).not.toHaveBeenCalledWith('dashboard');
  });

  it('should auto-navigate to dashboard from root when people exist', () => {
    const mockLocation = { pathname: '/' };
    vi.spyOn(ReactRouterDom, 'useLocation').mockReturnValue(mockLocation as any);

    const setAppStateSpy = vi.fn();
    vi.spyOn(require('@/hooks/useAppState'), 'useAppState').mockReturnValue({
      appState: 'welcome',
      setAppState: setAppStateSpy,
      selectedPerson: null,
      setSelectedPerson: vi.fn(),
      conversationId: null,
      setConversationId: vi.fn(),
    });

    vi.spyOn(require('@/hooks/usePeople'), 'usePeople').mockReturnValue({
      people: [{ id: '1', name: 'Test Person' }],
      loading: false,
    });

    render(<Index />);

    // Should navigate to dashboard when on root path with people
    expect(setAppStateSpy).toHaveBeenCalledWith('dashboard');
  });

  it('should not auto-navigate when on /settings route', () => {
    const mockLocation = { pathname: '/settings' };
    vi.spyOn(ReactRouterDom, 'useLocation').mockReturnValue(mockLocation as any);

    const setAppStateSpy = vi.fn();
    vi.spyOn(require('@/hooks/useAppState'), 'useAppState').mockReturnValue({
      appState: 'welcome',
      setAppState: setAppStateSpy,
      selectedPerson: null,
      setSelectedPerson: vi.fn(),
      conversationId: null,
      setConversationId: vi.fn(),
    });

    render(<Index />);

    // Should not auto-navigate when on protected routes
    expect(setAppStateSpy).not.toHaveBeenCalledWith('dashboard');
  });
});
