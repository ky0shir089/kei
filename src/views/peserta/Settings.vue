<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container fluid>
      <h2 class="mb-2 ml-2">Settings</h2>

      <v-row>
        <v-col cols="12" sm="10" order-sm="1" order="2">
          <v-row v-if="selected == 0">
            <v-col cols="12" sm="4">
              <v-card rounded="lg">
                <v-img src="/img/profile.png" contain v-if="user.avatar == null"></v-img>

                <v-img :src="getImage(user.avatar)" alt="Avatar" contain v-else></v-img>

                <v-file-input
                  id="fileid"
                  label="File input"
                  v-model="form.avatar"
                  accept="image/*"
                  outlined
                  dense
                  class="d-none"
                  @change="saveData"
                ></v-file-input>

                <v-btn id="buttonid" block small @click="uploadAvatar">Pilih Foto</v-btn>
              </v-card>
            </v-col>

            <v-col cols="12" sm="8">
              <v-row>
                <v-col cols="12">
                  <v-card rounded="lg">
                    <v-container fluid>
                      <div class="teal--text">Nama Akun</div>
                      <div class="d-flex align-center justify-space-between" v-if="!ubahNama">
                        <div>{{ user.name }}</div>

                        <v-btn
                          text
                          @click="ubahNama = true"
                          color="#008693"
                          style="text-transform: none"
                          :loading="loading"
                        >Ubah</v-btn>
                      </div>

                      <v-text-field
                        v-model="form.name"
                        outlined
                        dense
                        append-icon="mdi-content-save"
                        append-outer-icon="mdi-close"
                        @click:append-outer="ubahNama = false"
                        @click:append="saveData"
                        :rules="[rules.required]"
                        v-else
                      ></v-text-field>
                    </v-container>
                  </v-card>
                </v-col>

                <v-col cols="12">
                  <v-card rounded="lg">
                    <v-container fluid>
                      <div class="teal--text">Nomor Handphone</div>
                      <div class="d-flex align-center justify-space-between" v-if="!ubahNomor">
                        <div>{{ user.phone }}</div>

                        <v-btn
                          text
                          @click="ubahNomor = true"
                          color="#008693"
                          style="text-transform: none"
                          :loading="loading"
                        >Ubah</v-btn>
                      </div>

                      <v-text-field
                        v-model="form.phone"
                        outlined
                        dense
                        append-icon="mdi-content-save"
                        append-outer-icon="mdi-close"
                        @click:append-outer="ubahNomor = false"
                        @click:append="saveData"
                        :rules="[rules.required, rules.phone]"
                        v-else
                      ></v-text-field>
                    </v-container>
                  </v-card>
                </v-col>

                <v-col cols="12">
                  <v-card rounded="lg">
                    <v-container fluid>
                      <div class="teal--text mb-2">Ganti Password</div>

                      <v-form v-model="valid">
                        <v-text-field
                          v-model="old"
                          outlined
                          dense
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
                          dense
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
                          dense
                          label="Password Confirmation"
                          :type="show3 ? 'text' : 'password'"
                          prepend-icon="mdi-lock"
                          :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="show3 = !show3"
                          :rules="rules2"
                        ></v-text-field>
                      </v-form>
                    </v-container>

                    <v-card-actions>
                      <v-btn
                        block
                        color="primary"
                        :disabled="!valid"
                        @click="saveData"
                      >Change Password</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <profile v-if="selected == 1" />
        </v-col>

        <v-col cols="12" sm="2" order-sm="2" order="1">
          <v-list>
            <v-list-item-group v-model="selected" color="blue">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <b>Account</b>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <b>Profile</b>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "settings",
  components: {
    Profile: () =>
      import(/* webpackChunkName: "profile" */ "@/components/Profile.vue"),
  },
  data: () => ({
    photo: null,
    form: {
      name: "",
      phone: "",
      avatar: "",
    },
    rules: {
      required: (value) => !!value || "This field is required.",
      phone: value => value.length >= 10 && value.length <= 13 || "Nomor Handphone wajib diisi (Min 10, Max 13)",
    },
    ubahNama: false,
    ubahNomor: false,
    valid: true,
    old: "",
    show1: false,
    new1: "",
    show2: false,
    new2: "",
    show3: false,
    min: 8,
    rules1: [
      (v) => !!v || "field is required",
      (v) => v.length >= 8 || "Password minimal 8 karakter",
    ],
    loading: false,
    selected: "",
  }),
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

      if (this.form.new1) {
        const rule = (v) => (!!v && v) === this.form.new1 || "Password tidak sama";

        rules.push(rule);
      }

      return rules;
    },
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
    }),
    uploadAvatar() {
      document.getElementById('fileid').click()
    },
    async saveData() {
      this.loading = true;

      let formData = new FormData();
      formData.set("id", this.user.id);
      formData.set("name", this.form.name.toUpperCase());
      formData.set("phone", this.form.phone);
      if (this.form.avatar != null) {
        formData.set("avatar", this.form.avatar);
      }
      formData.set("old", this.old);
      formData.set("password", this.new2);

      await this.axios
        .post("/auth/v1/update-account", formData)
        .then((response) => {
          let { data } = response;
          this.setAlert({
            status: true,
            color: "success",
            text: data.message,
          });
          this.loading = false;
          this.ubahNama = false
          this.ubahNomor = false
          this.setAuth(data.data)
        })
    },
  },
  async created() {
    this.form = {
      name: this.user.name,
      phone: this.user.phone
    }
  }
}
</script>

<style>
</style>