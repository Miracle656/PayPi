import axios from 'axios';

// Reloadly API Configuration
const RELOADLY_BASE_URL = 'https://topups-sandbox.reloadly.com'; // Use production URL for live
const RELOADLY_AUTH_URL = 'https://auth-sandbox.reloadly.com/oauth/token'; // Use production URL for live

export interface ReloadlyOperator {
  id: number;
  name: string;
  country: {
    isoName: string;
    name: string;
  };
  denominationType: 'FIXED' | 'RANGE';
  fixedAmounts?: number[];
  minAmount?: number;
  maxAmount?: number;
  logoUrls: string[];
  suggestedAmounts?: number[];
}

export interface ReloadlyTopupRequest {
  operatorId: number;
  amount: number;
  useLocalAmount: boolean;
  customIdentifier: string;
  recipientPhone: {
    countryCode: string;
    number: string;
  };
  senderPhone?: {
    countryCode: string;
    number: string;
  };
}

export interface ReloadlyTopupResponse {
  transactionId: number;
  operatorTransactionId: string;
  customIdentifier: string;
  recipientPhone: string;
  recipientEmail?: string;
  senderPhone?: string;
  countryCode: string;
  operatorId: number;
  operatorName: string;
  discount: number;
  discountCurrencyCode: string;
  requestedAmount: number;
  requestedAmountCurrencyCode: string;
  deliveredAmount: number;
  deliveredAmountCurrencyCode: string;
  transactionDate: string;
  status: 'SUCCESSFUL' | 'FAILED' | 'PENDING';
}

export class ReloadlyService {
  private static instance: ReloadlyService;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  // ✅ Use import.meta.env (Vite style)
  private readonly CLIENT_ID = import.meta.env.VITE_RELOADLY_CLIENT_ID || 'your_client_id';
  private readonly CLIENT_SECRET = import.meta.env.VITE_RELOADLY_CLIENT_SECRET || 'your_client_secret';

  static getInstance(): ReloadlyService {
    if (!ReloadlyService.instance) {
      ReloadlyService.instance = new ReloadlyService();
    }
    return ReloadlyService.instance;
  }

  private async authenticate(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(RELOADLY_AUTH_URL, {
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        grant_type: 'client_credentials',
        audience: 'https://topups-sandbox.reloadly.com' // Use production audience for live
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Subtract 1 minute for safety

      return this.accessToken;
    } catch (error) {
      console.error('Reloadly authentication failed:', error);
      throw new Error('Failed to authenticate with Reloadly');
    }
  }

  async getOperators(countryCode: string = 'US'): Promise<ReloadlyOperator[]> {
    const token = await this.authenticate();
    const response = await axios.get(`${RELOADLY_BASE_URL}/operators/countries/${countryCode}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async getOperatorById(operatorId: number): Promise<ReloadlyOperator> {
    const token = await this.authenticate();
    const response = await axios.get(`${RELOADLY_BASE_URL}/operators/${operatorId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async topupAirtime(request: ReloadlyTopupRequest): Promise<ReloadlyTopupResponse> {
    const token = await this.authenticate();
    const response = await axios.post(`${RELOADLY_BASE_URL}/topups`, request, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async getTopupStatus(transactionId: number): Promise<ReloadlyTopupResponse> {
    const token = await this.authenticate();
    const response = await axios.get(`${RELOADLY_BASE_URL}/topups/reports/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  parsePhoneNumber(phoneNumber: string): { countryCode: string; number: string } {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.startsWith('1') && cleaned.length === 11) {
      return { countryCode: '1', number: cleaned.substring(1) };
    } else if (cleaned.length === 10) {
      return { countryCode: '1', number: cleaned };
    }
    return { countryCode: '1', number: cleaned };
  }
}
