import { NextResponse } from 'next/server'

const sampleVideos = [
  'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
  'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
  'https://samplelib.com/lib/preview/mp4/sample-15s.mp4',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://media.w3.org/2010/05/sintel/trailer.mp4',
  'https://bbfeeds.alterwork.in/obj/videos/0408de77c3194b6082b65d8a8409021b_v3.mp4',
  'https://bbfeeds.alterwork.in/obj/videos/0bd5b3e23857467c9bff52a654702874_v2.mp4',
  'https://bbfeeds.alterwork.in/obj/videos/e1980b26d68a44e298c025d1d28cd4f4_v1.mp4',
  'https://bbfeeds.alterwork.in/obj/videos/9de6173ac08a4405a5bb6cfeaa335633_v1.mp4'
]

/* explained in readme.md */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = 10
  const start = (page - 1) * limit

  const paginated = Array.from({ length: limit }, (_, i) => {
    const index = (start + i) % sampleVideos.length
    return {
      id: start + i + 1,
      mediaUrl: sampleVideos[index]
    }
  })

  return NextResponse.json(paginated)
}
