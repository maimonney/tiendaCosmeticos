<script setup>
import { ref, watch } from 'vue';
import Nav from '../components/Nav.vue';
import { useRouter } from 'vue-router';
import ClientesData from "/public/usuarios.json";
import IconFlecha from '@/components/icons/IconFlecha.vue';
import IconLupa from '@/components/icons/IconLupa.vue';

const router = useRouter();
const clientesData = ref([]);
const datosCargados = ref(false);

const cargarUsuarios = async () => {
  if (datosCargados.value) return; 

  try {
    const response = await fetch("/usuarios.json");
    clientesData.value = await response.json();
    datosCargados.value = true;
  } catch (error) {
    console.error("Error al cargar el JSON:", error);
  }
};

const irAtras = () => {
  router.back();
};

const nombreCliente = ref('');
const resultadosBusqueda = ref(null);

const buscarCliente = async () => {
  await cargarUsuarios();

  if (!nombreCliente.value.trim()) {
    resultadosBusqueda.value = null;
    return;
  }

  const clientesEncontrados = clientesData.value.filter(cliente =>
    cliente.nombre.toLowerCase().includes(nombreCliente.value.toLowerCase()) ||
    cliente.apellido.toLowerCase().includes(nombreCliente.value.toLowerCase())
  );

  resultadosBusqueda.value = clientesEncontrados.length > 0 ? clientesEncontrados : [];
};

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

watch(nombreCliente, async () => {
  await buscarCliente();
});
</script>


<template>
  <Nav></Nav>
  <section class="contenedor contenedor_views">
    <div class="d-flex">
      <button @click="irAtras" class="btn_back z-3">
        <IconFlecha />
      </button>
      <h2 class="ms-3">Clientes</h2>
    </div>

    <div class="mb-4">
      <form @submit.prevent="buscarCliente" class="mb-3">
        <div class="form_busqueda">
          <label for="nombreCliente">Buscar por nombre:</label>
          <input 
            type="text" 
            id="nombreCliente" 
            v-model="nombreCliente" 
            placeholder="Buscar por nombre de cliente" 
            class="input_text"
          />
          <button type="submit" class="buscar_lupa">
          <IconLupa class="lupa"></IconLupa>
        </button>
        </div>
        
      </form>
      
      <div class="cliente_cont_res">
            <div v-if="resultadosBusqueda !== null">
                <div v-for="cliente in resultadosBusqueda" :key="cliente.id">
                <RouterLink :to="`/cliente/${cliente.id}`" class="link-container">
                    <p v-html="resaltarTexto(cliente.nombre + ' ' + cliente.apellido, nombreCliente)"></p>
                    <hr>
                </RouterLink>
                </div>
            </div>
        </div>
    </div>

    <h2 class="ms-3">Listado de clientes</h2>
    <div class="cliente_cont">
    <div v-for="cliente in ClientesData">
      <RouterLink :to="`/cliente/${cliente.id}`" class="link-container">
        <img :src="cliente.foto" :alt="'Foto de ' + cliente.nombre" class="circulo_img clientes">
        <p><strong>{{ cliente.nombre }}</strong></p>
      </RouterLink>
    </div>
</div>
  </section>
</template>