#!/usr/bin/env node
/**
 * Shoots one slide of the deck to a PNG at its true 1920x1080, so a slide can
 * be looked at without clicking through the deck by hand — useful when working
 * on a slide's layout, and the only way to see one from a terminal.
 *
 * Usage:
 *   node mkpreview.js "15 Próximos passos"
 *   node mkpreview.js "11 Plano" --out /tmp
 *   node mkpreview.js "15 Próximos passos" --css ".prox-card { clip-path:inset(0) }"
 *   node mkpreview.js --list
 *
 * The <style> and the <section> are pulled straight out of index.html at run
 * time, so what gets shot is what the deck serves — there is no second copy of
 * the markup here to drift out of sync.
 *
 * Rendering is macOS Quick Look (qlmanage), which does NOT run scripts. Every
 * click-gated state — a revealed plan card, a peeled goal card, a risen
 * staircase — therefore renders in its closed state unless you force it open
 * with --css. That is the tool's one real limitation: it shows layout and type,
 * never behaviour.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const DECK_DIR = __dirname;
const DECK_FILE = path.join(DECK_DIR, 'index.html');

// Quick Look renders into a ~960px square viewport and always emits a square
// image, whatever the page's own size. So the stage is scaled to half and
// centred in that square: shot at 1920 the slide lands back at exactly
// 1920x1080, centred, and sips crops the letterboxing away.
const VIEW = 960;
const SHOT = 1920;
const SLIDE_W = 1920;
const SLIDE_H = 1080;

function parseArgs(argv) {
  const opts = { label: null, css: '', out: path.join(DECK_DIR, 'previews'), list: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--list') opts.list = true;
    else if (a === '--css') opts.css = argv[++i] || '';
    else if (a === '--out') opts.out = path.resolve(argv[++i] || '.');
    else if (!opts.label) opts.label = a;
  }
  return opts;
}

const slideLabels = (src) =>
  [...src.matchAll(/<section[^>]*data-label="([^"]+)"/g)].map((m) => m[1]);

function buildPage(src, label, extraCss) {
  const at = src.indexOf(`data-label="${label}"`);
  if (at === -1) {
    throw new Error(
      `no slide labelled "${label}".\nAvailable:\n  ` + slideLabels(src).join('\n  ')
    );
  }
  // data-label is not always the first attribute (some slides carry an id), so
  // walk back to the <section that opens it.
  const start = src.lastIndexOf('<section', at);
  const end = src.indexOf('</section>', start) + '</section>'.length;
  // deck-stage's shadow CSS normally supplies the positioning and gates the
  // entrance styles on [data-deck-active]; stand in for both here.
  const section = src.slice(start, end).replace('<section ', '<section data-deck-active ');
  const style = src.match(/<style>([\s\S]*?)<\/style>/)[1];
  const fonts = src.match(/<link href="https:\/\/fonts\.googleapis[^>]*>/);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
${fonts ? fonts[0] : ''}
<style>
${style}
  html, body { width:${VIEW}px; height:${VIEW}px; overflow:hidden; background:#060F1A; }
  #shot {
    position:absolute;
    top:${(VIEW - SLIDE_H / 2) / 2}px;
    left:0;
    width:${SLIDE_W}px; height:${SLIDE_H}px;
    transform:scale(0.5); transform-origin:top left;
  }
  section[data-deck-active] {
    position:relative !important;
    display:block !important;
    width:${SLIDE_W}px; height:${SLIDE_H}px;
    opacity:1 !important; visibility:visible !important;
    transform:none !important;
  }
${extraCss}
</style>
</head>
<body><div id="shot">
${section}
</div></body>
</html>`;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const src = fs.readFileSync(DECK_FILE, 'utf8');

  if (opts.list || !opts.label) {
    console.log('Slides (in deck order):');
    slideLabels(src).forEach((l, i) => console.log(`  ${String(i).padStart(2)}  ${l}`));
    if (!opts.label) console.log('\nUsage: node mkpreview.js "<slide label>" [--css "<overrides>"] [--out <dir>]');
    return;
  }

  const page = buildPage(src, opts.label, opts.css);

  // The page has to live beside index.html or its relative asset paths break.
  const tmp = path.join(DECK_DIR, `.mkpreview-${process.pid}.html`);
  fs.mkdirSync(opts.out, { recursive: true });
  const slug = opts.label.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const png = path.join(opts.out, `${slug}.png`);

  fs.writeFileSync(tmp, page);
  const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'mkpreview-'));
  try {
    execFileSync('qlmanage', ['-t', '-s', String(SHOT), '-o', staging, tmp], { stdio: 'ignore' });
    const shot = path.join(staging, path.basename(tmp) + '.png');
    if (!fs.existsSync(shot)) throw new Error('qlmanage produced no thumbnail');
    fs.copyFileSync(shot, png);
    // Square canvas in, 16:9 slide out.
    execFileSync('sips', ['-c', String(SLIDE_H), String(SLIDE_W), png], { stdio: 'ignore' });
  } finally {
    fs.rmSync(tmp, { force: true });
    fs.rmSync(staging, { recursive: true, force: true });
  }

  console.log(png);
}

try {
  main();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
