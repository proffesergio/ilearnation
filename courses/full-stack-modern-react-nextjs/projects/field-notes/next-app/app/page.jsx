import Link from 'next/link';
import Image from 'next/image';
import {cookies} from 'next/headers';
import {api} from '../lib/api.js';
import {authenticate,logout,createNote} from './actions.js';
import SearchNotes from './search-notes.jsx';
export const dynamic='force-dynamic';
const messages={'credentials':'Check the email and use a password of 12–128 characters.','login-failed':'Sign in failed. Check the API and credentials.','save-failed':'Save failed. Sign in again and check the field limits.','saved':'Note saved.','deleted':'Note deleted.','delete-failed':'Delete failed. Only the note owner can delete.','sign-in':'Sign in before writing.','invalid':'Invalid note identifier.'};
export default async function Page({searchParams}){
 const params=await searchParams;const signedIn=Boolean((await cookies()).get('field-notes-session'));
 let notes=null;try{notes=(await api('/api/notes')).notes;}catch{}
 return <><Image src="/notebook.svg" width={96} height={72} alt=""/><h1>Observe. Record. Verify.</h1><p>This local synthetic notebook is separate from iLearnNation accounts.</p>{messages[params.message]&&<p role="status">{messages[params.message]}</p>}{signedIn?<form action={logout}><button>Log out</button></form>:<form action={authenticate}><h2>Demo account</h2><label>Email<input name="email" type="email" required autoComplete="username"/></label><label>Password<input name="password" type="password" minLength={12} maxLength={128} required autoComplete="current-password"/></label><button name="mode" value="signup">Sign up</button> <button name="mode" value="login">Log in</button></form>}{notes?<SearchNotes notes={notes}/>:<p role="alert">API unavailable. Start the API and reload.</p>}{signedIn&&<form action={createNote}><h2>Add an observation</h2><label>Title<input name="title" required maxLength={120}/></label><label>Observation<textarea name="body" required maxLength={5000}/></label><button>Save note</button></form>}<p><Link href="/api/notes">Inspect the JSON route</Link></p></>;
}
