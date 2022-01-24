<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container fluid>
      <v-form ref="form" v-model="valid">
        <v-row>
          <v-col cols="12" sm="10">
            <v-card
              height="250"
              color="grey"
              class="d-flex align-center justify-center"
              @click="uploadBanner"
              v-if="Object.keys($route.query).length === 0"
            >
              <div v-if="form.webinar_banner == null">
                <h2>Banner</h2>
              </div>

              <v-img :src="banner" contain height="250" v-if="banner != null"></v-img>
            </v-card>

            <v-card
              height="250"
              color="grey"
              class="d-flex align-center justify-center"
              @click="uploadBanner"
              v-else
            >
              <v-img :src="banner" contain height="250" v-if="banner != null"></v-img>
              <v-img
                :src="getImage(form.banner)"
                contain
                height="250"
                v-if="form.banner != null && banner == null"
              ></v-img>
            </v-card>

            <v-file-input
              id="fileid"
              label="File input"
              v-model="form.webinar_banner"
              accept="image/*"
              outlined
              dense
              class="d-none"
              @change="changeBanner"
            ></v-file-input>

            <div class="text-caption red--text">* This field is required.</div>
          </v-col>

          <v-col cols="12" sm="10">
            <h4>Tipe</h4>

            <v-btn-toggle
              v-model="form.webinar_type"
              tile
              color="primary"
              group
              v-for="item in types"
              :key="item"
            >
              <v-btn :value="item" color="#107C42" class="rounded-lg">{{ item }}</v-btn>
            </v-btn-toggle>

            <div class="text-caption red--text">* This field is required.</div>
          </v-col>

          <v-col cols="12" sm="10">
            <h4>Nama Paket</h4>

            <v-text-field
              v-model="form.webinar_name"
              placeholder="Nama Paket"
              outlined
              dense
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="10" v-if="form.webinar_type == 'PRIVATE'">
            <h4>Kode Unik</h4>

            <v-text-field
              v-model="form.webinar_code"
              placeholder="Kode Unik"
              outlined
              dense
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="10" v-if="sessions.length > 0">
            <v-data-table
              :headers="headers"
              :items="sessions"
              :items-per-page="10"
              hide-default-footer
              class="elevation-1"
              dense
              :loading="loading"
            >
              <template v-slot:item.webinar_start_date="{ item }">
                <div>{{ moment(item.webinar_start_date).format("DD/MM/YYYY") }}</div>

                <div>{{ item.webinar_start_time.substr(0, 5) }} WIB</div>
              </template>
              -
              <template v-slot:item.webinar_price="{ item }">
                <v-chip color="primary">{{ item.webinar_price.toLocaleString("id-ID") }}</v-chip>
              </template>

              <template v-slot:item.webinar_status="{ item }">
                <div
                  class="green--text"
                  v-if="item.webinar_status == 'BUKA'"
                >{{ item.webinar_status }}</div>

                <div class="red--text" v-else>{{ item.webinar_status }}</div>
              </template>

              <template v-slot:item.action="{ item }">
                <v-checkbox
                  v-model="form.webinar_session"
                  :value="item"
                  :rules="[rules.required]"
                  @change="total"
                ></v-checkbox>
              </template>
            </v-data-table>

            <br />

            <v-pagination v-model="page" :length="pageCount" :total-visible="7" @input="getSession"></v-pagination>
          </v-col>

          <v-col cols="12" sm="10">
            <h4>Total Harga</h4>

            <v-text-field
              ref="totalHarga"
              v-model.lazy="totalHarga"
              placeholder="Potongan"
              outlined
              dense
              prefix="Rp"
              v-money="money"
              :rules="[rules.required]"
              readonly
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="10">
            <h4>Potongan</h4>

            <v-text-field
              ref="discount"
              v-model.lazy="discount"
              placeholder="Potongan"
              outlined
              dense
              prefix="Rp"
              v-money="money"
              :rules="[rules.required]"
              @change="potongan"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="10">
            <h4>Harga Paket</h4>

            <v-text-field
              ref="webinar_price"
              v-model.lazy="form.webinar_price"
              placeholder="Harga Paket"
              outlined
              dense
              prefix="Rp"
              v-money="money"
              :rules="[rules.required]"
              readonly
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="10">
            <h4>Kuota</h4>

            <v-text-field
              v-model.lazy="form.webinar_quota"
              placeholder="Kuota"
              outlined
              dense
              maxlength="3"
              v-mask="'###'"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="10">
            <div v-if="$route.query.id">
              <v-btn
                block
                color="primary"
                :loading="loading"
                @click="updateAll"
                v-if="form.webinar_publish == 'NO'"
              >Update</v-btn>
            </div>

            <v-btn
              block
              color="primary"
              :disabled="
                !valid || form.webinar_type == '' || form.webinar_session.length < 2
              "
              :loading="loading"
              @click="tambahKelas"
              v-else
            >Simpan</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { mask } from "vue-the-mask";
