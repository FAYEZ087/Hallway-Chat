"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { InterestSelection } from "@/components/interest-selection"
import { ChatRoom } from "@/components/chat-room"
import { createClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export default function MatchPage() {
  const router = useRouter()
  const [screen, setScreen] = useState<"loading" | "interests" | "chat">("loading")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/")
        return
      }

      // Check if profile is complete
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_profile_complete")
        .eq("id", user.id)
        .single()

      if (!profile?.is_profile_complete) {
        router.push("/setup")
        return
      }

      setUser(user)
      setScreen("interests")
    }

    checkAuth()
  }, [router])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  function handleStart(interests: string[]) {
    setSelectedInterests(interests)
    setScreen("chat")
  }

  function handleExit() {
    setScreen("interests")
    setSelectedInterests([])
  }

  if (screen === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (screen === "chat") {
    return (
      <ChatRoom 
        interests={selectedInterests} 
        onExit={handleExit} 
      />
    )
  }

  return (
    <InterestSelection 
      onStart={handleStart} 
      user={user} 
      onSignOut={handleSignOut} 
    />
  )
}
