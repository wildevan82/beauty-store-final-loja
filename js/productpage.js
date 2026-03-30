/* ============================================================
   DETALHES DO PRODUTO (PÁGINA INDIVIDUAL)
   ============================================================ */
import { products } from "./products.js";
import { Cart } from "./cart.js";

const cart = new Cart();

// 1. Captura de Parâmetros
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// 2. Busca do Produto (com tratamento de erro)
const product = products.find(p => p.id == productId);

// 3. Renderização Inteligente
function initProductPage() {
  if (!product) {
    // Se o ID não existir, redireciona para a vitrine ou mostra erro
    document.body.innerHTML = `
      <div style="text-align:center; padding:100px;">
        <h2 style="font-family:'Playfair Display', serif;">Produto não encontrado</h2>
        <a href="index.html" style="color:var(--primary-gold);">Voltar para a loja</a>
      </div>
    `;
    return;
  }

  // Preenche os dados com segurança
  const imgElement = document.getElementById("product-image");
  const nameElement = document.getElementById("product-name");
  const priceElement = document.getElementById("product-price");
  const descElement = document.getElementById("product-description"); // Dica: adicione descrição!

  if (imgElement) imgElement.src = product.image;
  if (nameElement) nameElement.innerText = product.name;
  if (priceElement) priceElement.innerText = `R$ ${product.price.toFixed(2)}`;
  if (descElement) descElement.innerText = product.description || "Toque de sofisticação para sua rotina de beleza.";

  // 4. Configuração do Botão de Compra
  const addBtn = document.getElementById("add-btn");
  if (addBtn) {
    addBtn.onclick = () => {
      cart.add(product);
      
      // Feedback Visual Elegante (Substituindo o Alert)
      addBtn.innerText = "Adicionado à Bolsa ✨";
      addBtn.style.background = "var(--primary-gold)";
      
      setTimeout(() => {
        addBtn.innerText = "Adicionar à Bolsa";
        addBtn.style.background = "var(--deep-black)";
      }, 2000);
    };
  }
}

// Inicializa a página
document.addEventListener("DOMContentLoaded", initProductPage);