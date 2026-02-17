# Rotaract Club of SSPU - Official Website

A modern, responsive website for the Rotaract Club of Symbiosis Skills & Professional University (SSPU) featuring real-time attendance tracking, member management, and professional development tools.

## 🌟 Features

### 📱 Responsive Design
- **Mobile-first approach** with Tailwind CSS
- **Adaptive layouts** for all screen sizes
- **Touch-friendly interface** for mobile devices
- **Dark/Light theme** toggle system

### 👥 Leadership & Members
- **Interactive BOD cards** with professional profiles
- **Member directory** with contact information
- **Role-based organization** (President, Secretary, Directors, etc.)
- **Professional Assistant Officer (PAO)** integration

### 📊 Real-Time Attendance System
- **Live dashboard** with Firebase real-time sync
- **Multi-device collaboration** - multiple users can mark simultaneously
- **Attendance tracking** for Board of Directors meetings
- **Export functionality** for CSV reports
- **Member-level tracking** with Present/Late/Absent status

### 🎨 Professional Features
- **Smooth animations** and micro-interactions
- **Modern UI/UX** with glassmorphism effects
- **Accessibility compliant** design
- **SEO optimized** structure

## 🚀 Quick Start

### Prerequisites
- Node.js (for local development)
- Git
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/rac-sspu-website.git
cd rac-sspu-website
```

2. **Start local server**
```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx serve .

# Or using Live Server in VS Code
```

3. **Open in browser**
```
http://localhost:8000
```

## 📁 Project Structure

```
rac-sspu-website/
├── index.html                 # Main website
├── attendance.html           # BOD Attendance System
├── qr-preview.html          # QR Code for mobile testing
├── qr-test.html            # QR Code testing page
├── styles.css              # Main stylesheet
├── js/
│   ├── mobile-menu.js      # Mobile navigation & interactions
│   ├── flip-cards.js       # Card flip animations
│   └── ipp-ips.js          # IPP & IPS functionality
├── assets/
│   ├── leadership/         # BOD member photos
│   └── logo.png           # Club logo
└── README.md              # This file
```

## 🌐 Pages & Features

### Main Website (`index.html`)
- **Hero section** with call-to-action buttons
- **About section** with tabbed content
- **Leadership showcase** with interactive cards
- **Membership information** and forms
- **Responsive navigation** with hamburger menu
- **Theme toggle** (Dark/Light mode)

### Attendance System (`attendance.html`)
- **Real-time Firebase sync** for live updates
- **BOD member management** with 13+ positions
- **Meeting type tracking** (Regular, Board, Special, etc.)
- **Attendance statistics** and reporting
- **Export to CSV** functionality
- **Multi-user collaboration**

### QR Code Pages
- **Mobile testing** QR codes
- **Cross-device preview** capabilities
- **Local network access** links

## 🔧 Technologies Used

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Modern styling with animations
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript (ES6+)** - Modern JS features
- **Font Awesome** - Icon library

### Backend Services
- **Firebase Realtime Database** - Live data sync
- **Firebase Authentication** - User management (configured)

### Design System
- **Glassmorphism UI** - Modern aesthetic
- **Dark Ocean palette** - Professional color scheme
- **Responsive grid** - Mobile-first layouts
- **Smooth animations** - Micro-interactions

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl)

## 👥 BOD Positions Included

### Core Leadership
- President
- Secretary
- Treasurer
- Joint Secretary & PDD

### Committee Heads
- Professional Assistant Officer (PAO)
- Club Service Directors (2)
- International Service Director & DEI Officer
- Community Service Directors
- Professional Development Director
- Finance Director
- Sergeant At Arms
- IPS, Club Advisor & WRWC

## 🔐 Firebase Setup (Optional)

For real-time attendance features:

1. **Create Firebase project**
2. **Enable Realtime Database**
3. **Update Firebase config** in `attendance.html`
4. **Configure security rules**

```javascript
// Firebase configuration (update with your keys)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
  --primary: #00A8D4;
  --bg-primary: #021826;
  --text-primary: #DFF6FF;
  /* ... */
}
```

### Fonts
- **Inter** - Body text
- **Poppins** - Headings

### Images
Replace placeholder images in `assets/leadership/` with actual member photos.

## 📊 Attendance System Features

### Real-Time Capabilities
- **Live updates** across all connected devices
- **Connection status** indicators
- **Multi-user collaboration**
- **Automatic data sync**

### Meeting Management
- **Meeting types**: Regular, Board, Special, Training, Event
- **Member tracking**: Present, Late, Absent
- **Notes and comments**
- **Timestamp tracking**

### Reporting
- **Attendance rates** calculation
- **CSV export** functionality
- **Meeting history** tracking
- **Individual member statistics**

## 🌍 Deployment

### GitHub Pages
```bash
# Deploy to GitHub Pages
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Netlify/Vercel
1. Connect repository
2. Set build command: `npm run build` (if needed)
3. Set publish directory: `.` (root)
4. Deploy!

### Custom Domain
Update `CNAME` file for custom domain setup.

## 🤝 Contributing

1. **Fork** the repository
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Rotaract International** - For the Rotaract movement
- **SSPU Management** - For supporting the club
- **Firebase/Google** - For real-time database services
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Contact

- **Club Email**: rotaractsspu@gmail.com
- **Website Issues**: Create GitHub Issue
- **Feature Requests**: Create GitHub Discussion

---

**Rotaract Club of SSPU** - *Connecting members through activities, growth and community impact.* 🌟
