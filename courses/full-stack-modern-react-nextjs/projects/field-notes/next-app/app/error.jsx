'use client';
export default function ErrorPage({reset}){return <><h1>Notebook unavailable</h1><p>Start the API, then retry. No credentials are included in this message.</p><button onClick={reset}>Retry</button></>;}
