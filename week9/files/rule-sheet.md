# Rule sheet · Beach Water Check

## Person and task

**Who:** a surfer or swimmer standing on a NYC beach, often in bright sun, sometimes with wet hands, who has just scanned the QR code on the beacon.

**Task:** decide in a few seconds whether to go in the water, and why.

**Assumptions to check with a real person:**

- They can read the status and the reason within about 5 seconds.
- They notice when the data was last updated.
- They read "No data" as "unknown", not as "probably fine".

## Type

| Style | Font | Size / line | Used for |
|---|---|---|---|
| Status | Geist Regular | 44 / 48 | Status word in the hero |
| Title | Geist Regular | 28 / 34 | Beach name |
| Headline | Geist SemiBold | 17 / 24 | Advice |
| Body | Geist Regular | 17 / 24 | Reason, reading labels |
| Footnote | Geist Regular | 13 / 18 | Update time, notices, pill labels |
| Mono | Geist Mono Regular | 12 / 16 | Uppercase labels |
| Dot | Doto Bold | 14 / 16 | Dates and index numbers (echoes the beacon's LED panel) |

## Color

- **Neutrals:** frosted grey glass (72% at the top of the sheet to 86% at the bottom) on a sky-to-sand backdrop. White text; secondary text at 85% white.
- **Status colors:** good #30D158, caution #FFD60A, poor #FF453A. These are the only colors in the interface.
- **Status scale:** red → yellow → green, used only by the hero arc.

## Spacing and radius

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 48.
- Screen margins 12, sheet padding 24, 28 between groups, 8–12 inside a group.
- Radius: 20 for small panels, 28 for panels, 40 for the sheet, full for pills.
- Touch targets at least 44pt.

## Reusable parts and their behavior

**Status hero (horseshoe).** A 270° arc with the gap at the bottom, matching the beacon's light ring.

- The track shows the full red → yellow → green scale at 14% strength.
- The fill shows the same scale at full strength up to the reading, ending in a white dot.
- The fill measures *quality*: it grows as water gets better. Poor ends in the first third, Caution in the middle third, Good in the last third, so the fill and the status word always agree.
- The status word sits in the center.
- A soft glow in the status color runs along the edge of the glass sheet.

**Menu bar.** Beaches pill, logo, About pill, fixed at the top with no background. Black over the sky; white once the glass sheet scrolls under it.

**Pill.** 44pt tall, translucent glass when inactive, white when active.

**Update line.** "Updated [time] · [date]" directly under the advice, in Footnote.

## Must stay

- The status is the largest element on the screen and is always a word, never only a color or shape.
- Every status has a reason and an action-phrased piece of advice.
- The update time is always visible under the advice.
- Status colors mean water quality and nothing else.
- Text passes 4.5:1 contrast (3:1 for the 44pt status word).

## May adapt

- The reason and advice wording per beach and situation.
- Which secondary readings appear (rainfall, water temperature, waves).
- The forecast notice: shown only when there is a forecast.
- Screen width: layouts stretch between 375 and 440pt; the hero stays a fixed size and centered.

## Must never happen

- **If the data is missing or stale, show No data and never a status color.** No fill, no dot, no glow, no colored track, and no advice that implies the water is safe or unsafe.
- A status color used for anything other than water quality (for example, the forecast dot is white).
- The fill ending in a zone that disagrees with the status word.
- Status communicated by color alone.

*Placeholder still to confirm: the age at which a sample counts as stale (assumed here as older than 72 hours) and the bacteria thresholds between Good, Caution and Poor.*
