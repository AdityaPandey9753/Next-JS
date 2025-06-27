'use client'

import pb from "../../../config/db"
import { useRouter } from "next/navigation"
import React from "react"
import { useState } from "react"
export default function CreateNotes() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const router = useRouter()

  const create = async () => {
    /* const Title = title
    const Description = description */
    /* await fetch('http://127.0.0.1:8090/api/collections/Trial/records/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        title, description
      })
    }) */

    const data = {
      "Title": title,
      "Description": description
    }

    const record = await pb.collection('Trial').create(data)

    setTitle('')
    setDescription('')
    router.refresh()
  }

  return (
    <form onSubmit={create}>
      <h3>Create a new Note</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">
        Create note
      </button>
    </form>
  )
}