import { useMutation } from "@tanstack/react-query";

const isArabic = (text) => /[\u0600-\u06FF]/.test(text);

const VOICES = {
  en: "21m00Tcm4TlvDq8ikWAM",
  ar: "EXAVITQu4vr4xnSDxMaL",
};

const API_KEY = "sk_6e02c9be5c42926729c7aca6eb64ff0db62099c395400164";
let currentAudio = null; // Active audio object
let currentText = ""; // Track the current message being read
let stopPlayback = false; // Flag to stop playback immediately

const splitText = (text, maxLength = 250) => {
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  let chunks = [];
  let currentChunk = "";

  sentences.forEach((sentence) => {
    if ((currentChunk + sentence).length > maxLength) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += " " + sentence;
    }
  });

  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchTTS = async (text, speed = 1.0) => {
  // **🔴 Stop Current Playback Immediately**
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
    stopPlayback = true; // Set stop flag
  }

  // **If clicking the same text, just stop playback**
  if (currentText === text) {
    currentText = "";
    return;
  }

  stopPlayback = false; // Reset stop flag
  currentText = text;
  const textChunks = splitText(text);
  let firstAudio = null;

  for (let i = 0; i < textChunks.length; i++) {
    if (stopPlayback) return; // **Exit if playback was stopped**

    const chunk = textChunks[i];
    const lang = isArabic(chunk) ? "ar" : "en";

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICES[lang]}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": API_KEY,
          },
          body: JSON.stringify({
            text: chunk.trim(),
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        }
      );

      if (response.status === 429) {
        console.warn("Rate limit hit! Waiting 2 seconds...");
        await delay(2000);
        i--;
        continue;
      }

      if (!response.ok) throw new Error("Failed to generate speech");

      const blob = await response.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.playbackRate = speed;

      // **🔴 Stop playing if needed**
      if (stopPlayback) return;

      if (!firstAudio) {
        firstAudio = audio;
        currentAudio = audio;
        audio.play();
      } else {
        firstAudio.onended = () => {
          if (!stopPlayback) audio.play();
        };
        firstAudio = audio;
      }

      await delay(500);
    } catch (error) {
      console.error("Error fetching TTS:", error);
    }
  }
};

export const useTTS = () => {
  return useMutation({
    mutationFn: ({ text, speed }) => fetchTTS(text, speed),
  });
};
