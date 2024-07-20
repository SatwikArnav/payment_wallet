const express = require("express");
const mongoose = require('mongoose');

const rootRouter=require("./routes/index");
const cors=require('cors');
mongoose.connect('mongodb+srv://satwikarnav:gifgo@cluster0.whgp4g5.mongodb.net/paytm');

const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/v1",rootRouter);
app.use((req, res, next) => {
    console.log('Request Body:', req.body);
    next();
  });
app.get('/:id',(req,res)=>
{
    console.log(req.params.id);
    res.send(req.params.id);
})



app.listen(3000);