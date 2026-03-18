let activeAudio: HTMLAudioElement | null = null;
let activeObjectUrl: string | null = null;

export const stopTTS = () => {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
  }
};

export const speakWithElevenLabs = async (text: string) => {
  const cleaned = (text || '').trim();
  if (!cleaned) return;

  stopTTS();

  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: cleaned }),
  });

  if (!response.ok) {
    throw new Error('TTS request failed');
  }

  const audioBlob = await response.blob();
  activeObjectUrl = URL.createObjectURL(audioBlob);
  activeAudio = new Audio(activeObjectUrl);

  await activeAudio.play();
  activeAudio.onended = () => stopTTS();
};
