declare const responsiveVoice: {
    speak: (text: string, voice?: string, params?: { speed?: number; volume?: number; onstart?: () => void; onend?: () => void }) => void;
    pause: () => void;
    resume: () => void;
    cancel: () => void;
    isPlaying: () => boolean;
    voices: () => { name: string; lang: string }[];
};