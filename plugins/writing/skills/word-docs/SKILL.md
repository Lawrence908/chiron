---
name: word-docs
description: "Convert a markdown draft into a styled, shareable Word document while keeping the markdown as the source of truth. Uses pypandoc for full-fidelity conversion (tables, lists, code blocks, links) and python-docx for styling, with optional mermaid diagram pre-rendering. Use when: Someone needs a .docx of an existing markdown draft, Submitting an essay or report that must be in Word format, Sending a technical document to someone who will not read markdown, Producing a formatted deliverable from notes or a spec, A markdown file needs to become a document with real tables and code styling."
metadata:
  category: writing
---

# Word Docs

## Purpose

Package an existing markdown draft as a `.docx` without making the Word file the
new source of truth. The markdown stays canonical; the document is a build
artifact.

## When to Use

- The user wants a `.docx` version of a draft that already exists in markdown.
- An essay, report, or spec must be submitted or shared in Word format.
- A document needs styled tables or code blocks that plain pandoc output lacks.

## Do Not Use

- To author new prose. Use `academic-essay` or `technical-documentation` to
  write, then this skill to package.
- For PDF output. Pandoc can do it directly; this skill's styling pass is
  docx-specific.
- When the recipient can read markdown. Do not add a build step nobody needs.

## Inputs Required

- A `.md` source file.
- Confirmation of whether the content may change. If the user wants no
  substantive edits, this is a packaging job only.

## Dependencies

- `pypandoc-binary` — pandoc wrapper with a bundled binary; handles tables,
  lists, code blocks, and links natively.
- `python-docx` — post-processing for styling.
- `@mermaid-js/mermaid-cli` (optional) — pre-renders mermaid blocks to PNG.

Preflight:

```bash
python3 -c "import pypandoc; print('pypandoc OK')" && \
python3 -c "import docx; print('python-docx OK')"
```

If missing:

```bash
pip3 install pypandoc-binary python-docx
npm install -g @mermaid-js/mermaid-cli   # only if mermaid diagrams are present
```

## Workflow

1. **Keep the markdown canonical.** Write or revise the `.md` file first, using
   standard markdown: tables, bullet lists, code blocks, links, mermaid.

2. **Convert with pypandoc.** This is the default path and the only one with
   full fidelity — tables, lists, code blocks, headings, links, emphasis:

   ```python
   import pypandoc
   pypandoc.convert_file('source.md', 'docx', outputfile='output.docx')
   ```

   The bundled `scripts/md_to_docx.py` is a **fallback for when pandoc is not
   available**. It uses python-docx directly and supports only `#`/`##`
   headings, paragraphs, inline links, bold, and inline code. It does **not**
   handle tables, lists, or fenced code blocks — reach for it only when pypandoc
   cannot be installed, and say so in your summary if you do.

   ```bash
   python3 scripts/md_to_docx.py source.md --output output.docx
   ```

3. **Style.** Pandoc's default Word output is plain. Run the styling pass:

   ```bash
   python3 scripts/style_docx.py output.docx
   python3 scripts/style_docx.py output.docx --margins 0.5
   ```

   This adds grid borders and a shaded bold header row to tables, a grey
   background with Consolas 9pt to code blocks, and configurable margins.

4. **Handle mermaid diagrams,** if the source has them. Pandoc does not render
   mermaid. Keep the ` ```mermaid ` blocks in the markdown so they still render
   on GitHub, then at build time extract them, render to PNG, and convert a temp
   markdown with image references swapped in:

   ```bash
   mmdc -i diagram.mmd -o diagram.png -w 1200 -b white
   ```

5. **Verify the artifact.** Check it exists with `ls -lh`. Do not imply you
   visually inspected the Word layout unless you actually opened it.

## Constraints & Guardrails

- Never treat the generated `.docx` as the source. If the user edits the Word
  file, the markdown is now stale and you must say so.
- If the user wants no substantive changes, preserve wording exactly and change
  packaging only.
- Report precisely what you verified: source written, `.docx` generated, file
  exists on disk.

## Outputs Produced

- A styled `.docx` alongside the markdown source.
- Any pre-rendered diagram PNGs, kept next to the source.
- A statement of what was verified.

## Anti-Patterns

- Rewriting the prose during a packaging request.
- Claiming the layout looks good without opening the file.
- Generating the `.docx` into a directory the user did not ask for.
- Hand-editing the `.docx` instead of fixing the markdown and rebuilding.

---

Adapted from `ourostack/ouroboros-skills` (`skills/word-docs`); the bundled
scripts are theirs, relocated to `scripts/`.
