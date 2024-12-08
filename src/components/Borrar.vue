<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Nav from './Nav.vue';
import ProductosData from '/public/productos.json';

const route = useRoute();
const router = useRouter();
const productoId = Number(route.params.id);

const producto = ref(ProductosData.find((producto) => producto.id === productoId));

const borrarProducto = () => {
  const productosLocal = JSON.parse(localStorage.getItem('productos')) || [];
  const productoIndex = productosLocal.findIndex(p => p.id === productoId);

  if (productoIndex !== -1) {
    productosLocal.splice(productoIndex, 1);
    localStorage.setItem('productos', JSON.stringify(productosLocal));
    router.push('/productos'); 
  } else {
    console.error('Producto no encontrado');
  }
};
</script>

<template>
    <section class="contenedor">
        <Nav></Nav>
      <div class="confirmacion_borrar">
        <h2>¿Estás seguro de que quieres eliminar este producto?</h2>
      <h3>{{ producto.nombre }}</h3>
      <div class="botones_confirmacion">
        <button @click="borrarProducto" type="submit" class="btn_borrar">Borrar producto</button>
        <RouterLink :to="`/producto/${producto.id}`" class="btn_enviar">Cancelar</RouterLink>
      </div>
      </div>
    </section>
  </template>
