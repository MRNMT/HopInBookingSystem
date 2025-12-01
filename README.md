# HopInBookingSystem

HopInBookingSystem is a comprehensive hotel booking management system built with React for the frontend and Node.js/TypeScript for the backend. It includes three main applications: a customer-facing app, an admin CMS, and a super admin panel, along with a shared backend API.

## Deployed Applications

- **Customer App**: [https://hop-in-booking-system.vercel.app/](https://hop-in-booking-system.vercel.app/)
- **Admin CMS**: [https://hop-in-booking-system-tghj.vercel.app/](https://hop-in-booking-system-tghj.vercel.app/)
- **Super Admin Panel**: [https://hop-in-booking-system-wyu5.vercel.app/](https://hop-in-booking-system-wyu5.vercel.app/)
- **Backend API**: [https://hopinbookingsystem-1.onrender.com](https://hopinbookingsystem-1.onrender.com)

## Design

The application design is available on Figma: [Hotel Prototype](https://www.figma.com/design/obgxWBC4OJOx16sJKesCKH/Hotel-Prototype?node-id=4063-508&t=cWdxE3QMnHBZyuyd-0)

## Technologies

- **Frontend**: React
- **Backend**: Node.js, TypeScript
- **Shared Code**: Common types and validation schemas

## Project Structure

This project consists of three main applications and shared common code:

1. **Backend**: Node.js/TypeScript backend server that serves both the Customer-app and CMS.
2. **Customer-app**: Public web application for end-users.
3. **CMS**: Admin panel for content management.
4. **common**: Shared code used by all three apps, including types and validation schemas.

## Screenshots

Here are some screenshots of the application:

- ![Screenshot 1](assets/1.PNG)
- ![Screenshot 2](assets/2.PNG)
- ![Screenshot 3](assets/3.PNG)
- ![Screenshot 4](assets/4.PNG)
- ![Screenshot 5](assets/5.PNG)
- ![Screenshot 6](assets/6.PNG)
- ![Screenshot 7](assets/7.PNG)
- ![Screenshot 8](assets/8.PNG)
- ![Screenshot 9](assets/9.PNG)
- ![Screenshot 10](assets/10.PNG)
- ![Screenshot 11](assets/11.PNG)
- ![Screenshot 13](assets/13.PNG)
- ![Screenshot 14](assets/14.PNG)
- ![Screenshot 15](assets/15.PNG)
- ![Screenshot 16](assets/16.PNG)
- ![Screenshot 17](assets/17.PNG)
- ![Screenshot 18](assets/18.PNG)
- ![Screenshot 19](assets/19.PNG)
- ![Screenshot 20](assets/20.PNG)
- ![Screenshot 21](assets/21.png)
- ![Screenshot 22](assets/22.PNG)
- ![Screenshot 23](assets/23.PNG)
- ![Screenshot 24](assets/24.PNG)
- ![Screenshot 25](assets/25.PNG)
- ![Screenshot 26](assets/26.PNG)
- ![Screenshot 27](assets/27.PNG)
- ![Edited Screenshot](assets/Screenshot%202025-12-01%20150249_edited.png)

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
