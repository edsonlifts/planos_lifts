# Handoff: Closer Lifts — Deck de Vendas Interativo

## Overview
Deck de apresentação de vendas (closer) para a Clínica Lifts — clínica de saúde 100% online brasileira. O deck guia o closer do primeiro contato até o fechamento, com um slide interativo de seleção de plano (slide 11).

## About the Design Files
Os arquivos neste bundle são **referências de design criadas em HTML** — protótipos mostrando aparência e comportamento pretendidos, não código de produção para copiar diretamente. A tarefa é **recriar esses designs HTML no ambiente existente do codebase** (React, Next.js, etc.) usando seus padrões e bibliotecas estabelecidos.

## Fidelity
**High-fidelity (hifi)**: Mockups pixel-perfect com cores finais, tipografia, espaçamento e interações. O desenvolvedor deve recriar a UI fielmente usando as bibliotecas e padrões existentes do codebase.

## Design System
Usa o **Clínica Lifts Design System** com os seguintes tokens:

### Colors
- **Navy (primary dark):** `#0F2638`
- **Navy deep (bg):** `#060F1A`
- **Navy mid:** `#12314A`
- **Lime (primary accent):** `#CCCB3F`
- **Lime soft (hover):** `#E3E28F`
- **White:** `#FFFFFF`
- **Dark backdrop (photos):** `#1C1C1C`
- **Red (negative):** `#E36B5C`

### Typography
- **Poppins** (Google Fonts) — headlines, impact text, buttons, body ≥20px
  - Weights: 900 (impact), 800/700 (headlines), 600/500 (body), 400 (regular), 300-italic (myths)
- **Inter** (Google Fonts) — credentials, disclaimers, captions, small text <20px
  - Weight: 400

### Key Design Patterns
- **Card radius:** 40px for slide cards, 0px for brand art boxes
- **Checker band:** `xadrez-bandeirada.svg` (navy on lime) and `xadrez-bandeirada-lime.svg` (lime on navy) — 48px tall strip at top of every slide
- **Signature tilt:** Emphasis boxes rotate ~1.5° counter-clockwise (`transform: rotate(-1.5deg)`)
- **Backgrounds:** Flat solid colors only, no gradients
- **Shadows:** None on brand art; subtle elevation on web elements only
- **Photo treatment:** Diagonal cuts, dark studio backdrop `#1C1C1C`

## Screens / Slides

### Slide Dimensions
1920×1080px (16:9), rendered inside a `deck-stage` web component that handles scaling, keyboard/tap nav, thumbnails and print. This deck runs it with `no-rail`, so the thumbnail rail is off.

### Slide Structure
Every slide follows this pattern:
- Outer: `<section>` with `background: #060F1A`
- Inner: `<div>` with `position: absolute; inset: 36px; border-radius: 40px; overflow: hidden`
- Top: 48px checker band (`background-image` with SVG pattern, `background-repeat: repeat-x`, `background-size: 96px 96px`)
- Content uses Poppins font-family throughout

### Slide List

The numbers in the labels are inherited from the original PDF and are **not** the
deck order — slides have been added, dropped and moved since. The order below is
the order they play in. `node mkpreview.js --list` prints it from the file.

0. **00 Paciente (SETUP — não é slide de apresentação)** — Lime bg. Seller fills the patient's name and goal before the call; it feeds the "VOCÊ" card on slide 09. Emagrecer/musculo ask for a kg figure (sign flips − / +); **melhorar shape has no field** — it is a fixed target, identical for everyone: −5 kg de gordura / +3 kg de músculo (`PAC_SHAPE_*` in the budget script). State is in-memory only, deliberately: persisting it would carry one patient's name into the next patient's call. A refresh clears it.

1. **14 CTA (opens the deck)** — Navy bg. Centered. Logo, lime box "Parabéns por chegar aqui." (tilted), subtitle about booking the first consult today. Checker bands top and bottom. Despite the label it is the **first** presentation slide: the old "01 Capa" was removed and this took its place as the welcome.

