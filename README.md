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
1920×1080px (16:9), rendered inside a `deck-stage` web component that handles scaling, keyboard nav, thumbnail rail, and print.

### Slide Structure
Every slide follows this pattern:
- Outer: `<section>` with `background: #060F1A`
- Inner: `<div>` with `position: absolute; inset: 36px; border-radius: 40px; overflow: hidden`
- Top: 48px checker band (`background-image` with SVG pattern, `background-repeat: repeat-x`, `background-size: 96px 96px`)
- Content uses Poppins font-family throughout

### Slide List (14 slides)

1. **01 Capa** — Lime bg. Left: emblem, tag "PASSO A PASSO PARA O RESULTADO", headline "Entrei na Lifts. E agora?", subtitle. Right: patient photo on dark backdrop.

2. **02 4 passos** — Navy bg. 4-column grid of step cards (Médico → Nutricionista → Personal → Resultado sustentável). Last card is lime with -1.5deg tilt.

3. **03 Resultado -29kg** — Lime bg. Left: stats (117kg/43%BF → 88kg/18%BF), navy box with "−29 KG". Right: before/after photos side-by-side.

4. **04 Clarice -14kg** — Navy bg. Left: stats (102kg/43%BF → 88kg/28%BF), lime box with "−14 KG". Right: image-slot placeholders for before/after photos.

5. **05 O problema** — Lime bg. Centered statement: "O problema não é você." + navy box "É FAZER SOZINHO" (tilted) + "… e sem acompanhamento."

6. **06 Mercado x Lifts** — Navy bg. Two-column comparison. Left (navy-mid): market failures with red ✕. Right (lime, tilted -1deg): Lifts advantages with ↘ arrows.

7. **07 App** — Lime bg. Left: headline "Seu plano inteiro no seu bolso.", tilted navy box "DIETA · TREINO · HIDRATAÇÃO" (shine), 5 feature rows with emoji in navy icon chips (chips echo the app's own icon tiles and keep the pale emoji legible — several render white and vanish on lime). Right: `assets/CELULAR.webp` (light + dark theme phones), floating. Lime is deliberate — the phones are black and sink into a navy bg, and it keeps 06/07/08 alternating. The asset is opaque from its top edge (0%), so it must clear the 48px flag strip; only the shadow tail past ~97% is safe to crop.

8. **12 Suporte 24h** — Lime bg. Left: headline + navy box "24 HORAS" (tilted). Right: 2 chat screenshots (slightly rotated, with shadows). Moved here from the end of the deck; "08 Manter é outra" (the ~80% weight-regain stat) was removed.

9. **09 Estudo adesão** — Lime bg. Bar chart comparing 81% (guided) vs 52% (solo) adherence. Academic citation.

10. **10 Custo sozinho** — Navy bg. Left: headline + 5 cost items, each with a red (`#E36B5C`) value; the five MUST sum to the R$ 7.400 in the box (1.800 + 1.500 + 2.100 + 900 + 1.100). Right: ONE box that flips on click — "≈ R$ 7.400 / sozinho, em 6 meses" (navy-mid, red rail + red number) → "a partir de R$ 197,48/mês" (lime, tilted). Costs are red, the Lifts price is lime; that contrast is the argument. Both sides span 6 months (START is literally 6x R$197,48 = R$1.184,88), so the comparison is like-for-like — keep it that way if the numbers change. Resets to the R$7.400 on slide change.

11. **11 Orçamento (INTERACTIVE)** — Lime bg. Left: headline "Vamos fazer SEU orçamento", subtitle, 3 toggle buttons (Médico, Nutricionista, Personal). Right: initially shows "?" placeholder → after selecting buttons, shows "VER MEU PLANO IDEAL ↘" button → after clicking, reveals matching plan card.

    **Selection logic:**
    - Médico only → Lifts MEDICAL (3x R$199, trimestral)
    - Nutricionista only OR Médico+Nutri → Lifts NUTRITION (6x R$237,48)
    - Personal only OR Nutri+Personal → Lifts START (6x R$197,48)
    - Médico+Personal OR all three → Lifts ELITE (6x R$317,48, vagas limitadas)

    **State management:**
    - `medico`, `nutri`, `personal`: boolean toggles
    - `revealed`: boolean, set to true on "VER MEU PLANO IDEAL" click, reset to false on any toggle change
    - Plan cards only show when `revealed === true`

    **Toggle button styles:**
    - Inactive: transparent bg, navy text, 3px navy border
    - Active: navy bg, lime text, 3px navy border
    - All: 28px Poppins 800, flex:1, cursor pointer, 200ms transition

12. **16 Lifts Medical** — Lime bg. Dedicated Medical plan slide with full details. Left: plan name, description, price (3x R$199). Right: included items list.

13. **17 CTA** — Navy bg. Centered. Logo, lime box "Bora começar?" (tilted), subtitle. Checker bands top and bottom.

## Assets
All assets are included in the handoff folder:
- `assets/` — Logo PNGs (`emblema-azul-total.png`, `horizontal-branco.png`) and checker SVG patterns
- `pdf_images/` — Patient photos, app screenshots, chat screenshots, feedback prints
- `deck-stage.js` — Slide deck web component (handles scaling, nav, thumbnails, print)
- `image-slot.js` — Drag-and-drop image placeholder component

## Files
- `Closer Lifts.dc.html` — The complete deck (Design Component format with embedded logic class)
