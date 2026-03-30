/* ============================================================
   CLASSE CART - GERENCIAMENTO DE BOLSA DE COMPRAS (CORRIGIDA)
   ============================================================ */
export class Cart {
  constructor() {
    this.items = this.load();
  }

  load() {
    const saved = localStorage.getItem("cart");
    // AJUSTE: Garante que sempre retorne um array, mesmo se o JSON estiver corrompido
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  add(product) {
    // AJUSTE: Convertendo ambos para String para evitar erro de Tipo (Número vs Texto)
    const item = this.items.find(p => String(p.id) === String(product.id));

    if (item) {
      item.quantity++;
    } else {
      // AJUSTE: Garante que o objeto tenha uma quantidade inicial 1
      this.items.push({ ...product, quantity: 1 });
    }

    this.save();
  }

  updateQuantity(id, amount) {
    const item = this.items.find(p => String(p.id) === String(id));
    if (item) {
      item.quantity += amount;
      if (item.quantity <= 0) this.remove(id);
    }
    this.save();
  }

  remove(id) {
    // AJUSTE: Comparação flexível para remover o item correto
    this.items = this.items.filter(p => String(p.id) !== String(id));
    this.save();
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  }

  getCount() {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  save() {
    localStorage.setItem("cart", JSON.stringify(this.items));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }

  clear() {
    this.items = [];
    this.save();
  }
}
