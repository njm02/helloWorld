# Virtual Jellyfish

An interactive underwater environment built with JavaScript and p5.js for an introductory coding assignment. Three luminous jellyfish swim independently, search for food, grow, and respond to the mouse and their surroundings.

The assignment is to create a virtual creature using classes that lives in an environment, responds to interactions, and evolves over time.

## Run the project

1. Download or keep the complete project folder, including `libraries`.
2. Open `index.html` in Chrome. You can also open it through VS Code's Live Server extension if installed.
3. Refresh the page to restart the simulation.

No build step is required. The canvas fills the browser viewport and adjusts when the window is resized. Objects scale proportionally, and mouse coordinates are adjusted to match the scene.

## Controls

| Action | Result |
| --- | --- |
| Click empty water | Add a green plankton particle for the jellyfish to eat. |
| Click a rose-colored bubble | Pop the hazard, creating a brief expanding ring. This does not also add food. |
| Move the pointer near a jellyfish | It swims away from the pointer instead of searching for food. |
| Hover over seaweed | Nearby strands sway more strongly, then gradually settle. |
| Refresh the page | Reset all creatures, food, and effects. |

After adding food, move the pointer away to let the jellyfish approach it. Food near the bottom may need to drift upward before it enters a jellyfish's reachable swimming area.

## Creature behavior

- **Autonomous swimming:** Jellyfish move around the ocean, turn at the boundaries, and gently separate from nearby jellyfish.
- **Feeding:** Each jellyfish searches for the nearest reachable plankton within its detection range. Eaten plankton is removed from the shared food array.
- **Energy:** Each creature starts with 80 energy. Swimming drains energy, eating restores 15, and a harmful bubble removes 10. Energy stays between 0 and 100.
- **Growth:** Each meal increases body size by 2, up to 140. Every third meal adds a tentacle, up to nine.
- **Visible state:** Below 25 energy, swimming slows. Lower energy also dims the creature's glow. Bubble damage triggers a brief white flash.

The compact status panel uses colored dots to identify the jellyfish. It displays each creature's energy bar, energy value, and total food eaten. The internal property for the displayed Food count is named `mealsEaten`.

## Environment and visuals

The ocean has a dark depth gradient, drifting background particles, and seaweed anchored along the bottom edges. Jellyfish have translucent curved bells, layered glow, pulsing bodies, and tapered tentacles with sine-wave motion. Four rose-colored hazard bubbles rise through the water and restart below the canvas after a collision, a click, or leaving the top.

## Classes and why they are used

A class is a reusable blueprint. Each object created from it stores its own **properties** (data) and uses **methods** (functions belonging to the object) to act on that data.

| Class | Responsibility |
| --- | --- |
| `Jellyfish` | Stores each creature's position, color, energy, size, and food count; handles movement, feeding, growth, mouse reactions, separation, and drawing. |
| `Plankton` | Represents an individual food particle that drifts upward. |
| `Bubble` | Represents a rising hazard that detects collisions and damages jellyfish. |
| `Seaweed` | Represents a plant strand with its own height, color, and mouse-responsive sway. |
| `OceanParticle` | Represents a small decorative particle drifting through the water. |
| `Pop` | Represents a temporary ring that expands and fades after a bubble is clicked. |

For example, three calls to `new Jellyfish(...)` create three independent creatures from one class. They share the same behavior code, but each has its own energy and growth. Feeding one does not change the others' properties. All three share the plankton array, so they compete for available food.

The constructor sets an object's starting properties. `this` refers to the specific object currently using a method. For example, `this.energy` is that jellyfish's energy, rather than a single energy value shared by every jellyfish.

## How the sketch is organized

- **Arrays at the top:** Store the jellyfish, food, plants, hazards, particles, and pop effects.
- **`setup()`:** Runs once to create the canvas and starting objects.
- **`draw()`:** Runs repeatedly to draw the environment, update objects, handle interactions, and display the status panel.
- **`drawOcean()` and `drawStatusPanel()`:** Draw the background and interface.
- **`mousePressed()`:** Checks for a clicked bubble first, then adds food if no bubble was clicked.
- **Classes:** Keep each type of object's information and behavior together. Most use `update()` to change state and `display()` to draw it. Seaweed also updates its sway strength inside `display()`.
- **Resize helpers:** Resize the canvas, reposition objects, and convert mouse coordinates into scene coordinates.

Important `Jellyfish` methods include `reactToMouse()`, `findFood()`, `separate()`, `eat()`, `update()`, `display()`, and `drawBell()`.

## Connection to the assignment

| Requirement | Implementation |
| --- | --- |
| Use classes | Multiple independent objects are created from the `Jellyfish` class and supporting environment classes. |
| Live in an environment | Creatures share an ocean with food, seaweed, particles, and hazards. |
| Respond to interactions | Jellyfish avoid the pointer, consume food, take bubble damage, and separate from neighbors. The user can feed them, pop bubbles, and disturb seaweed. |
| Evolve over time | Energy changes continuously; eating produces lasting increases in size and tentacle count. |

The project practices arrays, loops, conditionals, functions, classes, constructors, properties, methods, distance calculations, and animation. `sin()` creates repeating motion, while `lerp()` and `lerpColor()` create gradual transitions.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Loads p5.js, the stylesheet, and the sketch. |
| `sketch.js` | Contains the simulation, classes, interactions, and drawing code. |
| `style.css` | Removes page margins and scrollbars for the full-window canvas. |
| `libraries/` | Contains the local p5.js libraries loaded by the page. |
| `jsconfig.json` | Provides JavaScript editor configuration. |

## Current simplifications

- Collision detection uses an approximate circular area inside the bell, rather than the exact outline or tentacles.
- Jellyfish remain alive at zero energy; they become dimmer and slower.
- Movement, energy use, and effect durations are frame-based, so their timing depends on the actual frame rate.
- Gentle separation discourages overlap but does not prevent every overlap.
- Harmful bubbles are a fictional gameplay element, not a biological model.

## Small changes to experiment with

- Change the colors passed to `new Jellyfish(...)` in `setup()`.
- Adjust `detectionRange` or `mouseRange` in the jellyfish constructor.
- Change the starting bubble count to adjust the number of hazards.
- Adjust the energy restored in `eat()` or the damage in `Bubble.update()`.
- Change the two colors in `drawOcean()` to try a different underwater palette.
