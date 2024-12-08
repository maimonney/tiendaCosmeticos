//botonees
<script setup>
import Nav from "./Nav.vue";
</script>

<template>
  <Nav></Nav>

  <section class="contenedor d-flex flex-column align-items-center">
    <div class="mb-4">
      <RouterLink to="/clientes" class="link-container">
        <img src="/public/img_productos/ilustracion_cliente.png" alt="Ilustracion cliente" />
        <h2>Clientes</h2>
      </RouterLink>
    </div>

    <div>
      <RouterLink to="/productos" class="link-container">
        <img src="/public/img_productos/ilustracion_caja.png" alt="Ilustracion Productos" />
        <h2>Productos</h2>
      </RouterLink>
    </div>
  </section>
</template>
