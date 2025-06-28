'use client'
import React, { useState, useEffect, useRef } from 'react'
import VideoPost from './VideoPost'
import '../app/globals.css'

export default function InfiniteFeed() {
  const [posts, setPosts] = useState([]) /* <-  Stores all video post data fetched so far. */
  const [page, setPage] = useState(1) /* <- Tracks the current page number (used for pagination). */
  const [loading, setLoading] = useState(false) /* <- Whether a fetch request is currently in progress. */
  const [hasMore, setHasMore] = useState(true) /* <- Whether more posts are available to load. */
  const observerRef = useRef(null) /* <- Ref to the dummy div at the bottom (used for infinite scroll detection). */

  // The first use used here is to fetch the data from backend 
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      const res = await fetch(`/api/posts?page=${page}`)
      const data = await res.json()
      if (data.length === 0) setHasMore(false) /* <- if the inputs length is zero then there is no more content left to load from backend */
      else setPosts(prev => [...prev, ...data]) /* <- else adding the incoming data to the buffer list for caching */
      setLoading(false)
    }

    if (hasMore) fetchPosts()
  }, [page]) /* changes when a new page is asked to pull */

  // This use effect decides whether to make a pull request for more data and change the observerRef to the second last post of the cached list (post). Detailed explanation of the below used effect in readme
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading && hasMore) {
        setPage(prev => prev + 1)
      }
    }, { threshold: 1 })

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [loading, hasMore])

  return (
    <div className="fixed inset-0 bg-black overflow-y-auto snap-y snap-mandatory hide-scrollbar"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}> {/* Fixes the mobile browser height issue. Uses JavaScript-calculated --vh (via ViewportFix) to ensure full height. */}
      <div className="flex flex-col items-center">
        {posts.map((post: any, index: number) => (
          <div key={post.id} className="snap-start w-full max-w-md" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
            <VideoPost VideoUrl={post.mediaUrl} />
          </div>
        ))
        }
        <div ref={observerRef} className="h-10 my-4">
          {!hasMore && <p className="text-gray-400">No more posts</p>} {/*
          Purpose: This is the div that your IntersectionObserver watches.
          When it comes into the viewport, it triggers loading the next page.
          ref={observerRef}: Connects this DOM node to the observer logic.
          h-10: 40px tall spacer.
          my-4: Adds vertical margin around it.
          If there’s no more content, it shows a subtle message. */}
        </div>
      </div>
    </div>
  )
}
