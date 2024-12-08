<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Nav from "./Nav.vue";
import ClientesData from "/public/usuarios.json";
import IconStrella from "./icons/IconStrella.vue";
import IconFlecha from "@/components/icons/IconFlecha.vue";

const route = useRoute();
const router = useRouter();
const clientesId = Number(route.params.id);

const irAtras = () => {
  router.back();
};

const cliente = ref(ClientesData.find((cliente) => cliente.id === clientesId));
</script>

<template>
  <section>
    <Nav></Nav>
    <button @click="irAtras" class="btn_back z-3">
        <IconFlecha />
      </button>
      <div v-if="cliente" class="cont_id_cliente">

            <div class="cont_img_degradado">
                <img :src="cliente.foto" :alt="'Foto de ' + cliente.nombre + ' ' + cliente.apellido">
            </div>
        <h2 class="mt-3">Informacion del Cliente</h2>
        <ul class="cont_ul mt-3">
            <li><IconStrella /><strong> Nombre: </strong>{{ cliente.nombre }}</li>
            <li><IconStrella /><strong> Apellido: </strong>{{ cliente.apellido }}</li>
            <li><IconStrella /><strong> Email: </strong>{{ cliente.email }}</li>
            <li><IconStrella /><strong> Ultima compra: </strong>{{ cliente.ultimaCompra }}</li>
        </ul>

    </div>
  </section>
</template>
