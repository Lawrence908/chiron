#!/usr/bin/env python3
"""Inline local OTFs into an artifact as @font-face data URIs.

The Artifact CSP blocks every external host, so a linked webfont silently falls
back and the page loses its typography. Base64-ing the faces into the document
is the only way to guarantee the design survives publication.

Usage:
    embed-fonts.py content.html out.html [--css shared.css]

Replaces the literal token @FONT_FACES@ in the input with the generated
@font-face block. If the token is absent, the block is injected at the top of
the first <style>. With --css, that stylesheet's contents are inlined after the
faces, so a run's page carries only its own content and markup.

Faces are URW base35 clones, shipped on most Linux systems by the
fonts-urw-base35 package:
  P052                 Palatino clone - bookish, authoritative, not a default UI face
  NimbusSansNarrow     condensed grotesque - division-list labels and figures

If a face is missing the script says so and emits the remaining ones rather than
failing: a page with one real face beats a page that would not build.
"""

import base64
import sys
from pathlib import Path

OTF = Path("/usr/share/fonts/opentype/urw-base35")

FACES = [
    # (css family, file stem, weight, style)
    ("Board Serif", "P052-Roman", 400, "normal"),
    ("Board Serif", "P052-Bold", 700, "normal"),
    ("Board Serif", "P052-Italic", 400, "italic"),
    ("Board Label", "NimbusSansNarrow-Bold", 700, "normal"),
]


def face_block(family, stem, weight, style):
    path = OTF / f"{stem}.otf"
    if not path.exists():
        print(f"  ! missing {path}, skipping {family} {weight} {style}", file=sys.stderr)
        return None
    b64 = base64.b64encode(path.read_bytes()).decode("ascii")
    return (
        "@font-face{"
        f"font-family:'{family}';"
        f"font-weight:{weight};"
        f"font-style:{style};"
        "font-display:block;"
        f"src:url(data:font/otf;base64,{b64}) format('opentype')"
        "}"
    )


def main():
    if len(sys.argv) < 3:
        print(__doc__.strip(), file=sys.stderr)
        return 2

    src, dest = Path(sys.argv[1]), Path(sys.argv[2])
    css = None
    if "--css" in sys.argv:
        css = Path(sys.argv[sys.argv.index("--css") + 1])

    blocks = [b for b in (face_block(*f) for f in FACES) if b]
    if not blocks:
        print("no faces embedded - the page will fall back to system fonts", file=sys.stderr)

    payload = "\n".join(blocks)
    if css:
        if not css.exists():
            print(f"error: --css {css} not found", file=sys.stderr)
            return 2
        payload += "\n" + css.read_text()

    html = src.read_text()
    if "@FONT_FACES@" in html:
        html = html.replace("@FONT_FACES@", payload)
    elif "<style>" in html:
        html = html.replace("<style>", "<style>\n" + payload, 1)
    else:
        html = f"<style>\n{payload}\n</style>\n" + html

    dest.write_text(html)
    kb = len(html.encode()) / 1024
    print(f"wrote {dest} ({kb:.0f} KB, {len(blocks)} faces embedded)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
