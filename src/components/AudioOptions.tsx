import styles from "./AudioOptions.module.css";
import type { TickSoundType, AlarmSoundType } from "../lib/settingOptions";
import type { AudioValue } from "./Pomodoro";
import useSound from "../hooks/useSound";
import { findFilePath } from "../lib/audioFilePath";
import type { ChangeEvent } from "react";

type Tick = {
    label: "tick sound";
};

type Alarm = {
    label: "alarm sound";
};

type AudioOptions<T> = {
    options: (T | "off")[];
    audioValue: AudioValue<T>;
    setAudioValue: React.Dispatch<React.SetStateAction<AudioValue<T>>>;
};

type Props =
    | (Tick & AudioOptions<TickSoundType>)
    | (Alarm & AudioOptions<AlarmSoundType>);

export default function AudioOptions({
    label,
    options,
    audioValue,
    setAudioValue,
}: Props) {
    const { startAudio, stopAudio } = useSound();

    const processTickOptions = (
        option: any
    ): option is TickSoundType | "off" => {
        console.log(option);
        return label === "tick sound";
    };

    const processAlarmOptions = (
        option: any
    ): option is AlarmSoundType | "off" => {
        console.log(option);
        return label === "alarm sound";
    };

    const changeSound = (option: any) => {
        if (label === "tick sound" && processTickOptions(option)) {
            setAudioValue((prev) => {
                return { ...prev, sound: option };
            });
        }
        if (label === "alarm sound" && processAlarmOptions(option)) {
            setAudioValue((prev) => {
                return { ...prev, sound: option };
            });
        }
        if (option !== "off") {
            startAudio(findFilePath(option), audioValue.gain, false);
        }
    };

    const changeGain = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);

        setAudioValue((prev: any) => {
            return { ...prev, gain: value };
        });
    };

    return (
        <div className={styles.container}>
            <div>
                <h3>{label}</h3>
                <div className={styles.btns}>
                    {options.map((option) => (
                        <button
                            key={option}
                            className={
                                audioValue.sound === option
                                    ? styles["selected-btn"]
                                    : undefined
                            }
                            onClick={() => changeSound(option)}
                            onBlur={stopAudio}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
            <input
                className={styles["range-input"]}
                type="range"
                min={0}
                max={1}
                step={0.1}
                disabled={audioValue.sound === "off"}
                onChange={changeGain}
                value={audioValue.gain}
            />
        </div>
    );
}
