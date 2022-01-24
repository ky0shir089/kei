<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <div style="max-width: 1240px; margin: 0 auto !important">
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="9">
            <v-card rounded>
              <v-container fluid>
                <v-img :src="getImage(webinars.webinar_banner)" height="250"></v-img>
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
              <v-card-title class="font-weight-bold">Benefit</v-card-title>

              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          <span>
                            <v-icon>mdi-check</v-icon>
                          </span>
                          E-Sertifikat Workshop Excel
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          <span>
                            <v-icon>mdi-check</v-icon>
                          </span>E-Sertifikat Point Workshop Excel
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          <span>
                            <v-icon>mdi-check</v-icon>
                          </span>Re - Broadcast Workshop Excel
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          <span>
                            <v-icon>mdi-check</v-icon>
                          </span>Giveaway
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          <span>
                            <v-icon>mdi-check</v-icon>
                          </span>
                          Data Materi Workshop {{ webinars.webinar_name }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>

              <v-card-title class="font-weight-bold">Perangkat</v-card-title>

              <v-container fluid>
                <ul>
                  <li>Menggunakan PC atau Laptop</li>
                  <li>Menggunakan software Microsoft Excel 2013</li>
                </ul>
              </v-container>

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
                <b>Jadwal Webinar</b>
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
                <b>This course includes:</b>

                <v-list dense>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <span>
                          <v-icon>mdi-check</v-icon>
                        </span>
                        2 jam pelatiahan online
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <span>
                          <v-icon>mdi-check</v-icon>
                        </span>
                        E-Modul
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <span>
                          <v-icon>mdi-check</v-icon>
                        </span>
                        Materi file yang sudah diajarkan mentor
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <span>
                          <v-icon>mdi-check</v-icon>
                        </span>
                        Full lifetime access record
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <span>
                          <v-icon>mdi-check</v-icon>
                        </span>
                        Access on mobile and PC
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-container>

              <v-card-actions>
                <v-btn color="blue" dark block @click="addKeranjang">
                  <v-icon left>mdi-plus</v-icon>Keranjang
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "rincian-sesi",
  data: () => ({
    id: "",
    webinars: [],
    page: 1,
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
        }
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
