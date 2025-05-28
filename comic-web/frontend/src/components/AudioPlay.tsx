import {useEffect, useState, useRef} from 'react';
import { faForwardFast ,faBackwardFast} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { audioText } from '../actions/audioAction';
// import { useNavigate } from 'react-router-dom';
//Interface 
const baseURL = 'http://localhost:8000'
interface AudioPlayProps {
    audioTitle: string;
    nextAudio?: string|null;
    preAudio?: string|null;
}

const AudioPlay = ({audioTitle}:AudioPlayProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [audioUrl, setAudioUrl] = useState<string>('');
    /* Cập nhật audioUrl dựa vào title*/
    useEffect(()=>{
        const url = `${baseURL}/api/audio/tts/${audioTitle}/`;
        setAudioUrl(url);
        if (audioRef.current) {
            audioRef.current.load();  // Tải lại audio mỗi khi audioUrl thay đổi
        }
        console.log("Audio title: ",`${baseURL}/api/audio/tts/${audioTitle}/`);
        
    },[audioTitle])
    /* Tải hoặc tạo audio chỉ định */
    const handleGenerateAudio = async () => {
    setIsLoading(true);
    try {
        await audioText(audioTitle);
        console.log("Tải thành công audio!");
    } catch (error) {
        console.error("Error generating audio:", error);
    } finally {
        setIsLoading(false);
    }
  };
    /* Rewind 10 giây trước */
    const rewind = () =>
    {
        const audio = audioRef.current;
        if(audio) {
            audio.currentTime = Math.max(0, audio.currentTime - 10);
            console.log("Time changed: ",audio.currentTime, audio.duration);
        }
    };
    /* Forward 10 giây sau */
    const forward = () =>
    {
        const audio = audioRef.current;
        if(audio&&audio.readyState >= 1) {
            audioRef.current!.currentTime += 10;

            console.log("Time changed: ",audio.currentTime, audio.duration);
        }
    };

    
    return (
        <div className="bg-white p-4 rounded-xl shadow-md mt-10 space-y-4">
            <div className="space-x-4 space-y-4 ">
            <button onClick={handleGenerateAudio} disabled={isLoading}>
                {isLoading ? "Đang tạo..." : "Tạo âm thanh"}
            </button>
                <div className="flex flex-row gap-[8px] justify-center items-center">
                    {/* Control Button */}
                    <button onClick={rewind} className="rounded-[3px] hover:bg-white dark:hover:bg-gray-700">
                        <FontAwesomeIcon icon = {faBackwardFast} />
                    </button>
                    <button onClick={forward} className="rounded-[3px] hover:bg-white dark:hover:bg-gray-700">
                        <FontAwesomeIcon icon = {faForwardFast} />
                    </button> 
                </div>
                {/* Audio */}
                <div className="w-full flex items-center justify-between px-4 py-2 space-x-4">
                    <audio controls src={audioUrl} ref={audioRef} className="w-full">
                   </audio>
                </div>
            </div>        
        </div>
    );
}
export default AudioPlay;
