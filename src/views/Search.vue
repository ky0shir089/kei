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
        <h2>Filter</h2>

        <v-row>
          <v-col cols="6" sm="3">
            <v-select
              v-model="search.category_id"
              label="Kategori"
              outlined
              dense
              hide-details
              :items="categories"
              item-text="webinar_category"
              item-value="id"
              @change="doSearch"
              clearable
            ></v-select>
          </v-col>

          <v-col cols="6" sm="3">
            <v-select
              v-model="search.webinar_class"
              label="kelas"
              outlined
              dense
              hide-details
              :items="kelas"
              @change="doSearch"
              clearable
            ></v-select>
          </v-col>

          <v-col cols="6" sm="3">
            <v-select
              v-model="search.level_id"
              label="Level"
              outlined
              dense
              hide-details
              :items="levels"
              item-text="webinar_level"
              item-value="id"
              @change="doSearch"
              clearable
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6" sm="3" v-for="item in webinars" :key="item.id">
            <v-card rounded>
              <v-img :src="getImage(item.webinar_banner)" height="200" contain></v-img>

              <v-container fluid>
                <div class="text-subtitle-2">{{ item.webinar_name }}</div>

                <div class="text-caption" v-if="item.webinar_class == 'SESI'">
                  <v-icon small>mdi-calendar</v-icon>
                  {{ moment(item.webinar_start_date).format("DD MMM YYYY") }},
                  {{ moment(item.webinar_start_time, "HH:mm:ss").format("HH:mm") }} -
                  {{ moment(item.webinar_end_time, "HH:mm:ss").format("HH:mm") }} WIB |
                  <v-icon small>mdi-account</v-icon>
                  Kuota:
                  {{ item.webinar_quota - item.peserta }}
                </div>

                <div class="text-caption" v-else>
                  <v-icon small>mdi-calendar</v-icon>
                  {{ moment(item.webinar_start_date).format("MMMM") }}
                  |
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

                <v-list three-line v-if="item.mentor_id != null">
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
                <v-btn
                  color="blue"
                  dark
                  block
                  @click="workshop(item)"
                  v-if="item.webinar_class == 'SESI'"
                >Rincian Materi</v-btn>
                <v-btn color="blue" dark block @click="rincian(item)" v-else>Rincian Materi</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <br />

        <v-pagination v-model="page" @input="doSearch" :length="lengthPage" :total-visible="5"></v-pagination>
      </v-container>
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
            {{ moment(selected.webinar_start_time, "HH:mm:ss").format("HH:mm") }} -
            {{ moment(selected.webinar_end_time, "HH:mm:ss").format("HH:mm") }} WIB
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "search",
  // components: {
  //   AppBar: () =>
  //     import(/* webpackChunkName: "app-bar" */ "@/components/AppBar.vue"),
  // },
  data: () => ({
    webinars: [],
    categories: [],
    kelas: ["SESI", "PAKET"],
    levels: [],
    search: {
      category_id: "",
      webinar_class: "",
      level_id: "",
    },
    dialog: false,
    selected: [],
    sessions: [],
    page: 0,
    lengthPage: 0,
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
    async getWebinar() {
      await this.axios
        .get("/home/v1/list-tema", {
          params: {
            webinar_class: this.$route.query.class,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.webinars = data.data;
          this.page = data.current_page;
          this.lengthPage = data.last_page;
        });
    },
    async getCategory() {
      await this.axios.get("/home/v1/webinar_category").then((response) => {
        let { data } = response.data;
        this.categories = data;
      });
    },
    async getLevel() {
      await this.axios.get("/home/v1/webinar_level").then((response) => {
        let { data } = response.data;
        this.levels = data;
      });
    },
    async doSearch() {
      await this.axios
        .get("/home/v1/list-tema?page=" + this.page, {
          params: {
            category_id: this.search.category_id,
            webinar_class: this.search.webinar_class,
            level_id: this.search.level_id,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.webinars = data.data;
          this.page = data.current_page;
          this.lengthPage = data.last_page;
        });
    },
    async rincian(item) {
      this.selected = item;
      if (this.selected.webinar_session != null) {
        await this.checkWebinar();
      }
      this.dialog = true;
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
    workshop(item) {
      let kelas = item.webinar_class.toLowerCase()
      let id = item.webinar_name.toLowerCase().replaceAll(" ", "-") + '-' + item.id
      this.$router.push("/workshop/" + kelas + "/" + id)
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
    await this.getWebinar();
    await this.getCategory();
    await this.getLevel();
    this.search.webinar_class = this.$route.query.class;
  },
};
</script>

<style></style>
