// Loads a Google Font's stylesheet on demand (only when actually selected/used),
// instead of statically importing dozens of fonts up front. Keeps first load fast
// even though the picker offers 50+ font choices.

const loadedFonts = new Set<string>();

export function loadGoogleFont(
  fontName: string,
  weights: string = '300;400;500;600;700;800;900'
): void {
  if (!fontName || loadedFonts.has(fontName)) return;

  const linkId = `google-font-${fontName.replace(/\s+/g, '-')}`;
  if (document.getElementById(linkId)) {
    loadedFonts.add(fontName);
    return;
  }

  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
    /\s+/g,
    '+'
  )}:wght@${weights}&display=swap`;

  document.head.appendChild(link);
  loadedFonts.add(fontName);
}
