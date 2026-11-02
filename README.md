# Traivio: landing page

Marketing landing page for **Traivio**, an AI travel companion for North Cyprus. Travelers chat with an AI guide that builds personal day-by-day itineraries, suggests hidden spots, local food and beaches, and adapts the plan in real time.

**Live site:** https://spyspoky.github.io/traivio-landing/

## Stack

- Plain **HTML, CSS and vanilla JavaScript**: no frameworks, no build step, no npm
- Google Fonts: **Space Grotesk** (headings) and **Inter** (body)
- No external images: all visuals are pure CSS, inline SVG or emoji
- Hosted on **GitHub Pages** from the `main` branch root

## Files

| File | What it holds |
| --- | --- |
| `index.html` | Page markup: navbar, hero, how it works, demo, destinations, features, pricing, FAQ, waitlist, footer |
| `styles.css` | Dark theme, glass cards, animations and responsive layout |
| `script.js` | Itinerary demo, pricing toggle, FAQ accordion, waitlist validation, scroll and mouse effects |

## Features

- Interactive demo that builds a sample 1-day or 3-day itinerary from real North Cyprus places, with a typing animation
- Animated hero: moving aurora gradient, grain texture, a self-drawing outline of Cyprus and a chat that plays out on a phone mockup
- Scroll-reveal animations, count-up stats, 3D tilt on destination cards and the phone, and a cursor glow
- Monthly / yearly pricing toggle, FAQ accordion and a waitlist form with email validation (no backend)
- Responsive from 375px phones to 1440px+ desktops
- Accessible: semantic HTML, ARIA labels, keyboard support, and `prefers-reduced-motion` turns animations off; mouse effects are off on touch devices

## Run locally

Open `index.html` in a browser. Or serve the folder:

```bash
python -m http.server 5173
```

Then visit http://localhost:5173.

© 2026 Traivio
