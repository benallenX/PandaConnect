'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRoleFromEmail, getDashboardUrl } from '@/lib/role-utils';
import { Shield, GraduationCap, Users } from 'lucide-react';

export default function RoleTester() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<{
    role: 'admin' | 'teacher' | 'parent';
    dashboard: string;
  } | null>(null);

  const testEmail = () => {
    if (email) {
      const role = getRoleFromEmail(email);
      const dashboard = getDashboardUrl(role);
      setResult({ role, dashboard });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-5 h-5 text-purple-600" />;
      case 'teacher':
        return <GraduationCap className="w-5 h-5 text-green-600" />;
      case 'parent':
        return <Users className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'teacher':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'parent':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Test Email Role Assignment</CardTitle>
        <p className="text-sm text-gray-600 text-center">
          Enter an email to see which role it would be assigned
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && testEmail()}
          />
          <Button onClick={testEmail} disabled={!email}>
            Test
          </Button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg border-2 ${getRoleColor(result.role)}`}>
            <div className="flex items-center gap-2 mb-2">
              {getRoleIcon(result.role)}
              <span className="font-semibold capitalize">{result.role}</span>
            </div>
            <p className="text-sm">
              Dashboard: <code className="bg-white bg-opacity-50 px-1 rounded">{result.dashboard}</code>
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Admin:</strong> @admin., admin@, principal@, director@</p>
          <p><strong>Teacher:</strong> @apsk12.org (required), @teacher., @school., @edu., .edu, staff@</p>
          <p><strong>Parent:</strong> All other emails</p>
        </div>
      </CardContent>
    </Card>
  );
}
