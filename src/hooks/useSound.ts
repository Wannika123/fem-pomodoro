import { useEffect, useState } from "react";

const actx = new AudioContext();

export default function useSound() {
    const [source, setSource] = useState<AudioBufferSourceNode>(
        actx.createBufferSource()
    );
    const [isPlaying, setIsPlaying] = useState(false);

    const playSound = (
        source: AudioBufferSourceNode,
        decodedAudio: AudioBuffer,
        gainVal: number,
        loop: boolean
    ) => {
        source.buffer = decodedAudio;

        const gainNode = actx.createGain();
        gainNode.gain.value = gainVal;

        source.connect(gainNode).connect(actx.destination);
        source.loop = loop;
        source.start(actx.currentTime);
        setIsPlaying(true);
    };

    const stopAudio = () => {
        if (isPlaying) {
            source.stop();
        }
        setIsPlaying(false);

        // Create new source node, ready to be used right away
        setSource(actx.createBufferSource());
    };

    const startAudio = (
        sampleFilePath: string,
        gainVal: number,
        isLoop: boolean
    ) => {
        // Stop any playing sample (if any)
        if (isPlaying) {
            source.stop();
        }
        const newSource = actx.createBufferSource();
        // store in state, just in case to get access (to stop) later
        setSource(newSource);

        fetch(sampleFilePath)
            .then((data) => data.arrayBuffer())
            .then((buffer) => actx.decodeAudioData(buffer))
            .then((decodedAudio) => {
                playSound(newSource, decodedAudio, gainVal, isLoop);
            });
    };

    const soundEnd = () => {
        setIsPlaying(false);
    };

    useEffect(() => {
        console.log("adding");
        source.addEventListener("ended", soundEnd);

        return () => {
            source.removeEventListener("ended", soundEnd);
        };
    }, [source]);

    return { stopAudio, startAudio };
}
