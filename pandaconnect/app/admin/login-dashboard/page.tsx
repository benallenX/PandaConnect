"use client";

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function LoginDashboard() {
  const recentLogins = useQuery(api.myFunctions.getRecentLogins, { 
    schoolId: 'apsk12',
    limit: 25 
  });
  
  const loginStats = useQuery(api.myFunctions.getLoginStats, { 
    schoolId: 'apsk12',
    days: 7 
  });

  if (!recentLogins || !loginStats) {
    return <div className="p-8">Loading login data...</div>;
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Login Activity Dashboard</h1>
        <p className="text-gray-500">Last 7 days</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loginStats.totalLogins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loginStats.uniqueUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Teacher Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{loginStats.teacherLogins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Parent Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{loginStats.parentLogins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Logins Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Login Activity</CardTitle>
          <CardDescription>
            Most recent 25 login events across all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Login Time</TableHead>
                <TableHead>Browser</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLogins.map((login) => (
                <TableRow key={login._id}>
                  <TableCell className="font-medium">{login.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(login.role)}>
                      {login.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{login.loginTimeFormatted}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {login.userAgent ? login.userAgent.split(' ')[0] : 'Unknown'}
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
