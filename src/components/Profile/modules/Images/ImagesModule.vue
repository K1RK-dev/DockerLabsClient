<template>
  <v-card class="docker-images-container">
    <v-card-title class="headline">
      Docker Images
      <v-btn v-if="isAdminOrTeacher" color="primary" @click="openCreateDialog">
        <v-icon left>mdi-plus</v-icon>
        Добавить Image
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-alert v-if="hasError" type="error" dismissible>
        {{ errorMessage }}
      </v-alert>

      <v-progress-linear v-if="isLoading" indeterminate color="primary"></v-progress-linear>

      <v-expansion-panels v-if="!isLoading">
        <v-expansion-panel v-for="image in images" :key="image.id">
          <v-expansion-panel-title>
            {{ image.name }}
            <v-spacer></v-spacer>
            <v-btn v-if="isAdminOrTeacher" icon small class="mr-2" @click.stop="openEditDialog(image)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn v-if="isAdminOrTeacher" icon small class="mr-2" @click.stop="deleteImage(image.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <Image :image="image" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>

    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title class="headline">
          {{ editingImage ? 'Редактировать' : 'Добавить' }} Docker Image
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="imageForm.name" label="Название"></v-text-field>
          <v-text-field v-model="imageForm.image_id" label="Image ID"></v-text-field>

          <v-radio-group v-model="dockerfileSource" @change="resetDockerfile">
            <v-radio label="Выбрать из списка" value="select"></v-radio>
            <v-radio label="Загрузить Dockerfile" value="upload"></v-radio>
            <v-radio label="Написать Dockerfile" value="write"></v-radio>
          </v-radio-group>

          <v-select
            v-if="dockerfileSource === 'select'"
            v-model="imageForm.dockerfileId"
            :items="dockerfiles"
            item-text="name"
            item-value="id"
            label="Выберите Dockerfile"
          ></v-select>

          <v-file-input
            v-if="dockerfileSource === 'upload'"
            label="Dockerfile"
            accept=".txt, .Dockerfile"
            @change="handleFileUpload"
          ></v-file-input>

          <v-textarea
            v-if="dockerfileSource === 'write'"
            v-model="imageForm.dockerfileContent"
            label="Содержимое Dockerfile"
            rows="10"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-grey" text @click="closeDialog">Отмена</v-btn>
          <v-btn color="primary" @click="saveImage">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-card>
</template>

<script>
import { useStore } from 'vuex';
import { computed, onMounted, ref } from 'vue';
import Image from './Image.vue';

export default {
  components: {
    Image,
  },
  setup() {
    const store = useStore();
    const dialog = ref(false);
    const editingImage = ref(null);
    const imageForm = ref({
      id: null,
      name: '',
      image_id: '',
      dockerfileId: null,
      dockerfileContent: '',
    });
    const dockerfileSource = ref('write'); // Default to writing Dockerfile
    const selectedFile = ref(null);
    const snackbar = ref({
      show: false,
      text: '',
      color: '',
    });
    const dockerfiles = computed(() => store.getters['dockerfiles/allDockerfiles']);

    onMounted(() => {
      fetchImages();
      fetchDockerfiles();
    });

    const fetchImages = async () => {
      try {
        await store.dispatch('docker/getImages');
      } catch (error) {
        showSnackbar('Не удалось получить images', 'error');
      }
    };

    const fetchDockerfiles = async () => {
      try {
        await store.dispatch('dockerfiles/getDockerfiles');
      } catch (error) {
        showSnackbar('Не удалось получить dockerfiles', 'error');
      }
    };

    const images = computed(() => store.getters['docker/allImages']);
    const isLoading = computed(() => store.getters['docker/isLoading']);
    const hasError = computed(() => store.getters['docker/hasError']);
    const errorMessage = computed(() => store.getters['docker/errorMessage']);
    const userRole = computed(() => store.getters['auth/userRole']);

    const isAdminOrTeacher = computed(() => {
      return userRole.value === 'ADMIN' || userRole.value === 'TEACHER';
    });

    const openCreateDialog = () => {
      editingImage.value = null;
      resetForm();
      dialog.value = true;
    };

    const openEditDialog = (image) => {
      editingImage.value = image;
      imageForm.value = { ...image };
      if (image.dockerfileId) {
        dockerfileSource.value = 'select';
      } else if (image.dockerfileContent) {
        dockerfileSource.value = 'write';
      } else {
        dockerfileSource.value = 'upload';
      }
      dialog.value = true;
    };

    const closeDialog = () => {
      dialog.value = false;
    };

    const resetForm = () => {
      imageForm.value = {
        id: null,
        name: '',
        image_id: '',
        dockerfileId: null,
        dockerfileContent: '',
      };
      dockerfileSource.value = 'write';
      selectedFile.value = null;
    };

    const resetDockerfile = () => {
      imageForm.value.dockerfileId = null;
      imageForm.value.dockerfileContent = '';
      selectedFile.value = null;
    };

    const handleFileUpload = (file) => {
      selectedFile.value = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        imageForm.value.dockerfileContent = e.target.result;
      };
      reader.readAsText(file);
    };

    const saveImage = async () => {
      try {
        const payload = {
          ...imageForm.value,
          dockerfileContent: imageForm.value.dockerfileContent,
        };

        if (editingImage.value) {
          await store.dispatch('docker/updateImage', payload);
          showSnackbar('Image успешно обновлен', 'success');
        } else {
          await store.dispatch('docker/createImage', payload);
          showSnackbar('Image успешно создан', 'success');
        }
        closeDialog();
        fetchImages(); // Refresh images after saving
      } catch (error) {
        showSnackbar('Не удалось сохранить image', 'error');
      }
    };

    const deleteImage = async (imageId) => {
      if (confirm('Вы уверены, что хотите удалить этот Docker image?')) {
        try {
          await store.dispatch('docker/deleteImage', imageId);
          showSnackbar('Image успешно удален', 'success');
          fetchImages(); // Refresh images after deletion
        } catch (error) {
          showSnackbar('Не удалось удалить image', 'error');
        }
      }
    };

    const showSnackbar = (text, color) => {
      snackbar.value = { show: true, text: text, color: color };
    };

    return {
      dialog,
      editingImage,
      imageForm,
      images,
      isLoading,
      hasError,
      errorMessage,
      isAdminOrTeacher,
      openCreateDialog,
      openEditDialog,
      closeDialog,
      saveImage,
      deleteImage,
      snackbar,
      dockerfileSource,
      handleFileUpload,
      resetDockerfile,
      dockerfiles,
    };
  },
};
</script>

<style scoped>
.docker-images-container {
  padding: 20px;
}

.headline {
  font-size: 24px;
  margin-bottom: 20px;
}
</style>