import {api} from '../lib/api.js';
export const dynamic='force-dynamic';
export default async function sitemap(){
 const origin=process.env.SITE_URL||'http://127.0.0.1:3001';
 const pages=[{url:new URL('/',origin).href}];
 try {const {notes}=await api('/api/notes');return [...pages,...notes.map(note=>({url:new URL('/notes/'+encodeURIComponent(note.slug),origin).href,lastModified:note.createdAt}))];} catch {return pages;}
}
