<template>
  <div>
    <h1>Produtos</h1>
    <ul>
      <li v-for="product in products" :key="product.id">
        <h2>{{ product.title }}</h2>
        <p>Preço: ${{ product.price }}</p>
        <button @click="addToCart(product.id)">Adicionar ao Carrinho</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { mapMutations } from 'vuex'; 

export default {
  methods: {
    ...mapActions(['addToCart']), // Mapeia a ação addToCart se estiver usando Vuex actions
    ...mapMutations(['ADD_TO_CART']), // Mapeia a mutação ADD_TO_CART se estiver usando Vuex mutations
    async addToCart(productId) {
      // Chama a ação do Vuex para adicionar o produto ao carrinho
      await this.addToCart(productId);
      console.log('Produto adicionado ao carrinho:', productId);
    }
  }
}
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 20px;
}

h1 {
  color: #333;
}

a {
  margin-left: 10px;
  text-decoration: none;
  color: blue;
}

a:hover {
  text-decoration: underline;
}
</style>
