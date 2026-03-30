/* ============================================================
   CHECKOUT & INTEGRAÇÃO WHATSAPP
   ============================================================ */
import { Cart } from "./cart.js";

const cart = new Cart();

// Seletores do DOM
const dom = {
  summary: document.getElementById("order-summary"),
  finishBtn: document.getElementById("finish"),
  nameInput: document.getElementById("name"),
  phoneInput: document.getElementById("phone")
};

/**
 * Renderiza o resumo do pedido com estética clean
 */
function renderSummary() {
  if (!dom.summary) return;
  dom.summary.innerHTML = "";

  if (cart.items.length === 0) {
    dom.summary.innerHTML = "<p class='empty-msg'>Sua bolsa está vazia.</p>";
    return;
  }

  cart.items.forEach(item => {
    const div = document.createElement("div");
    div.className = "summary-item"; // Use esta classe no CSS para alinhar
    div.innerHTML = `
      <div class="item-info">
        <span class="item-name">${item.name}</span>
        <span class="item-qty">x${item.quantity}</span>
      </div>
      <span class="item-price">R$ ${(item.price * item.quantity).toFixed(2)}</span>
    `;
    dom.summary.appendChild(div);
  });

  // Adiciona a linha de Total Geral
  const totalDiv = document.createElement("div");
  totalDiv.className = "summary-total";
  totalDiv.innerHTML = `
    <strong>Total do Pedido</strong>
    <strong>R$ ${cart.getTotal().toFixed(2)}</strong>
  `;
  dom.summary.appendChild(totalDiv);
}

/**
 * Formata e envia o pedido para o WhatsApp
 */
function handleCheckout() {
  const name = dom.nameInput?.value.trim();
  const phone = dom.phoneInput?.value.trim();

  if (!name || !phone) {
    alert("Por favor, preencha seu nome e contato para prosseguirmos. ✨");
    return;
  }

  if (cart.items.length === 0) {
    alert("Sua bolsa está vazia!");
    return;
  }

  // 1. Gerar mensagem formatada para WhatsApp
  let message = `*Novo Pedido - Beauty Store* 💄%0A%0A`;
  message += `*Cliente:* ${name}%0A`;
  message += `*Contato:* ${phone}%0A%0A`;
  message += `*Produtos:*%0A`;

  cart.items.forEach(item => {
    message += `• ${item.name} (x${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2)}%0A`;
  });

  message += `%0A*Total: R$ ${cart.getTotal().toFixed(2)}*`;

  // 2. Salvar histórico de pedidos (Persistência)
  saveOrderToHistory(name, phone);

  // 3. Abrir WhatsApp e Limpar Carrinho
  const whatsappLink = `https://wa.me/SEUNUMERO?text=${message}`;
  window.open(whatsappLink, "_blank");

  cart.clear(); // Usando o método .clear() que criamos na classe Cart
  renderSummary();
}

/**
 * Salva o pedido no histórico local
 */
function saveOrderToHistory(name, phone) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  
  const newOrder = {
    id: Date.now(),
    name,
    phone,
    items: [...cart.items], // Cópia profunda dos itens
    total: cart.getTotal(),
    date: new Date().toLocaleString('pt-BR')
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));
}

// Inicialização
dom.finishBtn?.addEventListener("click", handleCheckout);
renderSummary();