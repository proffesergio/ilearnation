import {api} from '../../../lib/api.js';
export async function GET(){try{return Response.json(await api('/api/notes'),{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Notebook API unavailable'},{status:503});}}
