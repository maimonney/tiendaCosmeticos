<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const formulario = ref({
  email: '',
});

const errores = ref({
  email: '',
  autenticacion: '',
});

const usuarios = ref([]);

const cargarUsuarios = async () => {
  try {
    const response = await fetch('/usuarios.json');
    usuarios.value = await response.json();
  } catch (error) {
    console.error('Error al cargar el JSON:', error);
  }
};

const validarCredenciales = async (email) => {
  if (usuarios.value.length === 0) {
    await cargarUsuarios();
  }
  return usuarios.value.find((usuario) => usuario.email === email);
};

const validarEmail = () => {
  errores.value.email = formulario.value.email.trim() ? '' : '*El correo electrónico es obligatorio.';
};

const enviarFormulario = async () => {
  validarEmail();

  if (!errores.value.email) {
    const usuario = await validarCredenciales(formulario.value.email);
    if (usuario) {
      router.push(`/pass/${usuario.id}`);
    } else {
      errores.value.autenticacion = '*Email no registrado';
    }
  }
};
</script>

<template>
  <section class="contenedor">
    <form
      @submit.prevent="enviarFormulario"
      class="d-flex flex-column align-items-center"
    >
      <img src="/img_usuario/sel_rare.jpg" alt="Imagen de fundadora" class="circulo_img img_fundadora" />
      <h2 class="mt-3">¡Bienvenid@!</h2>

      <div class="d-flex flex-column align-items-center">
        <label for="email">Correo electrónico:</label>
        <input
          type="email"
          id="email"
          v-model.trim="formulario.email"
          class="input_text"
          @input="validarEmail"
        />
        <div v-if="errores.email" class="error">{{ errores.email }}</div>
      </div>

      <button type="submit" class="btn_enviar">Siguiente</button>
      <div v-if="errores.autenticacion" class="error">
        {{ errores.autenticacion }}
      </div>
      <img src="/img_productos/logo_rarebeuty_rosa_50.png" alt="logo" />
    </form>
  </section>
</template>
