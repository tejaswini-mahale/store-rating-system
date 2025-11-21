
import React, {useEffect,useState} from 'react';
const API='http://localhost:5000';
export default function App(){
  const [stores,setStores]=useState([]);
  useEffect(()=>{fetch(API+'/stores').then(r=>r.json()).then(setStores)},[]);
  return <div>
    <h1>Stores</h1>
    {stores.map(s=><div key={s.id}>{s.name} - {s.avg.toFixed(1)}</div>)}
  </div>;
}
