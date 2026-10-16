import {notFound} from 'next/navigation';
import {cookies} from 'next/headers';
import {api} from '../../../lib/api.js';
import {deleteNote} from '../../actions.js';
export const dynamic='force-dynamic';
export async function generateMetadata({params}){
 const {id}=await params;
 try{const data=await api(`/api/notes/${encodeURIComponent(id)}`);if(!data)return {title:'Missing observation',robots:{index:false}};
 const {note}=data;const canonical=new URL('/notes/'+encodeURIComponent(note.slug),process.env.SITE_URL||'http://127.0.0.1:3001').href;
 return {title:note.title,description:note.body.slice(0,160),alternates:{canonical},openGraph:{title:note.title,description:note.body.slice(0,160),url:canonical,type:'article',publishedTime:note.createdAt}};
 }catch{return {title:'Notebook unavailable',robots:{index:false}};}
}
export default async function NotePage({params}){const {id}=await params;const data=await api(`/api/notes/${encodeURIComponent(id)}`);if(!data)notFound();const {note}=data;return <article><h1>{note.title}</h1><p>{note.body}</p><time dateTime={note.createdAt}>{note.createdAt}</time>{(await cookies()).has('field-notes-session')&&<form action={deleteNote}><input type="hidden" name="id" value={note.id}/><p>The API checks ownership before deletion.</p><button>Delete my note</button></form>}</article>;}
