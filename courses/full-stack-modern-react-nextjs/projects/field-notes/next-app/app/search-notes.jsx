 'use client';
import {useState} from 'react';
import Link from 'next/link';
export default function SearchNotes({notes}){
 const [query,setQuery]=useState('');const visible=notes.filter(note=>note.title.toLowerCase().includes(query.toLowerCase()));
 return <section><label>Filter note titles<input type="search" value={query} onChange={event=>setQuery(event.target.value)}/></label><p role="status">{visible.length} notes</p><ul>{visible.map(note=><li key={note.id}><Link href={`/notes/${encodeURIComponent(note.id)}`}>{note.title}</Link></li>)}</ul></section>;
}
