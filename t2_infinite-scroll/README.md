# Vertical Infinite Scroll Video Feed (Next.js)
A fully functional vertical video feed with infinite scroll, automatic video playback, interactive buttons (Share/Add to Cart), and mobile viewport fix — inspired by Instagram Reels and TikTok.

## Features
  * Built a vertically scrolling full-screen video feed
  * Implemented infinite scroll using IntersectionObserver
  * Auto-play/pause logic for videos with tap-to-toggle
  * Included Share and Add to Cart buttons with floating UI
  * Handled mobile browser quirks using a --vh fix for layout
  * Styled using Tailwind CSS, with optional ShadCN for future UI expansion
  * Clean folder structure and modular code

## Project directory
  ``` 
  /t2_infinite-scroll
  │
  ├── app/
  │   ├── page.tsx                    # Home page (renders <InfiniteFeed />)
  │   ├── globals.css                # Tailwind + custom styles
  │   └── api/
  │       └── posts/
  │           └── route.ts            # Backend API route for paginated posts
  │
  ├── components/
  │   ├── InfiniteFeed.tsx           # Main infinite scroll logic
  │   ├── ViewportFix.tsx            # Handling browser activity
  │   └── VideoPost.tsx              # UI for each video post (with Share & Cart)
  │
  ├── tailwind.config.ts             # Tailwind CSS config
  ├── tsconfig.json                  # TypeScript config
  ├── shadcn.json                    # Shadcn UI config (if used)
  ├── next.config.js                 # Next.js config
  ├── package.json
  └── README.md
```

## Terms 
  | Term               | Meaning                                                                          |
  | ------------------ | -------------------------------------------------------------------------------- |
  | **Post**           | A single video object `{ id, mediaUrl }`                                         |
  | **Page**           | A batch of 10 posts fetched from the backend                                     |
  | **Scroll Trigger** | An invisible `<div>` observed using IntersectionObserver to load more            |
  | **100svh**         | Used to set viewport height excluding mobile browser chrome                      |
  | **AutoPlay**       | Videos automatically start playing on render                                     |
  | **Snap Scroll**    | Scroll behavior that locks one item per screen using Tailwind’s `snap-*` classes |

## Data flow
  1. Page renders <Feed /> (client component)
  2. useEffect triggers fetch to /api/posts?page=1
  3. Next.js API route receives request <br>
    a.  Parses ?page=1<br>
    b. Queries DB (e.g., LIMIT 10 OFFSET 0)
  4. API route returns 10 posts as JSON
  5. useState([...posts]) stores them in browser
  6. User scrolls → IntersectionObserver hits bottom
  7. Set page = 2 → fetch /api/posts?page=2
  8. Repeat fetch + append logic


## Explanations
### Use effect for setting the fetch function
- const observer = new IntersectionObserver(entries => { ... }, { threshold: 1 })<br>
  Creates a new IntersectionObserver instance.<br>
 What it does: Watches a DOM element (your "observer div" at the bottom) to see if it enters the viewport.<br>
The callback receives an array of entries (intersection records).

- { threshold: 1 }: This means the callback only fires when 100% of the element is visible in the viewport.

- if (entries[0].isIntersecting && !loading && hasMore) { 
  <br> Checks if:<br>
The target element is currently visible in the viewport (isIntersecting)<br>
You're not already loading more data<br>
There is more data to load<br>
Prevents unnecessary fetches or duplicate loads.

- setPage(prev => prev + 1)<br>
If the conditions above are true, it increases the page number by 1.<br>
This triggers another useEffect (the one that listens to page) to fetch the next page of data.

- if (observerRef.current) { observer.observe(observerRef.current) }<br> 
Starts observing the element referenced by observerRef.<br>
Usually this is a small `<div>` at the end of the list (e.g., "Loading more..." placeholder).<br>
When this div enters the viewport, it triggers the intersection callback.

- return () => observer.disconnect()<br>Cleanup function that runs when:<br>
The component is unmounted<br>
Or when the loading or hasMore state changes (causing a re-run of useEffect)<br>
Prevents memory leaks and ensures you're not observing stale elements.

- }, [loading, hasMore])<br>Dependency array.<br>
Ensures the effect re-runs if loading or hasMore change.<br>
This guarantees the IntersectionObserver uses the latest values of those states when checking conditions. 

### Routes.ts
#### Pagination variables
* limit: number of posts per page (10)
* start: index in the array where this page should begin

If page = 2, then start = (2 - 1) * 10 = 10.
#### Generating paginated post list
| Line                                 | Meaning                                                           |
| ------------------------------------ | ----------------------------------------------------------------- |
| `Array.from({ length: limit }, ...)` | Creates an array of length 10 (limit), where each entry is a post |
| `start + i`                          | Computes the global index (e.g., post 11, 12, ... for page 2)     |
| `% sampleVideos.length`              | **Cycles** through sample videos using modulo (looping logic)     |
| `id: start + i + 1`                  | Gives each post a unique numeric `id`                             |
| `mediaUrl: sampleVideos[index]`      | Assigns video URL from the sample pool                            |


<hr>
Aditya Pandey, Full Stack Developer & AI/ML Enthusiast