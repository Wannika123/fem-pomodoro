import type { SettingValues, AudioValue } from "./Pomodoro";
import type {
    ColorType,
    FontType,
    TickSoundType,
    AlarmSoundType,
} from "../lib/settingOptions";
import { COLORS, FONTS, TICK_SOUND, ALARM_SOUND } from "../lib/settingOptions";
import closeIcon from "../assets/icon-close.svg";
import styles from "./Settings.module.css";
import { useEffect, useState } from "react";
import checkIcon from "../assets/icon-check.svg";
import CustomInput from "./CustomInput";
import AudioOptions from "./AudioOptions";

type Props = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    values: SettingValues;
    setValues: React.Dispatch<React.SetStateAction<SettingValues>>;
};

export default function Settings({
    isOpen,
    setIsOpen,
    values,
    setValues,
}: Props) {
    const [font, setFont] = useState<FontType>(values.font);
    const [color, setColor] = useState<ColorType>(values.color);
    const [pomodoro, setPomodoro] = useState(values.pomodoro);
    const [shortBreak, setShortBreak] = useState(values.shortBreak);
    const [longBreak, setLongBreak] = useState(values.longBreak);
    const [tick, setTick] = useState<AudioValue<TickSoundType>>(values.tick);
    const [alarm, setAlarm] = useState<AudioValue<AlarmSoundType>>(
        values.alarm
    );

    const applyValues = () => {
        setValues({
            pomodoro: pomodoro,
            shortBreak: shortBreak,
            longBreak: longBreak,
            font: font,
            color: color,
            tick: tick,
            alarm: alarm,
        });
        setIsOpen(false);
    };

    useEffect(() => {
        if (!isOpen) return;

        // When the modal is closed with close button, the changed values won't be applied to the state in parent
        // This is to make sure that the value will be the same as parent
        setPomodoro(values.pomodoro);
        setShortBreak(values.shortBreak);
        setLongBreak(values.longBreak);
        setFont(values.font);
        setColor(values.color);
        setTick(values.tick);
        setAlarm(values.alarm);
    }, [isOpen]);
    return (
        <div className={styles.container}>
            <div className={styles["setting-header"]}>
                <h2>Settings</h2>
                <button
                    aria-label="close setting modal"
                    onClick={() => setIsOpen(false)}
                >
                    <img src={closeIcon} alt="close icon" />
                </button>
            </div>

            <hr />

            <div className={styles["setting-body"]}>
                <h3>time (minutes)</h3>
                <div className={styles["time-grid"]}>
                    <div>
                        <p>pomodoro</p>
                        <CustomInput value={pomodoro} setValue={setPomodoro} />
                    </div>
                    <div>
                        <p>short break</p>
                        <CustomInput
                            value={shortBreak}
                            setValue={setShortBreak}
                        />
                    </div>
                    <div>
                        <p>long break</p>
                        <CustomInput
                            value={longBreak}
                            setValue={setLongBreak}
                        />
                    </div>
                </div>

                <hr />

                <div className={styles["btns-wrapper"]}>
                    <h3>font</h3>
                    <div className={styles["font-btns"]}>
                        {FONTS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFont(f)}
                                style={{ fontFamily: f }}
                                className={
                                    font === f ? styles["selected-btn"] : ""
                                }
                            >
                                Aa
                            </button>
                        ))}
                    </div>
                </div>

                <hr />

                <div className={styles["btns-wrapper"]}>
                    <h3>color</h3>
                    <div className={styles["color-btns"]}>
                        {COLORS.map((c) => (
                            <button
                                key={c}
                                aria-label={`${c} button`}
                                style={{ backgroundColor: `var(--${c})` }}
                                onClick={() => setColor(c)}
                            >
                                {color === c ? (
                                    <img src={checkIcon} alt="check icon" />
                                ) : undefined}
                            </button>
                        ))}
                    </div>
                </div>

                <hr />

                <AudioOptions
                    label="tick sound"
                    options={[...TICK_SOUND, "off"]}
                    audioValue={tick}
                    setAudioValue={setTick}
                />

                <hr />

                <AudioOptions
                    label="alarm sound"
                    options={[...ALARM_SOUND, "off"]}
                    audioValue={alarm}
                    setAudioValue={setAlarm}
                />

                <button className={styles["apply-btn"]} onClick={applyValues}>
                    Apply
                </button>
            </div>
        </div>
    );
}
