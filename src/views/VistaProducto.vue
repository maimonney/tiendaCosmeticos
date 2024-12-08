<script setup>
import { ref, computed, watch } from 'vue';
import Nav from '../components/Nav.vue';
import { useRouter } from 'vue-router';
import IconFlecha from '@/components/icons/IconFlecha.vue';
import IconFiltro from '@/components/icons/IconFiltro.vue';
import IconLupa from '@/components/icons/IconLupa.vue';

const router = useRouter();
const irAtras = () => {
  router.push('/opciones');
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

const cargarProductos = async () => {
  if (datosCargados.value) return;

  try {
    const productosLocalStorage = localStorage.getItem('productos');
    
    if (productosLocalStorage) {
      productosData.value = JSON.parse(productosLocalStorage);
    } else {
      const response = await fetch("/productos.json");
      const productos = await response.json();
      
      localStorage.setItem('productos', JSON.stringify(productos));
      productosData.value = productos;
    }

    datosCargados.value = true;
    console.log("Productos cargados:", productosData.value); 
  } catch (error) {
    console.error("Error al cargar el JSON:", error);
  }
};

const productosData = ref([]);
const datosCargados = ref(false);
const nombreProducto = ref('');
const resultadosBusqueda = ref([]);

//BUSCADOR
const buscarProducto = async () => {
  await cargarProductos(); 

  if (!nombreProducto.value.trim()) {
    resultadosBusqueda.value = [];
    return;
  }

  console.log("Buscando productos con nombre:", nombreProducto.value);

  const productosEncontrados = productosData.value.filter(producto =>
    producto.nombre.toLowerCase().includes(nombreProducto.value.toLowerCase())
  );

  resultadosBusqueda.value = productosEncontrados;
};

watch(nombreProducto, async () => {
  await buscarProducto();
});

const resaltarTexto = (texto, terminoIngresado) => {
  if (!terminoIngresado.trim()) return texto;

  const textoMinuscula = texto.toLowerCase();
  const terminoMinuscula = terminoIngresado.toLowerCase();
  const partes = textoMinuscula.split(terminoMinuscula);

  if (partes.length === 1) return texto;

  let resultado = partes.map((parte, index) => {
    if (index === partes.length - 1) {
      return parte;
    }
    return `${parte}<span class="resaltado">${texto.substr(textoMinuscula.indexOf(terminoMinuscula, textoMinuscula.indexOf(parte) + parte.length), terminoIngresado.length)}</span>`;
  }).join('');

  return resultado;
};

//FILTROS
const precioSeleccionado = ref(null);
const stockSeleccionado = ref(null);

const rangoPrecio = {
  '5000-10000': [5000, 10000],
  '10000-15000': [10000, 15000],
  '15000-20000': [15000, 20000],
  '20000-25000': [20000, 25000],
  '25000': [25000, Infinity]
};

const ordenAlfabertico = ref('A-Z');

const seleccionarPrecio = (rango) => {
  precioSeleccionado.value = rangoPrecio[rango] || null;
};

const seleccionarOrden = (alfabetico) => {
  ordenAlfabertico.value = alfabetico;
};

const seleccionarStock = (stock) => {
  stockSeleccionado.value = stock;
};

const productosFiltrados = computed(() => {
  cargarProductos();
  let productos = productosData.value.slice(); 

  //PRECIO
  if (precioSeleccionado.value) {
    const [min, max] = precioSeleccionado.value;
    productos = productos.filter(producto => producto.precio >= min && producto.precio <= max);
  }

  //STOCK
  if (stockSeleccionado.value) {
    if (stockSeleccionado.value === 'disponible') {
      productos = productos.filter(producto => producto.stock >= 15);
    } else if (stockSeleccionado.value === 'ultimos') {
      productos = productos.filter(producto => producto.stock > 0 && producto.stock < 15);
    } else if (stockSeleccionado.value === 'agotado') {
      productos = productos.filter(producto => producto.stock <= 0);
    }
  }

  //ALFABETICO
  if (ordenAlfabertico.value === 'A-Z') {
    productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else if (ordenAlfabertico.value === 'Z-A') {
    productos.sort((a, b) => b.nombre.localeCompare(a.nombre));
  }

  console.log("Productos filtrados:", productos);
  return productos;
});

const eliminarFiltro = () => {
  precioSeleccionado.value = null;
  ordenAlfabertico.value = 'A-Z';
  stockSeleccionado.value = null;
};
</script>

<template>
  <Nav></Nav>
  <section class="contenedor contenedor_views">
    <div class="d-flex">
      <button @click="irAtras" class="btn_back z-3">
        <IconFlecha />
      </button>
      <h2 class="ms-3">Productos</h2>

      <!-- FILTROS -->
      <div>
        <button type="button" class="btn_filtro" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
          <IconFiltro />
        </button>

        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
              <div class="modal-header">
                <h2 class="modal-title fs-5" id="staticBackdropLabel">Filtro</h2>
                <button type="button" class="btn-close-custom" data-bs-dismiss="modal" aria-label="Close">
                  <IconFiltro />
                </button>
              </div>
              <div class="modal-body">

                <div class="precio_filtro mt-3">
                  <h3>Precio</h3>
                  <select @change="e => seleccionarPrecio(e.target.value)" class="form_select">
                    <option value="">Seleccionar precio</option>
                    <option value="5000-10000">$5.000 - $10.000</option>
                    <option value="10000-15000">$10.000 - $15.000</option>
                    <option value="15000-20000">$15.000 - $20.000</option>
                    <option value="20000-25000">$20.000 - $25.000</option>
                    <option value="25000">Más de $25.000</option>
                  </select>
                </div>

                <div class="alfabetico_filtro mt-3">
                  <h3>Alfabético</h3>
                  <select @change="e => seleccionarOrden(e.target.value)" class="form_select">
                    <option value="A-Z">A-Z</option>
                    <option value="Z-A">Z-A</option>
                  </select>
                </div>

                <div class="stock_filtro mt-3">
                  <h3>Stock</h3>
                  <select @change="e => seleccionarStock(e.target.value)" class="form_select">
                    <option value="">Seleccionar estado</option>
                    <option value="disponible">Disponible</option>
                    <option value="ultimos">Últimos artículos</option>
                    <option value="agotado">Agotados</option>
                  </select>
                </div>

                <button @click="eliminarFiltro" class="btn_enviar btn_filtro_eliminar">Eliminar Filtro</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BUSCADOR -->
    <div class="mb-4">
      <form @submit.prevent="buscarProducto" class="mb-3">
        <div class="form_busqueda">
          <label for="nombreProducto">Buscar por nombre:</label>
          <input 
            type="text" 
            id="nombreProducto" 
            v-model="nombreProducto" 
            placeholder="Buscar productos" 
            class="input_text"
          />
          <button type="submit" class="buscar_lupa">
            <IconLupa class="lupa"> </IconLupa>
          </button>
        </div>
      </form>
      
      <div class="cliente_cont_res">
        <div v-if="resultadosBusqueda.length">
          <div v-for="producto in resultadosBusqueda" :key="producto.id">
            <RouterLink :to="`/producto/${producto.id}`" class="link-container">
              <p v-html="resaltarTexto(producto.nombre, nombreProducto)"></p>
              <hr>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div v-if="productosFiltrados.length > 0" class="producto_cont">
      <div v-for="producto in productosFiltrados" :key="producto.id">
        <RouterLink :to="`/producto/${producto.id}`" class="link-container">
          <img :src="producto.foto" :alt="'Foto de ' + producto.nombre" class="rectangulo_img productos">
          <div class="info_prod">
            <p><strong>{{ producto.nombre }}</strong></p>
            <p>${{ producto.precio }}</p>
          </div>
          <p :class="disponible(producto.stock)">Stock: {{ producto.stock }}</p>
        </RouterLink>
      </div>
    </div>

    <div v-else>
      <p>No se encontraron productos.</p>
    </div>
  </section>
</template>
