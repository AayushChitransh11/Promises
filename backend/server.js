const express=require('express');
const cors=require('cors');
const app=express();
const PORT=5001;

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Running JS Promises visualiser');
});

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
});