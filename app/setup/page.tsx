"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, User, Loader2, Camera, Lock, HeartHandshake } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { HallwayLogo } from "@/components/hallway/logo"

export default function SetupPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [realName, setRealName] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [college, setCollege] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/")
      } else {
        setIsLoading(false)
      }
    })
  }, [router])

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo must be less than 5MB")
        return
      }
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
      setError("")
    }
  }

  async function handleSubmit() {
    if (!realName.trim() || !displayName.trim() || !college.trim()) {
      setError("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/")
        return
      }

      let profilePhotoUrl: string | null = null

      // Upload photo if selected
      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, photoFile, { upsert: true })

        if (uploadError) {
          console.error("Upload error:", uploadError)
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName)
          profilePhotoUrl = publicUrl
        }
      }

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          real_name: realName.trim(),
          display_name: displayName.trim(),
          college: college.trim(),
          profile_photo_url: profilePhotoUrl,
          is_profile_complete: true,
        })

      if (updateError) {
        throw updateError
      }

      router.push("/match")
    } catch (err) {
      console.error("Setup error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 relative overflow-hidden font-sans">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" aria-hidden />
      
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>

      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 z-10 w-full mb-16">
        
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <HallwayLogo className="text-3xl" />
          <h1 className="text-3xl tracking-tight font-display text-center mt-2">
            Complete Your <span className="text-primary">Profile</span>
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Let others know who they're chatting with
          </p>
        </div>

        {/* Form */}
        <div className="flex w-full flex-col gap-5 rounded-3xl border border-border/60 bg-card/60 p-8 backdrop-blur-md shadow-2xl">
          
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-24 w-24 rounded-full border-2 border-dashed border-border bg-secondary/30 flex items-center justify-center overflow-hidden transition-all hover:border-primary hover:bg-secondary/50 cursor-pointer"
            >
              {photoPreview ? (
                <>
                  <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">Upload</span>
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Profile photo (optional)</p>
          </div>

          {/* Real Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Real Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Display Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nickname shown to others"
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
            <p className="text-[10px] text-muted-foreground">
              This is what other users will see
            </p>
          </div>

          {/* College */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              College / University
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g., KIIT University"
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !realName.trim() || !displayName.trim() || !college.trim()}
            className="group h-12 w-full gap-2 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Continue to Hallway
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] font-medium text-muted-foreground/60 mb-4 flex items-center gap-1.5">
          <Lock className="h-3 w-3" />
          Your real name is only visible to you
        </p>
      </div>

      {/* Bottom Footer Row */}
      <footer className="absolute bottom-0 w-full border-t border-border/40 bg-card/40 py-6 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 px-4 sm:flex-row sm:gap-12 text-[10px] font-medium text-muted-foreground uppercase tracking-widest text-center">
          <p>© {new Date().getFullYear()} hallway. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <HeartHandshake className="h-3 w-3 text-destructive" /> by <a href="https://github.com/FAYEZ087" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Fayez</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
