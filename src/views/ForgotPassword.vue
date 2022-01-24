<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.replace('/')">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

     <div style="max-width: 1240px; margin: 0 auto !important">
      <v-container fluid fill-height class="mt-10">
        <v-card width="570" flat align="center" class="mx-auto">
          <router-link to="/">
            <v-img :src="'/img/kei_logo.png'" height="128" width="128" contain></v-img>
          </router-link>

          <div class="text-h3 font-weight-black">Atur ulang kata sandi</div>

          <div
            class="text-subtitle-1 font-weight-black my-2"
          >Masukkan e-mail yang terdaftar. Kami akan mengirimkan email untuk atur ulang kata sandi.</div>

          <v-form v-model="valid">
              <v-text-field
                v-model="email"
                label="Email"
                outlined
                dense
                prepend-inner-icon="mdi-email"
                :rules="[rules.required, rules.email]"
              ></v-text-field>
            </v-form>

            <v-btn
              block
              color="primary"
              :loading="loading"
              :disabled="!valid"
              @click="forgotPassword"
            >Submit</v-btn>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "forgot-password",
  data: () => ({
    email: "",
    show: false,
    valid: true,
    loading: false,
    rules: {
      required: value => !!value || 'This field is required.',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
      },
    },
  }),
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    async forgotPassword() {
      this.loading = true;

      let formData = new FormData();
      formData.set("email", this.email);

      await this.axios
        .post("/auth/v1/forgot-password", formData)
        .then((response) => {
          let { data } = response;
          this.setAlert({
            status: true,
            color: "success",
            text: data.status,
          });
          this.loading = false;
          location.href = "/"
        })
        .catch((error) => {
          let responses = error.response.data;
          this.setAlert({
            status: true,
            color: "error",
            text: responses.email,
          });
          this.loading = false;
        });
    },
  }
}
</script>

<style>
</style>