# ISeeYou Fortune Telling Platform - Admin Dashboard

A comprehensive admin dashboard for managing the ISeeYou Fortune Telling Platform - a mobile application connecting users with professional fortune tellers (seers) for personalized consultations including Tarot reading, Astrology, Palmistry, and more.

Our mission is to build a nationwide fortune telling community, connecting spiritual seekers with verified professional seers across the country. ISeeYou creates a trusted ecosystem where users can easily discover, connect, and consult with fortune tellers regardless of geographical boundaries - bringing ancient wisdom into the digital age.

## About This Project

This admin dashboard provides a powerful web interface for platform administrators to manage users, seers, bookings, payments, reports, and analytics. Built with modern web technologies for optimal performance and user experience:

- **Next.js 14** - React framework with App Router for server-side rendering and optimal performance
- **TypeScript** - Type-safe development for better code quality and maintainability
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Recharts** - Composable charting library for data visualization
- **Socket.IO Client** - Real-time communication for chat and notifications
- **Axios** - HTTP client with interceptors for API communication
- **SweetAlert2** - Beautiful, responsive popup boxes for user interactions

## Key Features

### User Management

- **Account Overview** - View and manage all user accounts (Customers, Seers, Admins)
- **Seer Verification** - Approve or reject seer registration applications
- **Account Status Control** - Activate, suspend, or block user accounts
- **Profile Management** - View detailed user profiles with zodiac and fortune telling information

### Booking & Payment Management

- **Booking Dashboard** - Monitor all consultation bookings in real-time
- **Payment Tracking** - Track payment transactions across multiple payment methods (VNPay, MoMo, PayPal)
- **Booking Status** - Manage booking lifecycle (Pending, Confirmed, Completed, Cancelled)
- **Certificate Management** - Issue and manage consultation certificates

### Financial Management

- **Revenue Analytics** - Track platform revenue and seer earnings
- **Seer Performance** - Monitor individual seer performance metrics and rankings
- **Customer Potential** - Analyze customer spending patterns and engagement
- **Bonus System** - Manage bonus payments for top-performing seers

### Content & Knowledge Management

- **Knowledge Base** - Manage fortune telling articles and educational content
- **Package Management** - Create and manage consultation packages
- **Report Handling** - Review and resolve user-reported violations

### Communication

- **Real-time Chat** - Monitor and moderate chat conversations between users and seers
- **Push Notifications** - Send targeted notifications to users and seers
- **Message Management** - View and manage platform messages

### AI-Powered Features

- **AI Analysis** - Natural language queries for business intelligence and reporting
- **Smart Analytics** - AI-powered insights into platform performance and user behavior

### Reports & Analytics

- **Dashboard Overview** - Real-time statistics and key performance indicators
- **Custom Reports** - Generate detailed reports on various platform metrics
- **Data Visualization** - Interactive charts and graphs for data analysis

## Architecture Overview

### Frontend Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── admin/               # Admin dashboard pages
│   │   ├── accounts/        # User account management
│   │   ├── ai-analysis/     # AI-powered analytics
│   │   ├── bookings/        # Booking management
│   │   ├── certificates/    # Certificate management
│   │   ├── chat/           # Real-time chat interface
│   │   ├── dashboard/      # Main dashboard
│   │   ├── finance/        # Financial management
│   │   ├── knowledge/      # Knowledge base management
│   │   ├── messages/       # Message management
│   │   ├── notifications/  # Notification management
│   │   ├── packages/       # Package management
│   │   ├── payments/       # Payment tracking
│   │   ├── profile/        # Admin profile
│   │   └── reports/        # Report management
│   └── auth/               # Authentication pages
│       ├── login/          # Login page
│       └── forgot-password/ # Password recovery
├── components/             # Reusable React components
│   ├── accounts/          # Account-related components
│   ├── booking/           # Booking components
│   ├── certificates/      # Certificate components
│   ├── chatHistory/       # Chat components
│   ├── common/            # Shared components
│   ├── dashboard/         # Dashboard components
│   ├── finance/           # Finance components
│   ├── knowledge/         # Knowledge base components
│   ├── messages/          # Message components
│   ├── notifications/     # Notification components
│   ├── packages/          # Package components
│   ├── payments/          # Payment components
│   ├── reports/           # Report components
│   └── ui/                # UI primitives
├── services/              # API service layer
│   ├── account/          # Account services
│   ├── ai/               # AI services
│   ├── auth/             # Authentication services
│   ├── booking/          # Booking services
│   ├── certificates/     # Certificate services
│   ├── chatHistory/      # Chat services
│   ├── dashboard/        # Dashboard services
│   ├── finance/          # Finance services
│   ├── knowledge/        # Knowledge services
│   ├── messages/         # Message services
│   ├── notification/     # Notification services
│   ├── packages/         # Package services
│   ├── payments/         # Payment services
│   ├── reports/          # Report services
│   ├── socket/           # Socket.IO services
│   ├── api-core.ts       # Core API client
│   ├── api-push-noti.ts  # Notification API client
│   └── api-report-service.ts # Report API client
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
└── constants/            # Application constants
```

### Backend Services Integration

The admin dashboard connects to the following backend services:

| Service           | Port       | Description                          |
| ----------------- | ---------- | ------------------------------------ |
| Gateway Service   | 8080       | API Gateway, routing, authentication |
| Core Service      | 8081, 8082 | Main business logic, user management |
| Push Notification | 8085       | Push notification management         |
| Report Service    | 8086       | Reports and analytics                |
| AI Support        | 8001       | AI-powered consulting (LightRAG)     |
| AI Analysis       | 8000       | AI data analysis (Vanna)             |

## Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **Backend Services** - ISeeYou Backend must be running (see backend README)

## Installation

### 1. Clone repository

```bash
git clone <repository-url>
cd ISU-Admin-Dashboard
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure environment

