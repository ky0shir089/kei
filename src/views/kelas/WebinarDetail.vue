<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-card>
      <v-row>
        <v-col cols="12" sm="9">
          <v-img :src="getImage(webinar.webinar_banner)" height="250" contain></v-img>

          <v-card-title>
            {{ webinar.webinar_name }}
            <span class="mx-2">-</span>
            <span
              class="red--text"
              v-if="webinar.webinar_status == 'NOT READY'"
            >{{ webinar.webinar_status }}</span>
            <span
              class="green--text"
              v-if="webinar.webinar_status == 'READY'"
            >{{ webinar.webinar_status }}</span>
            <span v-if="webinar.webinar_status == 'DONE'">{{ webinar.webinar_status }}</span>
          </v-card-title>

          <v-container fluid>
            <v-row align="center">
              <v-col cols="12" sm="4">
                <v-card flat color="#F9F9F9">
                  <v-list-item class="pa-2">
                    <v-list-item-icon>
                      <v-icon color="green">mdi-currency-usd</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-subtitle>Harga</v-list-item-subtitle>
                      <v-list-item-title
                        v-if="webinar != ''"
                      >{{ webinar.webinar_price.toLocaleString("id-ID") }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>

              <v-col cols="12" sm="4">
                <v-card flat color="#F9F9F9">
                  <v-list-item class="pa-2">
                    <v-list-item-icon>
                      <v-icon color="green">mdi-calendar-month</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-subtitle>Tanggal</v-list-item-subtitle>
                      <v-list-item-title>{{ moment(webinar.webinar_start_date).format("dddd, DD MMM YYYY") }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>

              <v-col cols="12" sm="4">
                <v-card flat color="#F9F9F9">
                  <v-list-item>
                    <v-list-item-avatar size="64">
                      <v-img
                        :src="getImage(webinar.mentor_avatar)"
                        v-if="webinar.mentor_avatar != null"
                      ></v-img>
                      <v-icon large v-else>mdi-account-circle</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-subtitle>Mentor</v-list-item-subtitle>
                      <v-list-item-title>{{ webinar.mentor_name }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <v-row>
            <v-col cols="12" sm="6">
              <v-container fluid>
                <h3>Detail Kelas</h3>
                <div v-html="webinar.webinar_detail"></div>
              </v-container>
            </v-col>

            <v-col cols="12" sm="6">
              <v-container fluid>
                <h3>Link Zoom</h3>
                <a
                  :href="webinar.webinar_link"
                  v-if="webinar.webinar_link != null"
                >{{ webinar.webinar_link }}</a>
                <div class="red--text" v-else>Masih Kosong</div>

                <br />
                <br />

                <h3>File Modul</h3>
                <a
                  :href="getImage(webinar.webinar_module)"
                  v-if="webinar.webinar_module != null"
                >{{ webinar.webinar_module.replace("file_modul/" + $route.params.id + "/", "") }}</a>
                <div class="red--text" v-else>Masih Kosong</div>

                <br />
                <br />

                <h3>Link Materi</h3>
                <ul v-if="subjects != null">
                  <li v-for="(item, index) in subjects" :key="index">
                    <a
                      :href="getImage(item)"
                    >{{ item.replace("file_materi/" + $route.params.id + "/", "") }}</a>
                  </li>
                </ul>
                <div class="red--text" v-else>Masih Kosong</div>
              </v-container>
            </v-col>

            <v-col cols="12" sm="6">
              <v-container fluid>
                <h3>Benefit</h3>
                <div v-html="webinar.webinar_benefit"></div>
              </v-container>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-data-table :headers="headers" :items="peserta" class="elevation-1" dense>
            <template v-slot:top>
              <v-toolbar flat dense color="grey lighten-2">
                <v-btn color="primary" left @click="sendEmail">
                  <v-icon>mdi-email</v-icon>Send Email
                </v-btn>

                <div class="mx-2" v-if="webinar.webinar_pretest != null">
                  <v-btn
                    color="primary"
                    @click="pretest('OPEN')"
                    v-if="webinar.webinar_pretest == 'CLOSE'"
                  >MULAI POST TEST</v-btn>

                  <v-btn
                    color="primary"
                    @click="pretest('DONE')"
                    v-if="webinar.webinar_pretest == 'OPEN'"
                  >SELESAI POST TEST</v-btn>

                  <div v-if="webinar.webinar_pretest == 'DONE'">DONE</div>
                </div>
              </v-toolbar>
            </template>

            <template v-slot:item.action="{ item }">
              <v-btn icon @click="view(item)">
                <v-icon small>mdi-eye</v-icon>
              </v-btn>
            </template>

            <template v-slot:item.score_pretest="{ item }">{{ item.score_pretest * 10 }}</template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>

    <v-dialog v-model="dialog" width="400">
      <v-card>
        <v-card-title>Bukti Transfer</v-card-title>

        <v-container fluid>
          <v-img :src="getImage(image)"></v-img>
          <div
            class="my-2"
            v-if="dialog"
          >Nominal: Rp {{ select.invhdr_amount.toLocaleString("id-ID") }}</div>
        </v-container>

        <div v-if="select.invhdr_status == 'ON PROCESS'">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="reject = true" v-if="!reject">Reject</v-btn>
            <v-btn color="primary" :loading="loading" @click="invoice('APPROVE')">Approve</v-btn>
          </v-card-actions>

          <v-container fluid v-if="reject">
            <v-text-field v-model="reason" label="alasan" outlined dense></v-text-field>
            <v-btn color="error" :loading="loading" @click="invoice('REJECT')">Reject</v-btn>
          </v-container>
        </div>

        <v-container fluid v-if="select.invhdr_status == 'REJECT'">
          <h3>Alasan Reject</h3>
          <div>{{ select.reason }}</div>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "webinar-detail",
  data: () => ({
    webinar: [],
    subjects: [],
    headers: [
      { text: "Tanggal Pendaftaran", value: "invhdr_payment_date" },
      { text: "Email", value: "email" },
      { text: "Nama Peserta", value: "name" },
      { text: "Kategori", value: "webinar_class" },
      { text: "Tiket", value: "name" },
      { text: "Status", value: "invhdr_status" },
      { text: "Bukti Transfer", value: "action", sortable: false },
      { text: "Score Post-test", value: "score_pretest" },
    ],
    peserta: [],
    loading: false,
    dialog: false,
    image: null,
    select: [],
    reason: "",
    reject: false,
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    async getWebinar() {
      await this.axios
        .get("/setup-webinar/v1/jadwal-webinar", {
          params: {
            id: this.$route.params.id
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.webinar = data.data[0];
          this.subjects = JSON.parse(this.webinar.webinar_subject)
        })
    },
    async getPeserta() {
      await this.axios
        .get("/peserta/v1/peserta", {
          params: {
            webinar_id: this.$route.params.id
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.peserta = data;
        })
    },
    async pretest(val) {
      let r = confirm("Apakah anda yakin akan menyimpan data berikut?");

      if (r) {
        this.loading = true

        let formData = new FormData();
        formData.set("id", this.$route.params.id);
        formData.set("webinar_pretest", val);
        formData.set("updated_by", this.user.id);

        await this.axios
          .post("/setup-webinar/v1/pretest", formData, {
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
            this.getWebinar()
          })
      }
    },
    async sendEmail() {
      let r = confirm("Apakah anda yakin akan mengirim email?");

      if (r) {
        let formData = new FormData();
        formData.set("users", JSON.stringify(this.peserta));
        formData.set("data", JSON.stringify([
          {
            webinar_name: this.webinar.webinar_name,
            webinar_link: this.webinar.webinar_link,
            webinar_subject: this.webinar.webinar_subject,
            webinar_module: this.webinar.webinar_module,
          }
        ]));

        await this.axios
          .post("/setup-webinar/v1/send_email", formData, {
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
            this.loading = false
          })
      }
    },
    view(item) {
      if (item.invhdr_status == "NEW") {
        alert("Tidak ada bukti transfer")
      } else {
        this.image = item.bukti_transfer
        this.select = item
        this.dialog = true
      }
    },
    async invoice(status) {
      let r = confirm("Apakah anda yakin?");

      if (r) {
        this.loading = true

        let formData = new FormData();
        formData.set("id", this.select.inv_id);
        formData.set("invhdr_status", status);
        if (status == "REJECT") {
          formData.set("reason", this.reason.toUpperCase());
        }
        formData.set("updated_by", this.user.id);

        await this.axios
          .post("/peserta/v1/invoice", formData, {
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
            this.getPeserta()
            this.loading = false;
            this.dialog = false
          })
          .catch((error) => {
            let responses = error.response.data;
            this.setAlert({
              status: true,
              color: "error",
              text: responses.message,
            });
            this.loading = false;
            this.dialog = false
          });
      }
    },
  },
  async created() {
    await this.getWebinar()
    await this.getPeserta()
  }
}
</script>

<style>
</style>