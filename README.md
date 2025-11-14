# HopInBookingSystem

This project consists of three main applications and shared common code:

1. **Backend**: Node.js/TypeScript backend server that serves both the Customer-app and CMS.
2. **Customer-app**: Public web application for end-users.
3. **CMS**: Admin panel for content management.
4. **common**: Shared code used by all three apps, including types and validation schemas.

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd HopInBookingSystem
   ```

2. Install dependencies for each app:

   **Backend:**
   ```bash
   cd Backend
   npm install
   ```

   **Customer-app:**
   ```bash
   cd ../Customer-app
   npm install
   ```

   **CMS:**
   ```bash
   cd ../CMS
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in each app directory
   - Fill in the required values

### Running the Applications

1. **Backend** (run first):
   ```bash
   cd Backend
   npm run dev
   ```

2. **Customer-app**:
   ```bash
   cd Customer-app
   npm run dev
   ```

3. **CMS**:
   ```bash
   cd CMS
   npm run dev
   ```

### Development

- The `common` directory contains shared types and validation schemas used across all apps.
- Make sure to update shared code carefully as changes affect all applications.

### Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test across all three apps
4. Submit a pull request
# HopInBookingSystem
