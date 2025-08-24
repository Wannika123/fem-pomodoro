import type { TickSoundType, AlarmSoundType } from "./settingOptions";

export function findFilePath(value: TickSoundType | AlarmSoundType) {
    switch (value) {
        case "cinematic":
        case "old-fasioned":
        case "simple":
            return `/sound/tick-${value}.mp3`;
        case "electronic":
        case "marimba":
        case "relax":
            return `/sound/alarm-${value}.mp3`;
    }
}
