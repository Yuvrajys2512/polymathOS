# Added Features

## Cosmos Tab — 6 New Sub-tabs

All six are accessible inside the **COSMOS** tab, alongside the existing Oracle, Timeline, DNA, Workbench, Lab, Expedition, Council, and Memento sub-tabs.

---

### Neural Storm (`src/components/NeuralStorm/NeuralStorm.jsx`)

A rotating 3D brain sphere built on a Fibonacci point distribution with 140 nodes. Each node is colored by its assigned domain. Nodes are connected to nearby neighbors with translucent edges. Lightning bolts (jagged Bezier arcs with canvas glow) randomly fire between connected nodes and chain-react through the network. The sphere rotates continuously. Sidebar shows per-domain node counts and total signals/sessions. Clicking the canvas or the **TRIGGER STORM** button fires a burst of 14 rapid bolts.

---

### Quantum Collapse (`src/components/QuantumCollapse/QuantumCollapse.jsx`)

Active todos, tasks, and quests are rendered as floating probability clouds on a dark canvas. Each cloud is a stack of oscillating semi-transparent circles pulsing at its own frequency, colored by domain. Positions are hash-stable per item ID so they don't jump between renders. Selecting an item from the sidebar list highlights its cloud (brighter, faster oscillation). Clicking **COLLAPSE** triggers a vortex implosion animation — particles spiral inward, then a crystallized hexagon with inner lattice lines replaces the cloud. Collapsed items persist as crystals for the session.

---

### Cognitive Weather (`src/components/CognitiveWeather/CognitiveWeather.jsx`)

Your mind rendered as a planetary weather system viewed from orbit. The planet is clipped to a circle. Streak days generate a central clarity glow and radial light rays. Focus sessions this week spawn rotating dashed pressure ring systems. Thought density produces drifting cloud blobs (Radial gradient ellipses with slow horizontal drift). A storminess index (thoughts minus sessions and streak) spawns a swirling red particle vortex. A precipitation layer drops dots around the planet ring. Sidebar shows four live metrics (Clarity, Pressure, Precipitation, Storminess) with colored fill bars and a plain-language forecast.

---

### Entropy Engine (`src/components/EntropyEngine/EntropyEngine.jsx`)

A 280-particle physics simulation that reflects the order vs. chaos state of your mind. Each particle is subject to an attraction force toward the nearest hex-lattice point (scales with order level) and a random perturbation force (scales with entropy level). When order is high — streak + habits + recent session + completed todos — particles migrate toward a hexagonal crystalline structure visible as a ghost lattice. When entropy rises the field dissolves into Brownian noise. Particle color shifts from teal (ordered) through amber to red (chaotic). The sidebar shows an entropy gauge, an ORDER percentage, and four stabilizer factor bars (Streak, Habits, Session, Tasks).

Entropy formula: `1 - (streak×0.38 + habitRate×0.28 + sessionRecency×0.2 + todoRate×0.14)`

---

### The Void (`src/components/TheVoid/TheVoid.jsx`)

Full-screen black canvas with 60 near-invisible ambient teal particles drifting at extremely slow speed. Typing into the bottom input and pressing Enter (or ↑) bursts the text from the canvas center — each character becomes an individual glowing particle flying outward, fading as it drifts. Clicking the canvas creates expanding ripple rings. Every 5–9 seconds a random old captured thought drifts in from the left or right edge as dim teal text, traverses the canvas, and fades — an ambient "echo" of past thinking. Submitting text **actually captures it as a thought** via `game.submitThought()`, so the void is a zero-UI capture surface.

---

### Signal Tower (`src/components/SignalTower/SignalTower.jsx`)

A geometric radio tower with a blinking red antenna light drawn on canvas. Expanding wave rings radiate from the antenna tip every 2 seconds. Below the tower: a frequency spectrum with one vertical bar per domain. Bar height is proportional to XP earned in that domain. Bars breathe with a sine wave for a live-signal feel. Thoughts captured in the last hour spike their domain bar upward with a bright white highlight. Clicking any bar — or a legend row in the sidebar — **tunes** to that frequency, highlighting it and displaying its XP in a status line. Sidebar shows the dominant domain and the full XP breakdown per domain with a LIVE badge for recently active ones.
