# Prompt B · one change: the rule loses "or stale"

Everything is the same as Prompt A (fresh conversation, same attachments, same task and data) except the key rule. The stale definition is removed with it.

**Changed lines:**

| Prompt A | Prompt B |
|---|---|
| Key rule: **If the data is missing or stale, show No data and never a status color.** A sample counts as stale when it is older than 72 hours. | Key rule: **If the data is missing, show No data and never a status color.** |

**Paste exactly:**

---

You are designing a screen for Beach Water Check, the companion app for a water quality beacon at NYC beaches. A swimmer scans the QR code on the beacon and decides in a few seconds whether to go in the water.

Attached are the rule sheet and the current Caution screen. Follow the rule sheet.

Key rule: **If the data is missing, show No data and never a status color.**

Task: write the screen spec for Rockaway Beach right now, using this data.

- Today: November 16, 9:00 AM
- Latest Enterococci sample: 30 MPN/100 mL, taken November 10, 8:40 AM
- Rainfall in the last 24 hours: 0 in
- Water temperature: 66°F
- Waves: 1–2 ft

List, in order from top to bottom: the status word, the hero arc (fill, dot, colors), the edge glow, the reason, the advice, the update line and the Enterococci row. Say which color each element uses.

---

*Note: the attached rule sheet still contains the full rule in its "Must never happen" list. That is a second difference from a clean test, recorded here on purpose: it shows whether the attachment can rescue a weaker prompt. For a stricter test, also remove "or stale" from the attached rule sheet.*
