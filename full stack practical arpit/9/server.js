const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let products = [
  { id: 1, name: "Laptop", price: 45000, description: "Student laptop" },
  { id: 2, name: "Headphones", price: 1500, description: "Wired headphones" }
];
let nextId = 3;

app.get("/api/products", (req,res) => res.json(products));
app.post("/api/products", (req,res) => {
  const { name, price, description } = req.body;
  if (!name || Number(price) < 0 || price === undefined) return res.status(400).json({ error:"Valid name and price are required." });
  const product = { id: nextId++, name, price:Number(price), description:description || "" };
  products.push(product); res.status(201).json(product);
});
app.put("/api/products/:id", (req,res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error:"Product not found." });
  Object.assign(product, req.body, { id:product.id });
  if (req.body.price !== undefined) product.price = Number(req.body.price);
  res.json(product);
});
app.delete("/api/products/:id", (req,res) => {
  const oldLength = products.length;
  products = products.filter(p => p.id !== Number(req.params.id));
  if (products.length === oldLength) return res.status(404).json({ error:"Product not found." });
  res.json({ message:"Product deleted." });
});
app.listen(3003, () => console.log("Product CRUD: http://localhost:3003"));
