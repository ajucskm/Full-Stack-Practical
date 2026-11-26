require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const app=express();
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
const Product=mongoose.model("Product",new mongoose.Schema({
 name:{type:String,required:true,trim:true},
 price:{type:Number,required:true,min:0},
 description:{type:String,default:""}
},{timestamps:true}));
app.get("/api/products",async(req,res)=>res.json(await Product.find().sort({createdAt:-1})));
app.post("/api/products",async(req,res)=>{try{const p=await Product.create(req.body);res.status(201).json(p)}catch(e){res.status(400).json({error:e.message})}});
app.put("/api/products/:id",async(req,res)=>{try{const p=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!p)return res.status(404).json({error:"Not found"});res.json(p)}catch(e){res.status(400).json({error:e.message})}});
app.delete("/api/products/:id",async(req,res)=>{const p=await Product.findByIdAndDelete(req.params.id);if(!p)return res.status(404).json({error:"Not found"});res.json({message:"Deleted"})});
const PORT=process.env.PORT||3005;
mongoose.connect(process.env.MONGO_URI).then(()=>app.listen(PORT,()=>console.log(`MongoDB CRUD: http://localhost:${PORT}`))).catch(e=>console.error("MongoDB connection failed:",e.message));
