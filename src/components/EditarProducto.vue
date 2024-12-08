<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Nav from "./Nav.vue";
import ProductosData from "/public/productos.json";
import IconFlecha from "@/components/icons/IconFlecha.vue";

const route = useRoute();
const router = useRouter();
const productoId = Number(route.params.id);

const irAtras = () => {
  router.back();
};

const producto = ref(
  ProductosData.find((producto) => producto.id === productoId)
);

const formulario = ref({
  nombre: "",
  precio: "",
  stock: "",
});

const errores = ref({
  nombre: "",
  precio: "",
  stock: "",
});

const validarNombre = () => {
  actualizarContador();

  const nombre = formulario.value.nombre.trim();

  if (!nombre) {
    errores.value.nombre = "*Introduzca un nombre de producto.";
  } else if (nombre.length > 100) {
    errores.value.nombre = "*No puede colocar más de 100 caracteres.";
  } else if (nombre.length < 10) {
    errores.value.nombre = "*No puede colocar menos de 10 caracteres.";
  } else if (!/^[a-zA-Z0-9\s,:-]+$/.test(nombre)) {
    errores.value.nombre = "*Solo puede contener letras y números.";
  } else {
    errores.value.nombre = "";
  }
};

const contadorCaracteres = ref(formulario.value.nombre.length);

const actualizarContador = () => {
  contadorCaracteres.value = 100 - formulario.value.nombre.length;
};


const validarPrecio = () => {
  const precio = formulario.value.precio;

  if (!precio) {
    errores.value.precio = "*Introduzca un precio.";
  } else if (isNaN(precio)) {
    errores.value.precio = "*El precio debe ser un número.";
  } else if (Number(precio) <= 0) {
    errores.value.precio = "*El precio debe ser mayor a 0.";
  } else {
    errores.value.precio = "";
  }
};

const validarStock = () => {
  const stock = formulario.value.stock;

  if (!stock) {
    errores.value.stock = "*Introduzca la cantidad de stock.";
  } else if (isNaN(stock)) {
    errores.value.stock = "*El stock debe ser un número.";
  } else if (Number(stock) < 0) {
    errores.value.stock = "*El stock no puede ser negativo.";
  } else if (parseInt(stock, 10) != stock) {
  errores.value.stock = "*El stock debe ser un número entero.";
}else {
    errores.value.stock = "";
  }
};

const actualizarDatos = () => {
  const productosLocal = JSON.parse(localStorage.getItem('productos')) || [];
  const producto_X_Id = productosLocal.findIndex(p => p.id === productoId);

  if (producto_X_Id !== -1) {

    const productoOriginal = productosLocal[producto_X_Id];

    productosLocal[producto_X_Id] = {
      id: productoId,
      nombre: formulario.value.nombre,
      foto: productoOriginal.foto,
      descripcion: productoOriginal.descripcion, 
      precio: formulario.value.precio,
      stock: formulario.value.stock
    };
    localStorage.setItem('productos', JSON.stringify(productosLocal));
    router.push(`/producto/${productoId}`);
  } else {
    console.error('Producto no encontrado');
  }
};

const enviarFormulario = async () => {
  validarNombre();
  validarPrecio();
  validarStock();

  if (!errores.value.nombre && !errores.value.precio && !errores.value.stock) {
    producto.value.nombre = formulario.value.nombre;
    producto.value.precio = formulario.value.precio;
    producto.value.stock = formulario.value.stock;

    actualizarDatos();
    router.push(`/producto/${producto.value.id}`);
  }
};

const inicializarFormulario = () => {
  formulario.value.nombre = producto.value.nombre;
  formulario.value.precio = producto.value.precio;
  formulario.value.stock = producto.value.stock;
};

inicializarFormulario();
</script>

<template>
  <section class="contenedor_views">
    <Nav></Nav>
    <button @click="irAtras" class="btn_back z-3">
      <IconFlecha />
    </button>
    <div v-if="producto" class="cont_id_producto">
      <h2 class="mt-4">Vas a editar:</h2>
      <h3>{{ producto.nombre }}</h3>
      <div>
        <form
          @submit.prevent="enviarFormulario"
          class="d-flex flex-column align-items-center justify-content-center"
        >
          <div
            class="d-flex flex-column align-items-center justify-content-center"
          >
            <label for="nombre">Modificar título:</label>
            <input
              type="text"
              id="nombre"
              v-model.trim="formulario.nombre"
              class="input_text"
              @input="validarNombre"
            />
            <p class="error">{{ errores.nombre }}</p>
            <p>Caracteres disponibles: {{contadorCaracteres}}</p>
          </div>

          <div
            class="d-flex flex-column align-items-center justify-content-center"
          >
            <label for="precio">Modificar precio:</label>
            <input
              type="text"
              id="precio"
              v-model.trim="formulario.precio"
              class="input_text"
              @input="validarPrecio"
            />
            <p class="error">{{ errores.precio }}</p>
          </div>

          <div
            class="d-flex flex-column align-items-center justify-content-center"
          >
            <label for="stock">Modificar stock:</label>
            <input
              type="number"
              id="stock"
              v-model.trim="formulario.stock"
              class="input_text"
              @input="validarStock"
            />
            <p class="error">{{ errores.stock }}</p>
          </div>

          <button type="submit" class="btn_enviar">Modificar</button>
        </form>

      </div>
    </div>

  </section>
</template>
