import { useEffect, useRef, useState } from "react";

export const useMultiLangTTS = (isPlaying, setIsPlaying) => {
  const synth = window.speechSynthesis;
  const voicesRef = useRef([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Load voices on mount
  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = synth.getVoices();
      if (voicesRef.current.length) setVoicesLoaded(true);
    };

    // Some browsers (Chrome) need this
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    loadVoices();

    return () => synth.cancel(); // Cancel speech on unmount
  }, []);

  // Utility: Strip markdown / formatting
  const cleanText = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/#+\s?/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .replace(/\n+/g, " ")
      .trim();

  // Utility: Detect Arabic
  const isArabic = (text) => {
    const arabicRegex =
      /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicRegex.test(text);
  };

  // Utility: Get best matching voice by lang
  const getVoiceByLang = (langCode) => {
    return (
      voicesRef.current.find((v) => v.lang === langCode) ||
      voicesRef.current.find((v) => v.lang.startsWith(langCode.slice(0, 2))) ||
      null
    );
  };

  const toggleSpeech = (rawText) => {
    if (!("speechSynthesis" in window)) {
      console.error("Text-to-Speech is not supported in this browser.");
      return;
    }

    synth.cancel(); // Stop any previous speech

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (!voicesLoaded) {
      console.warn("Voices not loaded yet");
      return;
    }

    const cleanedText = cleanText(rawText);
    const isArabicText = isArabic(cleanedText);
    const lang = isArabicText ? "ar-SA" : "en-US";
    const voice = getVoiceByLang(lang);

    if (!voice) {
      console.warn(`No voice found for language: ${lang}`);
    }

    const sentences = cleanedText.split(/(?<=[.!؟؟])\s+/);

    setIsPlaying(true);

    const speakNext = (index = 0) => {
      if (index >= sentences.length) {
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sentences[index]);
      utterance.lang = lang;
      if (voice) utterance.voice = voice;
      utterance.rate = 1.1;
      utterance.pitch = 1;

      utterance.onend = () => {
        speakNext(index + 1);
      };

      synth.speak(utterance);
    };

    speakNext();
  };

  return { toggleSpeech };
};
