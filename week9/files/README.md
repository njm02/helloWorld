# Assignment 2 · Context and evidence study

**Project:** Beach Water Check, the companion app for the Ocean Water Quality Beacon (a physical computing project).
**Format:** Working alone, so this is one small experience designed in two states, using the same rules and comparison method.

Figma file: [Ocean Water Quality Beacon](https://www.figma.com/design/J1Pb5bsoBUaovTzt8HiuRx/Ocean-Water-Quality-Beacon). The design system is on the left of the canvas; the two states are in the **Current · Caution screen** section.

## The experience

A surfer or swimmer at a NYC beach scans the QR code on the beacon and decides, in a few seconds, whether to go in the water and why.

The two states:

1. **Caution:** a recent sample shows elevated bacteria.
2. **No data:** there is no recent sample, so the app must not suggest the water is safe or unsafe.

## Files

| File | What it covers | Assignment part |
|---|---|---|
| [rule-sheet.md](rule-sheet.md) | Person and task, type, color, spacing, reusable parts and their behavior; what must stay, may adapt and must never happen | 1 · Context pack |
| [two-states.md](two-states.md) | The Caution and No data screens and how each rule applies | 1 · Your design |
| [context-comparison/](context-comparison/) | One rule tested by changing one context item: both prompts, the prediction and the comparison record | 2 · Compare and check one rule |
| [process.md](process.md) | How the design changed, the references used, the decisions and the reasons | Supporting evidence |

## The rule under test

> If the data is missing or stale, show **No data** and never a status color.

This is the most important rule in the system. A stale "Good" could send someone into unsafe water, and a stale "Poor" could keep people out for no reason.

## Status this week

- Rule sheet, design system and both states: done.
- Comparison: prompts and prediction written; results to be added after the runs.
- Human observation: not done this week.
- Final project ideas: not included this week.

## AI and source help

Claude helped research references, run a design critique, build the design system and mockups in Figma, and draft these files. Direction and design decisions were mine. Visual references: Ramin Nasibov (Aurevia, PRORS), Melody Ekbatani (Aeri), OEM (oem.care).
