const container=document.getElementById("products"),message=document.getElementById("message");
async function showProducts(){const data=await(await fetch("/api/products")).json();container.innerHTML=data.map(p=>`<article><h3>${safe(p.name)}</h3><p>Price: ₹${p.price}</p><p>Rating: ${p.rating}/5</p><small>Product ID: ${p.id}</small></article>`).join("");}
function safe(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
document.getElementById("form").addEventListener("submit",async e=>{e.preventDefault();const body={name:document.getElementById("name").value,price:document.getElementById("price").value,rating:document.getElementById("rating").value};const r=await fetch("/api/products",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const result=await r.json();message.textContent=r.ok?"Product added!":result.error;e.target.reset();showProducts();});
showProducts();
