import { PiNetworkService, PaymentData } from './piNetwork';
import { ReloadlyService, ReloadlyTopupRequest } from './reloadly';
import { Plan } from '../types';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  reloadlyTransactionId?: number;
  error?: string;
}

export class PaymentService {
  private static instance: PaymentService;
  private piService: PiNetworkService;
  private reloadlyService: ReloadlyService;

  constructor() {
    this.piService = PiNetworkService.getInstance();
    this.reloadlyService = ReloadlyService.getInstance();
  }

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async processPayment(plan: Plan, phoneNumber: string): Promise<PaymentResult> {
    try {
      // Step 1: Create Pi Network payment
      const paymentData: PaymentData = {
        amount: plan.price,
        memo: `${plan.type === 'airtime' ? 'Airtime' : 'Data'} top-up: ${plan.name}`,
        metadata: {
          planId: plan.id,
          planType: plan.type,
          phoneNumber: phoneNumber,
          amount: plan.amount
        }
      };

      const piPaymentId = await this.piService.createPayment(paymentData);
      console.log('Pi payment created:', piPaymentId);

      // Step 2: Process the actual top-up via Reloadly
      if (plan.type === 'airtime') {
        const reloadlyResult = await this.processAirtimeTopup(plan, phoneNumber, piPaymentId);
        return {
          success: true,
          transactionId: piPaymentId,
          reloadlyTransactionId: reloadlyResult.transactionId
        };
      } else {
        // For data plans, you would implement data bundle purchase
        // This might require different Reloadly endpoints or services
        console.log('Data plan processing not yet implemented');
        return {
          success: true,
          transactionId: piPaymentId
        };
      }

    } catch (error) {
      console.error('Payment processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      };
    }
  }

  private async processAirtimeTopup(plan: Plan, phoneNumber: string, piPaymentId: string) {
    const parsedPhone = this.reloadlyService.parsePhoneNumber(phoneNumber);
    
    // Get operators for the country (defaulting to US for demo)
    const operators = await this.reloadlyService.getOperators('US');
    
    // For demo purposes, use the first available operator
    // In production, you'd want to detect the operator from the phone number
    const operator = operators[0];
    
    if (!operator) {
      throw new Error('No operators available for this number');
    }

    // Convert Pi amount to USD (this would need real exchange rate)
    const usdAmount = this.convertPiToUSD(plan.price);

    const topupRequest: ReloadlyTopupRequest = {
      operatorId: operator.id,
      amount: usdAmount,
      useLocalAmount: false,
      customIdentifier: piPaymentId,
      recipientPhone: {
        countryCode: parsedPhone.countryCode,
        number: parsedPhone.number
      }
    };

    return await this.reloadlyService.topupAirtime(topupRequest);
  }

  private convertPiToUSD(piAmount: number): number {
    // This should use real-time exchange rates
    // For demo purposes, assuming 1 Pi = $2 USD
    return piAmount * 2;
  }

  async getTransactionStatus(reloadlyTransactionId: number) {
    return await this.reloadlyService.getTopupStatus(reloadlyTransactionId);
  }
}