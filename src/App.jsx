import { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";

export default function BackgroundAudioSite() {
  const [youtubeTrack, setYoutubeTrack] = useState("");
  const [rainSource, setRainSource] = useState("");
  const [fireSource, setFireSource] = useState("");
  const [rainPlaying, setRainPlaying] = useState(false);
  const [firePlaying, setFirePlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [lowPassFilter, setLowPassFilter] = useState(null);
  const youtubeAudioRef = useRef(null);

  useEffect(() => {
    if (!audioCtx) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      setAudioCtx(ctx);
      setGainNode(gain);
      setLowPassFilter(filter);
    }
  }, []);

  const onYouTubeReady = (event) => {
    const iframe = event.target.getIframe();
    if (!iframe) return;
    
    const videoAudio = new Audio();
    videoAudio.src = iframe.src;
    videoAudio.crossOrigin = "anonymous";
    videoAudio.play();
    
    if (audioCtx) {
      const source = audioCtx.createMediaElementSource(videoAudio);
      source.connect(lowPassFilter);
      lowPassFilter.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      youtubeAudioRef.current = videoAudio;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">Relaxing Audio Player</h1>
      <div className="space-y-4">
        <input type="text" placeholder="YouTube link for main audio" onChange={(e) => setYoutubeTrack(e.target.value)} className="p-2 bg-gray-800" />
        {youtubeTrack && (
          <YouTube videoId={youtubeTrack.split("v=")[1]} opts={{ playerVars: { autoplay: 1 } }} onReady={onYouTubeReady} />
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl">Background Sounds</h2>
        <div className="mt-4">
          <input type="text" placeholder="YouTube link for rain" onChange={(e) => setRainSource(e.target.value)} className="p-2 bg-gray-800" />
          {rainSource && <YouTube videoId={rainSource.split("v=")[1]} />} 
          <button onClick={() => setRainPlaying(!rainPlaying)} className="mt-2 p-2 bg-blue-500">{rainPlaying ? "Stop Rain" : "Play Rain"}</button>
        </div>
        <div className="mt-4">
          <input type="text" placeholder="YouTube link for fireplace" onChange={(e) => setFireSource(e.target.value)} className="p-2 bg-gray-800" />
          {fireSource && <YouTube videoId={fireSource.split("v=")[1]} />} 
          <button onClick={() => setFirePlaying(!firePlaying)} className="mt-2 p-2 bg-red-500">{firePlaying ? "Stop Fire" : "Play Fire"}</button>
        </div>
      </div>
    </div>
  );
}