Create a `.env.local` file in the root directory:

```env
# Gateway API URL
NEXT_PUBLIC_GATEWAY_DEPLOY=http://localhost:8080

# Gateway Deploy URL (for production)
NEXT_PUBLIC_GATEWAY_DEPLOY=https://your-production-gateway.com

# CometChat Configuration (for real-time chat)
NEXT_PUBLIC_COMETCHAT_APP_ID=your_app_id
NEXT_PUBLIC_COMETCHAT_AUTH_KEY=your_auth_key
NEXT_PUBLIC_COMETCHAT_REGION=us
```

### 4. Start development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

### Testing

```bash
npm run test         # Run tests (if configured)
```

## Usage

### Login

1. Navigate to [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
2. Use admin credentials:
   - **Email**: `admin@iseeyou.com`
   - **Password**: `Passwordexample`
3. Check "Remember me" to save credentials in localStorage (optional)

### Dashboard Navigation

After login, you'll have access to:

- **Dashboard** - Overview of platform statistics
- **Accounts** - Manage users, seers, and admins
- **Bookings** - View and manage consultation bookings
- **Payments** - Track payment transactions
- **Finance** - Seer performance and customer analytics
- **Packages** - Manage consultation packages
- **Knowledge** - Manage knowledge base articles
- **Certificates** - Issue and manage certificates
- **Messages** - View platform messages
- **Chat** - Real-time chat monitoring
- **Notifications** - Send and manage notifications
- **Reports** - Handle user reports and violations
- **AI Analysis** - Natural language data queries

## API Integration

### Authentication

The dashboard uses JWT-based authentication with automatic token refresh:

- **Access Token** - Stored in localStorage or sessionStorage
- **Refresh Token** - Used to obtain new access tokens
- **Auto-refresh** - Tokens are automatically refreshed on 401 errors

### API Clients

Three API clients are configured for different services:

1. **api-core.ts** - Core service endpoints (users, bookings, payments)
2. **api-push-noti.ts** - Notification service endpoints
3. **api-report-service.ts** - Report service endpoints

All clients include:

- Automatic token injection
- Token refresh on 401 errors
- Error handling and transformation
- TypeScript type safety

### Real-time Features

Socket.IO is used for real-time features:

- Live chat between users and seers
- Real-time notifications
- Booking status updates

**Socket Configuration:**

- Socket path: `/socket` (configured in `src/services/socket/chat.socket.ts`)
- Connection includes `userId` query parameter for authentication
- Auto-reconnection enabled with 5 attempts
- Timeout: 20 seconds

**Note:** If socket connection fails, messages will still be saved to database via REST API and will appear after page reload.

## Troubleshooting

### Cannot login

- Verify backend services are running
- Check `NEXT_PUBLIC_GATEWAY_DEPLOY` in `.env.local`
- Clear browser cache and localStorage
- Check browser console for errors

### API requests failing

- Ensure backend gateway is accessible at configured URL
- Check network tab in browser DevTools
- Verify CORS is properly configured on backend
- Check if tokens are being sent in request headers

### Real-time chat not working

**Socket connection issues:**

- Check if backend socket server is running on port 8080
- Verify socket path is `/socket` (not `/socket.io/`)
- Check browser console for connection errors
- Messages will still save to database even if socket fails
- Reload page to see messages if socket is disconnected

**CometChat issues:**

- Verify CometChat credentials in `.env.local`
- Check CometChat dashboard for API limits
- Ensure Core Service is running and accessible

### Data not loading

- Check browser console for errors
- Verify API responses in Network tab
- Ensure backend services have sample data imported
- Try clearing browser cache and reloading

### Build errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run build
```

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Tailwind CSS for styling
- Keep components small and focused
- Use custom hooks for reusable logic

### Component Structure

```typescript
'use client'; // For client components

import React from 'react';
// ... other imports

interface ComponentProps {
  // Define props with TypeScript
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Component logic

  return (
    // JSX
  );
}
```

### API Service Pattern

```typescript
import { apiFetch } from '../api-core';
import { SingleResponse } from '@/types/response.type';

export const MyService = {
  getData: async (id: string): Promise<SingleResponse<MyData>> => {
    return await apiFetch<SingleResponse<MyData>>(`/endpoint/${id}`, {
      method: 'GET',
    });
  },
};
```

## Deployment

### Build for production

```bash
npm run build
npm run start
```

### Environment variables

Ensure all required environment variables are set in production:

```env
NEXT_PUBLIC_GATEWAY_DEPLOY=https://your-production-gateway.com
NEXT_PUBLIC_COMETCHAT_APP_ID=your_production_app_id
NEXT_PUBLIC_COMETCHAT_AUTH_KEY=your_production_auth_key
```

### Docker deployment (optional)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## License

Private - ISeeYou Fortune Telling Platform

---

**Note**: This is the admin dashboard frontend. For the backend services, please refer to the [ISU-Backend-Production](https://github.com/your-org/ISU-Backend-Production) repository.

## Support

For issues, questions, or contributions, please contact the development team.
