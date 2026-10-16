import Link from 'next/link';
import './style.css';
export const metadata={title:{default:'Field Notes',template:'%s · Field Notes'},description:'Synthetic technical observations, authored as a full-stack learning project',robots:{index:false,follow:false}};
export default function Layout({children}){return <html lang="en"><body><header><Link href="/">Field Notes</Link></header><main>{children}</main></body></html>;}
