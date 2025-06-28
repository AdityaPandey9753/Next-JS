import { Share2, ShoppingCart } from 'lucide-react'
import React, { useState, useRef } from 'react'

export default function VideoPost({ VideoUrl }: { VideoUrl: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check this out!', /* title for share */
        url: window.location.href, /* URL for the sharing feature */
      })
    } else {
      alert('Share not supported on this browser')
    }
  }

  const handleAddToCart = () => {
    console.log('Add to cart clicked')
    // Optional: hook this into Zustand/Context/localStorage
  }

  return (
    <div className="relative h-[100svh] w-full bg-black overflow-hidden rounded-2xl"
      onClick={togglePlay}>
      <video
        ref={videoRef}
        src={VideoUrl}
        className="object-cover w-full h-full"
        autoPlay
        muted
        playsInline
        loop
        controls={false} // disables timeline
      />

      <div className="absolute top-4 right-4 flex flex-col gap-4 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleShare()
          }}
          className="bg-gray-800/70 hover:bg-gray-800 text-white rounded-full p-2 shadow-md"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleAddToCart()
          }}
          className="bg-gray-800/70 hover:bg-gray-800 text-white rounded-full p-2 shadow-md"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
