# Beach Water Check: design system and mockup process

Companion app for the Ocean Water Quality Beacon, a physical computing project. Built for Assignment 2 (Context and evidence study), due November 16, 2026. Working solo.

Figma file: [Ocean Water Quality Beacon](https://www.figma.com/design/J1Pb5bsoBUaovTzt8HiuRx/Ocean-Water-Quality-Beacon), page **Design System**. The canvas has the design system, a **Current · Caution screen** section and an **Archive** section.

## Person and task

A surfer or swimmer at a NYC beach scans the QR code on the beacon and decides, in a few seconds, whether to go in the water and why. They are standing on the sand, often in bright sun, sometimes with wet hands.

Assumptions still to check with a real person:

- They can read the status and the reason within about 5 seconds.
- They notice when the data was last updated.
- They read "no data" as "unknown", not as "probably fine".

## How the design changed

### v1: a first rule sheet

The first system was built for outdoor legibility: Atkinson Hyperlegible, a navy and sand palette, an 8px spacing scale, and a status card with four variants (Good, Caution, Poor, No data). Each status paired a color with an icon shape and a word, so it never relied on color alone. "NO RECENT DATA" was shortened to "NO DATA" because it wrapped to three lines at 44px.

It worked, but it felt generic. I wanted something more modern and distinctive.

### Looking for a direction

I looked through Ramin Nasibov's portfolio and picked two case studies:

- **Aurevia** (mining company): a palette taken from the site itself, fine parallel contour lines, sign-style large numbers. Its colors fit the ocean and sand, but I worried red, yellow and green would clash with it.
- **PRORS** (shipment risk): near-black, greys and white, wide light type, and a single pop of orange that marks what needs attention. Very minimal, but nothing about it says ocean.

I mocked up the same status screen three ways (Aurevia only, PRORS only, and a combination) before committing. In the Aurevia version the yellow Caution marker got lost in the teal. I chose the PRORS direction: neutrals with red, yellow and green as the only colors. The identity would come from the logo, motion and small details instead of the palette.

### v2: Apple-inspired neutrals

The second system used black, white and Apple-style greys, with Apple's system green, yellow and red as the status colors. Typography came from an Aurevia signage screenshot: a wide letterspaced wordmark, a clean grotesk, and a monospace for labels. I first built Light and Dark modes, then cut it to dark only so the colors would pop.

### Adding glass, data and detail

Two more references shaped the look:

- **Aeri** (Melody Ekbatani's AR diabetes concept): frosted glass panels, range bars that show where a reading falls between good and bad, and a line chart with summary numbers.
- **OEM** (oem.care): small rounded pills, dot-matrix numerals, a dotted logo, and translucent grey overlays on a soft gradient.

From these I added glass surfaces, a range bar, a trend chart, pill tabs, a notice pill, and Doto, a dot-matrix typeface that echoes the beacon's LED panel. OEM's text font turned out to be ABC Diatype, a paid font, so I switched the text styles from Inter to Geist, the closest free match.

The glass first looked almost black. OEM's panels look grey because of what sits behind them, so I added a sky-to-sand gradient backdrop and changed the glass to a mid grey at about 40% opacity. I also replaced the text wordmark with a placeholder logo: a water drop drawn in 14 dots.

### Simplifying

I cut the mockup down to the status, a forecast notice, tabs, and the readings, removing the trend chart and button for now. A copy pass changed "HEADS UP" to "FORECAST", spelled out "hours", and completed the unit as "MPN/100 mL". I removed the status card, glow, chart, notice, range bar and reading row components from the system. The mockup keeps those pieces as plain layers.

### Critique and contrast fixes

A structured critique of the Caution screen found three main problems: contrast was too low for reading outdoors (white text near the bottom was about 2:1), the big beach number "86" read as the answer instead of "Caution", and the update time was only a tiny dot-matrix label.

I tried several versions side by side:

- A darker version passed contrast but lost the sky-to-sand feel.
- The version I kept brings most of the sky and sand back and makes the glass more opaque toward the bottom (72% at the top to 86% at the bottom), where the sand is brightest. Main text now passes 4.5:1 down the sheet.
- I tried adding frost cues (a sheen, a brighter rim, grain) but they weren't worth it.

Other fixes: removed "86", added a plain "Updated 9:20 AM" line, made the forecast dot neutral so yellow only means water quality, renamed the arrow link "Source and test details", raised tabs and the link to 44pt touch targets, removed decorative grey squares, and snapped radius and padding to the scale. The original light version is kept in the archive for reference.

### The physical beacon

I compared four beacon concepts (rail box, vertical beacon, circular beacon, angled kiosk) and chose the **circular beacon with a horseshoe-shaped light ring**. Its ring and round center face map directly to a round hero in the app, it reads from every direction, and it fits the drop logo and dot-matrix type.

Planned build: a 64×64 RGB LED matrix behind a round smoked-acrylic window for the text, addressable LED neon flex in a 270° horseshoe for the ring, an Adafruit Matrix Portal S3 (Wi-Fi) to fetch data and drive both, and one 5V supply. Each status has its own light rhythm (steady, slow pulse, fast pulse) so it never relies on color alone. A device mockup with the three states and an exploded layer view is on a separate design canvas. Direct sunlight is a known limit of indoor LED panels.

### The horseshoe hero

The beacon's ring glows fully in the status color. In the app, the same horseshoe becomes a gauge:

- The track shows the full red → yellow → green scale at 14% strength.
- The fill shows the same gradient at full strength up to the reading, with a white dot marking the exact value.
- The fill measures quality, not bacteria, so it grows as water gets better. Thresholds are mapped so the fill always ends in the zone that matches the status (Poor in the first third, Caution in the middle, Good in the last third).
- A soft glow in the status color runs along the edge of the glass sheet, echoing the beacon's light.

Along the way I tried and dropped a single-color fill, a glow behind the ring, a glow in the center and zone tick marks. The hero also replaced the Enterococci range bar, so the screen has one scale instead of two.

### Menu bar and scrolling

Based on OEM's site, I added a fixed menu bar with no background: a "Beaches" pill, the logo and an "About" pill. Content scrolls underneath and shows through the translucent pills. The logo and labels are black over the sky at the top, then switch to white when the glass sheet scrolls under the bar (a 150–200 ms crossfade). Figma prototypes can't change colors based on scroll position, so the switch is shown in two static frames with a handoff note. The logo was reduced to 80% so it doesn't compete with the buttons, and it is centered on the screen rather than between the pills.

All mockups were resized from 390 to 402 wide to match the iPhone 17 and 18 Pro, and the top spacing was adjusted to clear the Dynamic Island.

## The design system now

### Typography

| Style | Font | Size / line height | Used for |
|---|---|---|---|
| Display | Geist Light | 88 / 88 | Not on the current screen (was the beach number) |
| Status | Geist Regular | 44 / 48 | Status word |
| Title | Geist Regular | 28 / 34 | Beach name |
| Headline | Geist SemiBold | 17 / 24 | Advice |
| Body | Geist Regular | 17 / 24 | Reasons, reading labels |
| Footnote | Geist Regular | 13 / 18 | Notices, update time, pill labels |
| Mono | Geist Mono Regular | 12 / 16 | Uppercase labels |
| Dot | Doto Bold | 14 / 16 | Dates, times, index numbers |

### Color

| Group | Tokens |
|---|---|
| Text and fills | text/primary #F5F5F7, text/secondary white 85%, text/inverse #000000, fill/inverse #F5F5F7, bg/primary #000000, bg/tertiary white 28%, line/hairline white 18% |
| Glass | surface/glass grey 72%, surface/glass-strong white 18%, surface/glass-stroke white 10%, Glass sheet style (grey 72% → 86%), Edge glow (status color, blur 30 + 8) |
| Status | status/good #30D158, status/caution #FFD60A, status/poor #FF453A, Status scale (red → yellow → green, for the hero arc) |
| Backdrop | Sky-to-sand gradient, with a darker middle band |

Glass uses the Glass blur effect (background blur, radius 40). The status scale and edge glow use fixed colors, because Figma can't link gradient colors to variables.

### Spacing and radius

Spacing scale: 4, 8, 12, 16, 20, 24, 32, 48. On the mockup: 12 screen margins, 24 sheet padding, 28 between groups, 8 to 12 inside a group. Frames are 402 wide.

Radius: 12 for swatches, 20 for small panels, 28 for panels, 40 for the sheet, full for buttons and pills.

### Components

- **Button:** light pill with a mono label and the arrow. One primary action per screen.
- **Pill:** tabs and tags with a dot-matrix index. White when active, glass when not. 44pt tall, 12/16 padding.
- **Arrow:** a thin-line arrow used everywhere something points.
- **Logo:** placeholder dotted water drop, 28 × 32.
- **Menu bar:** Beaches pill, logo, About pill, no background. Two tones: On light (black) and On dark (white).

## Open gaps

These are placeholders in the mockup, not real data:

- The data source and its name.
- The thresholds between Good, Caution and Poor, and how readings map onto the arc.
- The waiting time in the advice ("24–48 hours").
- The beach label "BEACH 86 ST" and sample number "0412".
- All readings (110 MPN/100 mL, 1.2 in, 68°F, 2–3 ft).

Design still open:

- Text inside and around the horseshoe ring.
- Good, Poor and No data versions of the hero, then a hero component with a status property.
- The Beaches and About pages the menu bar points to.
- Whether the edge glow should stay on the sheet (and scroll away) or sit on a fixed layer.
- A contrast check of text closest to the edge glow.

## Still to do for the assignment

- **Second state.** Design the No data version of the mockup next to Caution.
- **Context comparison.** Give an AI the rules, the sketch and one task; save the prompt and first result; change one context item; predict, then check whether a key rule held. A good rule to test: "If data is missing or stale, show No data and never a status color."
- **Human observation.** Have someone try the mockup before explaining it. Things to watch: whether they read the horseshoe correctly, whether they notice the update time, and whether the glass and text work in sunlight.
- **Final project ideas.** Bring three as sketches or notes.

## AI and source help

Claude helped interpret the assignment, research and summarize the reference projects, run the design critique and contrast estimates, build the design systems, mockups and device mockup in Figma, outline the beacon hardware, identify OEM's typeface, and edit the copy. Direction choices (PRORS over Aurevia, dark only, glass, Geist, simplifying the system, the middle-ground contrast version, the circular beacon, the gradient horseshoe, the edge glow and the fixed menu bar) were mine. Visual references: Ramin Nasibov (Aurevia, PRORS), Melody Ekbatani (Aeri), OEM (oem.care).
