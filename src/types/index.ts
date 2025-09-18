export interface Plan {
  id: string;
  type: 'airtime' | 'data';
  name: string;
  amount: string;
  price: number;
  duration?: string;
  popular?: boolean;
  description: string;
}

export interface Transaction {
  id: string;
  type: 'airtime' | 'data';
  planName: string;
  amount: string;
  price: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  txHash?: string;
}

export interface User {
  id: string;
  piAddress: string;
  balance: number;
  phoneNumber?: string;
  email?: string;
}

export interface Subscription {
  id: string;
  planId: string;
  planName: string;
  amount: string;
  renewalDate: Date;
  isActive: boolean;
  autoRenew: boolean;
}