import { User } from "@prisma/client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import useSWR from "swr"

interface UserRes {
  ok: boolean
  profile: User
}

export default function useUser() {
  const { data, error } = useSWR<UserRes>("/api/users/connuser")
  const router = useRouter()
  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/enter")
    } else if (data?.ok && router.pathname === "/enter") {
      router.replace("/profile")
    }
  }, [data, router])

  return { user: data?.profile, isLoading: !data && !error }
}