2. **02 4 passos** — Navy bg. Steps 1-3 (Médico → Nutricionista → Personal) run one card at a time in a fixed slot beside a persona photo, advanced by the lime arrow (`revealNextPasso`); after step 3 the slide swaps to a 4-up grid finale whose last card (Resultado sustentável) is lime and lands tilted -1.5deg. Resets to step 1 on slide change.

3. **03 Resultado -10kg** — Lime bg. Felipe, −10 KG em 2 meses. Navy "−10 KG" box with the shine sweep; the photo is a single click-to-toggle antes/depois, not a side-by-side pair.

4. **04 Resultado -14kg** — Navy bg. Mellanie, −14 KG em 3 meses. Same click-to-toggle photo pattern, lime "−14 KG" box.

5. **05 O problema** — Lime bg. Centered statement: "O problema não é você." + navy box "É FAZER SOZINHO" (tilted) + "… e sem acompanhamento."

6. **06 Mercado x Lifts** — Navy bg. Two-column comparison. Left (navy-mid): market failures with red ✕. Right (lime, tilted -1deg): Lifts advantages with ↘ arrows.

7. **07 App** — Lime bg. Left: headline "Seu plano inteiro no seu bolso.", tilted navy box "DIETA · TREINO · HIDRATAÇÃO" (shine), 5 feature rows with emoji in navy icon chips (chips echo the app's own icon tiles and keep the pale emoji legible — several render white and vanish on lime). Right: `assets/CELULAR.webp` (light + dark theme phones), floating. Lime is deliberate — the phones are black and sink into a navy bg, and it keeps 06/07/08 alternating. The asset is opaque from its top edge (0%), so it must clear the 48px flag strip; only the shadow tail past ~97% is safe to crop.

8. **12 Suporte 24h** — Lime bg. Left: tilted navy kicker plate, headline with the "24 HORAS" badge inline. Right: 2 chat screenshots (tilted, drifting like the slide 07 phones) — they render at ~half their native 1600px, so tapping opens one full size; below them the 💬 "app da Lifts" caption ties back to slide 07. Moved here from the end of the deck; "08 Manter é outra" (the ~80% weight-regain stat) was removed.

9. **09 Você também** — Navy bg. Left: "Você **também** pode chegar lá." Right: three cards — Felipe (−10kg / 2 meses), Mellanie (−14kg / 3 meses), and the patient's, fed from slide 00. The first two are results that happened; the third is a GOAL and is built to look different on purpose (dashed frame, no photo, "sua meta em 6 meses" instead of a period). Do not let it drift toward matching the other two — that would read as a promised outcome. It opens behind a lime "VOCÊ" cover that peels off its bottom-right corner on click (`peelYouCard`), so the number lands as a reveal; `resetYouCard` re-covers it on slide change. Replaced the Gavanda et al. adherence study (81% vs 52%), which is no longer anywhere in the deck.

10. **10 Custo sozinho** — Navy bg. Two views in one card, swapped by the corner "LOGÍSTICA ↗" button (`#custo-switch`), cross-fading.
    - **Custo (default):** headline + 5 cost items, each with a red (`#E36B5C`) value; the five MUST sum to the R$ 7.400 in the box (1.800 + 1.500 + 2.100 + 900 + 1.100). Right: ONE box that flips on click — "≈ R$ 7.400 / sozinho, em 6 meses" (navy-mid, red rail + red number) → "a partir de R$ 197,48/mês" (lime, tilted). Costs are red, the Lifts price is lime; that contrast is the argument. Both sides span 6 months (START is literally 6x R$197,48 = R$1.184,88), so the comparison is like-for-like — keep it that way if the numbers change.
    - **Logística:** the same argument in time rather than money — everything online, no commuting, one team ("100% ONLINE").
    - Resets to the Custo view on the R$7.400 on slide change.

11. **11 Plano (INTERACTIVE)** — Lime bg. Left: headline "Vamos fazer SEU plano.", subtitle, 3 toggle buttons (Médico, Nutricionista, Personal). Right: a single "VER O PLANO IDEAL" CTA carrying the Lifts emblem — greyed and inert until a professional is picked, then live (same element size in both states, so it lights up rather than jumps) → clicking reveals the matching plan card and collapses the left column to a rail.

    **Selection logic:**
    - Médico only → Lifts MEDICAL (3x R$199, trimestral)
    - Nutricionista only OR Médico+Nutri → Lifts NUTRITION (6x R$237,48)
    - Personal only OR Nutri+Personal → Lifts START (6x R$197,48)
    - Médico+Personal OR all three → Lifts ELITE (6x R$317,48, vagas limitadas)

    **State management:**
    - `medico`, `nutri`, `personal`: boolean toggles
    - `revealed`: boolean, set to true on the "VER O PLANO IDEAL" click. Toggles no longer reset it — once a plan is up they swap it live and the rail layout holds; only deselecting everything collapses back
    - Plan cards only show when `revealed === true`

    **Toggle button styles:**
    - Inactive: transparent bg, navy text, 3px navy border
    - Active: navy bg, lime text, 3px navy border
    - All: 28px Poppins 800, flex:1, cursor pointer, 200ms transition

12. **15 Próximos passos (closes the deck)** — Navy bg. Answers the "e agora?" right after the plan and the price. Five columns of rising height stand on the lime floor strip and draw a staircase: pagamento + contrato → onboarding → primeiras consultas → acesso ao app → alcançar sua melhor versão. The fifth is lime and the tallest because it is where the patient *arrives*, not another task he has to do — do not level it with the others.

    **Reveal:** the slide opens bare (plate, floor, emblem) and **each click anywhere on it raises the next step** (`revealNextProx`), growing out of the floor via `clip-path` — a transform would squash the type on the way up. After the fifth the handler is removed: deck-stage's tap-nav skips any `[onclick]` element, so leaving it on would cost the last slide its tap-to-go-back on touch. `resetProx` returns it to bare floor on slide change; `@media print` shows the whole flight, since print has no clicks.

    **Note:** `.prox-text` sets `text-wrap:balance` explicitly. deck-stage only grants it to headings and `<p>`, and these labels are `<div>`s — without it step 4 breaks into a ragged orphan line.

## Assets
All assets are included in the handoff folder:
- `assets/` — Logo PNGs (`emblema-azul-total.png`, `emblema-branco.png`, `horizontal-branco.png`) and checker SVG patterns
- `pdf_images/` — Patient photos, app screenshots, chat screenshots, feedback prints

## Files
- `index.html` — The complete deck: every slide, all its CSS, and the per-slide logic
- `deck-stage.js` — Slide deck web component (scaling, keyboard/tap nav, thumbnails, print)
- `image-slot.js` — Drag-and-drop image placeholder component
- `server.js` — Static preview server (`npm run dev` → http://localhost:3000)
- `mkpreview.js` — Renders one slide to a PNG (see below)

## Running it
```
npm run dev        # http://localhost:3000
```
Keyboard: ←/→, PgUp/PgDn, Space, Home/End, number keys. Tap-to-advance is
touch-only — on a mouse the clicks belong to the slides.

## Looking at a slide
`mkpreview.js` shoots any single slide to a PNG at its true 1920×1080, without
clicking through the deck by hand:

```
node mkpreview.js --list                    # slide labels, in deck order
npm run preview -- "15 Próximos passos"     # → previews/15-proximos-passos.png
```

It pulls the `<style>` and the `<section>` out of `index.html` at run time, so
what it shoots is what the deck serves — there is no second copy to drift.

Rendering is macOS Quick Look (`qlmanage`), which **does not run scripts**. Every
click-gated state — a revealed plan card, a peeled goal card, a risen staircase —
renders closed unless you force it open with `--css`:

```
npm run preview -- "15 Próximos passos" --css ".prox-card { clip-path:inset(0) !important }"
```

That is the tool's one real limitation: it shows layout and type, never motion.
`previews/` is gitignored.
