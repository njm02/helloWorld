# One Button Ski

## Original game

*SkiFree* (1991) was developed by Chris Pirih for Microsoft Windows. The original game let players steer left and right. In this adaptation, the skier automatically follows a repeating slalom path.

## Controls and objective

SPACEBAR is the only input. Press SPACE to start, then press it again to jump over trees, rocks, crossing bears, and chasing yetis. Each press triggers one jump; wait for the skier to land before jumping again. Avoid collisions and ski as far as you can. The run has no time or distance limit and ends only when you crash.

## Which controls are automated?

Directional steering is the main control automated from the original SkiFree. In the original game, the player chooses where to steer to navigate the slope and avoid obstacles. In this adaptation, the skier automatically turns left and right along a smooth, repeating slalom path. The player cannot change that path.

Downhill movement and speed are also handled automatically: the skier keeps moving, and the game gradually increases speed as the run continues. There are no manual steering, braking, or speed controls in this version.

The remaining gameplay control is **SPACE to jump**. Instead of choosing a route around hazards, the player watches the automatic route and decides when to jump over them. This shifts the challenge toward anticipation and jump timing.

## How to play

1. Press SPACE to start.
2. Watch the skier automatically slalom downhill.
3. Time SPACE to jump over obstacles in the skier's path.
4. Keep jumping to increase your distance score.
5. After a crash, press SPACE to play again.

Open `index.html` directly or use VS Code Live Server to play.

White snow mounds are harmless scenery. Trees and rocks require jumps. Downhill speed gradually rises from 57 to 91 km/h; the gaps gradually shorten. Each hazard targets the automatic slalom path, with enough spacing for a full jump and recovery.

## Classic slope redesign

A wider white slope, stepped evergreen sprites, bright pixel skiers, ski tracks, and gray Windows-style panels evoke classic SkiFree. The mountain is populated with tree clusters, rocks, flags, snow mounds, crossing bears, and chasing yetis. Background objects stay clear of the predicted route. Bears run horizontally across the slope from alternating edges and collide with the player unless jumped over. Bear crossings and yeti chases alternate with tree and rock hazards, preserving time to land between jumps. SPACE remains the only control.

The speed ramp is included in hazard arrival predictions, so bears and obstacles still meet the automatic path as the run accelerates. Restarting resets speed.

Gray pixel yetis with red eyes and yellow teeth enter from the bottom of the screen and run vertically upward in a fixed lane. Jump with SPACE as a yeti reaches you. Their arrival times share the obstacle schedule so the chase leaves time to land before the next hazard.

## Harder course

Hazard types arrive in random order, with bursts of 2–5 consecutive jumps and variable recovery breaks. Additional trees and rocks flank many obstacle rows. Arrival times retain at least 0.94 seconds between hazards, compared with the 0.78-second jump, even during acceleration. Bears still alternate crossing directions.
