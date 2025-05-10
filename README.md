# Es3af - AI-Powered Medical Assistant

## Project Description
Es3af is an AI-powered medical assistant designed to help medical students and healthcare professionals access simplified medical information through an intuitive chat interface. The application provides detailed explanations of medical concepts, pathophysiology, treatments, and other healthcare topics in a conversational format.

## Features

- **AI-Powered Medical Responses**: Get detailed, accurate medical information using Google's Gemini AI model
- **Multi-language Support**: Available in both English and Arabic
- **Interactive Chat Interface**: User-friendly chat interface with support for text and image inputs
- **Rich Medical Explanations**: Structured responses with definitions, importance, mechanisms, clinical applications, and more
- **Chat Management**: Save, favorite, delete, and export chat conversations
- **Secure Authentication**: User authentication and profile management with Clerk
- **Responsive Design**: Modern UI that works smoothly on desktop and mobile devices
- **Image Upload/Sharing**: Share medical images for more context in discussions
- **Dark/Light Mode**: Choose your preferred theme
- **Quick Access Medical Terms**: Access common medical terms quickly during conversations

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui (UI component library)
- Lucide React (icons)
- React Router DOM (routing)
- Clerk (authentication)
- React Query (API data fetching)

### Backend & Data
- Supabase (database and storage)
- Google Gemini API (AI model)

### UI/UX
- TailwindCSS (styling)
- tailwindcss-animate (animations)
- Embla Carousel (carousel components)
- Radix UI (accessible primitives)
- Sonner (toast notifications)

### Other Libraries
- React Hook Form (form handling)
- Zod (validation)
- React Markdown (markdown rendering)
- Recharts (data visualization)
- HTML2PDF.js & jsPDF (PDF export)
- Date-fns (date utilities)

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```sh
git clone https://github.com/yourusername/es3af.git
cd es3af
```

2. Install dependencies:
```sh
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_API_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_APP_LANG=en   # or ar for Arabic
```

4. Start the development server:
```sh
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Deployment

The project can be easily deployed on Netlify or any other static site hosting service:

1. Build the project:
```sh
npm run build
```

2. Deploy the `dist` folder to your preferred hosting service

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

- Google Gemini API for powering the AI responses
- Supabase for providing backend services
- shadcn/ui for the beautiful component library
- The medical community for input and validation
