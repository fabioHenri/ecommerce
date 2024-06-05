// store/index.js

import axios from 'axios';

export const state = () => ({
  products: [],
  cart: [],
  cartNotification: {
    show: false,
    message: ''
  }
});

export const mutations = {
  // Adicionar produtos ao estado
  setProducts(state, products) {
    state.products = products;
  },
  // Adicionar um produto ao carrinho
  addToCart(state, { productId, quantity }) {
    // Verifica se o produto já está no carrinho
    const existingProductIndex = state.cart.findIndex(item => item.productId === productId);
    if (existingProductIndex !== -1) {
      // Se o produto já estiver no carrinho, atualiza a quantidade
      state.cart[existingProductIndex].quantity += quantity;
    } else {
      // Caso contrário, adiciona um novo item ao carrinho
      state.cart.push({ productId, quantity });
    }
  },
  // Exibir notificação de produto adicionado ao carrinho
  showCartNotification(state, message) {
    state.cartNotification.message = message;
    state.cartNotification.show = true;
    // Fecha o modal de notificação após 3 segundos
    setTimeout(() => {
      state.cartNotification.show = false;
    }, 3000);
  },
  // Remover um produto do carrinho
  removeFromCart(state, productId) {
    state.cart = state.cart.filter(item => item.productId !== productId);
  },
  // Aumentar a quantidade de um produto no carrinho
  increaseQuantity(state, productId) {
    const item = state.cart.find(item => item.productId === productId);
    if (item) {
      item.quantity++;
    }
  },
  // Diminuir a quantidade de um produto no carrinho
  decreaseQuantity(state, productId) {
    const item = state.cart.find(item => item.productId === productId);
    if (item && item.quantity > 1) {
      item.quantity--;
    }
  }
};

export const actions = {
  // Buscar produtos da Fake Store API
  async fetchProducts({ commit }) {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      commit('setProducts', response.data);
    } catch (error) {
      console.error('Erro ao buscar os produtos:', error);
    }
  },
  // Adicionar produto ao carrinho e exibir notificação
  addToCart({ commit, state }, { productId, quantity }) {
    const product = state.products.find(prod => prod.id === productId);
    if (product) {
      commit('addToCart', { productId, quantity });
      commit('showCartNotification', `${quantity}x ${product.title} foi adicionado ao carrinho.`);
    }
  }
};

export const getters = {
  // Calcular o total do carrinho
  cartTotal(state, getters) {
    const cartItems = getters.cartItems;
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  },
  // Obter os itens do carrinho
  cartItems(state) {
    return state.cart.map(item => {
      const product = state.products.find(product => product.id === item.productId);
      return {
        ...product,
        quantity: item.quantity
      };
    });
  }
};