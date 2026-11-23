# Beach Water Check: design system and mockup process

Companion app for the Ocean Water Quality Beacon, a physical computing project. Built for Assignment 2 (Context and evidence study), due November 16, 2026. Working solo.

Figma file: [Ocean Water Quality Beacon](https://www.figma.com/design/J1Pb5bsoBUaovTzt8HiuRx/Ocean-Water-Quality-Beacon), page **Design System**. The canvas has the design system, a **Current · Caution screen** section (which also holds the No data, Good and Poor mockups), two loading animation sections (**1 · Rings animation** and **2 · Dots animation**) and an **Archive** section.

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

### State 2: No data

The second state, **Mockup · No data (state 2)**, sits next to the v4 Caution mockup and uses the same layout, menu bar and glass sheet. It follows the rule "If data is missing or stale, show No data and never a status color":

- **Hero:** only the empty horseshoe track, as a plain grey line (white 18%) with no gradient, no fill and no value dot. "No data" sits in the center in secondary white (85%), not in a status color.
- **White edge glow:** the sheet keeps the same edge glow as the other states but in white (#F5F5F7), never a status color, so the screen reads as unknown, not as Good. It started with no glow; I added the white one while designing the loading animation so every result screen glows.
- **Message:** "No recent water sample for this beach." The update line says how old the data is: "Last sample Nov 10 · 6 days ago".
- **Readings:** Enterococci shows "—" with "NO RECENT SAMPLE" in place of the unit. The header says "LAST SAMPLE 0398". Rainfall, water temperature and waves still show values, because they come from other sources and aren't the reason for the missing status.
- **Unchanged:** the date and beach label, "Source and test details", the neutral forecast notice and the tabs.

### States 3 and 4: Good and Poor

**Mockup · Good (state 3)** and **Mockup · Poor (state 4)** sit to the right of No data. Both are copies of the v4 Caution mockup, so the layout, menu bar, glass sheet and tabs are the same. Only the parts that depend on the status change:

| | Good | Caution | Poor |
|---|---|---|---|
| Horseshoe fill | 85%, ends in green | 55%, ends in yellow | 18%, ends in red |
| Edge glow | Green | Yellow | Red |
| Reason | Bacteria levels are within the safe range. | Bacteria elevated after rain. | Bacteria far above the safe limit. |
| Advice | Good for swimming today. | Wait 24–48 hours before swimming. | Don't swim today. Check back tomorrow. |
| Forecast | Clear skies all day | Rain expected this afternoon | More rain expected tonight |
| Enterococci | 12 MPN/100 mL | 110 MPN/100 mL | 320 MPN/100 mL |
| Rainfall · 24 h | 0.0 in | 1.2 in | 2.4 in |

The fill keeps the full red → yellow → green gradient and the white dot marks where it ends, so each fill lands in the matching third of the arc. The Poor reason was shortened to one line so the advice doesn't get pushed down.

### Loading animation: from scan to reading

After someone scans the beacon, the page opens into a short animation of the horseshoe while the reading loads. Two motion pieces inspired it: one where a single dot sends out sonar rings and splits into a ring of dots, and one where a gauge fills while its number counts up. The rule from the No data state carries over: no status color appears until the real reading arrives.

There are two versions. The current one is **2 · Dots animation**; the original, **1 · Rings animation**, is kept for comparison.

**2 · Dots animation (current).** With a Caution reading and data ready after 1.5 s:

| Phase | Time | What happens |
|---|---|---|
| Ripple | 0–1.00 s | A round field of dots fades in, using the exact layout from a reference still: 161 inner dots and a 46-dot outer ring on the horseshoe's circle. A wide band of brighter dots, about three rings deep, rolls out from the center and reaches the outer ring at 1.00 s. |
| Clear | 1.00–1.30 s | The band keeps going past the outer ring, so its lit rings reach the edge in turn: the outer ring plus two inside it, then plus one, then the outer ring alone. A fade follows 0.3 s behind the band on the same path, center first, and the 10 ring dots in the bottom gap fade last. The 36 outer dots inside the arc ease into the horseshoe's dim dots. |
| Chase | 1.30–2.30 s | As soon as the outer ring is alone, "CHECKING WATER" fades in and a white trail runs once around the dots, picking up from the ring's current brightness. It keeps lapping if the data is slower, and the label changes to "STILL CHECKING" after 6 s. |
| Fill | 2.30–3.23 s | The gradient flows in from the red end with a few colored dots leading. The white reading dot fades in from 60% size as it rides the tip, and the status word blurs in. |
| Settle | 3.23–6.55 s | Leftover dots grow into colored dots one after another around the rest of the ring, then the faint solid track fades in under them, the details rise in, the Enterococci number counts up, and the edge glow pulses twice slowly before holding steady. |

Because the horseshoe is the reference ring's own dots, it has 36 dots instead of 28, and its arc runs about 2° further at each end (about 133° to 407°) so the dots land exactly on it.

**1 · Rings animation (original).** A white seed dot pops in and sends out three rings (0–0.65 s), then 28 dots pop in around the horseshoe from bottom left to bottom right (0.65–1.56 s). Chase, fill and settle work the same way, starting about 0.06 s later.

In both, No data ends with the dots melting into a plain grey track and a white edge glow that pulses twice and holds. Reduce motion skips the opening, the chase and the pulses, and crossfades to the result.

How it changed:

- The first version spat the dots out of the center dot in a spiral. I replaced it with dots appearing in place around the horseshoe, which reads more clearly as the gauge drawing itself.
- I added the two glow pulses after the reading lands, then made them slower and smoother, about 0.7 s up and 0.8 s down, so they feel like the beacon breathing rather than an alarm.
- I tried two forced chase laps but went back to one. The second lap only added waiting, about 1 s on top of a roughly 5-second decision on the beach. The two-lap version is still useful for demos.
- I added a third ping ring, which costs no time because it overlaps the draw.
- At first the leftover dots snapped straight into the faint track once the fill stopped. Now they grow into colored dots one after another around the rest of the ring, the same way the No data dots melt, and only then does the solid track fade in. Every reading ends the same way.
- That first version had a slight pause where the fill stopped and the dots started. I removed the fill's overshoot, started the dot sweep while the fill is still easing in (at 60% of its time), and overlapped the solid track's fade-in with the last dots, so the motion runs from fill to finished ring without stopping.
- I compared the fill side by side with a version 1.4 times slower ([animation/fill-speed-compare.html](animation/fill-speed-compare.html)) and chose the slower one. At the original speed the fill was over almost before the eye found it (0.47 s for Poor), and the colored lead dots barely registered. The fill is the moment the person learns the answer, so it gets the time. It costs about 0.2 to 0.3 s depending on the reading; Caution now fills in 0.93 s.
- I tried a white edge glow on No data and kept it. It is faint on the grey glass, which suits a screen that shouldn't draw attention, and white isn't a status color.
- I tried five dot-field openings to replace the three rings ([animation/opening-options.html](animation/opening-options.html)), based on two motion references: scattered dots gathering into a sunflower-pattern field, and a band of brighter dots breathing outward through one. I chose **Ripple to ring** because the opening becomes the gauge: its outer ring of dots is the horseshoe, so nothing has to hand off. I then switched it to the exact dot layout from a reference still.
- Smoothing the ripple took three passes. The band used to slow to a stop at the rim, and the horseshoe dots re-popped before a pause. Now the band keeps its speed into the rim and the rim dots fade straight into the horseshoe. The inner dots fade out more slowly from the center, and a short pause follows before the chase and "CHECKING WATER" start together.
- The ripple still felt less smooth than the reference video. The cause wasn't the dots growing as such (the reference's dots grow too) but a narrow band moving fast, so each dot swelled and shrank in about a quarter of a second. I compared three versions side by side ([animation/ripple-smoothness.html](animation/ripple-smoothness.html)) and chose the one that costs no time: a band twice as wide (0.28 of the radius) and dots that grow about 1.8× instead of 2.6×. Measured at 60 fps, it changes about half as much per frame, and its biggest single-frame jump is a third of what it was.
- The inner dots used to vanish abruptly before the horseshoe was left on its own. A slower fade on its own didn't fix it, and a separate fade wave after the light band felt phased, like one action, then the next, then the next. What worked was making the fade follow the light band 0.25 s behind it on the same path, and starting the trail as the last dots fade instead of after a pause. Measured every 0.1 s, nothing now drops to a standstill between the opening and the trail. It also made the opening faster: the Caution reading lands at about 3.2 s.
- I also tried the light band rolling out twice before the fade ([animation/ripple-waves.html](animation/ripple-waves.html)), and the single wave slowed to 1.3 s ([animation/ripple-speed.html](animation/ripple-speed.html)). I kept the single wave at its current speed.
- Two last fixes to the moment the outer ring lights up. Its brightness used to peak with a sharp corner (rising until exactly 1.0 s, then dropping at full speed the next frame), which read as a hitch; it now rounds over the top and eases into the horseshoe's dim dots, and the trail picks up from the ring's actual brightness. The band also used to stop at the ring and fade, so the lit rings behind it vanished before reaching the edge; now it rolls through, so the outer ring is lit with two rings, then one, then alone, before the field is gone.
- The status word changed from Doto to round dots drawn on a 7-row grid, like an airport departures board, with only the lit dots shown. CAUTION and NO DATA first came within 5px of the ring, so I compared ways to narrow them while keeping one size for every reading ([animation/status-word-widths.html](animation/status-word-widths.html)). I kept a 3-dot-wide I and word space, with dots at about 91% of the first size (4px dots on a 5.1px grid, 35px tall). That leaves about 21px between the longest words and the ring.
- An animation audit found two visual fixes, which I compared side by side ([animation/ripple-fixes-before-after.html](animation/ripple-fixes-before-after.html)) and kept. The white reading dot no longer grows from nothing and overshoots; it fades in from 60% size. "CHECKING WATER" now fades in and out with easing instead of at a constant rate.

The motion lives in an HTML prototype ([animation/opening-animation.html](animation/opening-animation.html), also published as a private claude.ai artifact) with controls for the reading, the load time and playback speed. In Figma there are two sections, each with keyframe screens taken from the prototype's own timing and a timing strip with each phase's durations, easing and rules:

- **2 · Dots animation** (current): eight frames (ripple 0.50 s, ripple at the rim 1.00 s, clear with the outer ring alone 1.20 s, chase 1.85 s, fill 2.90 s, settle 6.55 s, No data melt 2.55 s and No data settle), all with the current header and the round-dot status word.
- **1 · Rings animation** (original): seven frames (ping, draw, chase, fill at 3.20 s, settle, No data melt and No data settle).

## The design system now

### Typography

| Style | Font | Size / line height | Used for |
|---|---|---|---|
| Display | Geist Light | 88 / 88 | Not on the current screen (was the beach number) |
| Status | Round-dot matrix (drawn, not a font) | 7 rows, 4px dots on a 5.1px grid, 35px tall | Status word (GOOD, CAUTION, POOR, NO DATA) |
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
- The beach label "BEACH 86 ST" and sample numbers "0412" (Caution) and "0398" (No data).
- All readings (110 MPN/100 mL, 1.2 in, 68°F, 2–3 ft), and the Good and Poor values (12 and 320 MPN/100 mL, 0.0 and 2.4 in). The Good and Poor screens still show sample 0412, the same as Caution.
- How old a sample can be before the app shows No data.
- The No data dates: the screen is dated 11.15.26 but says "Nov 10 · 6 days ago", which is 5 days. One of the two needs to change.

Design still open:

- Text inside and around the horseshoe ring.
- A hero component with a status property. All four states now exist as separate screens, built from plain layers.
- Whether rainfall, temperature and waves should stay on the No data screen, or whether they make it look like the water was checked.
- The Beaches and About pages the menu bar points to.
- Whether the edge glow should stay on the sheet (and scroll away) or sit on a fixed layer.
- A contrast check of text closest to the edge glow.
- Whether the beacon's light ring should play the same chase while it fetches data.

## Still to do for the assignment

- ~~**Second state.** Design the No data version of the mockup next to Caution.~~ Done: see "State 2: No data".
- **Context comparison.** Give an AI the rules, the sketch and one task; save the prompt and first result; change one context item; predict, then check whether a key rule held. A good rule to test: "If data is missing or stale, show No data and never a status color."
- **Human observation.** Have someone try the mockup before explaining it. Things to watch: whether they read the horseshoe correctly, whether they notice the update time, and whether the glass and text work in sunlight. For the loading animation: whether it feels slow, whether anyone reads the white chase as a result, and whether the white No data glow reads as "all clear".
- **Final project ideas.** Bring three as sketches or notes.

## AI and source help

Claude helped interpret the assignment, research and summarize the reference projects, run the design critique and contrast estimates, build the design systems, mockups and device mockup in Figma, outline the beacon hardware, identify OEM's typeface, and edit the copy. Direction choices (PRORS over Aurevia, dark only, glass, Geist, simplifying the system, the middle-ground contrast version, the circular beacon, the gradient horseshoe, the edge glow and the fixed menu bar) were mine. Visual references: Ramin Nasibov (Aurevia, PRORS), Melody Ekbatani (Aeri), OEM (oem.care).
