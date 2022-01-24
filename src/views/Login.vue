<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.replace('/')">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <div style="max-width: 1240px; margin: 0 auto !important">
      <v-container fluid fill-height class="mt-10">
        <v-card width="540" flat align="center" class="mx-auto">
          <router-link to="/">
            <v-img :src="'/img/kei_logo.png'" height="128" width="128" contain></v-img>
          </router-link>

          <div class="text-h3 font-weight-black">Selamat Datang Sob</div>

          <div
            class="text-subtitle-1 font-weight-black my-2"
          >Silahkan masukan email dan kata sandi Sobat</div>

          <v-form v-model="valid">
            <v-text-field
              v-model="email"
              label="Email"
              outlined
              prepend-inner-icon="mdi-email"
              :rules="[rules.required, rules.email]"
              class="mx-7"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              outlined
              prepend-inner-icon="mdi-lock"
              :type="show ? 'text' : 'password'"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required]"
              @click:append="show = !show"
              class="mx-7"
            ></v-text-field>
          </v-form>

          <vue-recaptcha
            sitekey="6Le-p_scAAAAAOJ_BV18JAeYqt2cn_hUFC67vg1Y"
            :loadRecaptchaScript="true"
            @verify="onVerify"
            @expired="onExpired"
          ></vue-recaptcha>

          <br />

          <v-btn
            width="380"
            color="blue"
            class="white--text"
            :loading="loading"
            :disabled="!siteverify"
            @click="login"
          >Masuk</v-btn>

          <div class="d-flex justify-space-around my-2">
            <div>
              Belum punya akun?
              <router-link to="/register" class="blue--text">Daftar</router-link>
            </div>

            <div>
              <router-link to="/forgot-password" class="blue--text">Lupa kata sandi?</router-link>
            </div>
          </div>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import VueRecaptcha from "vue-recaptcha";

export default {
  name: "login",
  components: { VueRecaptcha },
  data: () => ({
    email: "",
    password: "",
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
    secret: "6Le-p_scAAAAAI1WAxNJS9yr81w9Syzq9Kk73fRF",
    siteverify: false,
    response: "",
    url: ""
  }),
  computed: {
    ...mapGetters({
      guest: "auth/guest",
      prevUrl: 'prevUrl',
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
    }),
    async getUser() {
      await this.axios
        .get("/auth/v1/user", {
          params: {
            id: this.url[6]
          },
        }).then((response) => {
          let { data } = response.data;
          this.user = data;
          this.verify()
        })
    },
    async verify() {
      await this.axios
        .get("/auth/v1/email/verify/" + this.url[6] + "/" + this.url[7] + "&signature=" + this.$route.query.signature, {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        }).then((response) => {
          let { data } = response;
          this.setAlert({
            status: true,
            color: "success",
            text: data.message,
          });
        })
    },
    onVerify(response) {
      this.siteverify = true;
      this.response = response;
    },
    onExpired() {
      this.siteverify = false;
      this.response = "";
    },
    async login() {
      this.loading = true;

      await this.axios
        .post("/auth/v1/login", {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          let { data } = response.data;
          this.setAuth(data);
          this.setAlert({
            status: true,
            color: "success",
            text: "Selamat Datang " + data.name,
          });

          if (data.chpass == "YES") {
            this.$router.push("/change-password");
          } else {
            location.href = "/dashboard";
          }
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
  },
  created() {
    if (Object.keys(this.$route.query).length > 0) {
      this.url = this.$route.query.email_verify_url.split("/")
      this.getUser()
    }

    if (!this.guest) {
      this.$router.push("/");
    }
  }
}
</script>

<style>
a:link {
  text-decoration: none;
}
</style>