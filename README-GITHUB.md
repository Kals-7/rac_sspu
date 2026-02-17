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

---

**Rotaract Club of SSPU** - *Connecting members through activities, growth and community impact.* 🌟
