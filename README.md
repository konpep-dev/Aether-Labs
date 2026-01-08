<div align="center">

<img src="public/icon.svg" alt="Aether Labs" width="120" height="120">

# Aether Labs

### ✦ Scientific Simulation Suite ✦

<br>

[![Version](https://img.shields.io/badge/version-1.0.0-00e5ff?style=flat-square)](https://github.com/konpep-dev/aether-labs/releases)
[![Electron](https://img.shields.io/badge/Electron-28-47848F?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE)

<br>

**Explore the beauty of physics through interactive simulations.**

*Designed for students, educators, and science enthusiasts.*

<br>

[⬇️ Download](#-quick-start) &nbsp;•&nbsp; [✨ Features](#-simulations) &nbsp;•&nbsp; [🛠️ Build](#-development) &nbsp;•&nbsp; [📖 Docs](#-physics-reference)

<br>

---

<br>

</div>

## 🎯 Overview

**Aether Labs** is a modern desktop application that brings physics concepts to life through beautiful, real-time visualizations. Whether you're studying quadratic equations, exploring gravitational systems, or understanding wave interference, Aether Labs provides an intuitive and engaging learning experience.

<br>

## 🔬 Simulations

<table>
<tr>
<td width="50%">

### 📊 Quadratic Explorer
Visualize and analyze quadratic equations in real-time.

- Interactive parabola with draggable parameters
- Discriminant, roots, vertex & axis of symmetry
- Focus point & directrix visualization
- Derivative & area calculations
- 14+ presets including Golden Ratio & Physics

</td>
<td width="50%">

### 🚀 Reentry Simulator
Experience atmospheric reentry physics.

- Spacecraft trajectory simulation
- Heat shield & thermal load analysis
- G-Force monitoring
- Aerodynamic drag calculations
- Real-time telemetry display

</td>
</tr>
<tr>
<td width="50%">

### 🌍 Gravity Sandbox 3D
Create and explore gravitational systems.

- N-Body gravitational simulation
- Real-time orbital mechanics
- WASD camera controls + mouse orbit
- Energy & velocity tracking
- Collision detection (merge/bounce)

</td>
<td width="50%">

### 🌊 Wave Optics
Understand light interference patterns.

- Double-slit, single-slit & diffraction grating
- Real-time interference visualization
- Measurement tools & intensity analysis
- Theoretical pattern comparison
- Multiple color modes

</td>
</tr>
</table>

<br>

## ✨ Features

<table>
<tr>
<td>📝</td>
<td><b>Notes System</b></td>
<td>Take notes during simulations with timestamps and author names</td>
</tr>
<tr>
<td>🌐</td>
<td><b>Web Search</b></td>
<td>Quick access to Wikipedia, Khan Academy, Wolfram Alpha & more</td>
</tr>
<tr>
<td>🌍</td>
<td><b>Bilingual</b></td>
<td>Full support for English and Greek languages</td>
</tr>
<tr>
<td>📊</td>
<td><b>FPS Counter</b></td>
<td>Monitor performance in real-time</td>
</tr>
<tr>
<td>🎨</td>
<td><b>Modern UI</b></td>
<td>Beautiful dark theme with glassmorphism effects</td>
</tr>
<tr>
<td>💾</td>
<td><b>Auto-save</b></td>
<td>Your notes and settings are automatically saved</td>
</tr>
</table>

<br>

## ⬇️ Quick Start

### Windows Installation

1. Download the latest **[Aether Labs Setup](https://github.com/konpep-dev/aether-labs/releases/latest)**
2. Run the installer (one-click install)
3. Launch from Desktop or Start Menu

> 💡 The installer creates shortcuts automatically and runs the app after installation.

<br>

### Build from Source

```bash
# Clone repository
git clone https://github.com/konpep-dev/aether-labs.git
cd aether-labs

# Install dependencies
npm install

# Development mode
npm run electron:dev

# Build installer
npm run package:win      # Windows
npm run package:mac      # macOS  
npm run package:linux    # Linux
```

<br>

## 📖 Physics Reference

<div align="center">

| Formula | Description |
|:-------:|:------------|
| `x = (-b ± √Δ) / 2a` | Quadratic Formula |
| `Δ = b² - 4ac` | Discriminant |
| `F = G(m₁m₂) / r²` | Gravitational Force |
| `ψ = A·sin(kx - ωt)` | Wave Equation |
| `Δ = d·sin(θ) = mλ` | Interference Condition |

</div>

<br>

## 🛠️ Development

### Tech Stack

| Category | Technology |
|:---------|:-----------|
| Frontend | React 19, TypeScript, Tailwind CSS |
| Charts | Recharts |
| Desktop | Electron 28 |
| Build | Vite, electron-builder |

### Project Structure

```
aether-labs/
├── components/     # React components (14 files)
├── electron/       # Main process & preload
├── utils/          # Math, translations, physics
├── public/         # Icons & assets
├── App.tsx         # Main application
└── types.ts        # TypeScript definitions
```

<br>

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Fork → Clone → Branch → Code → Push → PR
git checkout -b feature/amazing-feature
git commit -m "Add amazing feature"
git push origin feature/amazing-feature
```

<br>

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) for details.

<br>

---

<div align="center">

<br>

**Built with ❤️ in Greece**

<br>

[![GitHub](https://img.shields.io/badge/GitHub-konpep--dev-181717?style=flat-square&logo=github)](https://github.com/konpep-dev)

<br>

<sub>© 2026 Aether Labs. All rights reserved.</sub>

</div>
