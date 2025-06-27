import React = require("react");
import styles from './Notes.module.css';
import Link from "next/link";
import CreateNotes from "./createNote";

async function getNotes() {
  // const db = new PocketBase('http://127.0.0.1:8090');
  // const result = await db.records.getList('notes');
  const res = await fetch('http://127.0.0.1:8090/api/collections/Trial/records?page=1&perPage=30', { cache: 'no-store' });
  const data = await res.json();
  return data?.items as any[];
}

export default async function NotesPage() {
  const notes = await getNotes(); 

  return(
    <div>
      <h1>Notes</h1>
      <div className={styles.grid}>
        {notes?.map((note) => {
          return <Note key={note.id} note={note} />;
        })}
      </div>
      <CreateNotes />
    </div>
  );
}

function Note({ note }: any) {
  const { id, Title, Description, created } = note || {};

  return (
    <Link href={`/notes/${id}`}>
      <div className={styles.note}>
        <h2>{Title}</h2>
        <h5>{Description}</h5>
        <p>{created}</p>
      </div>
    </Link>
  );
}