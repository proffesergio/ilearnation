 'use server';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {api} from '../lib/api.js';
import {noteInput} from '../lib/validation.mjs';
export async function authenticate(form){
 const mode=form.get('mode')==='signup'?'signup':'login';
 const email=String(form.get('email')||'').trim();const password=String(form.get('password')||'');
 if(!email||email.length>254||password.length<12||password.length>128)redirect('/?message=credentials');
 let data;
 try{data=await api(`/api/auth/${mode}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});}catch{redirect('/?message=login-failed');}
 (await cookies()).set('field-notes-session',data.token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:3600});
 redirect('/');
}
export async function logout(){(await cookies()).delete('field-notes-session');redirect('/');}
export async function createNote(form){
 const token=(await cookies()).get('field-notes-session')?.value;if(!token)redirect('/?message=sign-in');
 try{const input=noteInput(form);await api('/api/notes',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(input)});}catch{redirect('/?message=save-failed');}
 revalidatePath('/');redirect('/?message=saved');
}
export async function deleteNote(form){
 const token=(await cookies()).get('field-notes-session')?.value;if(!token)redirect('/?message=sign-in');
 const id=String(form.get('id')||'');if(!/^[a-zA-Z0-9-]{1,100}$/.test(id))redirect('/?message=invalid');
 // The API verifies the bearer token and authorId on every DELETE.
 // A hidden input, action identifier, or cookie presence does not authorize ownership.
 try{await api(`/api/notes/${encodeURIComponent(id)}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});}catch{redirect('/?message=delete-failed');}
 revalidatePath('/');redirect('/?message=deleted');
}
