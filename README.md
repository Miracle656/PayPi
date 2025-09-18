# Pi Network Airtime & Data DApp

A decentralized application built on the Pi Network that allows users to purchase real airtime and data bundles using Pi tokens. The app integrates with Reloadly's API for actual mobile top-ups worldwide.

## Features

- **Pi Network Integration**: Authentic Pi Network SDK integration for payments
- **Real Airtime & Data**: Powered by Reloadly API for actual mobile top-ups
- **Global Coverage**: Support for mobile operators worldwide
- **Real-time Status**: Live transaction status updates
- **Responsive Design**: Mobile-first design optimized for all devices
- **Subscription Management**: Auto-renewal and subscription tracking
- **Transaction History**: Complete payment and top-up history

## Setup Instructions

### 1. Pi Network Configuration

1. Register your app on the Pi Developer Portal
2. Get your app credentials and configure the Pi SDK
3. Update the Pi Network configuration in `src/services/piNetwork.ts`

### 2. Reloadly API Setup

1. Sign up at [Reloadly](https://www.reloadly.com/)
2. Get your API credentials from the dashboard
3. Copy `.env.example` to `.env` and add your credentials:

```bash
VITE_RELOADLY_CLIENT_ID=your_client_id_here
VITE_RELOADLY_CLIENT_SECRET=your_client_secret_here
```

### 3. Installation

```bash
npm install
npm run dev
```

## API Integration

### Pi Network SDK

The app uses the official Pi Network SDK for:
- User authentication
- Payment processing
- Transaction management

### Reloadly API

Integration with Reloadly provides:
- Global mobile operator coverage
- Real-time airtime top-ups
- Data bundle purchases
- Transaction status tracking

## Architecture

```
src/
├── components/          # React components
├── services/           # API integrations
│   ├── piNetwork.ts    # Pi Network SDK
│   ├── reloadly.ts     # Reloadly API
│   └── paymentService.ts # Payment orchestration
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
└── data/               # Mock data and constants
```

## Production Deployment

1. Update API endpoints to production URLs
2. Configure proper environment variables
3. Set up SSL certificates
4. Deploy to Pi Network approved hosting

## Security Considerations

- All API keys are stored securely in environment variables
- Pi Network payments are processed through official SDK
- Phone numbers and sensitive data are handled securely
- Real-time status updates prevent payment fraud

## Support

For issues related to:
- Pi Network integration: Check the [Pi Developer Guide](https://pi-apps.github.io/community-developer-guide/)
- Reloadly API: Visit [Reloadly Documentation](https://developers.reloadly.com/)
- App functionality: Create an issue in this repository