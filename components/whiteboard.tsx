"use client"

import { useEffect, useRef, useState } from "react"
import { Eraser, Pencil, Trash2, Minus, Plus } from "lucide-react"

interface WhiteboardProps {
  onDraw: (data: any) => void
  incomingUpdate: any
}

export function Whiteboard({ onDraw, incomingUpdate }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#00c896")
  const [lineWidth, setLineWidth] = useState(3)
  const [tool, setTool] = useState<"pencil" | "eraser">("pencil")
  const prevPos = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        // Save current content
        const tempCanvas = document.createElement("canvas")
        const tempCtx = tempCanvas.getContext("2d")
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
        tempCtx?.drawImage(canvas, 0, 0)

        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight

        // Restore content
        const context = canvas.getContext("2d")
        if (context) {
          context.lineCap = "round"
          context.lineJoin = "round"
          context.drawImage(tempCanvas, 0, 0)
          contextRef.current = context
        }
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const context = canvas.getContext("2d")
    if (context) {
      context.lineCap = "round"
      context.lineJoin = "round"
      contextRef.current = context
    }

    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  useEffect(() => {
    if (incomingUpdate) {
      if (incomingUpdate.type === "draw") {
        drawFromRemote(incomingUpdate)
      } else if (incomingUpdate.type === "clear") {
        clearCanvas(false)
      }
    }
  }, [incomingUpdate])

  const drawFromRemote = (data: any) => {
    const ctx = contextRef.current
    if (!ctx) return
    ctx.strokeStyle = data.color
    ctx.lineWidth = data.lineWidth
    ctx.beginPath()
    ctx.moveTo(data.prevX, data.prevY)
    ctx.lineTo(data.currX, data.currY)
    ctx.stroke()
  }

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { offsetX: number; offsetY: number } => {
    const canvas = canvasRef.current
    if (!canvas) return { offsetX: 0, offsetY: 0 }
    const rect = canvas.getBoundingClientRect()
    if ("touches" in e) {
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top,
      }
    } else {
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY,
      }
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoordinates(e)
    setIsDrawing(true)
    prevPos.current = { x: coords.offsetX, y: coords.offsetY }
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current || !prevPos.current) return
    
    // Prevent scrolling when drawing on touch devices
    if ("touches" in e) {
      e.preventDefault()
    }

    const coords = getCoordinates(e)
    const ctx = contextRef.current

    const drawColor = tool === "eraser" ? "#1e1e1e" : color
    const drawWidth = tool === "eraser" ? 30 : lineWidth

    ctx.strokeStyle = drawColor
    ctx.lineWidth = drawWidth
    ctx.beginPath()
    ctx.moveTo(prevPos.current.x, prevPos.current.y)
    ctx.lineTo(coords.offsetX, coords.offsetY)
    ctx.stroke()

    onDraw({
      type: "draw",
      prevX: prevPos.current.x,
      prevY: prevPos.current.y,
      currX: coords.offsetX,
      currY: coords.offsetY,
      color: drawColor,
      lineWidth: drawWidth,
    })

    prevPos.current = { x: coords.offsetX, y: coords.offsetY }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    prevPos.current = null
  }

  const clearCanvas = (emit = true) => {
    const canvas = canvasRef.current
    const ctx = contextRef.current
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (emit) onDraw({ type: "clear" })
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] relative group">
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setTool("pencil")}
          className={`p-2 rounded-xl transition ${tool === "pencil" ? "bg-[#00c896] text-black" : "text-white/70 hover:bg-white/10"}`}
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => setTool("eraser")}
          className={`p-2 rounded-xl transition ${tool === "eraser" ? "bg-[#00c896] text-black" : "text-white/70 hover:bg-white/10"}`}
        >
          <Eraser size={18} />
        </button>
        
        <div className="w-px h-6 bg-white/10 mx-1" />
        
        <div className="flex items-center gap-2 px-2">
          <button onClick={() => setLineWidth(Math.max(1, lineWidth - 1))} className="text-white/50 hover:text-white">
            <Minus size={14} />
          </button>
          <span className="text-[10px] font-mono text-white/70 w-4 text-center">{lineWidth}</span>
          <button onClick={() => setLineWidth(Math.min(20, lineWidth + 1))} className="text-white/50 hover:text-white">
            <Plus size={14} />
          </button>
        </div>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <div className="flex items-center gap-1.5 px-1">
          {["#00c896", "#3b82f6", "#ef4444", "#eab308", "#ffffff"].map((c) => (
            <button
              key={c}
              onClick={() => { setColor(c); setTool("pencil"); }}
              className={`w-5 h-5 rounded-full border-2 transition ${color === c && tool === "pencil" ? "border-white scale-110" : "border-transparent"}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <button
          onClick={() => clearCanvas()}
          className="p-2 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-400 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="flex-1 cursor-crosshair touch-none"
      />
      
      {/* Label */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          <div className="w-2 h-2 rounded-full bg-[#00c896] animate-pulse" />
          <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Live Whiteboard</span>
        </div>
      </div>
    </div>
  )
}
