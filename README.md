# 🌹 Enchanted Love Garden

A romantic themed website for couples featuring interactive sections, user authentication, and theme switching with beautiful animations.

## ✨ Features

- **Love Notes**: Daily affirmations and romantic messages
- **Our Playlist**: Shared music library with mood tracking
- **Koala Garden**: Interactive pet care game
- **Heart Hunt**: Heart collecting mini-game
- **Love Diary**: Shared diary with photo uploads
- **Date Ideas**: Date planning with email sharing
- **Multi-Theme Support**: Dark/mystical, Keychain/green, Bug/nature themes
- **Dual-Partner Authentication**: Separate profiles for each partner
- **Beautiful Animations**: Floating elements and smooth transitions
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/enchanted-love-garden.git
   cd enchanted-love-garden
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🌐 GitHub Pages Deployment

### Automatic Deployment (Recommended)

1. **Fork this repository** or create your own from this template

2. **Update the homepage URL** in `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/your-repo-name"
   ```

3. **Update the base path** in `vite.config.ts`:
   ```typescript
   base: '/your-repo-name/',
   ```

4. **Enable GitHub Pages** in your repository settings:
   - Go to Settings > Pages
   - Source: GitHub Actions
   - The workflow will automatically deploy on push to main branch

### Manual Deployment

```bash
npm install -g gh-pages
npm run deploy
```

## 🎨 Customization

### Themes

The app includes three beautiful themes:

- **Dark Theme** (`dark`): Mystical garden with purple/violet colors
- **Keychain Theme** (`immy`): Soft matcha green with baby pink accents
- **Bug Theme** (`light`): Wood and nature with brown/green colors

### Configuration

- **Passcode**: Default is `2025` (can be changed in `PasscodeEntry.tsx`)
- **User Profiles**: Modify in `UserLogin.tsx`
- **Theme Colors**: Update CSS variables in `styles/globals.css`

## 🛠 Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS v4** for styling
- **Motion** (formerly Framer Motion) for animations
- **ShadCN/UI** for beautiful components
- **LocalStorage** for data persistence

## 📁 Project Structure

```
├── components/          # React components
│   ├── ui/             # Reusable UI components (ShadCN)
│   └── figma/          # Figma-specific components
├── styles/             # Global styles and themes
├── .github/workflows/  # GitHub Actions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.html          # HTML template
```

## 🐛 Troubleshooting

### Common Issues

1. **Blank page after deployment**
   - Check that the `base` path in `vite.config.ts` matches your repository name
   - Ensure GitHub Pages is configured to use GitHub Actions

2. **Build fails**
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript errors with `npm run lint`

3. **Images not loading**
   - Ensure images are in the `public/` directory
   - Check image paths are relative to the base URL

### Support

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/yourusername/enchanted-love-garden/issues)
2. Review the deployment logs in GitHub Actions
3. Ensure all required environment variables are set

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💕 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with 💕 for couples everywhere 🌹