import {useEffect, useState, useRef} from 'react';
import { faForwardFast ,faBackwardFast} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { audioText } from '../actions/audioAction';
// import { useNavigate } from 'react-router-dom';
//Interface 
const baseURL = 'http://localhost:8000'
interface AudioPlayProps {
    audioContent: string;
    audioTitle: string;
    nextAudio?: string|null;
    preAudio?: string|null;
}

const AudioPlay = ({audioContent, audioTitle}:AudioPlayProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [audioUrl, setAudioUrl] = useState<string>('');
    // const navigate = useNavigate();
    /* Tải hoặc tạo audio chỉ định */
    useEffect(()=>{
        const url = `${baseURL}/api/audio/tts/${audioTitle}/`;
        setAudioUrl(url);
        console.log("Audio title: ",`${baseURL}/api/audio/tts/${audioTitle}/`);
    },[audioTitle])
    const handleGenerateAudio = async () => {
    setIsLoading(true);
    try {
        await audioText(audioContent, audioTitle);
        // console.log("data audio nhận: ",response);
        console.log("Tải thành công audio!");
        console.log("Audio title: ",`${baseURL}/api/audio/tts/${audioTitle}/`);
        const url = `${baseURL}/api/audio/tts/${audioTitle}/`;
        setAudioUrl(url);
    } catch (error) {
      console.error("Error generating audio:", error);
    } finally {
      setIsLoading(false);
    }
  };
    // useEffect(() => {
    //     const audio = audioRef.current;
    //     if (!audio) return;

    //     const handlePlay = () => setIsPlaying(true);
    //     const handlePause = () => setIsPlaying(false);

    //     audio.addEventListener("play", handlePlay);
    //     audio.addEventListener("pause", handlePause);

    //     return () => {
    //     audio.removeEventListener("play", handlePlay);
    //     audio.removeEventListener("pause", handlePause);
    //     };
    // }, []);
    useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();  // Tải lại audio mỗi khi audioUrl thay đổi
    }
  }, [audioUrl]);
    const rewind = () =>
    {
        const audio = audioRef.current;
        if(audio) {
            audio.currentTime = Math.max(0, audio.currentTime - 10);
            console.log("Time changed: ",audio.currentTime, audio.duration);
        }
    };
    const forward = () =>
    {
        const audio = audioRef.current;
        if(audio&&audio.readyState >= 1) {
            audioRef.current!.currentTime += 10;

            console.log("Time changed: ",audio.currentTime, audio.duration);
        }
    };

    /*  tiền xử lý content, xóa các ký tự thừa không phải là chữ số, dấu câu v.v */
    useEffect(() => {
        if (audioContent)
        {
            audioContent = audioContent.replace(/[^a-zA-ZÀ-Ỵà-ỵƠơƯưÂâÊêÔôĐđ.,!? ]/g, '').split(/(?<=[.!?])\s+/).toString();
        }
    }, [audioContent]);

    return (
        <div className="bg-white p-4 rounded-xl shadow-md mt-10 space-y-4">
            <div className="space-x-4 space-y-4 ">
            <button onClick={handleGenerateAudio} disabled={isLoading}>
                {isLoading ? "Đang tạo..." : "Tạo âm thanh"}
            </button>
                <div className="flex flex-row gap-[8px] justify-center items-center">
                    {/* Control Button */}
                    {/* <button onClick ={goToPrevious} className="rounded-[3px] hover:bg-white dark:hover:bg-gray-700">
                        <FontAwesomeIcon icon = {faBackwardStep} />
                    </button> */}
                    <button onClick={rewind} className="rounded-[3px] hover:bg-white dark:hover:bg-gray-700">
                        <FontAwesomeIcon icon = {faBackwardFast} />
                    </button>
                    <button onClick={forward} className="rounded-[3px] hover:bg-white dark:hover:bg-gray-700">
                        <FontAwesomeIcon icon = {faForwardFast} />
                    </button>
                    {/* <button onClick ={goToNext} className="rounded-[3px] hover:bg-white dark:hover:bg-gray-700">
                        <FontAwesomeIcon icon = {faForwardStep} />
                    </button> */}
                
                {/* Audio */} 
                </div>
                <div className="w-full flex items-center justify-between px-4 py-2 space-x-4">
                    <audio controls src={audioUrl} ref={audioRef} className="w-full">
                   </audio>
                </div>
            </div>        
        </div>
    );
}
export default AudioPlay;

{/* <script src="https://code.responsivevoice.org/responsivevoice.js?key=zzqcuKfu"></script> */}