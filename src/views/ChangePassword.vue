<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card width="400" class="elevation-12 mx-auto">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Change Password</v-toolbar-title>
          </v-toolbar>

          <v-card-text align="center">
            <v-form v-model="valid">
              <v-text-field
                v-model="old"
                outlined
                label="Old Password"
                :type="show1 ? 'text' : 'password'"
                prepend-icon="mdi-lock"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show1 = !show1"
                :rules="rules1"
              ></v-text-field>

              <v-text-field
                v-model="new1"
                outlined
                label="New Password"
                :type="show2 ? 'text' : 'password'"
                prepend-icon="mdi-lock"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show2 = !show2"
                :rules="rules1"
              ></v-text-field>

              <v-text-field
                v-model="new2"
                outlined
                label="Password Confirmation"
                :type="show3 ? 'text' : 'password'"
                prepend-icon="mdi-lock"
                :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show3 = !show3"
                :rules="rules2"
              ></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-btn block color="primary" :disabled="!valid" @click="doChange">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "change-passsword",
  data: () => ({
    valid: true,
    old: "",
    show1: false,
    rules1: [
      (v) => !!v || "field is required",
      (v) => v.length >= 8 || "Password minimal 8 karakter",
    ],
    new1: "",
    show2: false,
    new2: "",
    show3: false,
    min: 8,
    loading: false,
  }),
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
    }),
    async doChange() {
      this.loading = true

      await this.axios
        .post("/auth/v1/change-password", {
          id: this.user.id,
          old: this.old,
          password: this.new2,
        }).then(() => {
          this.loading = false
          this.login()
        }).catch((error) => {
          let responses = error.response.data;
          this.setAlert({
            status: true,
            color: "error",
            text: responses.message,
          });
          this.loading = false;
        });
    },
    async login() {
      await this.axios
        .post("/auth/v1/login", {
          email: this.user.email,
          password: this.new2,
        })
        .then((response) => {
          let { data } = response.data;
          this.setAuth(data);
          this.setAlert({
            status: true,
            color: "success",
            text: "Selamat Datang " + data.name,
          });
          location.href = "/dashboard";
        })
    },
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
    rules2() {
      const rules = [];

      if (this.min) {
        const rule = (v) =>
          (v || "").length >= this.min ||
          `Password minimal ${this.min} karakter`;

        rules.push(rule);
      }

      if (this.new1) {
        const rule = (v) => (!!v && v) === this.new1 || "Password tidak sama";

        rules.push(rule);
      }

      return rules;
    },
  },
  beforeRouteLeave(to, from, next) {
    next(false);
  },
};
</script>