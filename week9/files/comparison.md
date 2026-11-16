# Comparison · does the No data rule survive a change in wording?

**Rule checked:** If the data is missing or stale, show No data and never a status color.
**One change:** the prompt's wording of the rule drops "or stale" and the 72-hour definition.
**Test case:** the sample is 6 days old, and its value (30 MPN/100 mL) would otherwise read as Good. That makes it the riskiest case: an old, reassuring number.

## Prediction (written before running)

- **Prompt A:** passes. The AI shows "No data" in grey, with no fill, dot or glow, and advice to check signs or ask a lifeguard. The update line says the sample is 6 days old.
- **Prompt B:** likely fails. The data isn't *missing*, so the AI shows "Good" with a green fill and glow, and perhaps adds the sample date as a side note. The attached rule sheet might still catch it, so a pass is possible.

## Results

Full first results are saved unedited in `result-a.md` and `result-b.md`.

| | Prompt A | Prompt B |
|---|---|---|
| Date run | November 16, 2026 | November 16, 2026 |
| Status word | "No data," white | "No data," white |
| Arc, dot and glow colors | No fill, dot, track or glow; no status colors | No fill, dot, track or glow; no status colors |
| Advice | "Check back after a new sample is posted." | "Check for a newer water quality update before swimming." |
| Update line | "Updated 8:40 AM · Nov 10" (the sample time) | "Updated 9:00 AM · Nov 16" (the screen time) |
| Enterococci row | 30 MPN/100 mL, labelled as sampled Nov 10 | 30 MPN/100 mL, labelled as sampled Nov 10 |
| **Rule held?** | **Pass** | **Pass** |

## Check and decision

**Against the prediction.** A passed as predicted. B also passed, against my prediction. B's result explains why: it treats the sample as stale "under the rule sheet's stated assumption." The prompt's rule no longer mentioned stale data, but the attached rule sheet still did, with the 72-hour limit. The attachment carried the rule when the prompt wording didn't. Two passes recorded.

**What I keep.** The full rule and its time limit stay in the rule sheet. The comparison suggests the rule sheet is where the rule needs to live, because it survived a weaker prompt.

**What I change.** Both results followed the rule's wording but showed gaps in it:

- Both still showed the old reading (30 MPN/100 mL). A low number can reassure someone even with a "stale" label. Change the rule to: *If the data is missing or stale, show No data, never a status color, and never the stale reading value.*
- B's update line showed today's time, so the screen looked fresh. Add: *The update line always shows the time of the latest sample, not when the screen loaded.*
- Neither result kept a neutral arc track, and both used a white status word, where my design uses grey. Neither breaks the rule, but if they matter, the rule sheet should say so.

**Other explanations.** Each run was a single first result from one model; another run or model might differ. Prompt B changed the prompt but not the attachment, so this tested the prompt wording, not the rule itself.

**What remains uncertain.** Whether the rule survives without the rule sheet attached, or with "stale" removed from the rule sheet too. That is the next comparison to run. Also untested: whether a real person reads "No data" as "unknown" rather than "probably fine."
