<div align="center">

# ⚛️ Aether Labs

### Scientific Simulation Suite

[![Made in Greece](https://img.shields.io/badge/Made%20in-Greece-blue?style=for-the-badge)](https://github.com/konpep-dev)
[![Electron](https://img.shields.io/badge/Electron-28-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<img src="public/icon.svg" alt="Aether Labs Logo" width="150" height="150">

**An interactive physics simulation platform designed for students, educators, and science enthusiasts.**

[Download](#-installation) • [Features](#-features) • [Screenshots](#-screenshots) • [Development](#-development)

</div>

---

## ✨ Features

### 📊 Quadratic Explorer
- Real-time parabola visualization with interactive controls
- Advanced analysis: discriminant, roots, vertex, focus, directrix
- Derivative and area calculations
- Multiple presets (Golden Ratio, Perfect Square, Physics equations)
- Snapshot comparison tool

### 🚀 Orbital Reentry Simulator
- Atmospheric reentry physics simulation
- Heat shield and thermal load calculations
- G-Force monitoring
- Aerodynamic drag analysis

### 🌍 Gravity Sandbox 3D
- N-Body gravitational simulation
- Real-time orbital mechanics
- Create and interact with planetary systems
- Energy and velocity tracking
- WASD camera controls

### 🌊 Wave Optics
- Double-slit, single-slit, and diffraction grating simulations
- Real-time interference pattern visualization
- Measurement tools with intensity analysis
- Theoretical diffraction pattern comparison
- Multiple color modes (Cyan, Heatmap, Rainbow, Mono)

### 🛠️ Additional Features
- 📝 **Notes System** - Take notes during simulations with author names and timestamps
- 🌐 **Web Search** - Quick access to physics resources (Wikipedia, Khan Academy, Wolfram Alpha, etc.)
- 🌍 **Bilingual** - Full support for English and Greek
- 📊 **FPS Counter** - Performance monitoring
- 🎨 **Modern UI** - Beautiful dark theme with glassmorphism effects

---

## 📸 Screenshots

<div align="center">
<table>
<tr>
<td align="center"><b>Launcher</b></td>
<td align="center"><b>Quadratic Explorer</b></td>
</tr>
<tr>
<td><img src="screenshots/launcher.png" width="400"></td>
<td><img src="screenshots/quadratic.png" width="400"></td>
</tr>
<tr>
<td align="center"><b>Gravity Sandbox</b></td>
<td align="center"><b>Wave Optics</b></td>
</tr>
<tr>
<td><img src="screenshots/gravity.png" width="400"></td>
<td><img src="screenshots/optics.png" width="400"></td>
</tr>
</table>
</div>

---

## 💾 Installation

### Windows
1. Download the latest release from [Releases](https://github.com/konpep-dev/aether-labs/releases)
2. Run `Aether Labs-Setup-x.x.x.exe`
3. The app installs automatically and creates desktop/start menu shortcuts

### From Source
```bash
# Clone the repository
git clone https://github.com/konpep-dev/aether-labs.git
cd aether-labs

# Install dependencies
npm install

# Run in development mode
npm run electron:dev

# Build for production
npm run package:win    # Windows
npm run package:mac    # macOS
npm run package:linux  # Linux
```

---

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm 9+

### Project Structure
```
aether-labs/
├── components/          # React components
│   ├── Controls.tsx
│   ├── QuadraticChart.tsx
│   ├── GravitySandbox.tsx
│   ├── WaveOptics.tsx
│   ├── ReentrySimulator.tsx
│   └── ...
├── electron/            # Electron main process
│   ├── main.ts
│   └── preload.ts
├── utils/               # Utility functions
│   ├── math.ts
│   └── translations.ts
├── public/              # Static assets
│   ├── icon.ico
│   ├── icon.png
│   └── icon.svg
├── App.tsx              # Main React app
├── index.tsx            # Entry point
└── types.ts             # TypeScript types
```

### Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run electron:dev` | Run Electron in development |
| `npm run build` | Build for production |
| `npm run package:win` | Create Windows installer |
| `npm run package:mac` | Create macOS installer |
| `npm run package:linux` | Create Linux AppImage |

---

## 🧮 Physics Formulas

### Quadratic Equation
```
x = (-b ± √(b²-4ac)) / 2a
```

### Gravitational Force
```
F = G(m₁m₂) / r²
```

### Wave Equation
```
ψ = A·sin(kx - ωt)
```

### Double-Slit Interference
```
Δ = d·sin(θ) = mλ
I = I₀·cos²(πd·sinθ/λ)
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Desktop**: Electron 28
- **Build**: Vite, electron-builder
- **Icons**: Custom SVG

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**konpep**

- GitHub: [@konpep-dev](https://github.com/konpep-dev)

---

<div align="center">

### 🇬🇷 Made with ❤️ in Greece

**© 2026 Aether Labs. All rights reserved.**

</div>
