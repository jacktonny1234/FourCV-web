'use client'

import { Loader2, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Loading({ 
  timeout = 5000, 
  errorMessage = 'Taking longer than expected...' 
}: { 
  timeout?: number, 
  errorMessage?: string 
}) {
  const [isLongLoading, setIsLongLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLongLoading(true)
    }, timeout)

    return () => clearTimeout(timer)
  }, [timeout])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center space-y-4 text-center">
        {!isLongLoading ? (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Loading...</p>
          </>
        ) : (
          <>
            <AlertCircle className="h-12 w-12 text-yellow-500" />
            <p className="text-lg text-muted-foreground">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  )
}