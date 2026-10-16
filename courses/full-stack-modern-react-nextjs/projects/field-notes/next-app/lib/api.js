import 'server-only';
export async function api(path,options={}){
 const response=await fetch(`${process.env.API_URL||'http://127.0.0.1:4000'}${path}`,{...options,cache:'no-store',signal:AbortSignal.timeout(5000)});
 if(response.status===404)return null;
 if(response.status===204)return null;
 const data=await response.json();
 if(!response.ok)throw new Error(data.error||'Notebook API unavailable');
 return data;
}
