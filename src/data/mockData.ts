import { Plan, Transaction, User, Subscription } from '../types';

export const airtimePlans: Plan[] = [
  {
    id: 'airtime-1',
    type: 'airtime',
    name: '$5 Airtime',
    amount: '$5.00',
    price: 2.5,
    description: 'Perfect for emergency calls',
  },
  {
    id: 'airtime-2',
    type: 'airtime',
    name: '$10 Airtime',
    amount: '$10.00',
    price: 5.0,
    popular: true,
    description: 'Most popular airtime option',
  },
  {
    id: 'airtime-3',
    type: 'airtime',
    name: '$20 Airtime',
    amount: '$20.00',
    price: 9.5,
    description: 'Great value for heavy users',
  },
  {
    id: 'airtime-4',
    type: 'airtime',
    name: '$50 Airtime',
    amount: '$50.00',
    price: 22.0,
    description: 'Maximum airtime bundle',
  },
];

export const dataPlans: Plan[] = [
  {
    id: 'data-1',
    type: 'data',
    name: '1GB Data',
    amount: '1GB',
    price: 3.0,
    duration: '30 days',
    description: 'Light browsing and messaging',
  },
  {
    id: 'data-2',
    type: 'data',
    name: '5GB Data',
    amount: '5GB',
    price: 12.0,
    duration: '30 days',
    popular: true,
    description: 'Perfect for social media',
  },
  {
    id: 'data-3',
    type: 'data',
    name: '10GB Data',
    amount: '10GB',
    price: 20.0,
    duration: '30 days',
    description: 'Stream videos and music',
  },
  {
    id: 'data-4',
    type: 'data',
    name: '50GB Data',
    amount: '50GB',
    price: 85.0,
    duration: '30 days',
    description: 'Unlimited browsing experience',
  },
];

export const mockUser: User = {
  id: 'user-1',
  piAddress: 'GA7DNAI2GEMZQR2PPKWF2NNHQ3BKFVT5WBLLR3XVVHBSOJSJ3TKVW',
  balance: 127.45,
  phoneNumber: '+1234567890',
  email: 'user@example.com',
};

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'data',
    planName: '5GB Data',
    amount: '5GB',
    price: 12.0,
    status: 'completed',
    timestamp: new Date('2024-01-15T10:30:00'),
    txHash: '0x1234567890abcdef1234567890abcdef12345678',
  },
  {
    id: 'tx-2',
    type: 'airtime',
    planName: '$10 Airtime',
    amount: '$10.00',
    price: 5.0,
    status: 'completed',
    timestamp: new Date('2024-01-14T15:45:00'),
    txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
  },
  {
    id: 'tx-3',
    type: 'data',
    planName: '1GB Data',
    amount: '1GB',
    price: 3.0,
    status: 'pending',
    timestamp: new Date('2024-01-13T09:15:00'),
  },
];

export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    planId: 'data-2',
    planName: '5GB Data',
    amount: '5GB',
    renewalDate: new Date('2024-02-15T00:00:00'),
    isActive: true,
    autoRenew: true,
  },
  {
    id: 'sub-2',
    planId: 'airtime-2',
    planName: '$10 Airtime',
    amount: '$10.00',
    renewalDate: new Date('2024-01-25T00:00:00'),
    isActive: false,
    autoRenew: false,
  },
];