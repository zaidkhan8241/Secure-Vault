# 🔐 SecureVault

A professional, client-side password manager that stores your credentials locally in your browser. No server, no cloud, no tracking - your passwords stay on your device only.

![SecureVault](https://img.shields.io/badge/SecureVault-v1.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Security](https://img.shields.io/badge/Security-Local%20Only-success)

---

## ✨ Features

- **🔒 100% Local Storage** - All data stays in your browser's localStorage
- **🎨 Professional Dark UI** - Modern black theme with purple accents
- **📝 Unlimited Entries** - Store as many passwords as you need
- **👁️ Password Visibility** - Toggle to show/hide passwords
- **🔍 Search Functionality** - Quickly find credentials by site or username
- **✏️ Edit & Delete** - Manage your credentials easily
- **📊 Statistics Dashboard** - See total entries and unique sites
- **📱 Responsive Design** - Works on desktop and mobile
- **🚀 No Registration Required** - Simple signup, no email verification

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Edge, Safari)
- No internet connection required after initial load
- No server or database setup needed

### Installation

1. **Download the project files:**
   ```
   SecureVault/
   ├── login.html
   ├── signup.html
   ├── dashboard.html
   ├── auth.js
   ├── dashboard.js
   ├── style.css
   └── README.md
   ```

2. **Open in browser:**
   - Double-click `login.html` or
   - Right-click → Open with → Your Browser
   - Or use a local server for better experience

### Using a Local Server (Recommended)

**Option 1: Python**
```bash
cd "SecureVault"
python -m http.server 8000
```
Then open: `http://localhost:8000`

**Option 2: VS Code Live Server**
- Install "Live Server" extension
- Right-click on `login.html` → "Open with Live Server"

**Option 3: Node.js**
```bash
npx serve "SecureVault"
```

---

## 📖 How to Use

### 1. Create an Account
1. Open `signup.html` or click "Create one" on login page
2. Enter your name, email, and password
3. Click "Create Account"
4. **No password restrictions** - use any password you like

### 2. Login
1. Enter your email and password
2. Click "Sign In"
3. You'll be redirected to the dashboard

### 3. Add Credentials
1. In the left sidebar, fill in:
   - **Site/App** (e.g., "Google", "Facebook")
   - **Username/Email**
   - **Password**
2. Click "Save to Vault"

### 4. Manage Credentials
- **Copy Password** - Click the copy button
- **View Password** - Click the eye icon to reveal
- **Edit** - Click the pen icon to modify
- **Delete** - Click the trash icon to remove

### 5. Search
- Use the search bar at the top to find credentials by site or username

---

## 🛡️ Security Notes

### How It Works
- Passwords are encoded with **base64** before storage
- All data is stored in browser's **localStorage**
- **No data is sent to any server**
- **No encryption key management** - simple encoding for easy recovery

### Important Warnings
⚠️ **This is a learning/demo project:**
- Uses base64 encoding (not true encryption)
- LocalStorage can be cleared by browser
- Not suitable for highly sensitive production use
- Anyone with access to your computer can view stored data

### Data Persistence
- Data is saved until you:
  - Clear browser cache/data
  - Use private/incognito mode
  - Uninstall browser
  - Switch devices (data is device-specific)

---

## 📁 Project Structure

```
SecureVault/
├── login.html          # Login page
├── signup.html         # Registration page
├── dashboard.html      # Main vault interface
├── auth.js             # Authentication logic
├── dashboard.js        # Vault management logic
├── style.css           # Professional dark theme styling
└── README.md           # This file
```

---

## 🔧 Technical Details

### Storage Mechanism
```javascript
// User accounts stored as:
localStorage.setItem('sv_users', JSON.stringify([...]))

// Individual vaults stored as:
localStorage.setItem('sv_vault_' + btoa(email), encodedData)

// Current session:
localStorage.setItem('sv_cur', userEmail)
```

### Password Encoding
- Passwords are encoded with `btoa()` (base64)
- Not encrypted - can be decoded with `atob()`
- Simple approach for demonstration purposes

---

## 🎨 Customization

### Change Colors
Edit `style.css` root variables:
```css
:root {
  --accent: #6366f1;        /* Primary color */
  --accent-light: #818cf8;  /* Light accent */
  --bg: #0d0d0d;           /* Background */
  --bg-card: #1a1a1a;      /* Card background */
}
```

### Add Features
The code is modular and easy to extend:
- Edit `dashboard.js` to add new functions
- Modify `dashboard.html` to change layout
- Update `style.css` for styling changes

---

## 🐛 Troubleshooting

### "Account not found" after creating account
- Make sure you're not in private/incognito mode
- Check browser isn't clearing data on close
- Try using a local server instead of opening files directly

### Can't login with correct password
- Clear all data and recreate account
- Check browser console for errors (F12)

### Data disappeared
- Data is stored per browser, per device
- Check if browser cache was cleared
- Verify you're using same browser/device

### Styling issues
- Ensure all files are in same folder
- Check that `style.css` is loading (check Network tab in F12)
- Try hard refresh: Ctrl+Shift+R

---

## 📝 Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 80+ | ✅ Full |
| Firefox | 75+ | ✅ Full |
| Edge | 80+ | ✅ Full |
| Safari | 13+ | ✅ Full |
| Opera | 67+ | ✅ Full |

---

## ⚖️ License

This project is open source and available for personal use.

**Disclaimer:** This is a demonstration project for educational purposes. Use at your own risk for storing sensitive information.

---

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts (Inter) for typography
- Inspired by modern password managers

---

## 📧 Support

For issues or questions:
1. Check the troubleshooting section above
2. Open browser console (F12) for error messages
3. Verify all files are properly linked

---

**Made with ❤️ for secure password management**
