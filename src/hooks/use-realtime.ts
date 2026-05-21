"use client"

import { useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"

type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE"

interface RealtimeConfig {
  table: string
  event?: RealtimeEvent
  filter?: string
  callback: (payload: any) => void
}

export function useRealtime({ table, event, filter, callback }: RealtimeConfig) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const supabase = createClient()

    const channelConfig: any = {
      event: event ?? "*",
      schema: "public",
      table,
    }
    if (filter) {
      channelConfig.filter = filter
    }

    const channel = supabase
      .channel(`${table}-${Date.now()}`)
      .on("postgres_changes", channelConfig, (payload) => {
        callbackRef.current(payload)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, event, filter])
}
