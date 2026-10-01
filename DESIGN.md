---
name: Response Paragraph Writing Assistant
description: Write your response paragraph on a squared notebook sheet and get it back marked the way a teacher marks it.
colors:
  desk: "#e6ebf1"
  paper: "#fdfdfe"
  grid-line: "rgba(31, 78, 121, 0.085)"
  margin-rule: "rgba(214, 69, 65, 0.55)"
  ink: "#1c2533"
  ink-soft: "#4a5568"
  ink-faint: "#6b7686"
  pen: "#c0392b"
  pen-soft: "rgba(192, 57, 43, 0.1)"
  rule: "rgba(28, 37, 51, 0.14)"
  hl-topic: "rgba(110, 175, 240, 0.45)"
  hl-summary: "rgba(120, 210, 110, 0.45)"
  hl-reaction: "rgba(255, 166, 77, 0.5)"
  hl-conclusion: "rgba(190, 150, 240, 0.48)"
  ink-topic: "#1f4e79"
  ink-summary: "#1e6b2e"
  ink-reaction: "#8c4108"
  ink-conclusion: "#6b2fa0"
  desk-night: "#0b1017"
  paper-night: "#141b26"
  grid-line-night: "rgba(150, 185, 230, 0.07)"
  margin-rule-night: "rgba(255, 122, 107, 0.45)"
  ink-night: "#e6ecf3"
  ink-soft-night: "#b3bfcd"
  ink-faint-night: "#8b97a6"
  pen-night: "#ff7a6b"
  pen-soft-night: "rgba(255, 122, 107, 0.12)"
  rule-night: "rgba(230, 236, 243, 0.14)"
  hl-topic-night: "rgba(90, 160, 240, 0.32)"
  hl-summary-night: "rgba(100, 200, 100, 0.28)"
  hl-reaction-night: "rgba(255, 150, 60, 0.3)"
  hl-conclusion-night: "rgba(180, 130, 245, 0.32)"
  ink-topic-night: "#9cc8f2"
  ink-summary-night: "#8fd99a"
  ink-reaction-night: "#ffb877"
  ink-conclusion-night: "#d3b5f7"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Atkinson Hyperlegible Next, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Bricolage Grotesque, Atkinson Hyperlegible Next, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bricolage Grotesque, Atkinson Hyperlegible Next, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  body-writing:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "28px"
  body:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
  body-small:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.33
  figures:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    fontFeature: "tnum"
  score:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, monospace"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "tnum"
rounded:
  control: "2px"
  sheet: "4px"
  round: "9999px"
spacing:
  grid: "28px"
  sheet-pad: "28px"
  margin-column: "212px"
  margin-text-offset: "236px"
  note-column: "300px"
  section-gap: "32px"
  page-gap: "40px"
components:
  button-mark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    height: "48px"
    padding: "0 24px"
  button-mark-hover:
    backgroundColor: "{colors.pen}"
    textColor: "{colors.paper}"
  button-check:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "36px"
    padding: "0 14px"
  button-check-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  mode-switch-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "6px 16px"
  writing-area:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-writing}"
    rounded: "{rounded.control}"
    padding: "0 12px"
  sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "{spacing.sheet-pad}"
  priority-number:
    textColor: "{colors.pen}"
    typography: "{typography.figures}"
    rounded: "{rounded.round}"
    size: "24px"
---

# Design System: Response Paragraph Writing Assistant

## Overview

**Creative North Star: "The Marked Notebook Sheet"**

Everything happens on a sheet of squared paper lying on a pale blue-grey desk. The student writes in ballpoint navy, each of the four paragraph parts is swiped with its own highlighter, and the marking comes back in red pen: a hand-drawn circle around the score, ticks and crosses in the rubric, bracketed notes in the margin. There is no editor chrome and no AI sidebar; the sheet is the interface, and the red margin rule divides the margin (word track, Mark button, score, per-part key) from the writing.

