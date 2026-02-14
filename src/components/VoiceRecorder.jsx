import { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export default function VoiceRecorder({ statements, affirmation }) {
  const { theme } = useTheme();
  const { saveAffirmation } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [currentStatementIdx, setCurrentStatementIdx] = useState(0);
  const [recordingMode, setRecordingMode] = useState(null); // 'full' | 'statement'
  const [recordings, setRecordings] = useState(affirmation?.recordings || []);
  const [fullRecording, setFullRecording] = useState(affirmation?.fullRecording || null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(-1);
  const [showRecorder, setShowRecorder] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);

        // Stop tracks
        recorder.stream.getTracks().forEach(t => t.stop());
      };

      recorder.stop();
      setIsRecording(false);
    });
  }, []);

  // Full take recording
  const handleStartFull = useCallback(async () => {
    setRecordingMode('full');
    setCurrentStatementIdx(0);
    await startRecording();
  }, [startRecording]);

  const handleNextStatement = useCallback(() => {
    if (currentStatementIdx < statements.length - 1) {
      setCurrentStatementIdx(i => i + 1);
    }
  }, [currentStatementIdx, statements.length]);

  const handleStopFull = useCallback(async () => {
    const data = await stopRecording();
    if (data) {
      setFullRecording(data);
      const updated = { ...affirmation, fullRecording: data };
      saveAffirmation(updated);
    }
    setRecordingMode(null);
  }, [stopRecording, affirmation, saveAffirmation]);

  // Statement-by-statement recording
  const handleStartStatement = useCallback(async () => {
    setRecordingMode('statement');
    setCurrentStatementIdx(0);
    await startRecording();
  }, [startRecording]);

  const handleFinishStatement = useCallback(async () => {
    const data = await stopRecording();
    if (data) {
      setRecordings(prev => {
        const next = [...prev];
        next[currentStatementIdx] = data;
        return next;
      });
    }

    if (currentStatementIdx < statements.length - 1) {
      setCurrentStatementIdx(i => i + 1);
      // Small delay then start next
      setTimeout(() => startRecording(), 500);
    } else {
      // Done
      setRecordingMode(null);
      // Save all recordings
      const updatedRecordings = [...recordings];
      updatedRecordings[currentStatementIdx] = data;
      const updated = { ...affirmation, recordings: updatedRecordings };
      saveAffirmation(updated);
    }
  }, [stopRecording, currentStatementIdx, statements.length, startRecording, recordings, affirmation, saveAffirmation]);

  // Playback
  const playRecording = useCallback((dataUrl) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(dataUrl);
    audioRef.current = audio;
    setIsPlayingBack(true);
    audio.onended = () => {
      setIsPlayingBack(false);
      setPlaybackIndex(-1);
    };
    audio.play();
  }, []);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlayingBack(false);
    setPlaybackIndex(-1);
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const hasAnyRecording = fullRecording || recordings.some(Boolean);

  return (
    <div className={`rounded-2xl p-4 ${
      theme === 'dark' ? 'bg-navy-light/50' : 'bg-cream-dark/50'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium ${
          theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
        }`}>
          Your Voice
        </span>
        <button
          onClick={() => setShowRecorder(s => !s)}
          className={`text-xs px-2 py-1 rounded-md ${
            theme === 'dark' ? 'text-soft-white-dim hover:bg-navy-light' : 'text-charcoal-light hover:bg-cream-dark'
          }`}
        >
          {showRecorder ? 'Hide' : hasAnyRecording ? 'Manage' : 'Record'}
        </button>
      </div>

      {/* Quick playback if has recording */}
      {hasAnyRecording && !showRecorder && !recordingMode && (
        <button
          onClick={isPlayingBack ? stopPlayback : () => {
            if (fullRecording) {
              playRecording(fullRecording);
            }
          }}
          className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
            isPlayingBack
              ? theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-500/10 text-red-600'
              : theme === 'dark' ? 'bg-sage/20 text-sage-light' : 'bg-sage/20 text-sage-dark'
          }`}
        >
          {isPlayingBack ? 'Stop' : 'Play Your Recording'}
        </button>
      )}

      {showRecorder && !recordingMode && (
        <div className="space-y-3">
          {/* Recording options */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleStartFull}
              className={`p-3 rounded-xl text-center text-xs border ${
                theme === 'dark'
                  ? 'border-navy-light bg-navy/50 text-soft-white hover:border-gold/30'
                  : 'border-cream-dark bg-white/50 text-charcoal hover:border-gold-dark/30'
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 mx-auto mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
              Full Take
            </button>
            <button
              onClick={handleStartStatement}
              className={`p-3 rounded-xl text-center text-xs border ${
                theme === 'dark'
                  ? 'border-navy-light bg-navy/50 text-soft-white hover:border-gold/30'
                  : 'border-cream-dark bg-white/50 text-charcoal hover:border-gold-dark/30'
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 mx-auto mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              Line by Line
            </button>
          </div>

          {/* Existing recordings */}
          {fullRecording && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => playRecording(fullRecording)}
                className={`flex-1 py-2 rounded-lg text-xs ${
                  theme === 'dark' ? 'bg-navy text-soft-white-dim' : 'bg-white text-charcoal-light'
                }`}
              >
                Play full recording
              </button>
              <button
                onClick={() => {
                  setFullRecording(null);
                  const updated = { ...affirmation, fullRecording: null };
                  saveAffirmation(updated);
                }}
                className={`p-2 rounded-lg text-xs ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Teleprompter view during recording */}
      {recordingMode && (
        <div className="space-y-4">
          {/* Recording indicator */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-red-500 font-medium">Recording</span>
            <span className={`text-xs ml-auto ${
              theme === 'dark' ? 'text-soft-white-dim' : 'text-charcoal-light'
            }`}>
              {currentStatementIdx + 1} / {statements.length}
            </span>
          </div>

          {/* Teleprompter */}
          <div className="space-y-3">
            {statements.map((stmt, i) => (
              <p
                key={i}
                className={`font-display text-base leading-relaxed transition-all duration-300 ${
                  i === currentStatementIdx
                    ? theme === 'dark' ? 'text-soft-white' : 'text-charcoal'
                    : i < currentStatementIdx
                      ? theme === 'dark' ? 'text-soft-white/20' : 'text-charcoal/20'
                      : theme === 'dark' ? 'text-soft-white/10' : 'text-charcoal/10'
                }`}
              >
                {stmt}
              </p>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {recordingMode === 'full' ? (
              <>
                {currentStatementIdx < statements.length - 1 && (
                  <button
                    onClick={handleNextStatement}
                    className={`flex-1 py-2.5 rounded-xl text-sm ${
                      theme === 'dark' ? 'bg-navy text-soft-white-dim' : 'bg-white text-charcoal-light'
                    }`}
                  >
                    Next Line
                  </button>
                )}
                <button
                  onClick={handleStopFull}
                  className="flex-1 py-2.5 rounded-xl text-sm bg-red-500/20 text-red-500"
                >
                  Finish
                </button>
              </>
            ) : (
              <button
                onClick={handleFinishStatement}
                className={`flex-1 py-2.5 rounded-xl text-sm ${
                  currentStatementIdx < statements.length - 1
                    ? theme === 'dark' ? 'bg-gold/20 text-gold' : 'bg-gold/20 text-gold-dark'
                    : 'bg-red-500/20 text-red-500'
                }`}
              >
                {currentStatementIdx < statements.length - 1 ? 'Next Statement' : 'Finish Recording'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
