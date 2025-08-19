# 🚀 ONEbox - OneChain Development Portal

<div align="center">
  
[![OneChain](https://img.shields.io/badge/OneChain-Testnet-blue?style=for-the-badge)](https://doc-testnet.onelabs.cc)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

*The ultimate development toolkit for OneChain blockchain*

[🌐 Live Demo](https://onebox-app.vercel.app/) 
</div>

## ✨ Features

### 🔗 **Wallet Integration**
- **Seamless Connection**: Connect OneChain wallets with one click
- **Multi-Wallet Support**: Compatible with all OneChain wallet providers
- **Account Management**: Switch between accounts effortlessly
- **Real-time Status**: Live connection status and account information

### 🧪 **PTB Simulator**
- **10+ Presets**: Pre-built transaction templates for common operations
- **Dry-Run Testing**: Test transactions without executing them
- **Gas Estimation**: Accurate gas cost predictions
- **Debug Tools**: Comprehensive transaction analysis
- **Smart Validation**: Input validation and error prevention

### 💰 **Testnet Faucet**
- **Instant Tokens**: Get OCT test tokens in seconds
- **Rate Limiting**: Built-in spam protection
- **Multi-Amount**: Choose from different token amounts
- **Balance Integration**: Automatic balance updates

### 📊 **Transaction History**
- **Comprehensive Tracking**: All transaction types (sent/received/interactions)
- **Smart Categorization**: Automatic transaction type detection
- **Explorer Integration**: Direct links to OneChain explorer
- **Real-time Updates**: Live transaction monitoring
- **Advanced Filtering**: Filter by type, date, and amount

### ⚡ **Balance Management**
- **Multi-Token Support**: Track OCT and other tokens
- **Real-time Updates**: Live balance synchronization
- **Historical Data**: Balance change tracking
- **Visual Charts**: Balance trends and analytics

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or later
- **pnpm** (recommended) or npm/yarn
- **OneChain Wallet** (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sambitsargam/ONEbox.git
   cd ONEbox
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🛠 Tech Stack

### **Frontend Framework**
- **Next.js 14.2.16** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **React 18** - Modern React with concurrent features

### **Styling & UI**
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **next-themes** - Dark/light mode support

### **OneChain Integration**
- **@onelabs/dapp-kit** - OneChain wallet and transaction utilities
- **@mysten/sui** - Core Sui/OneChain SDK
- **@tanstack/react-query** - Data fetching and caching

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **TypeScript** - Static type checking

## 📁 Project Structure

```
ONEbox/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── ui/                      # UI primitives (Radix + Tailwind)
│   ├── balance-section.tsx      # Balance management
│   ├── faucet-section.tsx       # Testnet faucet
│   ├── ptb-section.tsx          # PTB simulator
│   ├── transaction-section.tsx  # Transaction history
│   ├── wallet-section.tsx       # Wallet connection
│   └── providers.tsx            # Context providers
├── hooks/                        # Custom React hooks
├── lib/                         # Utility libraries
│   ├── faucet-api.ts           # Faucet integration
│   ├── onechain-config.ts      # OneChain configuration
│   ├── ptb-presets.ts          # PTB templates
│   ├── transaction-api.ts      # Transaction queries
│   └── utils.ts                # Helper functions
├── public/                      # Static assets
└── styles/                      # Additional styles
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# OneChain Network Configuration
NEXT_PUBLIC_ONECHAIN_NETWORK=testnet
NEXT_PUBLIC_ONECHAIN_RPC_URL=https://rpc-testnet.onelabs.cc
NEXT_PUBLIC_ONECHAIN_EXPLORER_URL=https://onescan.cc

# Faucet Configuration (optional)
NEXT_PUBLIC_FAUCET_URL=https://faucet-testnet.onelabs.cc
```

### OneChain Network Setup

The app is pre-configured for OneChain testnet. To modify network settings:

```typescript
// lib/onechain-config.ts
export const ONECHAIN_NETWORKS = {
  testnet: {
    url: "https://rpc-testnet.onelabs.cc",
    name: "OneChain Testnet",
    explorerUrl: "https://onescan.cc"
  }
  // Add other networks as needed
}
```

## 🧪 PTB Presets

ONEbox includes 10+ pre-built PTB templates:

1. **OCT Transfer** - Simple token transfers
2. **Multi-Recipient** - Batch transfers to multiple addresses
3. **Coin Operations** - Advanced coin management
4. **Batch Operations** - Multiple operations in one transaction
5. **Gas Efficient** - Optimized for low gas usage
6. **Large Amount** - High-value transaction testing
7. **Contract Interaction** - Smart contract calls
8. **Complex Workflow** - Multi-step transaction logic
9. **Full Developer Demo** - Comprehensive example
10. **Custom Template** - Build your own

Each preset includes:
- ✅ Pre-configured transaction logic
- ✅ Input validation
- ✅ Gas estimation
- ✅ Error handling
- ✅ Documentation

## 🔍 API Reference

### Wallet Integration

```typescript
import { useCurrentAccount, useSignTransactionBlock } from "@onelabs/dapp-kit"

function MyComponent() {
  const currentAccount = useCurrentAccount()
  const { mutate: signTransactionBlock } = useSignTransactionBlock()
  
  // Your component logic
}
```

### Transaction Building

```typescript
import { Transaction } from "@mysten/sui/transactions"

const txb = new Transaction()
txb.setSender(senderAddress)
// Add transaction commands
const result = await signTransactionBlock({ transaction: txb })
```

### Faucet Integration

```typescript
import { requestFaucetTokens } from "@/lib/faucet-api"

const result = await requestFaucetTokens(address, amount)
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository to Vercel**
2. **Set environment variables**
3. **Deploy automatically**

```bash
pnpm build
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export

```bash
pnpm build
pnpm export
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   pnpm test
   ```
5. **Submit a pull request**

### Code Style

- **ESLint** - Follow the configured rules
- **Prettier** - Auto-format code
- **TypeScript** - Use strict typing
- **Conventional Commits** - Follow commit message standards

## 🧪 Testing

### Run Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

### Test Structure

```
tests/
├── components/          # Component tests
├── lib/                # Utility tests
├── e2e/                # End-to-end tests
└── setup.ts            # Test configuration
```

## 📊 Performance

### Lighthouse Scores

- 🟢 **Performance**: 95+
- 🟢 **Accessibility**: 100
- 🟢 **Best Practices**: 100
- 🟢 **SEO**: 100

### Optimization Features

- ⚡ **Next.js App Router** - Optimized routing
- 🎨 **CSS-in-JS** - Zero runtime CSS
- 📦 **Bundle Splitting** - Efficient code splitting
- 🖼️ **Image Optimization** - Next.js Image component
- 🔄 **Caching** - React Query + SWR patterns

## 🔒 Security

### Best Practices

- 🛡️ **Input Validation** - All user inputs validated
- 🔐 **Wallet Security** - Never store private keys
- 🚫 **XSS Protection** - Content Security Policy
- 🌐 **HTTPS Only** - Secure connections required
- 🔍 **Dependency Scanning** - Regular security audits

## 📚 Resources

### OneChain Documentation
- [OneChain Developer Docs](https://doc-testnet.onelabs.cc)
- [TypeScript SDK](https://doc-testnet.onelabs.cc/typescript)
- [Wallet Integration](https://doc-testnet.onelabs.cc/wallet)

### Community
- [OneChain Discord](https://discord.gg/onechain)
- [GitHub Discussions](https://github.com/sambitsargam/ONEbox/discussions)
- [Twitter](https://twitter.com/onechain)

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OneChain Team** - For the amazing blockchain platform

<div align="center">

**Built with ❤️ for the OneChain community**

[⭐ Star this repo](https://github.com/sambitsargam/ONEbox) • [🐛 Report Bug](https://github.com/sambitsargam/ONEbox/issues) • [💡 Request Feature](https://github.com/sambitsargam/ONEbox/issues)

</div>
