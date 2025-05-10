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

<details>
<summary><b>🌟 Key Features</b></summary>

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
</details>

## 🔧 Tech Stack

<details>
<summary><b>Frontend</b></summary>

- ⚛️ React 18
- 📘 TypeScript
- ⚡ Vite
- 🎨 Tailwind CSS
- 🧩 shadcn/ui (UI component library)
- 🔍 Lucide React (icons)
- 🔄 React Router DOM (routing)
- 🔐 Clerk (authentication)
- 📊 React Query (API data fetching)
</details>

<details>
<summary><b>Backend & Data</b></summary>

- 🗃️ Supabase (database and storage)
- 🧠 Google Gemini API (AI model)
</details>

<details>
<summary><b>UI/UX & Additional Libraries</b></summary>

- 🎭 Radix UI (accessible primitives)
- 🔔 Sonner (toast notifications)
- 📝 React Hook Form & Zod (form handling)
- 📄 React Markdown (markdown rendering)
- 📊 Recharts (data visualization)
- 📑 HTML2PDF.js & jsPDF (PDF export)
- 📅 Date-fns (date utilities)
</details>

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

<p align="center">
  Made with ❤️ for the medical community
</p>
