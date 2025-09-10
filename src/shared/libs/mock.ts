export interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}

export interface ActivityRow {
  id: string;
  date: string;
  user: string;
  action: string;
  status: 'success' | 'warning' | 'error';
}

export const mockStats: StatCard[] = [
  {
    title: 'Total Users',
    value: '2,543',
    change: '+12.5%',
    changeType: 'positive'
  },
  {
    title: 'Active Sessions',
    value: '1,234',
    change: '+8.2%',
    changeType: 'positive'
  },
  {
    title: 'Revenue',
    value: '$45,231',
    change: '+15.3%',
    changeType: 'positive'
  },
  {
    title: 'Conversion',
    value: '3.2%',
    change: '-2.4%',
    changeType: 'negative'
  }
];

export const mockActivity: ActivityRow[] = [
  {
    id: '1',
    date: '2024-01-15',
    user: 'john.doe@example.com',
    action: 'User login',
    status: 'success'
  },
  {
    id: '2',
    date: '2024-01-15',
    user: 'jane.smith@example.com',
    action: 'Password reset',
    status: 'success'
  },
  {
    id: '3',
    date: '2024-01-15',
    user: 'admin@example.com',
    action: 'Failed login attempt',
    status: 'error'
  },
  {
    id: '4',
    date: '2024-01-15',
    user: 'user@example.com',
    action: 'Profile update',
    status: 'success'
  },
  {
    id: '5',
    date: '2024-01-14',
    user: 'test@example.com',
    action: 'API rate limit exceeded',
    status: 'warning'
  },
  {
    id: '6',
    date: '2024-01-14',
    user: 'demo@example.com',
    action: 'Account created',
    status: 'success'
  },
  {
    id: '7',
    date: '2024-01-14',
    user: 'support@example.com',
    action: 'Login successful',
    status: 'success'
  },
  {
    id: '8',
    date: '2024-01-13',
    user: 'guest@example.com',
    action: 'Session expired',
    status: 'warning'
  },
  {
    id: '9',
    date: '2024-01-13',
    user: 'manager@example.com',
    action: 'Data export',
    status: 'success'
  },
  {
    id: '10',
    date: '2024-01-13',
    user: 'developer@example.com',
    action: 'API call failed',
    status: 'error'
  }
];