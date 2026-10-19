# Virtual Jellyfish

Three glowing jellyfish swim independently, search for food, grow, and respond to the mouse and their surroundings.

## Controls

Click empty water:  Add a green plankton particle for the jellyfish to eat. 
Click a floating bubble:  Pop the hazard, creating a brief expanding ring. 
Move the mouse near a jellyfish:  It swims away from the pointer instead of searching for food.
Hover over seaweed: Nearby strands sway, then gradually settle.
Refresh the page: Reset all creatures, food, and effects.

After adding food, move the pointer away to let the jellyfish approach it. Food near the bottom may need to drift upward before it enters a jellyfish's reachable swimming area.

## Creature behavior

- Autonomous swimming: Jellyfish move around the ocean, turn at the boundaries, and gently separate from nearby jellyfish.
- Feeding: Each jellyfish searches for the nearest reachable plankton within its detection range. Eaten plankton is removed from the shared food array.
- Energy: Each creature starts with 80 energy. Swimming drains energy, eating restores 15, and a harmful bubble removes 10. Energy stays between 0 and 100.
- Growth: Each meal increases body size by 2, up to 140. Every third meal adds a tentacle, up to nine.
- Visible state: Below 25 energy, swimming slows. Lower energy also dims the creature's glow. Bubble damage triggers a brief white flash.

The status panel uses colored dots to identify the jellyfish. It displays each creature's energy bar, energy value, and total food eaten.

## Codex Prompt

"I'm working on an assignment for my introductory coding class using JavaScript and p5.js.

Assignment: Create a virtual creature using classes. The creature should live in an environment, respond to interactions, and evolve over time.

My project idea: An interactive virtual jellyfish that lives in an underwater environment. The jellyfish will swim around, search for plankton, gain and lose energy, grow over time, and respond to mouse interactions.

I want you to act as my coding tutor and collaborator, not just write the entire project for me.

Important instructions:

- Work with me step by step. Do not generate the entire project at once.
- Break the project into small, manageable stages.
- Before writing code for each stage, explain what we're building and why.
- Keep the code beginner-friendly. I'm still learning JavaScript, classes, objects, methods, loops, conditionals, and functions.
- Explain new programming concepts in simple language as they come up.
- Use standard p5.js functions like `setup()` and `draw()`.
- Avoid unnecessary complexity or advanced programming techniques.
- Add clear, concise comments explaining important parts of the code.
- When adding new code, explain exactly where it goes and how it connects to the existing code.
- Let me test each stage before moving to the next.
- Ask me questions occasionally to check my understanding.
- If something isn't working, help me troubleshoot and understand the problem instead of immediately rewriting everything.
- Encourage me to make small changes myself to practice.
- Do not move to the next stage until I confirm that I'm ready.

For each stage, follow this process:

1. Briefly explain the goal.
2. Introduce any new programming concepts.
3. Show me a small amount of code to add.
4. Explain the important lines and how they work.
5. Tell me how to test the code.
6. Give me one small experiment or modification to try myself.
7. Wait for my response before continuing.
