const list = document.getElementById("products");
const statusBox = document.getElementById("status");
async function loadProducts(){
  const products = await (await fetch("/api/products")).json();
  list.innerHTML = products.map(p => `<article class="card"><h3>${escapeHtml(p.name)}</h3><p>₹${p.price}</p><p>${escapeHtml(p.description)}</p><button onclick="editProduct(${p.id}, '${encodeURIComponent(p.name)}', ${p.price}, '${encodeURIComponent(p.description)}')">Edit</button> <button class="danger" onclick="deleteProduct(${p.id})">Delete</button></article>`).join("") || "No products yet.";
}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
document.getElementById("productForm").addEventListener("submit", async e => {
  e.preventDefault();
  const body = {name:document.getElementById("name").value,price:document.getElementById("price").value,description:document.getElementById("description").value};
  await fetch("/api/products",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  e.target.reset(); statusBox.textContent="Product added."; loadProducts();
});
async function deleteProduct(id){await fetch(`/api/products/${id}`,{method:"DELETE"});loadProducts();}
async function editProduct(id, name, price, description){
  const newName = prompt("Product name:",decodeURIComponent(name)); if(newName===null)return;
  const newPrice = prompt("Price:",price); if(newPrice===null)return;
  const newDescription = prompt("Description:",decodeURIComponent(description)); if(newDescription===null)return;
  await fetch(`/api/products/${id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:newName,price:newPrice,description:newDescription})});loadProducts();
}
loadProducts();
