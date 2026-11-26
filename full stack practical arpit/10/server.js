const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
let products = [
 {id:1,name:"Laptop",price:45000,rating:4.5},
 {id:2,name:"Smartphone",price:18000,rating:4.2}
];
app.get("/api/products",(req,res)=>res.json(products));
app.post("/api/products",(req,res)=>{
 const {name,price,rating}=req.body;
 if(!name || !Number.isFinite(Number(price)) || !Number.isFinite(Number(rating))) return res.status(400).json({error:"Name, price and rating are required."});
 const product={id:Date.now(),name,price:Number(price),rating:Number(rating)};
 products.push(product);res.status(201).json(product);
});
app.listen(3004,()=>console.log("Product API: http://localhost:3004"));
