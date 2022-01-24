<template>
  <v-container fluid>
    <v-carousel cycle show-arrows hide-delimiter-background height="400">
      <v-carousel-item
        v-for="item in banners"
        :key="item.id"
        :src="getImage(item.banner_img)"
        reverse-transition="fade-transition"
        transition="fade-transition"
        :to="'/banner/' + item.banner_name.toLowerCase()"
        max-width="1920"
        max-height="400"
        align="center"
        contain
      ></v-carousel-item>
    </v-carousel>

    <br />

    <div style="max-width: 1240px; margin: 0 auto !important">
      <div class="d-flex align-center justify-space-between">
        <h2>WEBINAR PAKET</h2>
        <router-link to="/search?class=PAKET">
          Lihat Semua
          <v-icon>mdi-chevron-right</v-icon>
        </router-link>
      </div>

      <br />

      <v-row v-if="webinarPaket.length > 0">
        <v-col cols="6" sm="3" v-for="item in webinarPaket.slice(0, 4)" :key="item.id">
          <v-card rounded>
            <v-img :src="getImage(item.webinar_banner)" height="200" contain></v-img>

            <v-container fluid>
              <div class="text-subtitle-2">{{ item.webinar_name }}</div>

              <div class="text-caption">
                <v-icon small>mdi-calendar</v-icon>
                {{ moment(item.webinar_start_date).format("MMMM") }} |
                <v-icon small>mdi-account</v-icon>
                Kuota:
                {{ item.webinar_quota - item.peserta }}
              </div>

              <v-divider class="my-2"></v-divider>

              <div class="text-right">Rp {{ item.webinar_price.toLocaleString("id-ID") }}</div>
            </v-container>

            <v-card-actions>
              <v-btn color="blue" dark block @click="rincian(item)">Rincian Materi</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <div v-else>
        <h3>Tidak ada paket</h3>
      </div>

      <hr class="my-4" />

      <div class="d-flex align-center justify-space-between">
        <h2>WEBINAR SESI</h2>
        <router-link to="/search?class=SESI">
          Lihat Semua
          <v-icon>mdi-chevron-right</v-icon>
        </router-link>
      </div>

      <br />

      <v-row v-if="webinarSesi.length > 0">
        <v-col cols="6" sm="3" v-for="item in webinarSesi.slice(0, 4)" :key="item.id">
          <v-card rounded>
            <v-img :src="getImage(item.webinar_banner)" height="200" contain></v-img>

            <v-container fluid>
              <div class="text-subtitle-2">{{ item.webinar_name }}</div>

              <div class="text-caption">
                <v-icon small>mdi-calendar</v-icon>
                {{ moment(item.webinar_start_date).format("DD MMM YYYY") }},
                {{ moment(item.webinar_start_time, "HH:mm:ss").format("HH:mm") }}
                -
                {{ moment(item.webinar_end_time, "HH:mm:ss").format("HH:mm") }}
                WIB |
                <v-icon small>mdi-account</v-icon>
                Kuota:
                {{ item.webinar_quota - item.peserta }}
              </div>

              <div>
                <v-chip x-small color="primary">{{ item.webinar_class }}</v-chip>

                <v-chip x-small color="secondary" class="mx-1">{{ item.webinar_category }}</v-chip>

                <v-chip
                  x-small
                  color="tertiary"
                  class="white--text"
                  v-if="item.webinar_level != null"
                >{{ item.webinar_level }}</v-chip>
              </div>

              <v-list three-line>
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img :src="getImage(item.mentor_avatar)" v-if="item.mentor_avatar != null"></v-img>
                    <v-icon large v-else>mdi-account-circle</v-icon>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.mentor_name }}</v-list-item-title>

                    <v-list-item-subtitle>{{ item.mentor_title }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-divider class="my-2"></v-divider>

              <div class="text-right">Rp {{ item.webinar_price.toLocaleString("id-ID") }}</div>
            </v-container>

            <v-card-actions>
              <v-btn color="blue" dark block @click="workshop(item)">Rincian Materi</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <div v-else>
        <h3>Tidak ada sesi</h3>
      </div>

      <hr class="my-4" />

      <h2>WEBINAR SPESIAL</h2>

      <v-card width="300">
        <v-container fluid>
          <v-form v-model="valid">
            <v-text-field
              v-model="webinar_code"
              label="Kode Unik"
              outlined
              dense
              hide-details
              :rules="[rules.required]"
            ></v-text-field>
          </v-form>
        </v-container>

        <v-card-actions>
          <v-btn color="primary" block @click="getSpecial" :disabled="!valid">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <v-dialog v-model="dialog" persistent width="400">
      <v-card>
        <v-toolbar flat color="primary" dark>
          <v-toolbar-title>Webinar</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-img :src="getImage(selected.webinar_banner)" height="200" contain></v-img>

        <v-container fluid>
          <div class="text-h6">{{ selected.webinar_name }}</div>

          <div class="text-caption">
            <v-icon small>mdi-calendar</v-icon>
            {{ moment(selected.webinar_start_date).format("DD MMM YYYY") }},
            {{ moment(selected.webinar_start_time, "HH:mm:ss").format("HH:mm") }}
            -
            {{ moment(selected.webinar_end_time, "HH:mm:ss").format("HH:mm") }}
            WIB
          </div>

          <div class="text-caption">
            <v-icon small>mdi-account</v-icon>
            Kuota:
            {{ selected.webinar_quota - selected.peserta }}
          </div>

          <br />

          <div v-if="selected.webinar_class == 'SESI'">
            <div class="text-h6">List Materi:</div>

            <div v-html="selected.webinar_detail"></div>
          </div>

          <div v-else>
            <div class="text-h6">List Paket:</div>

            <ul>
              <li v-for="item in sessions" :key="item.id">{{ item.webinar_name }}</li>
            </ul>
          </div>

          <div>
            <v-chip x-small color="primary">{{ selected.webinar_class }}</v-chip>

            <v-chip x-small color="secondary" class="mx-1">{{ selected.webinar_category }}</v-chip>

            <v-chip
              x-small
              color="tertiary"
              class="white--text"
              v-if="selected.webinar_level != null"
            >{{ selected.webinar_level }}</v-chip>
          </div>

          <br />

          <div v-if="selected.mentor_id != null">
            <div class="text-h6">Mentor:</div>

            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <v-img :src="getImage(selected.mentor_avatar)"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ selected.mentor_name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ selected.mentor_title }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>

          <div class="d-flex justify-space-between">
            <div class="text-h6">Harga:</div>

            <div v-if="dialog">Rp {{ selected.webinar_price.toLocaleString("id-ID") }}</div>
          </div>

          <v-card-actions>
            <v-btn color="blue" dark block @click="addKeranjang(selected)">
              <v-icon left>mdi-plus</v-icon>Keranjang
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "home",
  data: () => ({
    banners: [],
    webinarPaket: [],
    webinarSesi: [],
    paket: [],
    sesi: [],
    dialog: false,
    selected: [],
    sessions: [],
    validate: [],
    webinar_code: "",
    valid: true,
    webinarSpecial: [],
    rules: {
      required: (value) => !!value || "This field is required.",
    },
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
      guest: "auth/guest",
      carts: "cart/carts",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      addCart: "cart/add",
    }),
    async getBanner() {
      await this.axios
        .get("/home/v1/banner", {
          params: {
            banner_status: "ACTIVE",
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.banners = data;
        });
    },
    async getWebinarPaket() {
      await this.axios
        .get("/home/v1/list-tema", {
          params: {
            webinar_class: "PAKET",
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.webinarPaket = data.data;
        });
    },
    async getWebinarSesi() {
      await this.axios
        .get("/home/v1/list-tema", {
          params: {
            webinar_class: "SESI",
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.webinarSesi = data.data;
        });
    },
    async rincian(item) {
      this.selected = item;
      if (this.selected.webinar_session != null) {
        await this.checkWebinar();
      }
      this.dialog = true;
    },
    workshop(item) {
      let kelas = item.webinar_class.toLowerCase()
      let id = item.webinar_name.toLowerCase().replaceAll(" ","-") + '-' + item.id
      this.$router.push("/workshop/" + kelas + "/" + id)
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.selected = [];
        this.sessions = [];
      }, 300);
    },
    async checkWebinar() {
      let formData = new FormData();
      formData.set("webinar_id", this.selected.webinar_session);

      await this.axios.post("/home/v1/check-paket", formData).then((response) => {
        let { data } = response.data;
        this.sessions = data;
      });
    },
    async getSpecial() {
      await this.axios
        .get("/home/v1/list-tema", {
          params: {
            webinar_code: this.webinar_code,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.webinarSpecial = data.data;
          if (this.webinarSpecial.length > 0) {
            this.workshop(this.webinarSpecial[0])
          } else {
            this.setAlert({
              status: true,
              color: "error",
              text: "Tidak ada data.",
            });
          }
        });
    },
    addKeranjang(item) {
      if (this.guest) {
        this.setAlert({
          status: true,
          color: "error",
          text: "Silahkan login terlebih dahulu",
        });
        this.$router.push("/login");
      } else {
        let check = this.carts.filter((x) => {
          return item.id == x.id;
        });

        if (check.length > 0) {
          this.setAlert({
            status: true,
            color: "error",
            text: "Item telah terdaftar di keranjang anda",
          });
        } else {
          this.addCart(item);
          this.setAlert({
            status: true,
            color: "success",
            text: "Item telah berhasil ditambahkan ke keranjang",
          });
        }
        this.close();
      }
    },
  },
  async created() {
    await this.getBanner()
    await this.getWebinarPaket();
    await this.getWebinarSesi();
  },
};
</script>

<style>
a:link {
  text-decoration: none;
}
</style>
