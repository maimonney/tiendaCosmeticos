<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import IconFlecha from '@/components/icons/IconFlecha.vue';

const route = useRoute();
const router = useRouter();

const irAtras = () => {
  router.back();
};

const formulario = ref({
  pass: '',
});

const errores = ref({
  pass: '',
  autenticacion: '',
});

const usuarios = ref([]);
const usuarioActual = ref(null);

const cargarUsuarios = async () => {
  try {
    const response = await fetch('/usuarios.json');

    usuarios.value = await response.json();
    console.log('Usuarios cargados:', usuarios.value);

    const usuarioId = String(route.params.id);
    console.log('ID:', usuarioId);

    usuarioActual.value = usuarios.value.find(usuario => String(usuario.id) === usuarioId);
    console.log('Usuario:', usuarioActual.value);

  } catch (error) {
    console.error('Error al cargar el JSON:', error);
  }
};

cargarUsuarios();

const validarPass = () => {
  errores.value.pass = formulario.value.pass.trim() ? '' : '*La contraseña es obligatoria.';
};

const enviarFormulario = async () => {
  validarPass();

  if (!errores.value.pass) {
    if (usuarioActual.value && usuarioActual.value.pass === formulario.value.pass) {
      router.push('/opciones');
    } else {
      errores.value.autenticacion = '*Contraseña incorrecta';
    }
  }
};

</script>

<template>
  <section class="contenedor">
    <button @click="irAtras" class="btn_back z-3">
      <IconFlecha />
    </button>
    <form
      @submit.prevent="enviarFormulario"
      class="d-flex flex-column align-items-center"
    >
      <img :src="usuarioActual.foto" :alt="'Foto de ' + usuarioActual.nombre + ' ' + usuarioActual.apellido" class="circulo_img clientes">
      <h2 class="mt-3">¡Gracias por ingresar {{usuarioActual.nombre}}!</h2>

      <div class="d-flex flex-column align-items-center">
        <label for="pass">Contraseña:</label>
        <input
          type="password"
          id="pass"
          v-model.trim="formulario.pass"
          class="input_text"
          @input="validarPass"
        />
        <div v-if="errores.pass" class="error">{{ errores.pass }}</div>
      </div>

      <button type="submit" class="btn_enviar">Ingresar</button>
      <div v-if="errores.autenticacion" class="error">
        {{ errores.autenticacion }}
      </div>
      <img src="/img_productos/logo_rarebeuty_rosa_50.png" alt="logo" />
    </form>
  </section>
</template>
