"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import VideoPlayer from "@/app/components/VideoPlayer";
import toast, { Toaster } from "react-hot-toast";

interface Caption {
  text: string;
  startTime: number;
  endTime: number;
}

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [captionText, setCaptionText] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const addCaption = () => {
    if (captionText && startTime && endTime) {
      const start = parseFloat(startTime);
  const end = parseFloat(endTime);

  if (start >= end) {
    toast.error("Start time must be less than end time!");
    return;
  }

  
  const isOverlapping = captions.some(
    (caption) =>
      (start >= caption.startTime && start < caption.endTime) || // Overlaps with existing
      (end > caption.startTime && end <= caption.endTime) || // Overlaps at the end
      (start <= caption.startTime && end >= caption.endTime) // Completely covers existing
  );

  if (isOverlapping) {
    toast.error("This time range overlaps with an existing caption!");
    return;
  }
      setCaptions([
        ...captions,
        { text: captionText, startTime: parseFloat(startTime), endTime: parseFloat(endTime) },
      ]);
      setCaptionText("");
      setStartTime("");
      setEndTime("");
      toast.success("Caption added successfully!");
    }else{
      toast.error("Please fill all fields!");

    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedCaptions: Caption[] = JSON.parse(event.target?.result as string);
        setCaptions(parsedCaptions);
        toast.success("Captions uploaded successfully!");
      } catch (error) {
        toast.error("Invalid file format! Please upload a valid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-300 text-gray-900 p-6">
      <Toaster position="top-right" />
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-6 text-center drop-shadow-lg"
      >
         Caption it Up!
      </motion.h1>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl bg-white/80 backdrop-blur-lg shadow-lg rounded-xl p-6"
      >
        <input
          type="text"
          placeholder="Enter video URL..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
        />

        <div className="flex gap-3 items-start mt-4">
          <textarea
            placeholder="Enter caption..."
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
            rows={1}
          />

          <input
            type="number"
            placeholder="Start"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            min="0"
            className="w-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
          />
          <input
            type="number"
            placeholder="End"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            min="0"
            className="w-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addCaption}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition-all"
          >
            Add
          </motion.button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <label className="text-gray-700">Upload Captions:</label>
          <input type="file" accept=".json" onChange={handleFileUpload} className="text-gray-700" />
        </div>
      </motion.div>

      {videoUrl && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 w-full max-w-3xl"
        >
          <VideoPlayer url={videoUrl} captions={captions} />
        </motion.div>
      )}
    </div>
  );
}
