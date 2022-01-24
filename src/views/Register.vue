<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.replace('/')">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <div style="max-width: 1240px; margin: 0 auto !important">
      <router-link to="/">
        <v-img :src="'/img/kei_logo.png'" height="128" width="128" contain></v-img>
      </router-link>

      <v-container fluid fill-height>
        <v-card width="440" flat align="center" class="mx-auto">
          <div class="text-h3 font-weight-black">Pendaftaran</div>

          <div class="text-subtitle-2 my-2">Silahkan buat akun Komunitas Excel Indonesia Sobat</div>

          <br />

          <v-form v-model="valid">
            <v-text-field
              v-model="form.email"
              outlined
              placeholder="Email"
              prepend-inner-icon="mdi-email"
              :rules="[rules.required, rules.email]"
            ></v-text-field>

            <v-text-field
              v-model="form.name"
              outlined
              placeholder="Nama Lengkap"
              prepend-inner-icon="mdi-account"
              :rules="[rules.required]"
            ></v-text-field>

            <v-text-field
              v-model="form.phone"
              outlined
              placeholder="Nomor Whatsapp"
              prepend-inner-icon="mdi-phone"
              v-mask="mask"
              :rules="[rules.required, rules.phone]"
            ></v-text-field>

            <v-text-field
              v-model="form.password"
              outlined
              placeholder="Password"
              :type="show1 ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show1 = !show1"
              :rules="[rules.required, rules.password]"
            ></v-text-field>

            <v-text-field
              v-model="form.repassword"
              outlined
              placeholder="Konfirmasi Password"
              :type="show2 ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show2 = !show2"
              :rules="repasswordRule"
            ></v-text-field>
          </v-form>

          <v-btn
            block
            color="teal"
            class="white--text"
            :disabled="!valid"
            :loading="loading"
            @click="register"
          >Daftar</v-btn>

          <br />

          <p>
            Sudah memiliki Akun?
            <router-link to="/login">Masuk</router-link>
          </p>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mask } from "vue-the-mask";

export default {
  name: "register",
  directives: { mask },
  data: () => ({
    form: {
      phone: "",
      password: "",
    },
    rules: {
      required: value => !!value || 'This field is required.',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
      },
      phone: value => value.length >= 10 && value.length <= 13 || "Nomor Handphone wajib diisi (Min 10, Max 13)",
      password: value => value.length >= 8 || "Password minimal 8 karakter",
    },
    mask: "#############",
    min: 8,
    show1: false,
    show2: false,
    valid: true,
    loading: false,
  }),
  computed: {
    repasswordRule() {
      const rules = [];

      if (this.min) {
        const rule = (v) => (v || "").length >= 8 || `Password minimal ${this.min} karakter`;

        rules.push(rule);
      }

      if (this.form.password) {
        const rule = (v) => v === this.form.password || "Password tidak sama";

        rules.push(rule);
      }

      return rules;
    },
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    async register() {
      this.loading = true;

      let formData = new FormData();
      formData.set("name", this.form.name.toUpperCase());
      formData.set("email", this.form.email);
      formData.set("phone", this.form.phone);
      formData.set("password", this.form.repassword);

      await this.axios
        .post("/auth/v1/register", formData)
        .then((response) => {
          let { data } = response;
          this.setAlert({
            status: true,
            color: "success",
            text: data.message,
          });
          this.sendVerificationEmail(response.data.data.api_token)
          this.loading = false;
          this.$router.push("/verification")
        })
        .catch((error) => {
          let responses = error.response.data;
          this.setAlert({
            status: true,
            color: "error",
            text: responses.message,
          });
          this.loading = false;
        });
    },
    async sendVerificationEmail(token) {
      await this.axios
        .get("/auth/v1/email/verify", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
    },
  }
}
</script>

<style>
</style>