import { products } from "./products.js";
import { Cart } from "./cart.js";

const cart = new Cart();
let user = JSON.parse(localStorage.getItem("user")) || null;

const dom = {
  grid: document.querySelector(".product-grid"),
  cartCount: document.getElementById("cart-count"),
  cartItems: document.getElementById("cart-items"),
  cartTotal: document.getElementById("cart-total-amount"),
  checkoutBtn: document.getElementById("checkout-btn"),
  authModal: document.getElementById("auth-modal"),
  authForm: document.getElementById("auth-form")
};

const Shop = {
  render() {
    if (!dom.grid) return;
    dom.grid.innerHTML = ""; 

    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-tag">${product.tag || 'Destaque'}</div>
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">R$ ${product.price.toFixed(2)}</p>
        <button class="add-btn-vitrine">Adicionar ✨</button>
      `;

      card.onclick = () => {
        cart.add(product);
        UI.updateCart();
        UI.showToast(`${product.name} na bolsa!`);
      };

      dom.grid.appendChild(card);
    });
  }
};

const UI = {
  updateCart() {
    if (!dom.cartItems) return;
    dom.cartItems.innerHTML = "";
    
    if (dom.cartCount) dom.cartCount.innerText = cart.getCount();

    if (cart.items.length === 0) {
      dom.cartItems.innerHTML = `<p class="empty-msg">Sua bolsa está vazia.</p>`;
      dom.cartTotal.innerText = "0.00";
      dom.checkoutBtn.disabled = true;
      return;
    }

    // AJUSTE: Cria um cabeçalho para o botão esvaziar ficar no topo lateral
    const cartHeader = document.createElement("div");
    cartHeader.className = "cart-header-mini";
    cartHeader.innerHTML = `
      <span>Itens selecionados</span>
      <button class="btn-clear-mini" onclick="window.esvaziarTudo()">
        <i class="fas fa-trash-alt"></i> Esvaziar
      </button>
    `;
    dom.cartItems.appendChild(cartHeader);

    cart.items.forEach(item => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <div class="cart-info">
          <span>${item.name} (x${item.quantity})</span>
          <small>R$ ${(item.price * item.quantity).toFixed(2)}</small>
        </div>
        <button class="remove-btn" onclick="window.removeDoCarrinho(${item.id})">×</button>
      `;
      dom.cartItems.appendChild(div);
    });

    dom.cartTotal.innerText = cart.getTotal().toFixed(2);
    dom.checkoutBtn.disabled = false;
  },

  showToast(msg) {
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 500);
    }, 2000);
  }
};

/* ============================================================
   FUNÇÕES GLOBAIS
   ============================================================ */
window.removeDoCarrinho = (id) => {
  cart.remove(id);
  UI.updateCart();
};

window.esvaziarTudo = () => {
  if(confirm("Deseja limpar toda a sua bolsa?")) {
    cart.clear();
    UI.updateCart();
    UI.showToast("Bolsa limpa! 🗑️");
  }
};

function finalizarPedido() {
  const fone = "5511999998888";
  let txt = `*Pedido Beauty Store*\nCliente: ${user.username}\n\n`;
  cart.items.forEach(i => txt += `• ${i.name} (x${i.quantity})\n`);
  txt += `\n*Total: R$ ${cart.getTotal().toFixed(2)}*`;
  window.open(`https://wa.me/${fone}?text=${encodeURIComponent(txt)}`, "_blank");
  cart.clear();
  UI.updateCart();
  function finalizarPedido() {
  const fone = "5511999998888";
  let txt = `*Pedido Beauty Store*\nCliente: ${user.username}\n\n`;
  cart.items.forEach(i => txt += `• ${i.name} (x${i.quantity})\n`);
  txt += `\n*Total: R$ ${cart.getTotal().toFixed(2)}*`;
  
  // Linha adicionada para o pagamento
  txt += `\n\n_Desejo combinar o pagamento via Pix ou Cartão._`;
  
  window.open(`https://wa.me/${fone}?text=${encodeURIComponent(txt)}`, "_blank");
  cart.clear();
  UI.updateCart();
}
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  Shop.render();
  UI.updateCart();

  dom.checkoutBtn?.addEventListener("click", () => {
    if (!user) dom.authModal.classList.add("active");
    else finalizarPedido();
  });

  dom.authForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    user = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value
    };
    localStorage.setItem("user", JSON.stringify(user));
    dom.authModal.classList.remove("active");
    finalizarPedido();
  });
});