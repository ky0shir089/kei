<template>
  <div>
    <!-- <app-bar v-if="$vuetify.breakpoint.smAndUp" /> -->

    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" class="mx-2" @click="dialog = true">
            <v-badge color="orange" :content="countCart" :value="countCart" overlap>
              <v-icon>mdi-cart</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span>Keranjang</span>
      </v-tooltip>
    </v-app-bar>

    <div style="max-width: 1240px; margin: 0 auto !important">
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="9">
            <v-card rounded>
              <v-container fluid>
                <v-img :src="getImage(webinars.webinar_banner)" height="400" contain></v-img>
              </v-container>

              <v-container fluid>
                <div class="text-h4 font-weight-bold">{{ webinars.webinar_name }}</div>

                <div>
                  <v-chip color="primary">{{ webinars.webinar_class }}</v-chip>

                  <v-chip color="secondary" class="mx-1">{{ webinars.webinar_category }}</v-chip>

                  <v-chip
                    color="tertiary"
                    class="white--text"
                    v-if="webinars.webinar_level != null"
                  >{{ webinars.webinar_level }}</v-chip>
                </div>

                <br />

                <div class="text-h5 font-weight-bold">Mentor</div>

                <div class="d-inline-flex flex-column" align="center">
                  <div>
                    <v-avatar size="100">
                      <v-img
                        :src="getImage(webinars.mentor_avatar)"
                        v-if="webinars.mentor_avatar != null"
                      ></v-img>
                      <v-icon x-large v-else>mdi-account-circle</v-icon>
                    </v-avatar>
                  </div>

                  <div class="font-weight-bold">{{ webinars.mentor_name }}</div>

                  <div>{{ webinars.mentor_title }}</div>
                </div>
              </v-container>
            </v-card>

            <br />

            <v-card rounded>
              <v-card-title class="font-weight-bold">Deskripsi</v-card-title>

              <v-container fluid>
                <div v-html="webinars.webinar_detail"></div>
              </v-container>
            </v-card>
          </v-col>

          <v-col cols="12" sm="3">
            <v-card>
              <v-card-title
                class="text-h5 teal--text font-weight-bold"
                v-if="Object.keys(webinars).length > 0"
              >Rp {{ webinars.webinar_price.toLocaleString("id-ID") }}</v-card-title>

              <hr class="mx-4" />

              <div class="mx-4 mt-2">
                <b>Jadwal Webina</b>r
              </div>

              <v-list>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ moment(webinars.webinar_start_date).format("DD MMM YYYY") }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ moment(webinars.webinar_start_time, "HH:mm:ss").format("HH:mm") }}
                      -
                      {{ moment(webinars.webinar_end_time, "HH:mm:ss").format("HH:mm") }}
                      WIB
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-container fluid>
                <b>Benefit:</b>

                <div v-html="webinars.webinar_benefit"></div>

                <v-btn color="#387947" dark block @click="addKeranjang">
                  <v-icon left>mdi-plus</v-icon>Keranjang
                </v-btn>

                <br />

                <v-btn outlined block @click="checkout">
                  <div class="green--text text--darken-2">Pesan Sekarang</div>
                </v-btn>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <v-dialog v-model="dialog" persistent width="400">
      <v-card v-if="countCart === 0">
        <v-toolbar flat color="primary" dark>
          <v-toolbar-title>Keranjang Belanja</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-container fluid>
          <v-alert outlined color="warning" icon="mdi-cart-off">Keranjang belanja kosong!</v-alert>
        </v-container>
      </v-card>

      <v-card v-else>
        <v-toolbar flat color="primary" dark>
          <v-toolbar-title>Keranjang Belanja</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list>
          <v-list-item v-for="item in carts" :key="item.id">
            <v-list-item-avatar size="80">
              <v-img :src="getImage(item.logo)"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>Rp {{ item.price.toLocaleString("id-ID") }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon @click.stop="removeCart(item)">
                <v-icon dark color="error">mdi-minus-circle</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <hr />

        <v-card-actions>
          Total Price: Rp {{ totalPrice.toLocaleString("id-ID") }}
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="checkout">
            <v-icon left>mdi-cart-arrow-right</v-icon>Checkout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "rincian",
  // components: {
  //   AppBar: () =>
  //     import(/* webpackChunkName: "app-bar" */ "@/components/AppBar.vue"),
  // },
  data: () => ({
    id: "",
    webinars: [],
    page: 1,
    lengthPage: 0,
    dialog: false,
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
      guest: "auth/guest",
      carts: "cart/carts",
      countCart: 'cart/count',
      totalPrice: 'cart/totalPrice',
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
            id: this.id,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.webinars = data.data[0];
          this.page = data.current_page;
          this.lengthPage = data.last_page;
        });
    },
    addKeranjang() {
      if (this.guest) {
        this.setAlert({
          status: true,
          color: "error",
          text: "Silahkan login terlebih dahulu",
        });
        this.$router.push("/login");
      } else {
        let check = this.carts.filter((x) => {
          return this.webinars.id == x.id;
        });

        if (check.length > 0) {
          this.setAlert({
            status: true,
            color: "error",
            text: "Item telah terdaftar di keranjang anda",
          });
        } else {
          this.addCart(this.webinars);
          this.setAlert({
            status: true,
            color: "success",
            text: "Item telah berhasil ditambahkan ke keranjang",
          });
        }
      }
    },
    checkout() {
      if (this.guest) {
        this.setAlert({
          status: true,
          color: "error",
          text: "Silahkan login terlebih dahulu",
        });
        this.$router.push("/login");
      } else {
        this.addKeranjang()
        this.$router.push("/checkout")
      }
    },
  },
  async created() {
    let search = this.$route.params.id.lastIndexOf("-")
    let id = this.$route.params.id.substr(search + 1)
    this.id = id

    await this.getWebinar()
  }
}
</script>

<style>
</style>
