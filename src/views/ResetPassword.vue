<template>
  <v-container>
    <v-card width="400" class="elevation-12 mx-auto">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Change Password</v-toolbar-title>
      </v-toolbar>

      <v-card-text align="center">
        <v-form v-model="valid">
          <v-text-field
            v-model="password"
            dense
            outlined
            label="New Password"
            :type="show1 ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show1 = !show1"
            :rules="rules1"
          ></v-text-field>

          <v-text-field
            v-model="password_confirmation"
            dense
            outlined
            label="Password Confirmation"
            :type="show2 ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show2 = !show2"
            :rules="rules2"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn block color="primary" :disabled="!valid" @click="doChange">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "reset-passsword",
  data: () => ({
    valid: true,
    password: "",
    show1: false,
    rules1: [
      (v) => !!v || "field is required",
      (v) => v.length >= 8 || "Password minimal 8 karakter",
    ],
    password_confirmation: "",
    show2: false,
    min: 8,
    loading: false,
  }),
  computed: {
    rules2() {
      const rules = [];

      if (this.min) {
        const rule = (v) =>
          (v || "").length >= this.min ||
          `Password minimal ${this.min} karakter`;

        rules.push(rule);
      }

      if (this.password) {
        const rule = (v) => (!!v && v) === this.password || "Password tidak sama";

        rules.push(rule);
      }

      return rules;
    },
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    async doChange() {
      this.loading = true

      await this.axios
        .post("/auth/v1/reset-password", {
          token: this.$route.query.token,
          email: this.$route.query.email,
          password: this.password,
          password_confirmation: this.password_confirmation,
        }).then((response) => {
          let { data } = response;
          this.setAlert({
            status: true,
            color: "success",
            text: data.status,
          });
          this.loading = false
          this.$router.push("/login")
        }).catch((error) => {
          let responses = error.response.data;
          this.setAlert({
            status: true,
            color: "error",
            text: responses.email,
          });
          this.loading = false;
        });
    },
  },
  beforeRouteLeave(to, from, next) {
    next(false);
  },
};
</script>

<style>
</style>