# Splito Frontend — Premium Financial Interface

Splito is a cutting-edge user interface built to redefine how users interact with shared finances. It combines high-end aesthetics with a fluid, responsive experience, featuring the custom "Magic Bento" design system.

---

## Core UI Features

- **Magic Bento Dashboard**: An interactive, grid-based dashboard with dynamic spotlight effects and particle animations.
- **Intelligent Theme System**: Comprehensive Light and Dark mode support with persistent user preferences across sessions.
- **Fluid Micro-interactions**: GSAP-powered transitions and hover effects that provide immediate visual feedback.
- **Responsive Navigation**: A versatile layout optimized for seamless use across mobile, tablet, and desktop devices.
- **Interactive Financial Modals**: Clean, portal-based overlays for managing group details, settlements, and expenses.

---

## Technology Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | React 18 with Vite |
| **Styling** | Vanilla CSS with CSS Custom Properties (Variables) |
| **Animations** | GSAP (GreenSock Animation Platform) |
| **API Client** | Axios with interceptor-ready configuration |
| **Icons** | Lucide React / Custom SVG Assets |

---

## Project Structure

```text
src/
├── components/      # UI Components (Dashboard, Groups, Profile, etc.)
│   └── MagicBento/  # Core design system components and styles
├── assets/          # Static media and global icons
├── hooks/           # Custom React hooks for state and API logic
├── App.jsx          # Main application entry and routing logic
└── index.css        # Global design tokens and foundational styles
```

---

## Development Setup

### 1. Installation
```bash
git clone https://github.com/ayushkumarsinghh/splito-frontend.git
cd splito-frontend
npm install
```

### 2. Environment Configuration
Create a .env file in the root directory:
```bash
VITE_API_URL=http://localhost:3000
```

### 3. Execution
```bash
# Start development server
npm run dev

# Build for production
npm run build
```

---

## UI Highlights

### Magic Bento System
The application utilizes a custom Bento-grid layout that prioritizes information hierarchy. Each panel features a dynamic hover effect that tracks the user's cursor, providing a "spotlight" feel that emphasizes the premium nature of the app.

### Dynamic Theme Engine
The theme system is built entirely on CSS Variables, allowing for instantaneous switching between light and dark modes without page reloads. The system automatically detects and applies the user's preferred color scheme while providing a manual toggle for full control.

---

## Conclusion

Splito Frontend is more than just a finance tool; it is a showcase of modern web capabilities. By prioritizing visual excellence and smooth performance, it lowers the barrier to managing shared expenses, making financial coordination an engaging rather than a tedious task. The interface is built to be modular and scalable, ready for future feature expansions such as real-time notifications and data visualization.
