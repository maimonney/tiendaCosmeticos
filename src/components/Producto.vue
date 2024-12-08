<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Nav from './Nav.vue';
import ProductosData from '/public/productos.json';
import IconFlecha from '@/components/icons/IconFlecha.vue';

const route = useRoute();
const router = useRouter();
const productoId = Number(route.params.id);

const irAtras = () => {
  router.push('/productos');
};

const disponible = (stock) => {
  if (stock >= 15) {
    return 'stock_disponible';
  } else if (stock <= 0) {
    return 'stock_agotado';
  } else {
    return 'stock_ultimas';
  }
};

const producto = ref(ProductosData.find((producto) => producto.id === productoId));


</script>

<template>
  <section class="contenedor_views">
    <Nav></Nav>
    <button @click="irAtras" class="btn_back z-3">
        <IconFlecha />
      </button>
      <div v-if="producto" class="cont_id_producto">

            <div class="cont_img_degradado">
                <img :src="producto.foto" :alt="'Foto de ' + producto.nombre + ' ' + producto.apellido">
            </div>
        <div class="info_producto">
            <h2 class="mt-3">Informacion del producto</h2>
        <ul class="cont_ul mt-3">
            <li><strong>Nombre: </strong>{{ producto.nombre }}</li>
            <li><strong>Descripcion: </strong>{{ producto.descripcion }}</li>
            <li><strong>Precio: </strong>${{ producto.precio }}</li>
        </ul>
        <p :class="disponible(producto.stock)" style="width: 250px;"><strong>Stock: </strong>{{ producto.stock }}</p>
        <RouterLink :to="`/productoEdit/${producto.id}`" class="btn_enviar">Editar producto</RouterLink>
        <RouterLink :to="`/borrar/${producto.id}`" class="btn_enviar">Borrar producto</RouterLink>
        </div>
    </div>

  </section>
</template>
