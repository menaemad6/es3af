import React, { useState } from "react";
import fetchTTS from "@/services/fetchTTS.js"; // Import function

const TextToSpeech = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [text, setText] = useState("Hello, مرحبًا كيف حالك؟");

  const handleTTS = async () => {
    const url = await fetchTTS(text);
    setAudioUrl(url);
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        cols={50}
      />
      <button onClick={handleTTS}>Convert to Speech</button>
      {audioUrl && (
        <audio controls>
          <source src={audioUrl} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
};

export default TextToSpeech;
