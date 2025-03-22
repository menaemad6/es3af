

import { useEffect, useState } from "react";




const useMultiLangTTS = (isPlaying, setIsPlaying) => {
  const synth = window.speechSynthesis;

  useEffect(() => {
    return () => {
      synth.cancel(); // Stop speech when the component unmounts
    };
  }, []);

  const cleanText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/#+\s?/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .replace(/\n+/g, " ")
      .trim();
  };

  const isArabic = (text) => /[\u0600-\u06FF]/.test(text);

  const toggleSpeech = (text) => {
    if (!("speechSynthesis" in window)) {
      console.error("Text-to-Speech is not supported in this browser.");
      return;
    }

    if (isPlaying) {
      synth.cancel(); // 🔥 Stop speech if already playing
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    synth.cancel(); // Ensure no previous speech continues

    const sentences = cleanText(text).split(/(?<=[.!?])\s+/);

    const utterance = new SpeechSynthesisUtterance(sentences.join(" "));
    // utterance.lang = isArabic(text) ? "ar-SA" : "en-US";
    utterance.lang = "en-US"; // English Only For Now
    utterance.rate = 1.5;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    synth.speak(utterance);
  };

  return {toggleSpeech};
};



export {useMultiLangTTS} ;