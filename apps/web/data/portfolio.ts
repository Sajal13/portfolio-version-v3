// Row splits into two opposing-direction rows once there are more than this many projects.
export const SPLIT_THRESHOLD = 12;

// A row only autoplays once it has more than this many items — otherwise a
// static line of e.g. 2-4 cards would just loop pointlessly over itself.
export const MIN_ITEMS_TO_AUTOPLAY = 4;

// Cards get a fixed width so the loop distance and nav "nudge" step are
// exact numbers instead of something we have to re-measure from the DOM.
export const CARD_WIDTH = 360; // px
export const CARD_GAP = 24; // px — matches Tailwind's gap-6

export const MARQUEE_SPEED_PX_PER_SEC = 55;
export const NUDGE_SCRUB_DURATION = 0.6; // seconds, nav-button seek animation
