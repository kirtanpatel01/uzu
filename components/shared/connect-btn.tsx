"use client"

import React from 'react'
import { createConnectLink, getPluginConnectionStatus } from '@/app/actions/connect'
import { Button } from '../ui/button'
import { Link2 } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'

function ConnectBtn({ plugin }: { plugin: "gmail" | "calendar" }) {
  const [isConnected, setIsConnected] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    getPluginConnectionStatus(plugin)
      .then((connected) => {
        if (isMounted) {
          setIsConnected(connected)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsConnected(false)
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [plugin])

  if (isLoading) {
    return <Skeleton className="h-6 w-28 rounded-md" />
  }

  return (
    <div>
      {isConnected ? (
        <Badge variant="outline">Connected</Badge>
      ) : (
        <Button
          variant="outline"
          size="xs"
          onClick={async () => {
            const connectUrl = await createConnectLink(plugin)
            window.location.href = connectUrl
          }}
        >
          <Link2 />
          Connect {plugin}
        </Button>
      )}
    </div>
  )
}

export default ConnectBtn