export const THEME_KEY = "theme";
export const STARTUP_KEY = "desk:started";

/**
 * Runs before first paint. Applies a saved theme, and marks the first visit of
 * a session so the desk can play its startup once. Skipped under reduced motion.
 */
export const BEFORE_PAINT = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")d.dataset.theme=t;if(!sessionStorage.getItem("${STARTUP_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.startup=""}catch(e){}})()`;
