// Each line is typed out in sequence. Prefixing a line with "$ " renders it
// like a typed command; anything else renders like command output.
export const TERMINAL_LINES: string[] = [
  '$ whoami',
  'sajal-das — software engineer',
  '$ npm run build',
  'Compiling modules... done',
  'Optimizing assets... done',
  '✓ Build complete',
  '$ npm start',
  '✓ Server ready on port 3000'
];

export const TYPE_SPEED_MS = 28; // ms per character
export const LINE_PAUSE_MS = 220; // pause between finishing one line and starting the next
export const HOLD_BEFORE_EXIT_MS = 500; // pause after the last line before exiting
