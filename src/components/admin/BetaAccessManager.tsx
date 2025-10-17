import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, Search, RefreshCw, Calendar, Users, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface WaitlistMember {
  id: string;
  email: string;
  full_name: string | null;
  message: string | null;
  status: string;
  created_at: string;
  how_did_you_hear: string | null;
  primary_interest: string | null;
}

interface BetaAccessRecord {
  id: string;
  email: string;
  access_code: string;
  is_temporary: boolean;
  expires_at: string | null;
  used_at: string | null;
  access_status: string;
  days_remaining: number | null;
  granted_from_waitlist: boolean;
  notes: string | null;
}

export function BetaAccessManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [waitlistMembers, setWaitlistMembers] = useState<WaitlistMember[]>([]);
  const [betaAccessList, setBetaAccessList] = useState<BetaAccessRecord[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [durationDays, setDurationDays] = useState('30');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ active: 0, expired: 0, permanent: 0, pending: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load waitlist members
      const { data: waitlist, error: waitlistError } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (waitlistError) throw waitlistError;
      setWaitlistMembers(waitlist || []);

      // Load beta access overview
      const { data: betaAccess, error: betaError } = await supabase
        .from('admin_beta_access_overview')
        .select('*')
        .order('created_at', { ascending: false });

      if (betaError) throw betaError;
      setBetaAccessList(betaAccess || []);

      // Calculate stats
      const active = betaAccess?.filter(b => b.access_status === 'Active').length || 0;
      const expired = betaAccess?.filter(b => b.access_status === 'Expired').length || 0;
      const permanent = betaAccess?.filter(b => b.access_status === 'Permanent').length || 0;
      const pending = waitlist?.filter(w => w.status === 'pending').length || 0;

      setStats({ active, expired, permanent, pending });
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAccess = async () => {
    if (selectedEmails.size === 0) {
      toast({
        title: "No emails selected",
        description: "Please select at least one email to grant access",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('grant-beta-access', {
        body: {
          emails: Array.from(selectedEmails),
          durationDays: parseInt(durationDays),
          notes: `Beta access granted - ${durationDays} days`,
          sendNotifications: false
        }
      });

      if (error) throw error;

      toast({
        title: "Access granted successfully",
        description: `Granted access to ${data.granted} user(s)`,
      });

      setSelectedEmails(new Set());
      await loadData();
    } catch (error: any) {
      toast({
        title: "Error granting access",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEmailSelection = (email: string) => {
    const newSelected = new Set(selectedEmails);
    if (newSelected.has(email)) {
      newSelected.delete(email);
    } else {
      newSelected.add(email);
    }
    setSelectedEmails(newSelected);
  };

  const selectAllPending = () => {
    const pendingEmails = waitlistMembers
      .filter(w => w.status === 'pending')
      .map(w => w.email);
    setSelectedEmails(new Set(pendingEmails));
  };

  const filteredWaitlist = waitlistMembers.filter(w => 
    w.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Beta Access Manager</h1>
          <p className="text-muted-foreground">Manage waitlist and grant beta access</p>
        </div>
        <Button onClick={loadData} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Waitlist</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Access</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permanent Access</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.permanent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expired}</div>
          </CardContent>
        </Card>
      </div>

      {/* Grant Access Section */}
      <Card>
        <CardHeader>
          <CardTitle>Grant Beta Access</CardTitle>
          <CardDescription>Select users from waitlist and grant temporary or permanent access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Duration (days)</Label>
              <Select value={durationDays} onValueChange={setDurationDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="0">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGrantAccess} 
              disabled={loading || selectedEmails.size === 0}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              Grant Access ({selectedEmails.size})
            </Button>
            <Button 
              onClick={selectAllPending} 
              variant="outline"
              disabled={loading}
            >
              Select All Pending
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Waitlist Table */}
      <Card>
        <CardHeader>
          <CardTitle>Waitlist Members</CardTitle>
          <div className="flex gap-2 items-center mt-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Select</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWaitlist.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedEmails.has(member.email)}
                      onCheckedChange={() => toggleEmailSelection(member.email)}
                      disabled={member.status !== 'pending'}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={member.status === 'pending' ? 'secondary' : 'default'}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.full_name || '-'}</TableCell>
                  <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Beta Access Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Beta Access</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Access Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {betaAccessList.map((access) => (
                <TableRow key={access.id}>
                  <TableCell className="font-mono text-sm">{access.email}</TableCell>
                  <TableCell className="font-mono">{access.access_code}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        access.access_status === 'Active' ? 'default' :
                        access.access_status === 'Permanent' ? 'secondary' : 'destructive'
                      }
                    >
                      {access.access_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {access.expires_at 
                      ? new Date(access.expires_at).toLocaleDateString() 
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    {access.days_remaining !== null 
                      ? `${Math.floor(access.days_remaining)} days` 
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {access.used_at 
                      ? new Date(access.used_at).toLocaleDateString() 
                      : 'Not yet'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}