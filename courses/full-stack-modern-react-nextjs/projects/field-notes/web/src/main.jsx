import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';
import { ApolloProvider, useQuery as useGraphQuery, useMutation } from '@apollo/client/react';
import { VictoryAxis, VictoryBar, VictoryChart } from 'victory';
import { io } from 'socket.io-client';
import { mergeEvents } from './events.mjs';
import './style.css';
const queryClient = new QueryClient();
async function request(path, options = {}) {
 const response = await fetch(path, options); const data = await response.json();
 if (!response.ok) throw new Error(data.error || 'Request failed'); return data;
}
function NoteList({ notes }) {return notes.length ? <ul>{notes.map(note => <li key={note.id}><article><h2>{note.title}</h2><p>{note.body}</p><small>{note.createdAt}</small></article></li>)}</ul> : <p>No notes yet. Add your first observation.</p>;}
function Auth({ setToken }) {
 const [error,setError]=useState(''); const [pending,setPending]=useState(false);
 async function submit(event) {event.preventDefault();const form=event.currentTarget;const values=new FormData(form);const method=event.nativeEvent.submitter?.value||'login';setPending(true);setError('');try {const data=await request('/api/auth/'+method,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:values.get('email'),password:values.get('password')})});setToken(data.token);form.reset();}catch(error){setError(error.message);}finally{setPending(false);}}
 return <form onSubmit={submit}><h2>Local demo account</h2><p>Use synthetic credentials. Session stays in memory and resets on reload.</p><label>Email<input name="email" type="email" required autoComplete="username"/></label><label>Password<input name="password" type="password" minLength={12} required autoComplete="current-password"/></label><button value="signup" disabled={pending}>Sign up</button> <button value="login" disabled={pending}>Log in</button><p role="alert">{error}</p></form>;
}
function NoteForm({onSubmit,disabled}) {return <form onSubmit={onSubmit}><label>Title<input name="title" maxLength={120} required/></label><label>Observation<textarea name="body" maxLength={5000} required/></label><button disabled={disabled}>Save note</button>{disabled&&<p>Sign in to write, or wait for the request.</p>}</form>;}
function RestNotes({token}) {
 const client=useQueryClient();const [error,setError]=useState('');const [pending,setPending]=useState(false);
 const result=useQuery({queryKey:['notes'],queryFn:()=>request('/api/notes')});
 async function submit(event){event.preventDefault();const form=event.currentTarget;const values=new FormData(form);setPending(true);setError('');try{await request('/api/notes',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({title:values.get('title'),body:values.get('body')})});form.reset();await client.invalidateQueries({queryKey:['notes']});}catch(error){setError(error.message);}finally{setPending(false);}}
 return <><h1>REST notebook</h1>{result.isPending?<p role="status">Loading notes…</p>:result.error?<p role="alert">{result.error.message}</p>:<NoteList notes={result.data.notes}/>}<NoteForm onSubmit={submit} disabled={!token||pending}/><p role="alert">{error}</p></>;
}
const NOTES=gql`query Notes { notes { id title body createdAt } }`;
const CREATE=gql`mutation CreateNote($title:String!,$body:String!){createNote(title:$title,body:$body){id title body createdAt}}`;
function GraphNotes({token}){
 const result=useGraphQuery(NOTES);const [create,{loading,error}]=useMutation(CREATE,{refetchQueries:[{query:NOTES}],awaitRefetchQueries:true});const [failure,setFailure]=useState('');
 async function submit(event){event.preventDefault();const form=event.currentTarget;const values=new FormData(form);setFailure('');try{await create({variables:{title:values.get('title'),body:values.get('body')},context:{headers:{Authorization:`Bearer ${token}`}}});form.reset();}catch(error){setFailure(error.message);}}
 return <><h1>GraphQL notebook</h1>{result.loading?<p role="status">Loading GraphQL…</p>:result.error?<p role="alert">{result.error.message}</p>:<NoteList notes={result.data?.notes||[]}/>}<NoteForm onSubmit={submit} disabled={!token||loading}/><p role="alert">{failure||error?.message}</p></>;
}
function LiveNotes({token}){
 const socketRef=useRef(null);const [events,setEvents]=useState([]);const [status,setStatus]=useState('Sign in to connect');const [error,setError]=useState('');
 useEffect(()=>{setEvents([]);setError('');if(!token){setStatus('Sign in to connect');return;}const socket=io({auth:{token}});socketRef.current=socket;
 const connected=()=>{setStatus('Connected');socket.emit('notes:sync',{after:null});};
 const receive=event=>setEvents(previous=>mergeEvents(previous,[event]));
 const history=payload=>{setEvents(previous=>mergeEvents(previous,payload.events));if(payload.hasMore)socket.emit('notes:sync',{after:payload.nextCursor});};
 const disconnected=()=>setStatus('Disconnected; reconnecting when available');const failed=error=>setError(error.message);
 socket.on('connect',connected);socket.on('note:created',receive);socket.on('notes:history',history);socket.on('disconnect',disconnected);socket.on('connect_error',failed);
 return()=>{socket.off('connect',connected);socket.off('note:created',receive);socket.off('notes:history',history);socket.off('disconnect',disconnected);socket.off('connect_error',failed);socket.disconnect();socketRef.current=null;};
 },[token]);
 function submit(event){event.preventDefault();const form=event.currentTarget;const values=new FormData(form);if(!socketRef.current?.connected){setError('Reconnect before sending. Offline writes are not silently queued.');return;}socketRef.current.timeout(5000).emit('note:create',{clientId:crypto.randomUUID(),title:values.get('title'),body:values.get('body')},(timeout,result)=>{if(timeout){setError('No confirmation received. Synchronize history before retrying.');return;}if(!result?.ok){setError(result?.error||'Save rejected');return;}setError('');form.reset();});}
 return <><h1>Live observations</h1><p role="status">{status}</p><p>History merges with live delivery by event ID. Connected does not guarantee a write was saved.</p><NoteList notes={events.map(event=>event.note)}/><NoteForm onSubmit={submit} disabled={!token}/><p role="alert">{error}</p></>;
}
function Insights(){const result=useQuery({queryKey:['stats'],queryFn:()=>request('/api/stats')});if(result.isPending)return <p>Loading totals…</p>;if(result.error)return <p role="alert">{result.error.message}</p>;const stats=result.data;return <><h1>Notebook observations</h1><p>{stats.totalNotes} total notes. Counts describe this synthetic demo only.</p><div aria-hidden="true"><VictoryChart domainPadding={20}><VictoryAxis/><VictoryAxis dependentAxis/><VictoryBar data={stats.byDay} x="day" y="count"/></VictoryChart></div><table><caption>Notes by UTC day</caption><thead><tr><th scope="col">Day</th><th scope="col">Notes</th></tr></thead><tbody>{stats.byDay.map(row=><tr key={row.day}><th scope="row">{row.day}</th><td>{row.count}</td></tr>)}</tbody></table></>;}
function App(){const [token,setToken]=useState('');const [apollo]=useState(()=>new ApolloClient({link:new HttpLink({uri:'/graphql'}),cache:new InMemoryCache()}));async function logout(){setToken('');queryClient.clear();await apollo.clearStore();}return <ApolloProvider client={apollo}><header><nav aria-label="Notebook"><Link to="/">REST</Link><Link to="/graphql">GraphQL</Link><Link to="/live">Live</Link><Link to="/insights">Insights</Link></nav></header><main>{token?<button onClick={logout}>Log out</button>:<Auth setToken={setToken}/>}<Routes><Route path="/" element={<RestNotes token={token}/>}/><Route path="/graphql" element={<GraphNotes token={token}/>}/><Route path="/live" element={<LiveNotes token={token}/>}/><Route path="/insights" element={<Insights/>}/><Route path="*" element={<h1>Page not found</h1>}/></Routes></main></ApolloProvider>;}
createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><QueryClientProvider client={queryClient}><App/></QueryClientProvider></BrowserRouter></React.StrictMode>);
