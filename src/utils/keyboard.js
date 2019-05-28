import { KEY_RETURN, KEY_ESCAPE, KEY_RIGHT, KEY_LEFT } from 'keycode-js';

export const isSubmitKey = e => (e.ctrlKey || e.metaKey) && e.keyCode === KEY_RETURN;
export const isEnterKey = e => e.keyCode === KEY_RETURN;
export const isEscKey = e => e.keyCode === KEY_ESCAPE;
export const isLeftArrowKey = e => e.keyCode === KEY_LEFT;
export const isRightArrowKey = e => e.keyCode === KEY_RIGHT;