Density is classroom-practical: generous 28px line spacing that sits text on the grid, compact 12-14px helper text, figures always in tabular mono so counts and scores read like a tally. Light mode is daylight on white paper; dark mode is the same sheet under a desk lamp, with the pen warming to coral and highlighters dimmed to keep contrast. The world uses no texture, no handwriting fonts and no page curl; its only hand-made gestures are the SVG pen strokes and the highlighter swipe.

**Key Characteristics:**
- Squared paper sheets (28px grid) with a red vertical margin rule, floating on a flat desk colour.
- Navy ink for all text and primary actions; red pen reserved for marking, scores, errors and focus.
- Four part highlighters, each paired with a darker part ink for text that names the part.
- Tabular mono figures for every count, score and number.
- Motion that imitates marking: swipes, pen strokes drawn on, notes inked in, staggered.

## Colors

A cool paper-and-ink neutral base with one marking colour (red pen) and a fixed four-colour highlighter code that means "which part of the paragraph".

### Primary
- **Ballpoint Navy** (ink): body text, headings, the filled Mark button, the active mode-switch thumb, the outlined Check buttons. It is the default voice of the page.

### Secondary
- **Teacher's Red Pen** (pen): the score and its hand-drawn circle, ticks, crosses, strike-throughs on wrong language, priority numbers, warnings and over-limit counts, the active nav underline, caret colour, focus outline, and the Mark button's hover. Pen-soft (10% red) tints the selected draft row and the word-track target zone.

### Tertiary
- **Topic Blue / Summary Green / Reaction Orange / Conclusion Lilac** (hl-topic, hl-summary, hl-reaction, hl-conclusion): translucent highlighter swipes behind text belonging to that part, the word-track segments and part dots, and the focus halo of a part's writing area.
- **Part inks** (ink-topic, ink-summary, ink-reaction, ink-conclusion): the dark, legible pairing of each highlighter, used for part numbers, part labels on notes, and the writing-area focus border. Summary green doubles as the "on target / improved" signal (sentence count in range, positive draft delta).

### Neutral
- **Desk** (desk): the page background behind the sheets.
- **Paper** (paper): sheet and input fill; also the reversed text on navy buttons.
- **Grid Line** (grid-line): the 1px squared-paper lines, faint enough to read through.
- **Margin Rule** (margin-rule): the single vertical red rule on sheets that have a margin column.
- **Ink Soft** (ink-soft): hints, secondary descriptions, rubric comments, inactive nav.
- **Ink Faint** (ink-faint): placeholders, metadata, unit labels ("words", "/20"), quiet text buttons.
- **Rule** (rule): hairline borders on inputs and tables, row dividers, empty word-track trough.

Each neutral and accent has a `-night` counterpart applied under `.dark`; the role map is identical.

### Named Rules
**The Red Pen Rule.** Red means the teacher touched it: scores, corrections, errors, warnings, focus. Never use pen red for decoration, branding or a neutral call to action at rest.

**The Highlighter Code Rule.** The four highlighters belong to the four parts (topic, summary, reaction, conclusion) and are set by `data-part`. A part keeps the same colour on every surface, and a highlighter never appears on text that does not belong to, or name, its part.

**The Part Ink Rule.** Text that names a part is coloured with that part's ink, never with the translucent highlighter, which is only ever a background.

## Typography

**Display Font:** Bricolage Grotesque (fallback Atkinson Hyperlegible Next, sans-serif)
**Body Font:** Atkinson Hyperlegible Next (fallback system-ui, sans-serif)
**Label/Mono Font:** Atkinson Hyperlegible Mono, for figures only

**Character:** A characterful grotesque for headings over a body face designed for reading accessibility; the mono is a counting face, not a code face.

