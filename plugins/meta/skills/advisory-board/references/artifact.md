# The board record artifact

Every completed run publishes one. It is the executive summary a board would hand back: what was
decided, who dissented, and what would change the answer. Read this before writing the page.

## Build

Write the content HTML to `<runDir>/board-record.src.html`, then:

```bash
SK=<skill dir>            # ~/.claude/skills/advisory-board
python3 $SK/scripts/embed-fonts.py \
  <runDir>/board-record.src.html <runDir>/board-record.html \
  --css $SK/assets/board-artifact.css
```

Publish `board-record.html` with the Artifact tool, favicon `⚖️`. Keep the favicon stable across
reruns of the same decision. A re-run under new weights is a **new** artifact, not an update, for
the same reason runs are never overwritten.

The source file carries only a `<title>`, a `<style>` block containing the literal token
`@FONT_FACES@`, and the markup. The script injects the faces and the shared stylesheet, producing
a self-contained ~560KB page. Never link a font URL: the Artifact CSP blocks every external host
and the page would silently fall back.

## Design intent

The page is a **board record** — a division list and a sealed judgment — not a dashboard. That
choice drives everything else, and it is why the stylesheet is shared rather than reinvented per
run: two runs should look like two records from the same institution.

- **Claret is the seal.** It appears on the verdict and the dissent, nowhere else. If it starts
  showing up on headings and links it stops meaning anything.
- **The slate ramp encodes magnitude only**, one hue light-to-dark. Every scored cell also prints
  its number, so nothing is conveyed by colour alone.
- **Green and ochre are semantic** (settled / clash) and are deliberately not the accent.
- Both themes are defined at token level and the viewer's toggle overrides the OS preference in
  both directions. Style through the tokens, never inside the media query.

## Required sections

Omit a section only when the run genuinely has nothing for it, and say so rather than padding.

| Section | Carries |
|---|---|
| Masthead | The question, the lede, and run metadata: date, roster, dossier, member/adjudicator models, any binding tolerance |
| Pre-vote findings | Anything the board discovered about the *frame* before answering — malformed options, false constraints. Omit if the frame survived intact |
| The verdict | Sealed block. The recommendation in one sentence, plus whether it overrules the arithmetic and why |
| Weighted score | Horizontal bars, score as percentage width. Mark the recommendation and, if different, the arithmetic leader. State explicitly when the top options are within noise |
| Scoring matrix | Criteria × options, weights in their own column, every cell numbered. Spotlight the recommended column |
| The division | One card per member: name, mandate line, ordering, and their argument in their own terms. Include the adjudicator's ruling on member bias. Footnote which orderings were explicit and which were derived |
| Where they clashed | Each clash as two columns literally facing each other, then what settled it — or an honest statement that the record does not settle it |
| What decides it | The single factor, with the branches spelled out |
| Dissent | Sealed block. The strongest surviving objection and the exact grounds for overruling it. **Never publish a record without this** |
| Weight sensitivity | Which criterion the ranking is fragile to, and which suspected hinges turned out inert |
| Construction notes | The board's critique of its own frame and rubric. This is the most valuable section for the *next* run |
| Provenance | Run path, roster, models, isolation, and a plain statement that scores are a hand-scored rubric rather than a measurement |

## Honesty rules

These matter more than the styling.

- **Never let the page look more decisive than the verdict was.** If two options were within noise,
  the bars must say so in words, not just show similar lengths.
- **Attribute derived data.** If a member's ordering was inferred from their prose rather than
  stated, footnote it. Do not manufacture precision for the sake of a tidy matrix.
- **Reproduce the overrule.** When the adjudicator went against its own arithmetic, the page must
  show both the arithmetic and the reason — never quietly present the recommendation as the winner.
- **Quote members in their own words** where a phrase is load-bearing. Paraphrase flattens the
  disagreement, and the disagreement is the product.
