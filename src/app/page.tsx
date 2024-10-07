"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { MdOutlineFileUpload } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MdSkipPrevious } from "react-icons/md"
import { MdSkipNext } from "react-icons/md"; 
import { FaPlay, FaPause } from "react-icons/fa"; 
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [tracks, setTracks] = useState<{ title: string; artist: string; src: string; image?: string }[]>([]); 
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false); 
  const [progress, setProgress] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newTracks = Array.from(files).map((file) => ({
        title: file.name,
        artist: "Unknown Artist",
        src: URL.createObjectURL(file),
        image: "/path/to/your/default/image.jpg",
      }));
      setTracks((prevTracks) => [...prevTracks, ...newTracks]);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    );
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = tracks[currentTrackIndex]?.src || "";
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, tracks, isPlaying]);

  return (
    <div className="flex items-center justify-center bg-slate-300 min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Card className="bg-gradient-to-t from-blue-950 to-blue-900 text-white shadow-lg w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-5">
            Audio Player
            <Button variant="ghost">
              <label htmlFor="audio-upload" title="Upload audio file">
                <MdOutlineFileUpload className="size-6" />
                <input
                  type="file"
                  id="audio-upload"
                  accept="audio/*"
                  multiple
                  className="hidden"
                  onChange={handleUpload}
                  title="Upload audio files"
                  aria-label="Upload audio files"
                />
              </label>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <div className="image w-44 rounded-full bg-slate-300 shadow-lg shadow-blue-400 h-40 overflow-hidden">
            <Image
              src="/cover.png"
              alt="Album Art"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="audio-title font-bold text-xl">
            {tracks[currentTrackIndex]?.title || "Audio Title"}
          </div>
          <div className="person-name -translate-y-4">
            {tracks[currentTrackIndex]?.artist || "Person Name"}
          </div>
          <div className="slider w-full">
            <Slider
              value={[progress]}
              max={100}
              step={1}
              onValueChange={(value) => {
                const newTime = (value[0] / 100) * (audioRef.current?.duration || 0);
                if (audioRef.current) {
                  audioRef.current.currentTime = newTime;
                }
                setProgress(value[0]);
              }}
            />
            <div className="flex justify-between w-full text-sm">
              <span>{formatTime(audioRef.current ? audioRef.current.currentTime : 0)}</span>
              <span>{formatTime(audioRef.current ? audioRef.current.duration : 0)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center gap-5">
          <div className="prev">
            <Button variant="ghost" onClick={handlePrevTrack} aria-label="Previous track">
              <MdSkipPrevious className="size-10 text-orange-500" />
            </Button>
          </div>
          <div className="play/pause">
            <Button variant="ghost" onClick={handlePlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? (
                <FaPause className="size-8 text-orange-500" />
              ) : (
                <FaPlay className="size-8 text-orange-500" />
              )}
            </Button>
          </div>
          <div className="next">
            <Button variant="ghost" onClick={handleNextTrack} aria-label="Next track">
              <MdSkipNext className="size-10 text-orange-500" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
}



















