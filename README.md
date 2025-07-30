# RPG Character Sheet

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)](https://github.com/Zawtt/rpg-app)

A modern, interactive character sheet application built with React and Vite for tabletop RPG enthusiasts. This project provides a comprehensive digital solution for managing character stats, abilities, inventory, and dice rolling in a sleek, responsive interface.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Development](#development)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

## Features

### Core Functionality
- **Character Management**: Complete character creation and customization system
- **Dynamic Dice Roller**: Advanced dice rolling with visual feedback and multiple dice types
- **Ability System**: Create, manage, and track spells and abilities with cooldown mechanics
- **Inventory Management**: Interactive inventory system with item categorization
- **Turn Counter**: Built-in turn tracking for combat scenarios
- **Theme System**: Multiple visual themes with real-time switching

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Instant feedback and state management
- **Keyboard Navigation**: Full keyboard accessibility support
- **Local Storage**: Automatic saving of character data
- **Modal System**: Intuitive popup interfaces for detailed interactions

## Demo

Visit the live demo: [RPG Character Sheet Demo](https://your-demo-link.com)

![Screenshot](https://via.placeholder.com/800x450/1a1a1a/ffffff?text=RPG+Character+Sheet+Preview)

## Installation

### Prerequisites
- Node.js (version 16.0 or higher)
- npm or yarn package manager

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Zawtt/rpg-app.git

# Navigate to project directory
cd rpg-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Usage

### Character Creation
1. Open the application
2. Fill in character details (name, race, class, stats)
3. Customize appearance and background
4. Save your character

### Managing Abilities
- Click "+" to add new abilities
- Set cost, cooldown, and description
- Use abilities by clicking on them
- Track cooldowns automatically

### Dice Rolling
- Select dice type (D4, D6, D8, D10, D12, D20, D100)
- Enter custom expressions (e.g., "2d6+3")
- View detailed roll results and history

### Inventory Management
- Add items with custom properties
- Organize by categories
- Track quantities and weights
- Search and filter functionality

## Project Structure

```
rpg-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── CharacterSheet/
│   │   ├── DiceRoller/
│   │   ├── AbilitiesAndSpells/
│   │   ├── Inventory/
│   │   └── ThemeProvider/
│   ├── contexts/
│   │   └── AppContext.js
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── styles/
│   │   ├── index.css
│   │   └── themes.css
│   ├── utils/
│   │   └── diceUtils.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## Technologies

### Frontend Framework
- **React 18**: Modern React with hooks and concurrent features
- **Vite**: Next-generation frontend tooling for fast development

### Styling & UI
- **CSS3**: Custom styling with CSS variables and flexbox/grid
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Lucide React**: Beautiful, customizable SVG icons

### State Management
- **React Context**: Global state management for application data
- **Local Storage**: Persistent data storage in browser

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Vite HMR**: Hot module replacement for fast development

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Code Style

This project follows standard React and JavaScript conventions:
- Use functional components with hooks
- Implement proper error boundaries
- Follow component composition patterns
- Maintain consistent naming conventions

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_TITLE="RPG Character Sheet"
VITE_APP_VERSION="1.0.0"
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write clean, documented code
- Include tests for new features
- Update documentation as needed
- Follow existing code style

## Roadmap

### Phase 1 (Current)
- [x] Character creation system
- [x] Basic dice rolling
- [x] Ability management
- [x] Inventory system

### Phase 2 (Next Release)
- [ ] Combat tracking system
- [ ] Status effects management
- [ ] Character sheet templates
- [ ] Export/import functionality

### Phase 3 (Future)
- [ ] Multiplayer support
- [ ] Campaign management
- [ ] Advanced automation
- [ ] Mobile application

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Developed with passion for the RPG community**

For questions, suggestions, or support, please [open an issue](https://github.com/Zawtt/rpg-app/issues) or contact the development team.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=flat-square&logo=github)](https://github.com/Zawtt/rpg-app)
[![Issues](https://img.shields.io/github/issues/Zawtt/rpg-app?style=flat-square)](https://github.com/Zawtt/rpg-app/issues)
[![Stars](https://img.shields.io/github/stars/Zawtt/rpg-app?style=flat-square)](https://github.com/Zawtt/rpg-app/stargazers)