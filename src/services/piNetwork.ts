// Pi Network SDK Integration
declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox: boolean }) => void;
      authenticate: (scopes: string[], onIncompletePaymentFound: (payment: any) => void) => Promise<any>;
      createPayment: (paymentData: any, callbacks: any) => void;
      openShareDialog: (title: string, message: string) => void;
    };
  }
}

export interface PiUser {
  uid: string;
  username: string;
  accessToken: string;
}

export interface PaymentData {
  amount: number;
  memo: string;
  metadata: {
    planId: string;
    planType: 'airtime' | 'data';
    phoneNumber: string;
    amount: string;
  };
}

export class PiNetworkService {
  private static instance: PiNetworkService;
  private user: PiUser | null = null;
  private isInitialized = false;

  static getInstance(): PiNetworkService {
    if (!PiNetworkService.instance) {
      PiNetworkService.instance = new PiNetworkService();
    }
    return PiNetworkService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // Load Pi SDK script
      const script = document.createElement('script');
      script.src = 'https://sdk.minepi.com/pi-sdk.js';
      script.onload = () => {
        try {
          window.Pi.init({ 
            version: "2.0", 
            sandbox: true // Set to false for production
          });
          this.isInitialized = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      script.onerror = () => reject(new Error('Failed to load Pi SDK'));
      document.head.appendChild(script);
    });
  }

  async authenticate(): Promise<PiUser> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const scopes = ['payments', 'username'];
      const auth = await window.Pi.authenticate(scopes, this.onIncompletePaymentFound);
      
      this.user = {
        uid: auth.user.uid,
        username: auth.user.username,
        accessToken: auth.accessToken
      };

      return this.user;
    } catch (error) {
      console.error('Pi authentication failed:', error);
      throw new Error('Failed to authenticate with Pi Network');
    }
  }

  async createPayment(paymentData: PaymentData): Promise<string> {
    if (!this.user) {
      throw new Error('User not authenticated');
    }

    return new Promise((resolve, reject) => {
      const payment = {
        amount: paymentData.amount,
        memo: paymentData.memo,
        metadata: paymentData.metadata,
      };

      const callbacks = {
        onReadyForServerApproval: (paymentId: string) => {
          console.log('Payment ready for server approval:', paymentId);
          resolve(paymentId);
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log('Payment ready for completion:', paymentId, txid);
        },
        onCancel: (paymentId: string) => {
          console.log('Payment cancelled:', paymentId);
          reject(new Error('Payment cancelled by user'));
        },
        onError: (error: any, payment: any) => {
          console.error('Payment error:', error, payment);
          reject(new Error(`Payment failed: ${error.message}`));
        }
      };

      window.Pi.createPayment(payment, callbacks);
    });
  }

  private onIncompletePaymentFound = (payment: any) => {
    console.log('Incomplete payment found:', payment);
    // Handle incomplete payment - could show a modal to complete it
  };

  getUser(): PiUser | null {
    return this.user;
  }

  logout(): void {
    this.user = null;
  }
}