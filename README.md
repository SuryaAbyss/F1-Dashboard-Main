# 🏎️ FormulaF1 Dash By Surya

A comprehensive, real-time Formula 1 dashboard application built with Next.js, providing live race data, analytics, and interactive visualizations for F1 enthusiasts.

![Formula 1 Dashboard](https://img.shields.io/badge/Formula%201-Dashboard-red?style=for-the-badge&logo=formula1)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-UI-black?style=for-the-badge)

## ✨ Features

### 🎯 Core Features
- **Live Race Dashboard** - Real-time race data and telemetry
- **Interactive Track Map** - Visual representation of driver positions on track
- **Race Control Messages** - Live updates from race control
- **Driver Analytics** - Detailed driver performance metrics and comparisons
- **Driver Standings** - World Championship standings display
- **Race Replay** - Replay past races with synchronized data visualization
- **Multi-Session Support** - View data from Practice, Qualifying, and Race sessions

### 🎨 UI/UX Features
- **Modern Dark Theme** - Eye-friendly interface optimized for extended viewing
- **Animated Sidebar Logo** - Typewriter effect animation (loops every 7 seconds)
- **Responsive Design** - Optimized for all screen sizes
- **Priority Driver Selection** - Top teams prominently featured in analytics
- **Real-time Updates** - Live data streaming with WebSocket support

### 🔧 Technical Features
- **OpenF1 API Integration** - Leveraging official F1 data sources
- **Type-Safe Development** - Full TypeScript implementation
- **Component Library** - Built with shadcn/ui components
- **Optimized Performance** - Efficient rendering and data caching
- **Modular Architecture** - Clean, maintainable codebase

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SuryaAbyss/F1-Dashboard-Main.git
   cd F1-Dashboard-Main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
F1-Dashboard-Main/
├── app/                    # Next.js app directory
│   ├── analytics/         # Driver analytics page
│   ├── race-replay/       # Race replay feature
│   ├── settings/          # Settings page
│   └── page.tsx           # Main dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Feature components
├── lib/                  # Utility functions and configs
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## 🎮 Usage

### Main Dashboard
The main dashboard displays:
- Live track map with driver positions
- Race control messages
- Driver standings for World Championship
- Session information
- Real-time telemetry data

### Driver Analytics
Navigate to the analytics page to:
- Compare driver performance
- View detailed telemetry
- Analyze lap times and sector performance
- Access top team drivers with priority

### Race Replay
Experience past races with:
- Time-synchronized playback
- Track position visualization
- Telemetry data replay
- Playback controls (play, pause, speed adjustment)

## 🛠️ Built With

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Recharts](https://recharts.org/)** - Data visualization
- **[OpenF1 API](https://openf1.org/)** - F1 data source
- **[Lucide Icons](https://lucide.dev/)** - Icon library

## 🎨 Key Components

- **Track Map** - Interactive circuit visualization with live positions
- **Race Control** - Real-time message feed from race officials
- **Telemetry Charts** - Speed, RPM, throttle, and brake data visualization
- **Driver Cards** - Detailed driver information and statistics
- **Session Selector** - Switch between different race weekend sessions
- **Animated Sidebar** - Branded navigation with typewriter effect

## 📊 Data Sources

This application uses the OpenF1 API to fetch:
- Live timing data
- Driver positions and telemetry
- Race control messages
- Session information
- Historical race data

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 👨‍💻 Author

**Surya**
- GitHub: [@SuryaAbyss](https://github.com/SuryaAbyss)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/surya-abyss)

## 📝 License

This project is open source and available for personal and educational use.

## 🙏 Acknowledgments

- OpenF1 for providing the API
- Formula 1 for the amazing sport
- shadcn for the excellent UI components
- The F1 community for inspiration

## 🔮 Future Enhancements

- [ ] Driver comparison tool
- [ ] Lap time predictions
- [ ] Weather integration
- [ ] Push notifications for race events
- [ ] Mobile app version
- [ ] Historical statistics dashboard
- [ ] Fantasy F1 integration

---

**Developed with ❤️ for Formula 1 fans worldwide**

*Note: This is an unofficial fan project and is not affiliated with Formula 1 or FIA.*
