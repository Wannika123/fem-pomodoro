export type Mode = "pomodoro" | "short break" | "long break";

export const COLORS = ["Red", "Blue", "Purple"] as const;
export type ColorType = (typeof COLORS)[number];

export const FONTS = ["Kumbh Sans", "Roboto Slab", "Space Mono"] as const;
export type FontType = (typeof FONTS)[number];

export const TICK_SOUND = ["cinematic", "old-fasioned", "simple"] as const;
export type TickSoundType = (typeof TICK_SOUND)[number];

export const ALARM_SOUND = ["electronic", "marimba", "relax"] as const;
export type AlarmSoundType = (typeof ALARM_SOUND)[number];
