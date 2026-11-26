const list=document.getElementById("products"),statusBox=document.getElementById("status");
async function load(){const r=await fetch("/api/products");
const data=await r.json();
list.innerHTML=data.map(p=>`<article class="card">
  <h3>${safe(p.name)}</h3>\
  <p>₹${p.price}</p>
  <p>${safe(p.description)}</p>
  <button onclick="edit('${p._id}','${encodeURIComponent(p.name)}',${p.price},'${encodeURIComponent(p.description||"")}')">Edit</button> 
  <button class="danger" onclick="removeProduct('${p._id}')">Delete</button>
  </article>`).join("")||"No products yet."}
function safe(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
document.getElementById("productForm").addEventListener("submit",async e=>{e.preventDefault();
  const body={name:nameInput.value,price:priceInput.value,description:descriptionInput.value};
  const r=await fetch("/api/products",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  statusBox.textContent=r.ok?"Added!":"Could not add product.";e.target.reset();load();});
const nameInput=document.getElementById("name"),priceInput=document.getElementById("price"),descriptionInput=document.getElementById("description");
async function removeProduct(id){await fetch("/api/products/"+id,{method:"DELETE"});load();}
async function edit(id,n,p,d){const name=prompt("Name",decodeURIComponent(n));if(name===null)return;const price=prompt("Price",p);if(price===null)return;const description=prompt("Description",decodeURIComponent(d));
  if(description===null)return;await fetch("/api/products/"+id,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,price,description})});
  load();}
load();
