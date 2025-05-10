# <img src="https://img.icons8.com/color/48/000000/health-checkup.png" width="32" height="32"/> Es3af

> **Your AI-Powered Medical Assistant**

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.49-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

![Es3af Demo](https://placehold.co/800x400/6366f1/FFFFFF/png?text=Es3af+Medical+Assistant&font=montserrat)

## 🩺 Overview

Es3af is an intelligent medical assistant designed to help medical students and healthcare professionals access simplified medical information through an intuitive chat interface. Powered by Google's Gemini AI, Es3af provides detailed explanations of medical concepts, pathophysiology, treatments, and other healthcare topics in a conversational format.

<b>🌟 Key Features</b>

- 🤖 **AI-Powered Medical Responses** - Get detailed, accurate medical information using Google's Gemini AI model
- 🌐 **Multi-language Support** - Available in both English and Arabic
- 💬 **Interactive Chat Interface** - User-friendly chat interface with support for text and image inputs
- 📚 **Rich Medical Explanations** - Structured responses with definitions, importance, mechanisms, clinical applications, and more
- 📂 **Chat Management** - Save, favorite, delete, and export chat conversations
- 🔒 **Secure Authentication** - User authentication and profile management with Clerk
- 📱 **Responsive Design** - Modern UI that works smoothly on desktop and mobile devices
- 🖼️ **Image Upload/Sharing** - Share medical images for more context in discussions
- 🌓 **Dark/Light Mode** - Choose your preferred theme
- ⚡ **Quick Access Medical Terms** - Access common medical terms quickly during conversations


## 🔧 Tech Stack

<div align="center">
  <table>
    <tr>
      <td align="center" width="96">
        <img src="https://techstack-generator.vercel.app/react-icon.svg" alt="React" width="48" height="48" />
        <br/>React
      </td>
      <td align="center" width="96">
        <img src="https://techstack-generator.vercel.app/ts-icon.svg" alt="TypeScript" width="48" height="48" />
        <br/>TypeScript
      </td>
      <td align="center" width="96">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" alt="Vite" width="48" height="48" />
        <br/>Vite
      </td>
      <td align="center" width="96">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" alt="Tailwind" width="48" height="48" />
        <br/>Tailwind
      </td>
      <td align="center" width="96">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" alt="Supabase" width="48" height="48" />
        <br/>Supabase
      </td>
      <td align="center" width="96">
        <img src="https://www.vectorlogo.zone/logos/reactrouter/reactrouter-icon.svg" alt="React Router" width="48" height="48" />
        <br/>Router
      </td>
    </tr>
    <tr>
      <td align="center" width="96">
        <img src="https://avatars.githubusercontent.com/u/14957082" alt="Gemini AI" width="48" height="48" />
        <br/>Gemini AI
      </td>
      <td align="center" width="96">
        <img src="https://clerk.com/images/logo/clerk-logomark-light.svg" alt="Clerk" width="48" height="48" />
        <br/>Clerk
      </td>
      <td align="center" width="96">
        <img src="https://raw.githubusercontent.com/TanStack/query/main/media/logo.svg" alt="React Query" width="48" height="48" />
        <br/>React Query
      </td>
      <td align="center" width="96">
        <img src="https://cdn.worldvectorlogo.com/logos/zod.svg" alt="Zod" width="48" height="48" />
        <br/>Zod
      </td>
      <td align="center" width="96">
        <img src="https://avatars.githubusercontent.com/u/75042455" alt="Radix UI" width="48" height="48" />
        <br/>Radix UI
      </td>
      <td align="center" width="96">
        <img src="https://avatars.githubusercontent.com/u/139895814" alt="shadcn UI" width="48" height="48" />
        <br/>shadcn/ui
      </td>
    </tr>
  </table>
</div>

<b>⚛️ Frontend</b>

- React 18 - JavaScript library for building user interfaces
- TypeScript - Type-safe programming language
- Vite - Frontend build tool for rapid development
- Tailwind CSS - Utility-first CSS framework
- shadcn/ui - Beautifully designed components built with Radix UI and Tailwind
- Lucide React - Beautiful & consistent icon toolkit
- React Router DOM - Client-side routing for React applications
- Clerk - Complete user management and authentication
- React Query - Powerful data synchronization for React


<b>🗃️ Backend & Data</b>

- Supabase - Open-source Firebase alternative (database, auth, storage)
- Google Gemini API - Google's advanced language model


<b>🎭 UI/UX & Additional Libraries</b>

- Radix UI - Unstyled, accessible UI components
- Sonner - Toast notification component for React
- React Hook Form & Zod - Form validation and handling
- React Markdown - Markdown renderer for React
- Recharts - Composable charting library built on React components
- HTML2PDF.js & jsPDF - PDF generation tools
- Date-fns - Modern JavaScript date utility library


## 📂 Project Structure

```
es3af/
├── dist/                   # Build output directory
├── public/                 # Public assets
├── src/
│   ├── components/
│   │   ├── layout/         # Layout components (Header, Footer, Sidebar)
│   │   ├── ui/             # UI components from shadcn
│   │   └── ui-custom/      # Custom UI components
│   ├── hooks/              # Custom React hooks
│   │   ├── useChat.js      # Chat functionality hook
│   │   ├── useGemini.js    # AI integration hook
│   │   └── ...
│   ├── lib/                # Utility functions and configurations
│   │   ├── supabaseFunctions.js  # Database operations
│   │   ├── fetchTTS.js           # Text-to-speech service
│   │   └── helpers.js            # Helper functions
│   ├── App.tsx            # Main application component
│   ├── index.css          # Global styles
│   ├── main.tsx           # Application entry point
│   └── supabase.js        # Supabase client setup
├── index.html             # HTML entry point
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1️⃣ **Clone the repository:**
```sh
git clone https://github.com/yourusername/es3af.git
cd es3af
```

2️⃣ **Install dependencies:**
```sh
npm install
```

3️⃣ **Configure environment variables:**

Create a `.env` file in the root directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_API_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_APP_LANG=en   # or ar for Arabic
```

4️⃣ **Start the development server:**
```sh
npm run dev
```

5️⃣ **Open your browser:**
Navigate to `http://localhost:5173`

## 🖥️ Demo Screenshots

<div align="center">
  <img src="https://placehold.co/800x450/6366f1/FFFFFF/png?text=Landing+Page" alt="Landing Page" width="400" />
  <img src="https://placehold.co/800x450/6366f1/FFFFFF/png?text=Chat+Interface" alt="Chat Interface" width="400" />
</div>

<div align="center">
  <img src="https://placehold.co/800x450/6366f1/FFFFFF/png?text=Dashboard" alt="Dashboard" width="400" />
  <img src="https://placehold.co/800x450/6366f1/FFFFFF/png?text=Medical+Information" alt="Medical Information" width="400" />
</div>

## 🌐 Deployment

```sh
# Build the project
npm run build

# Deploy the dist folder to your preferred hosting service
# We recommend Netlify, Vercel, or GitHub Pages
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Google Gemini API for powering the AI responses
- Supabase for providing backend services
- shadcn/ui for the beautiful component library
- The medical community for input and validation

---

<div align="center">
  <img src="https://img.icons8.com/color/48/000000/health-checkup.png" width="24" height="24"/>
  <p>Made with ❤️ for the medical community</p>

</div>
