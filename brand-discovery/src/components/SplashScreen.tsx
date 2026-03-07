"use client";

import { useCallback, useRef, useState } from "react";
import { useBrandStore } from "@/store/brand-store";
import { BELLE_ANSWERS } from "@/lib/prefill";

export function SplashScreen() {
  const setScreen = useBrandStore((s) => s.setScreen);
  const loadPrefill = useBrandStore((s) => s.loadPrefill);
  const setUploadedFile = useBrandStore((s) => s.setUploadedFile);
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setUploadedFile(file);
      setFileName(file.name);
      // For demo, load Belle's prefill data
      loadPrefill(BELLE_ANSWERS);
    },
    [setUploadedFile, loadPrefill]
  );

  const startFresh = () => {
    setScreen("questionnaire");
  };

  const startWithPrefill = () => {
    loadPrefill(BELLE_ANSWERS);
    setScreen("questionnaire");
  };

  const generateNow = () => {
    loadPrefill(BELLE_ANSWERS);
    setScreen("loading");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-accent/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-accent/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Badge */}
        <div className="animate-fade-up inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/25 rounded-full px-4 py-1.5 mb-8">
          <span className="text-brand-accent text-[10px] font-semibold tracking-[0.15em] uppercase">
            Personal Brand Discovery
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up-delay font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-4">
          Discover your
          <br />
          <span className="font-display italic font-normal text-brand-accent">
            brand identity.
          </span>
        </h1>

        {/* Subhead */}
        <p className="animate-fade-up-delay-2 text-brand-muted text-base md:text-lg leading-relaxed max-w-md mx-auto mb-10">
          Uncover the colours, typography, voice, and visual world that make you
          unmistakable. Walk away with a complete brand guidelines document.
        </p>

        {/* Upload area */}
        <div
          className={`animate-fade-up-delay-2 mb-8 mx-auto max-w-sm border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer ${
            dragOver
              ? "border-brand-accent bg-brand-accent/5"
              : fileName
              ? "border-brand-accent/40 bg-brand-accent/5"
              : "border-white/10 hover:border-white/20"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.csv"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
          />
          {fileName ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-accent/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-brand-text">{fileName}</p>
                <p className="text-xs text-brand-muted">Uploaded — fields pre-filled</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm text-brand-muted mb-1">
                Drop your CV, LinkedIn export, or bio here
              </p>
              <p className="text-xs text-brand-muted/60">
                PDF, DOCX, or TXT — we&apos;ll pre-fill your answers
              </p>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={startFresh}
            className="px-8 py-3.5 bg-brand-accent text-brand-bg text-sm font-semibold rounded-lg hover:brightness-110 transition-all tracking-wide"
          >
            Start Questionnaire
          </button>
          <button
            onClick={startWithPrefill}
            className="px-8 py-3.5 border border-white/10 text-brand-muted text-sm rounded-lg hover:border-white/20 hover:text-brand-text transition-all"
          >
            Start with Demo Data
          </button>
        </div>

        {/* Quick generate */}
        <button
          onClick={generateNow}
          className="mt-6 text-brand-accent/70 hover:text-brand-accent text-xs font-medium tracking-wide transition-colors"
        >
          Skip to results (demo)
        </button>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent" />
    </div>
  );
}
