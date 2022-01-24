<template>
  <div>
    <!-- <app-bar v-if="$vuetify.breakpoint.smAndUp" /> -->

    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <div style="max-width: 1240px; margin: 0 auto !important">
      <v-container fluid>
        <div class="text-h4 text-center">Summary</div>

        <br />

        <v-card v-for="item in carts" :key="item.id" class="my-4">
          <v-list>
            <v-list-item>
              <v-list-item-avatar size="80">
                <v-img :src="getImage(item.logo)"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>
                  [{{ item.category }}] {{ item.title }} ({{
                    item.type
                  }})
                </v-list-item-title>
                <v-list-item-subtitle>
                  <span
                    v-if="item.category_id != 'TEMATIK'"
                  >Level: {{ item.level }} | Kelas: {{ item.class }}</span>
                  <span v-if="item.mentor_id != null">| Mentor: {{ item.mentor }}</span>
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <span style="float: right">Rp {{ item.price.toLocaleString("id-ID") }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-expand-transition v-if="item.webinar_class == 'SESI'">
            <div>
              <hr />
              <div class="text-h6 mx-2">List Materi:</div>
              <v-card-text v-html="item.detail"></v-card-text>
            </div>
          </v-expand-transition>
        </v-card>

        <br />

        <v-card>
          <v-card-text>
            <div class="d-flex justify-space-between">
              <div>Total Price:</div>
              <div>Rp {{ totalPrice.toLocaleString("id-ID") }}</div>
            </div>
          </v-card-text>
        </v-card>

        <br />

        <v-btn block color="primary" :loading="loading" @click="go">Daftar</v-btn>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "checkout",
  // components: {
  //   AppBar: () =>
  //     import(/* webpackChunkName: "app-bar" */ "@/components/AppBar.vue"),
  // },
  data: () => ({
    loading: false,
    profiles: [],
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
      carts: "cart/carts",
      totalPrice: "cart/totalPrice",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setCart: "cart/set",
    }),
    async getProfile() {
      await this.axios
        .get("/peserta/v1/user-profile", {
          params: {
            user_id: this.user.id,
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.profiles = data;
        });
    },
    go() {
      if (this.profiles.length > 0) {
        this.daftar();
      } else {
        this.$router.push("/peserta/profile");
      }
    },
    async daftar() {
      let r = confirm("Apakah anda yakin mengikuti pelatihan berikut?");

      if (r) {
        this.loading = true;

        let formData = new FormData();
        formData.set("tema", JSON.stringify(this.carts));
        formData.set("user_id", this.user.id);

        await this.axios
          .post("/peserta/v1/daftar-webinar", formData, {
            headers: {
              Authorization: "Bearer " + this.user.api_token,
            },
          })
          .then((response) => {
            let { data } = response;
            this.setAlert({
              status: true,
              color: "success",
              text: data.message,
            });
            this.submit = true;
            this.setCart([]);
            this.loading = false;
            this.$router.push("/peserta/invoice/" + data.data.invoice.inv_id);
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
      }
    },
  },
  async created() {
    if (this.carts.length == 0) {
      this.$router.go(-1)
    }
    await this.getProfile();
  },
};
</script>

<style>
</style>