### Hierarchy
- **Display** (800, 30-36px on the writing desk, 36-48px on reference pages, tight tracking): one page title per screen.
- **Headline** (700, 24px; 30-36px for "Draft N, marked"): sheet titles.
- **Title** (700, 20px, tight tracking): part names in the writing sheet, sub-sections on reference pages; 18px for in-sheet h3 (Rubric, Reaction moves).
- **Body writing** (400, 17px on a 28px line): everything the student writes or reads back, sitting on the grid lines.
- **Body** (400, 15px, relaxed): model sentences, priorities, list content. Lede text under page titles runs at 15-17px in ink-soft.
- **Body small** (400, 14px): hints, margin-note text, rubric comments.
- **Label** (700, 12px): keys for items (a part on a margin note, a stance, a connector family), coloured in part ink or ink-faint.
- **Figures** (mono, tabular): every number. Scores scale up to 48px semibold inside the pen circle; part numbers render as zero-padded "01-04".

### Named Rules
**The Tally Rule.** Every count, score, limit and draft number is set in Atkinson Hyperlegible Mono with tabular figures (`.nums`). Prose numbers stay in the body face only when they are part of a sentence.

**The On-Grid Rule.** Writing and read-back text uses a line-height equal to the grid (28px) so lines sit on the squares.

## Layout

The page is a single centred column (max 1152px, 16px gutters, 24px from 640px) of stacked sheets with 32px between sheets on the writing desk and 40px on reference pages. The writing sheet and the marked sheet share one geometry from 1024px: a 212px margin column, the red margin rule at 212px, and content starting at 236px. Below 1024px the margin rule moves to 16px, the margin column disappears, and the word track plus Mark button move into a fixed bottom bar on paper with a top hairline. From 1280px each part gets a 300px note column beside its writing area (320px on the marked sheet); below that, notes stack under the writing. Sheets pad 28px (40px horizontally on wide reference sheets). The writing area grows with its text in 28px rows and never scrolls internally.

Drafts render as one sheet containing a divided list of numbered rows (newest first, selected row tinted pen-soft), with up to two offset, slightly rotated sheets behind it to suggest the stack. Each draft is not its own sheet.

## Elevation & Depth

Depth is physical and minimal: sheets lift off the desk with one soft paper shadow, and nothing else floats. Inside a sheet everything is flat; separation comes from hairline rules and the margin rule. The only other shadows are the Mark button (a navy shadow at rest that shifts to a red one on hover) and the mobile bottom bar's upward shadow.

### Shadow Vocabulary
- **Sheet** (`box-shadow: 0 1px 2px rgba(28,37,51,0.06), 0 12px 32px -12px rgba(28,37,51,0.18)`; night: `0 1px 2px rgba(0,0,0,0.4), 0 16px 40px -16px rgba(0,0,0,0.7)`): every sheet.
- **Mark button** (`0 4px 14px -6px rgba(28,37,51,0.45)`, hover `0 10px 22px -10px rgba(192,57,43,0.6)`): the single primary action.
- **Bottom bar** (`0 -8px 24px -12px rgba(0,0,0,0.25)`): fixed mobile action bar.

### Named Rules
**The One Sheet Shadow Rule.** Paper is the only surface with elevation. Cards, panels and boxes inside a sheet stay flat and use rule-colour hairlines.

## Shapes

Nearly square. Sheets have a 4px corner; buttons, inputs, the mode switch and the word track use 2px. Full circles are reserved for numbered priority badges and the part dots. Borders are 1px in the rule colour; the optional-case field uses a dashed border that turns solid when opened, and the word-track target zone is a dashed margin-rule box. Organic shapes come only from the pen: the SVG score circle, ticks, crosses, the nav underline and the margin-note bracket, all with round caps. The highlighter swipe has slightly uneven corners (0.2em-0.35em) and a feathered 100deg edge.

## Components

