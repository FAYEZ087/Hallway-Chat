"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { io, Socket } from "socket.io-client"

export type MatchStatus = "idle" | "waiting" | "connected"

export interface LiveStats {
  onlineNow: number
  totalConnections: number
  totalMatches: number
  matchesToday: number
}

const getSocketUrl = () => {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL?.trim()
  if (!url) {
    throw new Error("NEXT_PUBLIC_SOCKET_URL environment variable is missing. Please check your .env.local or production environment variables.")
  }
  return url.replace(/\/+$/, "")
}

// Re-export SERVER_URL for other hooks/components like useLiveStats
export const SERVER_URL = typeof window !== "undefined" ? getSocketUrl() : ""

export function useSocket(interests: string[]) {
  const socketRef = useRef<Socket | null>(null)
  const peerRef = useRef<RTCPeerConnection | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)
  const iceCandidateQueue = useRef<RTCIceCandidate[]>([])
  const iceConfigRef = useRef<RTCConfiguration | null>(null)

  const [status, setStatus] = useState<MatchStatus>("idle")
  const [onlineCount, setOnlineCount] = useState(0)
  const [messages, setMessages] = useState<{ text: string; self: boolean }[]>([])
  const [code, setCode] = useState<string>("// Start coding here...")
  const [whiteboardUpdate, setWhiteboardUpdate] = useState<any>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const partnerIdRef = useRef<string | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")

  const fetchIceConfig = useCallback(async (): Promise<RTCConfiguration> => {
    if (iceConfigRef.current) return iceConfigRef.current
    if (!SERVER_URL) return { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] }
    try {
      const res = await fetch(`${SERVER_URL}/ice-config`)
      const config = await res.json()
      iceConfigRef.current = config
      return config
    } catch {
      console.warn("Failed to fetch ICE config, using STUN only")
      return { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] }
    }
  }, [])

  const createPeer = useCallback(async (stream: MediaStream) => {
    const iceConfig = await fetchIceConfig()
    const peer = new RTCPeerConnection(iceConfig)

    stream.getTracks().forEach((track) => peer.addTrack(track, stream))

    peer.ontrack = (event) => {
      console.log("🎥 GOT REMOTE STREAM!", event.streams[0])
      setRemoteStream(event.streams[0])
    }

    peer.ondatachannel = (event) => {
      console.log("📡 GOT DATA CHANNEL!")
      const channel = event.channel
      channel.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data)
          if (data.type === "code-update") {
            setCode(data.code)
          } else if (data.type === "whiteboard-update") {
            setWhiteboardUpdate(data.data)
          }
        } catch (err) {
          console.error("Data channel parse error", err)
        }
      }
      dataChannelRef.current = channel
    }

    peer.onicecandidate = (event) => {
      if (event.candidate && partnerIdRef.current && socketRef.current) {
        socketRef.current.emit("ice-candidate", {
          candidate: event.candidate,
          to: partnerIdRef.current,
        })
      }
    }

    peer.onconnectionstatechange = () => console.log("🔗 Connection state:", peer.connectionState)
    peer.oniceconnectionstatechange = () => console.log("🧊 ICE state:", peer.iceConnectionState)

    return peer
  }, [fetchIceConfig])

  const flushIceCandidates = useCallback(async () => {
    if (!peerRef.current) return
    for (const candidate of iceCandidateQueue.current) {
      try { await peerRef.current.addIceCandidate(candidate) }
      catch (e) { console.error("ICE flush error", e) }
    }
    iceCandidateQueue.current = []
  }, [])

  const findMatch = useCallback(async () => {
    if (!socketRef.current) return

    setMessages([])
    setRemoteStream(null)
    setStatus("waiting")
    iceCandidateQueue.current = []

    if (!localStreamRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        })
        setLocalStream(stream)
        localStreamRef.current = stream
      } catch {
        console.warn("Camera/mic not available")
      }
    }

    if (peerRef.current) { peerRef.current.close(); peerRef.current = null }
    if (localStreamRef.current) peerRef.current = await createPeer(localStreamRef.current)

    socketRef.current.emit("find-match", { interests })
  }, [interests, createPeer])

  const next = useCallback(async () => {
    if (!socketRef.current) return

    setRemoteStream(null)
    setMessages([])
    partnerIdRef.current = null
    iceCandidateQueue.current = []

    if (peerRef.current) { peerRef.current.close(); peerRef.current = null }
    if (localStreamRef.current) peerRef.current = await createPeer(localStreamRef.current)

    setStatus("waiting")
    socketRef.current.emit("next")
  }, [createPeer])

  // ── Rear/front camera toggle ───────────────────────────────────────────────
  const switchCamera = useCallback(async () => {
    if (!localStreamRef.current) return

    const newFacing = facingMode === "user" ? "environment" : "user"

    try {
      // Stop current video track only
      localStreamRef.current.getVideoTracks().forEach((t) => t.stop())

      // Get new video track with switched facing mode
      const newVideoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacing },
        audio: false,
      })
      const newVideoTrack = newVideoStream.getVideoTracks()[0]

      // Replace track in active peer connection (no renegotiation needed)
      if (peerRef.current) {
        const sender = peerRef.current.getSenders().find((s) => s.track?.kind === "video")
        if (sender) await sender.replaceTrack(newVideoTrack)
      }

      // Rebuild local stream with new video + existing audio
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      const updatedStream = new MediaStream(
        [newVideoTrack, audioTrack].filter(Boolean)
      )
      localStreamRef.current = updatedStream
      setLocalStream(updatedStream)
      setFacingMode(newFacing)

      console.log(`📷 Switched to ${newFacing} camera`)
    } catch (e) {
      console.error("Camera switch failed — device may only have one camera", e)
    }
  }, [facingMode])

  const sendMessage = useCallback((text: string) => {
    if (!socketRef.current || !text.trim()) return
    socketRef.current.emit("chat-message", { message: text })
    setMessages((prev) => [...prev, { text, self: true }])
  }, [])

  const updateCode = useCallback((newCode: string) => {
    setCode(newCode)
    if (dataChannelRef.current && dataChannelRef.current.readyState === "open") {
      dataChannelRef.current.send(JSON.stringify({ type: "code-update", code: newCode }))
    }
  }, [])

  const sendWhiteboardUpdate = useCallback((data: any) => {
    if (dataChannelRef.current && dataChannelRef.current.readyState === "open") {
      dataChannelRef.current.send(JSON.stringify({ type: "whiteboard-update", data }))
    }
  }, [])

  const report = useCallback((reason: string) => {
    if (!socketRef.current) return
    socketRef.current.emit("report", { reason })
    next()
  }, [next])

  useEffect(() => {
    if (!SERVER_URL) return

    fetchIceConfig()

    const socket = io(SERVER_URL)
    socketRef.current = socket

    socket.on("live-stats", (stats: LiveStats) => setOnlineCount(stats.onlineNow))
    socket.on("waiting", () => setStatus("waiting"))

    socket.on("match-found", async ({ partnerId, isInitiator, sharedInterests }) => {
      console.log("🟢 MATCH FOUND - isInitiator:", isInitiator)
      partnerIdRef.current = partnerId
      iceCandidateQueue.current = []
      setStatus("connected")
      setCode("// Start coding here...")
      setWhiteboardUpdate({ type: "clear" })
      setMessages([{
        text: sharedInterests > 0
          ? `Connected! You share ${sharedInterests} interest${sharedInterests > 1 ? "s" : ""} 🎉`
          : "You are now connected with a student. Say hi! 👋",
        self: false,
      }])

      if (peerRef.current && isInitiator) {
        const channel = peerRef.current.createDataChannel("collaboration")
        channel.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data)
            if (data.type === "code-update") {
              setCode(data.code)
            } else if (data.type === "whiteboard-update") {
              setWhiteboardUpdate(data.data)
            }
          } catch (err) {
            console.error("Data channel parse error", err)
          }
        }
        dataChannelRef.current = channel

        const offer = await peerRef.current.createOffer()
        await peerRef.current.setLocalDescription(offer)
        socket.emit("webrtc-offer", { offer, to: partnerId })
      }
    })

    socket.on("webrtc-offer", async ({ offer, from }) => {
      console.log("📨 Got offer")
      if (!peerRef.current) return
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer))
      await flushIceCandidates()
      const answer = await peerRef.current.createAnswer()
      await peerRef.current.setLocalDescription(answer)
      socket.emit("webrtc-answer", { answer, to: from })
    })

    socket.on("webrtc-answer", async ({ answer }) => {
      console.log("📨 Got answer")
      if (!peerRef.current) return
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer))
      await flushIceCandidates()
    })

    socket.on("ice-candidate", async ({ candidate }) => {
      if (!peerRef.current) return
      if (peerRef.current.remoteDescription) {
        try { await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate)) }
        catch (e) { console.error("ICE error", e) }
      } else {
        console.log("⏳ Queuing ICE candidate")
        iceCandidateQueue.current.push(new RTCIceCandidate(candidate))
      }
    })

    socket.on("partner-disconnected", async () => {
      console.log("👋 Partner disconnected")
      setRemoteStream(null)
      partnerIdRef.current = null
      iceCandidateQueue.current = []
      setStatus("waiting")
      setMessages([{ text: "Stranger disconnected. Finding new match...", self: false }])

      if (peerRef.current) { peerRef.current.close(); peerRef.current = null }
      if (localStreamRef.current) peerRef.current = await createPeer(localStreamRef.current)
      socket.emit("find-match", { interests })
    })

    socket.on("chat-message", ({ message }: { message: string }) => {
      setMessages((prev) => [...prev, { text: message, self: false }])
    })

    socket.on("error-message", (msg: string) => {
      console.warn("⚠️ Server:", msg)
    })

    return () => {
      socket.disconnect()
      peerRef.current?.close()
      localStreamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [fetchIceConfig, createPeer, interests])

  return {
    status, onlineCount, messages, localStream, code, whiteboardUpdate,
    remoteStream, findMatch, next, sendMessage, report,
    switchCamera, facingMode, updateCode, sendWhiteboardUpdate
  }
}
