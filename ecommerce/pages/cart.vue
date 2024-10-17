<template>
  <div>
    <header class="header">
      <nav class="navbar">
        <div class="navbar-brand">
          <NuxtLink to="/">
            <img
              src="~/assets/images/logo.jpg"
              style="width: 100px; height: 50px; object-fit: fill"
            />
          </NuxtLink>
        </div>
      </nav>
    </header>
    <div class="checkout-container">
      <h1>Seu Carrinho</h1>
      <div class="cart-box">
        <ul class="cart-box-items">
          <li
            v-for="(item, index) in cartItems"
            :key="item.id"
            :class="{
              'cart-box-item': true,
              'item-divider': index < cartItems.length - 1,
            }"
          >
            <div class="product-info">
              <img
                :src="item.image"
                alt="Imagem do Produto"
                class="product-image"
              />
              <div class="item-details">
                <span class="item-title">{{ item.title }}</span>
                <span class="item-price"
                  >R$ {{ item.price }} x {{ item.quantity }}</span
                >
                <div class="quantity-remove-buttons">
                  <button
                    @click="increaseQuantity(item.id)"
                    class="quantity-button"
                  >
                    +
                  </button>
                  <button
                    @click="decreaseQuantity(item.id)"
                    class="quantity-button-decress"
                  >
                    -
                  </button>
                  <button
                    @click="removeFromCart(item.id)"
                    class="remove-button"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <p v-if="validCartItems.length > 0" class="total">
        Total: R$ {{ cartTotal.toFixed(2) }}
      </p>
      <p v-else>Seu carrinho está vazio ou contém produtos inválidos.</p>
      <NuxtLink to="/" class="continue-shopping">Continuar Comprando</NuxtLink>
      <div v-if="cartNotification.show" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <p>{{ cartNotification.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    cartItems() {
      return this.$store.getters.cartItems;
    },
    validCartItems() {
      return this.cartItems.filter(
        (item) => item.id && item.title && item.price
      );
    },
    cartTotal() {
      return this.validCartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    cartNotification() {
      return this.$store.state.cartNotification;
    },
  },
  methods: {
    removeFromCart(productId) {
      this.$store.commit("removeFromCart", productId);
    },
    increaseQuantity(productId) {
      this.$store.commit("increaseQuantity", productId);
    },
    decreaseQuantity(productId) {
      this.$store.commit("decreaseQuantity", productId);
    },
  },
};
</script>

<style scoped>
.product-info {
  display: flex;
  align-items: center;
}

.product-image {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}

.cart-box {
  background-color: #f2f2f2;
  padding: 10px;
  margin: 100px;
  max-height: 500px;
  overflow-y: auto;
}

.cart-box-items {
  list-style-type: none;
  padding: 0;
}

.cart-box-item {
  background-color: #f2f2f2;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.item-divider {
  border-bottom: 1px solid #ccc;
}

.checkout-container {
  font-family: Arial, sans-serif;
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

body {
  font-family: "Bebas Neue", sans-serif;
}

h1 {
  color: #333;
}

.total {
  margin-top: 20px;
}

.remove-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-button:hover {
  background-color: #da190b;
}

.quantity-remove-buttons {
  display: flex;
  align-items: center;
}

.quantity-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-right: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.quantity-button:hover {
  background-color: #45a049;
}

.quantity-button-decress {
  background-color: #ffce00;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-right: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.quantity-button-decress:hover {
  background-color: #ffce00;
}

.continue-shopping {
  margin: 10px 0 10px 0;
  background-color: #ffce00;
  color: black;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: center;
  text-decoration: none;
}

.continue-shopping:hover {
  background-color: #ffce00;
  text-decoration: none;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .product-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .product-image {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .item-details {
    margin-right: 0;
  }

  .quantity-remove-buttons {
    flex-direction: column;
    align-items: flex-start;
  }

  .quantity-button,
  .quantity-button-decress,
  .remove-button {
    margin-top: 5px;
  }
}
</style>
