# ⏱ Tick Tock — Stopwatch & Timer App

A polished, pastel-themed **Stopwatch and Timer** app built with **React + Vite**. Features a 2D hand-drawn design style with thick borders, hard shadows, and a soft pastel colour palette — all powered by Tailwind CSS.

---

## ✨ Features

### ⏱ Stopwatch
- **Start / Pause / Reset** controls
- **Lap tracking** — record multiple laps with a single button
- Automatically highlights the 🥇 **fastest** and 🐢 **slowest** laps
- Centisecond precision display (`MM:SS.cs` / `HH:MM:SS.cs`)
- Pulsing animation while running

### ⏳ Timer
- **Custom time input** — set hours, minutes, and seconds manually
- **Quick presets** — 1 min, 5 min, 10 min, 25 min (Pomodoro)
- Animated **SVG progress ring** that drains as time counts down
- 🎉 Celebration state with wiggle animation when time's up
- **Start / Pause / Reset** controls

### 🎨 Design
- **2D drawing style** — thick `3px` black borders, hard offset box-shadows (no blur)
- **Pastel colour palette** — pink, purple, blue, mint, yellow, peach & lavender
- **Doodle background** — full-screen SVG with stars, circles, dots, crosses, diamonds, zigzags, and wavy lines
- **Fredoka One** (display) + **Nunito** (UI) Google Fonts
- Smooth hover/press button animations
- Fully responsive layout

---

## 🛠 Tech Stack

| Tool | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [Vite 8](https://vite.dev/) | Build tool & dev server |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Vanilla CSS](src/index.css) | Custom design system (2D theme, animations) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# Clone the repository
git clone https://github.com/0nlyjs/Stopwatch-and-timer-app.git
cd Stopwatch-and-timer-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173** (or the next available port).

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── App.jsx        # All components — DoodleBg, Stopwatch, Timer, App
├── index.css      # Tailwind v4 import + custom 2D/pastel design system
└── main.jsx       # React entry point
index.html         # HTML shell with Google Fonts preload
vite.config.js     # Vite + Tailwind plugin config
```

---

## 🧩 Component Overview

| Component | Description |
|---|---|
| `DoodleBg` | Full-screen SVG doodle background (110+ decorative elements) |
| `Stopwatch` | Stopwatch with lap tracking, fastest/slowest highlights |
| `Timer` | Countdown timer with progress ring, presets, and custom input |
| `App` | Root component with tab switching between modes |

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server with HMR |
| `npm run build` | Build optimised production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
