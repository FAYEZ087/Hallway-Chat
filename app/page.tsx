"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LandingPage } from "@/components/landing-page"
import { AuthScreen } from "@/components/auth-screen"
import { createClient } from "@/lib/supabase"

export default function Home() {
  const router = useRouter()
  const [screen, setScreen] = useState<"loading" | "landing" | "auth">("loading")

  useEffect(() => {
    const supabase = createClient()
    
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Check if profile is complete
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_profile_complete")
          .eq("id", session.user.id)
          .single()

        if (profile?.is_profile_complete) {
          router.push("/match")
        } else {
          router.push("/setup")
        }
      } else {
        setScreen("landing")
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_profile_complete")
          .eq("id", session.user.id)
          .single()

        if (profile?.is_profile_complete) {
          router.push("/match")
        } else {
          router.push("/setup")
        }
      } else {
        setScreen("landing")
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (screen === "auth") return <AuthScreen />
  return <LandingPage onGetStarted={() => {
    window.scrollTo({ top: 0, behavior: "instant" })
    setScreen("auth")
  }} />
}