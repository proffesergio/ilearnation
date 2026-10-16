import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {fileURLToPath} from 'node:url';
import {App} from './App.mjs';
import {serializeData} from './serialization.mjs';
const app=express();
app.use('/assets',express.static(fileURLToPath(new URL('../dist/',import.meta.url))));
app.get('/',async(_request,response)=>{
 try {
  const result=await fetch(`${process.env.API_URL||'http://127.0.0.1:4000'}/api/notes`,{signal:AbortSignal.timeout(5000)});
  if(!result.ok)throw new Error('API unavailable');
  const {notes}=await result.json();const data={notes};
  const html=renderToString(React.createElement(App,data));
  response.set('Cache-Control','no-store').send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Field Notes SSR</title><meta name="description" content="A synthetic notebook demonstrating React server rendering"></head><body><div id="root">${html}</div><script id="initial-data" type="application/json">${serializeData(data)}</script><script type="module" src="/assets/client.js"></script></body></html>`);
 }catch{response.status(503).send('Notebook API unavailable. Start the API, then reload.');}
});
app.listen(Number(process.env.SSR_PORT||5174),'127.0.0.1',()=>console.log('SSR: http://127.0.0.1:5174'));
