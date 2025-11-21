
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const dbPath = __dirname + '/db.json';
if(!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({users:[],stores:[],ratings:[]},null,2));

function load(){return JSON.parse(fs.readFileSync(dbPath));}
function save(d){fs.writeFileSync(dbPath, JSON.stringify(d,null,2));}

app.post('/signup',(req,res)=>{
  const {name,email,address,password,role} = req.body;
  const db=load();
  if(db.users.find(u=>u.email===email)) return res.status(400).json({msg:"exists"});
  db.users.push({id:Date.now(),name,email,address,password,role:role||"user"});
  save(db);
  res.json({msg:"ok"});
});

app.post('/login',(req,res)=>{
  const {email,password}=req.body;
  const db=load();
  const u=db.users.find(u=>u.email===email && u.password===password);
  if(!u) return res.status(400).json({msg:"invalid"});
  res.json(u);
});

app.post('/store',(req,res)=>{
  const {name,email,address}=req.body;
  const db=load();
  db.stores.push({id:Date.now(),name,email,address});
  save(db);
  res.json({msg:"ok"});
});

app.get('/stores',(req,res)=>{
  const db=load();
  const withRating=db.stores.map(s=>{
    const r=db.ratings.filter(x=>x.storeId===s.id);
    const avg=r.length?(r.reduce((a,b)=>a+b.rating,0)/r.length):0;
    return {...s,avg};
  });
  res.json(withRating);
});

app.post('/rate',(req,res)=>{
  const {userId,storeId,rating}=req.body;
  const db=load();
  const ex=db.ratings.find(r=>r.userId===userId && r.storeId===storeId);
  if(ex) ex.rating=rating;
  else db.ratings.push({id:Date.now(),userId,storeId,rating});
  save(db);
  res.json({msg:"ok"});
});

app.get('/ratings',(req,res)=>{
  const db=load();
  res.json(db.ratings);
});

app.listen(5000,()=>console.log("backend 5000"));
