# Data Fetching System - Quick Start Guide

## 🚨 IMPORTANT: First Time Setup

### Step 1: Install Dependencies (Required)

**Run this FIRST from the main project directory:**

```powershell
# Navigate to your project folder
cd "C:\Users\Asus\Desktop\dakka_project_source (1)"

# Run the quick fix script to install Python dependencies
.\quick_fix.ps1

# OR run the full setup script
.\setup_project.ps1
```

### Step 2: Start Your Servers

**Option A: Start Both Servers Automatically**
```powershell
.\start_project.ps1
```

**Option B: Start Servers Manually**

**Backend (Terminal 1):**
```powershell
cd "home\ubuntu\dakka_project\new-ser-backend"
python src\main.py
```

**Frontend (Terminal 2):**
```powershell
cd "home\ubuntu\dakka_project\ser-app"
npm install  # Only needed once
npm run dev
```

### Step 3: Initialize Database (First Time Only)
```powershell
.\init_database.ps1
```

## 🔧 Troubleshooting Common Issues

### "ModuleNotFoundError: No module named 'flask'"
**Solution:** Run the quick fix script:
```powershell
.\quick_fix.ps1
```

### "Cannot find path" errors
**Solution:** Make sure you're in the right directory:
```powershell
# You should be in: C:\Users\Asus\Desktop\dakka_project_source (1)
pwd  # Check current directory
```

### Frontend won't start
**Solution:** Install Node dependencies:
```powershell
cd "home\ubuntu\dakka_project\ser-app"
npm install
npm run dev
```

## 📁 **Created Files for Easy Setup**

- ✅ `quick_fix.ps1` - Instantly fixes Python dependency issues
- ✅ `setup_project.ps1` - Complete project setup
- ✅ `start_backend.ps1` - Start only the Flask backend
- ✅ `start_frontend.ps1` - Start only the React frontend  
- ✅ `start_project.ps1` - Start both servers together
- ✅ `init_database.ps1` - Initialize database tables

## 🚀 **URLs After Starting**

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Test API:** http://localhost:5000/api/auth/me

## Overview
Your website now has a complete data fetching system that automatically connects to your Flask backend and manages all the data for your application.

## What's Changed

### 1. API Service (`src/services/api.js`)
- Now connects to your actual backend at `http://localhost:5000`
- Handles all authentication, chat, and user data
- Includes proper error handling and session management

### 2. Data Fetcher Hook (`src/hooks/useDataFetcher.js`)
- Centralized data management for your entire app
- Auto-refresh functionality for real-time updates
- Handles all data types: users, chats, messages, etc.

### 3. Updated App Component (`src/App.jsx`)
- Uses the data fetcher hook for all data operations
- Automatic data loading when users log in
- Real-time updates for chat sessions and notifications

## How to Use

### Starting Your Application

1. **Start your Flask backend:**
   ```bash
   cd home/ubuntu/dakka_project/new-ser-backend
   python src/main.py
   ```

2. **Start your React frontend:**
   ```bash
   cd home/ubuntu/dakka_project/ser-app
   npm run dev
   ```

### Data Available in Your App

The `useDataFetcher` hook provides access to:

- `data.user` - Current user information
- `data.metUsers` - List of users you've chatted with
- `data.reconnectRequests` - Pending reconnection requests
- `data.chatStats` - Chat statistics
- `data.messages` - Chat messages
- `data.sessionStatus` - Current chat session status
- `data.systemSettings` - System settings (admin)
- `data.reports` - User reports (admin)
- `data.users` - All users (admin)

### Using the Data Fetcher

```jsx
import useDataFetcher from './hooks/useDataFetcher.js';

function MyComponent() {
  const {
    data,
    loading,
    error,
    fetchAllData,
    refreshData,
    updateUserData
  } = useDataFetcher();

  // Access user data
  const user = data.user;
  const metUsers = data.metUsers;
  
  // Refresh specific data
  const handleRefresh = () => {
    refreshData(['metUsers', 'reconnectRequests']);
  };

  return (
    <div>
      <h1>Welcome {user?.display_name}</h1>
      <p>You've met {metUsers.length} users</p>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### Auto-Refresh Features

- The system automatically refreshes data every 30 seconds when a user is logged in
- Chat session status is checked in real-time
- Reconnection requests are updated automatically

### Testing Your Setup

1. Open your browser console
2. Run: `window.testDataFetching.runAllTests()`
3. This will test your backend connection and data fetching

## Key Features

### 1. **Real-time Data Sync**
- Session status updates automatically
- New messages appear instantly
- Reconnection requests update in real-time

### 2. **Automatic Error Handling**
- Network errors are caught and displayed
- Failed requests are retried automatically
- Authentication errors redirect to login

### 3. **Optimized Performance**
- Data is cached to reduce API calls
- Only necessary data is refreshed
- Background updates don't block the UI

### 4. **Preview Mode Support**
- All functionality works in preview mode
- Mock data is used when backend is unavailable
- Seamless switching between preview and real data

## Data Flow

1. **User Login** → `apiService.login()` → Update user data → Fetch all data
2. **Chat Start** → `apiService.startChatSession()` → Update session status
3. **Auto Refresh** → Check session status, messages, requests every 30s
4. **User Actions** → API calls → Update local data → UI updates

## Troubleshooting

### Backend Not Responding
- Check if Flask server is running on port 5000
- Verify CORS settings in your backend
- Check browser console for network errors

### Data Not Updating
- Check if auto-refresh is enabled
- Verify user is logged in (preview mode has limited auto-refresh)
- Check browser console for API errors

### Authentication Issues
- Clear browser cookies and local storage
- Restart both frontend and backend
- Check if session management is working in backend

## Next Steps

Your data fetching system is now complete! All your components will automatically receive fresh data from your backend. The system handles:

- ✅ User authentication and profiles
- ✅ Chat sessions and messaging
- ✅ Met users and reconnection requests
- ✅ Real-time updates and notifications
- ✅ Error handling and retry logic
- ✅ Preview mode with mock data

Your website is now fully connected to your backend and ready for production use!
