"use client"

import { useEffect, useRef, useState } from "react"
import { AlertTriangle, SkipForward, LogOut, Users, Shield, Mic, MicOff, Video as VideoIcon, VideoOff, FlipHorizontal, Send, HeartHandshake, Code, Palette, Sparkles } from "lucide-react"
import { useSocket } from "@/hooks/useSocket"
import Editor from "@monaco-editor/react"
import { Whiteboard } from "./whiteboard"
import { useTheme } from "next-themes"
import { ModeToggle } from "@/components/mode-toggle"

function HallwayIcon({ size = 28 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={size} height={size} fill="none">
      <defs>
        <radialGradient id="bgGradCR" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx="50" fill="url(#bgGradCR)" />
      <polygon points="0,0 0,100 26,78 26,22" fill="#181818" />
      <polygon points="100,0 100,100 74,78 74,22" fill="#202020" />
      <polygon points="0,0 100,0 74,22 26,22" fill="#161616" />
      <polygon points="0,100 100,100 74,78 26,78" fill="#141414" />
      <rect x="26" y="22" width="48" height="56" fill="#111111" stroke="#2a2a2a" strokeWidth="1.2" />
      <line x1="0" y1="0" x2="50" y2="50" stroke="#00c896" strokeWidth="0.8" opacity="0.3" />
      <line x1="100" y1="0" x2="50" y2="50" stroke="#00c896" strokeWidth="0.8" opacity="0.3" />
      <line x1="0" y1="100" x2="50" y2="50" stroke="#00c896" strokeWidth="0.8" opacity="0.3" />
      <line x1="100" y1="100" x2="50" y2="50" stroke="#00c896" strokeWidth="0.8" opacity="0.3" />
      <ellipse cx="50" cy="50" rx="3.5" ry="4.5" fill="#00c896" opacity="0.6" />
      <ellipse cx="50" cy="50" rx="1.5" ry="2" fill="#00c896" />
      <circle cx="50" cy="43" r="3.5" fill="#00c896" />
      <rect x="47" y="47.5" width="6" height="10" rx="1.5" fill="#00c896" />
      <rect x="63" y="40" width="9" height="22" rx="1.5" fill="none" stroke="#00c896" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

interface ChatRoomProps {
  interests: string[]
  onExit: () => void
}

export function ChatRoom({ interests, onExit }: ChatRoomProps) {
  const { status, onlineCount, messages, localStream, remoteStream, code, whiteboardUpdate, updateCode, sendWhiteboardUpdate, findMatch, next, sendMessage, report, switchCamera } = useSocket(interests)
  const [showReport, setShowReport] = useState(false)
  const [viewMode, setViewMode] = useState<"video" | "code" | "whiteboard">("video")
  const [inputText, setInputText] = useState("")
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const dark = theme === "dark"

  useEffect(() => { findMatch() }, [])
  useEffect(() => { if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream }, [localStream, viewMode])
  useEffect(() => { if (remoteVideoRef.current && remoteStream) remoteVideoRef.current.srcObject = remoteStream }, [remoteStream, viewMode])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  function toggleMic() { localStream?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled)); setMicOn((v) => !v) }
  function toggleCam() { localStream?.getVideoTracks().forEach((t) => (t.enabled = !t.enabled)); setCamOn((v) => !v) }
  function handleSend() { if (!inputText.trim()) return; sendMessage(inputText.trim()); setInputText("") }
  function handleReport(reason: string) { setShowReport(false); report(reason) }

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground font-sans relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" aria-hidden />

      {/* Header */}
      <header className="sticky top-0 z-40 shrink-0 flex items-center justify-between border-b border-border/60 px-4 py-3 bg-background/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <HallwayIcon size={28} />
          <span className="font-display">
            <span className="text-foreground">hall</span><span className="text-primary">way</span>
          </span>
          <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-secondary/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-foreground">{onlineCount || "..."}</span>
            <span className="text-muted-foreground">online</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <div className="hidden items-center gap-1.5 md:flex">
            {interests.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                {tag}
              </span>
            ))}
            {interests.length > 2 && <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">+{interests.length - 2}</span>}
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/30 px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <Shield className="h-3 w-3 text-primary" />
            Verified
          </div>
          <button onClick={onExit}
            className="flex h-8 w-8 items-center justify-center rounded-full transition bg-secondary/50 text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main App Area */}
      <div className="flex min-h-0 flex-1 flex-col md:flex-row z-10 relative">

        {/* Content Side */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 md:p-4">
          
          {/* Active View */}
          <div className="relative flex-1 min-h-0">
            {viewMode === "video" ? (
              <div className="grid h-full grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Your video */}
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md shadow-xl group">
                  {localStream ? (
                    <video ref={localVideoRef} autoPlay muted playsInline className="h-full w-full object-cover scale-x-[-1]" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 bg-secondary/20">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/50">
                        <VideoOff className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">No Camera</span>
                    </div>
                  )}
                  {/* Label */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-background/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground backdrop-blur-md border border-border/60">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    You
                  </div>
                  {/* Local Controls */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={toggleMic}
                      className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer border border-border/60 ${micOn ? "bg-background/60 text-foreground hover:bg-background/80" : "bg-destructive/80 text-white border-none"}`}>
                      {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </button>
                    <button onClick={toggleCam}
                      className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer border border-border/60 ${camOn ? "bg-background/60 text-foreground hover:bg-background/80" : "bg-destructive/80 text-white border-none"}`}>
                      {camOn ? <VideoIcon className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </button>
                    <button onClick={switchCamera}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur-md border border-border/60 transition-all hover:bg-background/80 cursor-pointer">
                      <FlipHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
    
                {/* Stranger video */}
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md shadow-xl">
                  {remoteStream ? (
                    <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-4 bg-secondary/10">
                      {status === "waiting" ? (
                        <>
                          <div className="relative">
                            <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-primary animate-pulse" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold uppercase tracking-widest text-foreground">Searching</p>
                            <p className="text-[10px] font-medium text-muted-foreground mt-1">Connecting with a student...</p>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-3 grayscale opacity-40">
                          <VideoOff className="h-10 w-10 text-muted-foreground" />
                          <span className="text-xs font-bold uppercase tracking-widest">Disconnected</span>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Label */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-background/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground backdrop-blur-md border border-border/60">
                    <div className={`h-1.5 w-1.5 rounded-full ${status === "connected" ? "bg-primary" : "bg-warning"}`} />
                    {status === "waiting" ? "Finding match" : "Stranger"}
                  </div>
                  {/* Matched chip */}
                  {status === "connected" && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-full bg-primary/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      Shared Interests!
                    </div>
                  )}
                </div>
              </div>
            ) : viewMode === "code" ? (
              <div className="h-full rounded-2xl overflow-hidden border border-border/60 bg-[#1e1e1e] shadow-2xl">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  theme={dark ? "vs-dark" : "light"}
                  value={code}
                  onChange={(value) => updateCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 16 },
                  }}
                />
              </div>
            ) : (
              <div className="h-full rounded-2xl overflow-hidden border border-border/60 shadow-2xl">
                <Whiteboard onDraw={sendWhiteboardUpdate} incomingUpdate={whiteboardUpdate} />
              </div>
            )}

            {/* PIP overlay when not in video mode */}
            {viewMode !== "video" && (
              <div className="absolute bottom-4 right-4 flex flex-col gap-3 z-30">
                <div className="h-28 w-40 overflow-hidden rounded-xl bg-black border border-border/60 shadow-2xl relative">
                  {localStream ? (
                    <video ref={localVideoRef} autoPlay muted playsInline className="h-full w-full object-cover scale-x-[-1]" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-secondary/50"><VideoOff className="h-4 w-4 opacity-20" /></div>
                  )}
                </div>
                <div className="h-28 w-40 overflow-hidden rounded-xl bg-black border border-border/60 shadow-2xl relative">
                  {remoteStream ? (
                    <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-secondary/50"><VideoOff className="h-4 w-4 opacity-20" /></div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="flex shrink-0 items-center justify-between rounded-2xl border border-border/60 px-4 py-3 bg-card/60 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-3 relative">
              <button onClick={() => setShowReport(!showReport)}
                className="flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/30 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-all hover:border-destructive/40 hover:text-destructive hover:bg-destructive/10 cursor-pointer">
                <AlertTriangle className="h-3.5 w-3.5" />
                Report
              </button>
              
              <div className="flex items-center gap-1 rounded-xl bg-background/50 p-1 border border-border/60">
                <button onClick={() => setViewMode("video")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${viewMode === "video" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>
                  <VideoIcon className="h-3.5 w-3.5" />
                  Video
                </button>
                <button onClick={() => setViewMode("code")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${viewMode === "code" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>
                  <Code className="h-3.5 w-3.5" />
                  Code
                </button>
                <button onClick={() => setViewMode("whiteboard")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${viewMode === "whiteboard" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>
                  <Palette className="h-3.5 w-3.5" />
                  Board
                </button>
              </div>

              {showReport && (
                <div className="absolute bottom-14 left-0 z-50 rounded-2xl border border-border/60 bg-card p-2 shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
                  <div className="px-3 py-2 mb-1 border-b border-border/40">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Report Reason</p>
                  </div>
                  {["Inappropriate", "Harassment", "Spam", "Underage"].map((reason) => (
                    <button key={reason} onClick={() => handleReport(reason)}
                      className="block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-foreground/70 transition-all hover:bg-destructive hover:text-white cursor-pointer">
                      {reason}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary leading-none">
                  {status === "connected" ? "Connected" : "Standing By"}
                </span>
                <span className="text-[9px] font-medium text-muted-foreground mt-0.5">
                  {status === "connected" ? "Encrypted Channel" : "Waiting for match"}
                </span>
              </div>
              <button onClick={next}
                className="group flex h-10 items-center justify-center gap-2 rounded-xl px-6 font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 cursor-pointer">
                Next
                <SkipForward className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Side */}
        <div className="flex w-full shrink-0 flex-col border-t border-border/40 md:w-80 md:border-l md:border-t-0 lg:w-96 bg-card/30 backdrop-blur-md">

          {/* Chat header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-4 py-3.5 bg-secondary/10">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Room Chat</span>
            <div className="flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-bold bg-background/50 text-muted-foreground border border-border/60">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {status === "connected" ? "2 Active" : "1 Active"}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4" style={{ minHeight: 0 }}>
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center opacity-30 gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/50">
                  <Send className="h-5 w-5" />
                </div>
                <p className="text-center text-[10px] font-bold uppercase tracking-widest">
                  {status === "waiting" ? "Connecting..." : "Say Hello!"}
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.self ? "items-end" : "items-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-all ${msg.self
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-secondary/40 text-foreground border border-border/60 rounded-tl-sm backdrop-blur-sm"
                }`}>
                  {!msg.self && (
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-primary/80">Student</span>
                  )}
                  <p className="font-medium">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="shrink-0 border-t border-border/60 p-4 bg-background/40">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={status === "connected" ? "Send a message..." : "Waiting..."}
                  disabled={status !== "connected"}
                  className="flex-1 rounded-xl border border-border/60 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all disabled:opacity-40 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 shadow-inner"
                />
                <button onClick={handleSend} disabled={status !== "connected" || !inputText.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  style={{ background: "#00c896" }}>
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">
                 <p>© {new Date().getFullYear()} hallway</p>
                 <span className="h-1 w-1 rounded-full bg-muted-foreground/20" />
                 <p>v2.0.4</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