import { VMoney } from "v-money";

export default {
  name: "add-package",
  directives: { mask, money: VMoney },
  data: () => ({
    valid: true,
    form: {
      webinar_banner: null,
      webinar_type: "",
      webinar_name: "",
      webinar_code: "",
      webinar_session: [],
      webinar_price: 0,
      webinar_quota: "",
      webinar_sponsor: null,
      webinar_status: "",
    },
    banner: null,
    rules: {
      required: (value) => !!value || "This field is required.",
    },
    types: ["PUBLIC", "PRIVATE"],
    headers: [
      { text: "ID", value: "id" },
      { text: "Tanggal", value: "webinar_start_date" },
      { text: "Kategori", value: "webinar_category" },
      { text: "Nama Kelas", value: "webinar_name" },
      { text: "Mentor", value: "mentor_name" },
      { text: "Level", value: "webinar_level" },
      { text: "Harga", value: "webinar_price", align: "right" },
      { text: "Action", value: "action", sortable: false },
    ],
    sessions: [],
    page: 1,
    pageCount: 0,
    totalHarga: 0,
    discount: "",
    money: {
      precision: 0,
      masked: false,
    },
    loading: false,
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
    uploadBanner() {
      document.getElementById('fileid').click()
    },
    changeBanner(file) {
      this.banner = URL.createObjectURL(file);
    },
    async getSession() {
      await this.axios
        .get("/setup-webinar/v1/session-list?page=" + this.page, {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.sessions = data.data;
          this.page = data.current_page;
          this.pageCount = data.last_page;
        });
    },
    total() {
      let calculate = this.form.webinar_session.reduce(
        (sum, item) => sum + item.webinar_price,
        0
      );
      this.$refs.totalHarga.$el.getElementsByTagName("input")[0].value =
        calculate;
      this.totalHarga = calculate;
      let price = calculate - this.discount.replaceAll(",", "");
      this.$refs.webinar_price.$el.getElementsByTagName("input")[0].value =
        price;
      this.form.webinar_price = price;
    },
    potongan() {
      let price =
        this.totalHarga.replaceAll(",", "") - this.discount.replaceAll(",", "");
      if (price > 0) {
        this.$refs.webinar_price.$el.getElementsByTagName("input")[0].value =
          price;
        this.form.webinar_price = price;
      } else {
        this.setAlert({
          status: true,
          color: "error",
          text: "Harga tidak boleh minus",
        });
        this.$refs.discount.$el.getElementsByTagName("input")[0].value = 0;
        this.discount = 0;
      }
    },
    async tambahKelas() {
      let r = confirm("Apakah anda yakin akan menyimpan data berikut?");

      if (r) {
        this.loading = true;

        let tanggal = this.form.webinar_session.map((item) => {
          return item.webinar_start_date;
        });
        let sort_tanggal = tanggal.sort();
        let tanggal_selesai = sort_tanggal.slice(-1).pop();

        let waktu_mulai = this.form.webinar_session.map((item) => {
          return item.webinar_start_time;
        });
        let sort_waktu_mulai = waktu_mulai.sort();

        let waktu = this.form.webinar_session.map((item) => {
          return item.webinar_end_time;
        });
        let sort_waktu = waktu.sort();
        let waktu_selesai = sort_waktu.slice(-1).pop();

        let sesi = this.form.webinar_session.map((item) => {
          return item.id;
        });

        let formData = new FormData();
        formData.set("webinar_banner", this.form.webinar_banner);
        formData.set("category_id", 1);
        formData.set("webinar_type", this.form.webinar_type);
        formData.set("webinar_class", "PAKET");
        formData.set("webinar_name", this.form.webinar_name.toUpperCase());
        formData.set("webinar_code", this.form.webinar_code.toUpperCase());
        formData.set("webinar_start_date", sort_tanggal[0]);
        formData.set("webinar_end_date", tanggal_selesai);
        formData.set("webinar_start_time", sort_waktu_mulai[0]);
        formData.set("webinar_end_time", waktu_selesai);
        formData.set(
          "webinar_price",
          this.form.webinar_price.replaceAll(",", "")
        );
        formData.set("webinar_quota", this.form.webinar_quota);
        formData.set("webinar_session", JSON.stringify(sesi));
        formData.set("webinar_status", this.form.webinar_status);
        formData.set("created_by", this.user.id);

        await this.axios
          .post("/setup-webinar/v1/tambah-kelas", formData, {
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
            this.loading = false;
            this.$router.push("/paket/package-list");
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
    async initialize() {
      await this.axios
        .get("/setup-webinar/v1/jadwal-webinar", {
          params: {
            id: this.$route.query.id,
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          let result = data.data[0];
          this.form = {
            webinar_banner: null,
            banner: result.webinar_banner,
            webinar_class: result.webinar_class,
            webinar_type: result.webinar_type,
            webinar_code: result.webinar_code,
            webinar_name: result.webinar_name,
            price: result.webinar_price,
            session: result.webinar_session,
            webinar_quota: result.webinar_quota,
            webinar_status: result.webinar_status,
            webinar_publish: result.webinar_publish,
          };
        });
    },
    async checkWebinar() {
      let formData = new FormData();
      formData.set("webinar_id", this.form.session);

      await this.axios.post("/home/v1/check-paket", formData)
        .then((response) => {
          let { data } = response.data;
          Object.assign(this.form, { webinar_session: data });
          this.total()
        }).then(() => {
          let potongan =
            this.totalHarga.replaceAll(",", "") - this.form.price;
          this.$refs.webinar_price.$el.getElementsByTagName("input")[0].value = this.form.price;
          this.$refs.discount.$el.getElementsByTagName("input")[0].value = potongan;
          this.discount = potongan;
        })
    },
    async updateAll() {
      let r = confirm("Apakah anda yakin akan mengupdate data berikut?");

      if (r) {
        this.loading = true;

        let tanggal = this.form.webinar_session.map((item) => {
          return item.webinar_start_date;
        });
        let sort_tanggal = tanggal.sort();
        let tanggal_selesai = sort_tanggal.slice(-1).pop();

        let waktu_mulai = this.form.webinar_session.map((item) => {
          return item.webinar_start_time;
        });
        let sort_waktu_mulai = waktu_mulai.sort();

        let waktu = this.form.webinar_session.map((item) => {
          return item.webinar_end_time;
        });
        let sort_waktu = waktu.sort();
        let waktu_selesai = sort_waktu.slice(-1).pop();

        let sesi = this.form.webinar_session.map((item) => {
          return item.id;
        });

        let formData = new FormData();
        formData.set("id", this.$route.query.id);
        formData.set("webinar_banner", this.form.webinar_banner);
        formData.set("category_id", 1);
        formData.set("webinar_type", this.form.webinar_type);
        formData.set("webinar_class", "PAKET");
        formData.set("webinar_name", this.form.webinar_name.toUpperCase());
        if (this.form.webinar_code != null) {
          formData.set("webinar_code", this.form.webinar_code.toUpperCase());
        }
        formData.set("webinar_start_date", sort_tanggal[0]);
        formData.set("webinar_end_date", tanggal_selesai);
        formData.set("webinar_start_time", sort_waktu_mulai[0]);
        formData.set("webinar_end_time", waktu_selesai);
        formData.set(
          "webinar_price",
          this.form.webinar_price.replaceAll(",", "")
        );
        formData.set("webinar_quota", this.form.webinar_quota);
        formData.set("webinar_session", JSON.stringify(sesi));
        formData.set("webinar_status", this.form.webinar_status);
        formData.set("updated_by", this.user.id);

        await this.axios
          .post("/setup-webinar/v1/update-all", formData, {
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
            this.loading = false;
            this.$router.push("/paket/package-list");
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
    await this.getSession();
    if (this.$route.query.id) {
      await this.initialize();
      await this.checkWebinar()
    }
    if (!this.$route.query.id) {
      this.$refs.form.validate()
    }
  },
};
</script>

<style>
</style>
