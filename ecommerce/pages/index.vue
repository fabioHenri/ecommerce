<template>
  <div>
    <header class="header">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="navbar-brand">
          <!-- Logo -->
          <NuxtLink to="/">
            <img src="~/assets/images/logo.jpg" style="width: 100px; height: 50px; object-fit: fill;">
          </NuxtLink>
        </div>
      </nav>
        <!-- Dropdown de Categorias -->
        <div class="dropdown">
          <button class="dropbtn" style="font-family: 'Roboto', sans-serif;">Filtrar por Categoria</button>
          <div class="dropdown-content">
            <ul>
              <!-- Lista de Categorias -->
              <li v-for="category in categories" :key="category">
                <button @click="selectCategory(category)">{{ category }}</button>
              </li>
            </ul>
          </div>
        </div>
       <!-- Link do Carrinho -->
       <NuxtLink to="/cart" class="cart-link" style="margin-left: auto; margin-right: 30px;">
          <font-awesome-icon :icon="['fas', 'shopping-cart']" style="font-size: 36px;"/>
        </NuxtLink>
    </header>
    <!-- Container de Produtos -->
    <div class="products-container">
      <div class="product-cards">
        <!-- Cards de Produto -->
        <div v-if="filteredProducts.length > 0" v-for="product in filteredProducts" :key="product.id" class="product-card">
          <!-- Link do Produto -->
          <div @click="openModal(product)" class="product-link">
            <div class="product-image">
              <img :src="product.image" alt="Imagem do Produto">
            </div>
            <div class="product-details">
              <h2 class="product-title">{{ product.title }}</h2>
              <p class="product-price">R$ {{ product.price }}</p>
            </div>
          </div>
          <!-- Adicionar ao Carrinho -->
          <div class="add-to-cart-section">
            <input type="number" v-model.number="quantities[product.id]" min="1" placeholder="1" class="quantity-input">
            <button @click="addToCart(product.id)" class="add-to-cart-btn">Adicionar ao Carrinho</button>
          </div>
        </div>
        <!-- Mensagem de Produto não encontrado -->
        <div v-else>
          <p>Nenhum produto encontrado.</p>
        </div>
      </div>
    </div>
    <!-- Modal de Produto -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <div class="modal-body">
          <img :src="selectedProduct.image" alt="Imagem do Produto" class="modal-image">
          <div class="modal-details">
            <h2>{{ selectedProduct.title }}</h2>
            <p>{{ selectedProduct.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal de Notificação -->
    <div v-if="showCartNotification" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeNotification">&times;</span>
        <div class="modal-body">
          <p>
            <font-awesome-icon :icon="['fas', 'check']" class="success-icon" />{{ cartNotificationMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default {
  data() {
    return {
      selectedCategory: '',
      quantities: {},
      showModal: false,
      selectedProduct: {},
      showCartNotification: false,
      cartNotificationMessage: ''
    };
  },
  async created() {
    // Carrega os produtos
    await this.$store.dispatch('fetchProducts');
    // Carrega o carrinho do armazenamento local
    this.$store.dispatch('loadCartFromLocalStorage');
  },
  computed: {
    products() {
      return this.$store.state.products;
    },
    categories() {
      // Lista de categorias únicas
      const categories = this.products.map(product => product.category);
      return [...new Set(categories)];
    },
    filteredProducts() {
      // Filtra os produtos pela categoria selecionada
      if (this.selectedCategory === '') {
        return this.products;
      }
      return this.products.filter(product => product.category === this.selectedCategory);
    }
  },
  methods: {
    addToCart(productId) {
      // Adiciona o produto ao carrinho
      const quantity = this.quantities[productId] || 1;
      const product = this.products.find(prod => prod.id === productId);
      this.$store.commit('addToCart', { productId, quantity, product });
      this.showNotification(`${quantity}x ${product.title} adicionado ao carrinho.`);
    },
    showNotification(message) {
      // Exibe uma notificação
      this.cartNotificationMessage = message;
      this.showCartNotification = true;
      setTimeout(() => {
        this.showCartNotification = false;
      }, 1000); // Fecha a notificação após 1 segundo
    },
    closeNotification() {
      // Fecha a notificação
      this.showCartNotification = false;
    },
    openModal(product) {
      // Abre o modal com os detalhes do produto
      this.selectedProduct = product;
      this.showModal = true;
    },
    closeModal() {
      // Fecha o modal
      this.showModal = false;
      // Fecha a notificação se estiver aberta
      this.showCartNotification = false;
    },
    selectCategory(category) {
      // Seleciona uma categoria para filtrar os produtos
      this.selectedCategory = category;
    }
  }
};
</script>

<style>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  background-color: transparent;
  color: #ffffff;
  padding: 10px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropdown-content {
  font-family: 'Bebas Neue', sans-serif;
  background-color: white;
  display: none;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0 8px 16px 0 #474747ec;
  z-index: 1;
  opacity: 0; /* Começa com a opacidade 0 */
  transition: opacity 3s ease; /* Adiciona uma transição suave de 0.3 segundos */
  text-align: center; 
  align-items: center; /* Alinha os elementos verticalmente */
}

.dropdown-content ul {
  list-style: none;
  padding: 0;
  font-family: 'Bebas Neue', sans-serif;
}

.dropdown-content button {
  background-color: transparent;
  color: #333;
  padding: 10px;
  font-size: 16px;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-family: 'Bebas Neue', sans-serif;
}

.dropdown-content button:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
  opacity: 1; /* Define a opacidade para 1 ao mostrar */
}
body {
  font-family: 'Bebas Neue', sans-serif;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  font-family: 'Bebas Neue', sans-serif;
}

.header {
  background: #212121;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.success-icon {
  font-size: 2rem; /* Defina o tamanho desejado para o ícone de sucesso */
  margin-right: 10px; /* Adicione margem à direita do ícone para separá-lo do texto */
}
.menu ul li {
  display: inline-block;
  margin-right: 20px;
}

.menu ul li a {
  color: #fff;
  text-decoration: none;
}

.navbar-brand {
  color: #fff;
  font-size: 24px;
  text-decoration: none;
}

.cart-link {
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  margin-left: auto;
  
}

.cart-link font-awesome-icon {
  margin-right: 5px;
}

.products-container {
  margin: 20px;
}

.category-filter {
  margin-bottom: 20px;
}

.product-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.product-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 300px;
  background: #fff;
}

.product-link {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image img {
  max-width: 100%;
  height: auto;
}

.product-details {
  padding: 10px;
  text-align: center;
}

.product-title {
  font-size: 1.2rem;
  margin: 10px 0;
}

.product-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
}

.product-price {
  font-size: 1.2rem; /* Aumenta o tamanho da fonte */
  font-weight: bold; /* Deixa em negrito */
  color: #333;
}

.add-to-cart-section {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity-input {
  width: 60px;
  padding: 5px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-to-cart-btn {
  background-color: #ffce00;
  color: black;
  border: none;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: center;
}

.add-to-cart-btn:hover {
  background-color: #ffce00;
}

.view-cart-link {
  display: block;
  margin-top: 20px;
  text-decoration: none;
  color: #2c3844;

}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  display: flex;
  align-items: center;
}

.modal-image {
  max-width: 200px;
  margin-right: 20px;
}

.modal-details {
  flex: 1;
}

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

nav{
    background-color: #333;
}

nav li{
    display: inline-block;
}

nav li a{
    display: inline-block;
    color: white;
    text-decoration: none;
    padding: 15px;
}

nav li a:hover{
    background-color: red;
}

.dropdown-menu{
    position: absolute;
    box-shadow: 0 0 2px black;
    display: none;
}

.dropdown-menu a{
    display: block;
    color: black;
}

.dropdown:hover .dropdown-menu{
    display: block;
}
</style>