### Buttons
Decisive, ink-on-paper, never pill-shaped.
- **Shape:** near-square corners (2px).
- **Primary (Mark my paragraph):** filled navy, paper text, semibold, 48px tall, 24px horizontal padding. One per screen, pinned in the margin column on desktop and in the bottom bar on mobile.
- **Hover / Focus:** lifts 1px and turns pen red with a red shadow; returns on press. Focus everywhere is a 2px pen-red outline at 2px offset. Disabled drops to 45% opacity with no shadow or lift.
- **Secondary (Check my part):** 36px outlined in navy, fills navy with paper text on hover; disabled turns rule-coloured.
- **Text buttons:** semibold 12-14px in ink-faint or ink-soft that darken to ink (or turn pen red for destructive ones like Clear) on hover; links that lead somewhere use a 2px pen-red underline at 4px offset.
- **Loading:** label replaced with an animated red scribble plus "Marking..." or "Reading...".

### Mode Switch
A two-segment control on the sheet header: 1px rule border, 4px inset, a navy thumb that slides between segments (300ms, expo-out); active label in paper, inactive in ink-soft.

### Inputs / Fields
- **Style:** the writing area is squared paper itself (grid background scrolling with the text), 1px rule border, 2px corners, 17px text on a 28px line, red caret.
- **Focus:** border takes the part ink and a 3px halo in the part's highlighter; other parts fade to 45% opacity while one is focused.
- **Error:** inline pen-red text below the field; no red borders.

### Navigation
Display-face wordmark with an ink-faint course tag, then text links at 14px in ink-soft. The active link is ink, semibold, with a hand-drawn red underline that draws on. On mobile the links wrap to a full-width row below the wordmark. A 36px icon-only theme toggle sits at the end.

### Margin Note
A note tied to its part by a thin red bracket (hooked top and bottom ends). It holds the part key in the part's highlighter and ink, then 14px text. Notes ink in from the left with a blur, staggered 140ms.

### Pen Marks
SVG strokes in pen red with round caps, drawn on with a dash animation: the loose circle around a score (2.2px), the tick, the cross, the scribble loader. The score inside the circle is mono, with the "/20" smaller.

### Word Track
A 12px trough in the rule colour filled left to right by four highlighter segments in part order, scaled to 240 words, with a dashed pen-soft target zone for 190-210 and a mono count above it. A status ("On target", "N to go", "N over") reads green in range, red outside it.

### Sheet
The container for everything: paper fill, 28px grid, 4px corners, sheet shadow, and optionally the red margin rule. Sections inside a sheet split with a top hairline rather than a nested box.

## Do's and Don'ts

### Do:
- **Do** put every content area on a sheet (paper, 28px grid, 4px corners, the sheet shadow) over the desk colour.
- **Do** keep the margin rule at 212px with content at 236px on any sheet with a margin column, and move it to 16px below 1024px.
- **Do** colour a part by setting `data-part` and letting it supply both the highlighter and the part ink.
- **Do** set every number in the mono face with tabular figures.
- **Do** draw marking (score circles, ticks, crosses, underlines) as SVG pen strokes in pen red, drawn on with `pen-draw` and staggered.
- **Do** use expo-out (`cubic-bezier(0.16, 1, 0.3, 1)`) for entrances and swipes, and turn all of it off under reduced motion, leaving pen strokes fully drawn.
- **Do** show corrections as a 2px red strike-through on the wrong text followed by the fix in semibold red.

### Don't:
- **Don't** use pen red at rest for anything that is not marking, an error, focus, or a hover response.
- **Don't** put a highlighter colour on text that is not part of, or the name of, its paragraph part.
- **Don't** add paper texture, handwriting or script fonts, or page-curl effects; the pen exists only in SVG strokes.
- **Don't** nest shadowed cards inside a sheet; separate with rule-colour hairlines.
- **Don't** round controls beyond 2px or use pill buttons.
- **Don't** set small uppercase tracked labels above a heading or section as an eyebrow; the label role is for keying individual items only.
