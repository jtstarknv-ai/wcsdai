# WCSD AI Hub — Transfer Packet

Everything needed to keep working on the teacher AI Hub from another computer.
Live site: **https://wcsdai.vercel.app** (Vercel project `wcsdai`, scope `jtstarknv-8681s-projects`).

## What's in this packet

```
WCSD-AI-Hub-Transfer/
  README-START-HERE.md            <- you are here
  orient.md                       <- full project history + rules (read this)
  site/
    index.html                    <- THE live site (deploy this folder)
    wcsd-ai-hub-teacher-v2.html   <- identical copy, original filename, for editing
    WCSD-TEACH-One-Pager.pdf      <- the PDF the TEACH page's "Download PDF" button serves
  one-pager-source/
    teach_onepager_v2.typ         <- editable source for the one-pager PDF
    wcsd_logo.png                 <- logo the .typ needs (keep it next to the .typ)
  deploy/
    deploy.ps1                    <- one-command deploy (Windows PowerShell)
    build-pdf.ps1                 <- recompile the PDF from the .typ
```

## The site is one self-contained file

`site/index.html` is a single HTML file: all CSS and JavaScript are inline, the only
external call is Google Fonts. Open it in any browser to preview. No build step, no
server, no framework. Edit the HTML directly.

`index.html` and `wcsd-ai-hub-teacher-v2.html` are the same file. Edit whichever you
like, but **whatever you deploy has to be named `index.html`** and sit in a folder
next to `WCSD-TEACH-One-Pager.pdf` (the TEACH page links to that PDF by relative path).

## Editing rules (carried over — please keep)

1. **Do not edit anything inside the `const PROMPTS = [...]` array.** Those 55 prompt
   bodies are the published doworkwithai IP and are kept byte-for-byte. The em-dash ban
   and voice rules apply to the UI copy only, never to the prompt bodies.
2. **No em dashes or en dashes in UI copy.** Use commas or restructure. (The one dash in
   the file lives inside a PROMPTS entry, which is intentionally untouched.)
3. **TEACH letter colors:** T navy `#01528A`, E teal `#0E8C7F`, A gold `#DEB40A`,
   C coral `#B42318`, H violet `#6A3FB5` (gradient `#8A63D2 -> #6A3FB5`). The H was
   changed from green so it no longer clashes with E.
4. **Green `#1E7F5C` is the semantic "success / Green-Go" color** (stoplight, section
   accents). It is NOT the H letter anymore. Don't merge the two again.
5. **Prompting spectrum** (the Who/What/How/But/Why color system) is its own cool ramp:
   p1 `#003766`, p2 `#01528A`, p3 `#1B6FA8`, p4 `#11758C`, p5 `#0E8C7F`. Distinct from
   the TEACH rainbow on purpose.

## How to deploy an update

You need Node.js installed and your Vercel token.

1. Make your edits in `site/index.html`.
2. If you changed the one-pager, rebuild the PDF first (see next section).
3. Set your token, then run the deploy script:

   ```powershell
   $env:VERCEL_TOKEN = "your_vercel_token_here"
   .\deploy\deploy.ps1
   ```

   This deploys the whole `site/` folder to production and re-aliases
   `wcsdai.vercel.app`. It ships `index.html` AND `WCSD-TEACH-One-Pager.pdf` together,
   which is required for the download button to work.

   Your Vercel token is in your personal `agentcraft-build2/.env.local`
   (`VERCEL_TOKEN=...`), or generate a new one at Vercel > Settings > Tokens.
   The token is intentionally NOT included in this packet.

## How to rebuild the one-pager PDF

The PDF is generated from `one-pager-source/teach_onepager_v2.typ` using
[Typst](https://typst.app).

Install Typst once: `winget install Typst.Typst` (restart the shell after).

Then:

```powershell
.\deploy\build-pdf.ps1
```

That compiles the `.typ` and writes a fresh `WCSD-TEACH-One-Pager.pdf` straight into
`site/`, ready to deploy. Keep `wcsd_logo.png` next to the `.typ` — the source
references it by name.

The one-pager fits on exactly one US-Letter page. It's tightly tuned; if you add
content, it can spill to a second page. If that happens, trim spacing or shorten the
TEACH body lines until `typst compile` reports one page again.

## Current state (June 2026)

The site is live and current. Most recent changes: Guardrails merged into the TEACH
page (no separate nav item), home reimagined to lead with the TEACH framework, the
prompting "sentence builder" with a color legend on the home page, the one-pager's old
"5-second check" replaced by the prompt-builder block, and the H letter recolored to
violet across the site and the PDF. Full detail is in `orient.md`.
