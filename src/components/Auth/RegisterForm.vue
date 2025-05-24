<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Registration</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field v-model="username" label="Username" required></v-text-field>
            <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
            <v-text-field v-model="lastname" label="Last name" required></v-text-field>
            <v-text-field v-model="firstname" label="First name" required></v-text-field>
            <v-text-field v-model="middlename" label="Middle name" required></v-text-field>
            <v-select
              v-model="selectedGroup"
              :items="groups"
              item-title="name"
              item-value="id"
              return-object
              label="Select Group"
              required
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="register">Submit</v-btn>
            <v-btn color="primary" @click="goToLogin">Back to login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useStore } from 'vuex';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const username = ref('');
    const password = ref('');
    const firstname = ref('');
    const lastname = ref('');
    const middlename = ref('');
    const groups = ref([]);
    const selectedGroup = ref(null);

    const loadGroups = async () => {
      try {
        const response = await store.dispatch('groups/getGroups');
        groups.value = response.groups;
        groups.value.forEach(group => {
          console.log(group.name)
        });
      } catch (error) {
        console.error('Loading groups failed', error);
      }
    };

    const register = async () => {
      try {
        await store.dispatch('auth/register', {
          username: username.value,
          password: password.value,
          group: selectedGroup.value,
          firstname: firstname.value,
          lastname: lastname.value,
          middlename: middlename.value
        });
        router.push('/login');
      } catch (error) {
        console.error('Registration failed', error);
      }
    };

    const goToLogin = () => {
      router.push('/login');
    };

    onMounted(() => {
      loadGroups();
    });

    return {
      username,
      password,
      firstname,
      lastname,
      middlename,
      groups,
      selectedGroup,
      register,
      goToLogin,
      loadGroups
    };
  }
};
</script>