<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container fluid>
      <div style="max-width: 1240px; margin: 0 auto !important">
        <v-card>
          <v-card-title>Bantu isi data dulu ya sob, buat bahan analisa mimin kedepannya</v-card-title>
        </v-card>

        <br />

        <v-card>
          <v-card-subtitle class="text--primary">Alasan mengikuti webinar dari KEI?</v-card-subtitle>

          <v-container fluid>
            <v-radio-group v-model="form.reason_id" class="mt-0" :rules="[rules.required]">
              <v-radio
                v-for="item in reasons"
                :key="item.id"
                :label="item.reason"
                :value="item.id"
              ></v-radio>
            </v-radio-group>
          </v-container>
        </v-card>

        <br />

        <v-form v-model="valid">
          <v-card>
            <v-card-subtitle class="text--primary">Dari mana Sobat dapet informasi ini?</v-card-subtitle>

            <v-container fluid>
              <v-radio-group v-model="form.info" class="mt-0" :rules="[rules.required]">
                <v-radio
                  v-for="item in informations"
                  :key="item.id"
                  :label="item.information"
                  :value="item.id"
                ></v-radio>

                <v-radio label="OTHER" :value="-1"></v-radio>
              </v-radio-group>

              <v-text-field
                v-model="otherInfo"
                label="Other"
                outlined
                dense
                :rules="[rules.required]"
                v-if="form.info == -1"
              ></v-text-field>
            </v-container>
          </v-card>

          <br />

          <v-card v-if="form.info == 1 || form.info == 2">
            <v-card-subtitle class="text--primary">Dapat info dari iklan yang mana sob?</v-card-subtitle>

            <v-container fluid>
              <v-radio-group v-model="form.ig_dtl" class="mt-0" :rules="[rules.required]">
                <v-radio label="IKLAN POSTINGAN" value="POSTINGAN"></v-radio>

                <v-radio label="IKLAN STORY" value="STORY"></v-radio>
              </v-radio-group>
            </v-container>
          </v-card>

          <br />

          <v-card>
            <v-card-subtitle class="text--primary">Tinggal di Daerah mana sob?</v-card-subtitle>
            <v-card-text>*ceklist salah satu</v-card-text>

            <v-container fluid>
              <v-data-table
                :headers="headers"
                :items="zipcodes"
                :items-per-page="10"
                hide-default-footer
                class="elevation-1"
                dense
                :loading="loading"
              >
                <template v-slot:top>
                  <v-row>
                    <v-col cols="6" sm="3">
                      <v-select
                        v-model="search.provinsi"
                        label="Provinsi"
                        outlined
                        dense
                        hide-details
                        :items="provinsi"
                        item-text="provinsi"
                        item-value="provinsi"
                        @change="selectProvinsi"
                        clearable
                      ></v-select>
                    </v-col>

                    <v-col cols="6" sm="3">
                      <v-select
                        v-model="search.kabupaten"
                        label="Kabupaten"
                        outlined
                        dense
                        hide-details
                        :items="kabupaten"
                        item-text="kabupaten"
                        item-value="kabupaten"
                        @change="selectKabupaten"
                        clearable
                        :disabled="disable.kabupaten"
                      ></v-select>
                    </v-col>

                    <v-col cols="6" sm="3">
                      <v-select
                        v-model="search.kecamatan"
                        label="Kecamatan"
                        outlined
                        dense
                        hide-details
                        :items="kecamatan"
                        item-text="kecamatan"
                        item-value="kecamatan"
                        @change="selectKecamatan"
                        clearable
                        :disabled="disable.kecamatan"
                      ></v-select>
                    </v-col>

                    <v-col cols="6" sm="3">
                      <v-select
                        v-model="search.kelurahan"
                        label="Kelurahan"
                        outlined
                        dense
                        hide-details
                        :items="kelurahan"
                        item-text="kelurahan"
                        item-value="kelurahan"
                        @change="selectKelurahan"
                        clearable
                        :disabled="disable.kelurahan"
                      ></v-select>
                    </v-col>
                  </v-row>
                </template>

                <template v-slot:item.action="{ item }">
                  <v-checkbox v-model="form.zipcode_id" :value="item.id" :rules="[rules.required]"></v-checkbox>
                </template>
              </v-data-table>

              <!-- <v-pagination v-model="page" :length="pageCount" :total-visible="7" @input="getZipcode"></v-pagination> -->
            </v-container>
          </v-card>

          <br />

          <v-card>
            <v-card-subtitle class="text--primary">Statusnya apa nih?</v-card-subtitle>

            <v-container fluid>
              <v-radio-group v-model="form.marital" class="mt-0" :rules="[rules.required]">
                <v-radio label="LAJANG" value="LAJANG"></v-radio>

                <v-radio label="MENIKAH" value="MENIKAH"></v-radio>

                <v-radio label="CERAI" value="CERAI"></v-radio>
              </v-radio-group>
            </v-container>
          </v-card>

          <br />

          <v-card>
            <v-card-subtitle class="text--primary">Apa pekerjaan Sobat?</v-card-subtitle>

            <v-container fluid>
              <v-radio-group v-model="form.job_id" class="mt-0" :rules="[rules.required]">
                <v-radio v-for="item in jobs" :key="item.id" :label="item.job" :value="item.id"></v-radio>

                <v-radio label="OTHER" :value="-1"></v-radio>
              </v-radio-group>

              <v-text-field
                v-model="otherJob"
                label="Other"
                outlined
                dense
                :rules="[rules.required]"
                v-if="form.job_id == -1"
              ></v-text-field>
            </v-container>
          </v-card>

          <br />

          <v-card>
            <v-card-subtitle class="text--primary">Apa Posisi Sobat?</v-card-subtitle>

            <v-container fluid>
              <v-radio-group v-model="form.position_id" class="mt-0" :rules="[rules.required]">
                <v-radio
                  v-for="item in positions"
                  :key="item.id"
                  :label="item.position"
                  :value="item.id"
                ></v-radio>

                <v-radio label="OTHER" :value="-1"></v-radio>
              </v-radio-group>

              <v-text-field
                v-model="otherPos"
                label="Other"
                outlined
                dense
                :rules="[rules.required]"
                v-if="form.position_id == -1"
              ></v-text-field>
            </v-container>
          </v-card>

          <br />

          <v-card>
            <v-card-subtitle class="text--primary">Hobi apa yang Sobat paling sukai?</v-card-subtitle>

            <v-container fluid>
              <v-radio-group v-model="form.hobby_id" class="mt-0" :rules="[rules.required]">
                <v-radio
                  v-for="item in hobbies"
                  :key="item.id"
                  :label="item.hobby"
                  :value="item.id"
                ></v-radio>
              </v-radio-group>
            </v-container>
          </v-card>
        </v-form>

        <br />

        <v-btn
          color="primary"
          block
          :disabled="!valid"
          @click="check"
          v-if="profiles.length == 0"
        >Submit</v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "profile",
  data: () => ({
    profiles: [],
    valid: true,
    form: {
      reason_id: "",
      info: "",
      ig_dtl: "",
      zipcode_id: "",
      marital: "",
      job_id: "",
      position_id: "",
      hobby_id: "",
    },
    rules: {
      required: (value) => !!value || "This field is required.",
    },
    reasons: [],
    informations: [],
    otherInfo: "",
    headers: [
      { text: "Provinsi", value: "provinsi" },
      { text: "Kabupaten", value: "kabupaten" },
      { text: "Kecamatan", value: "kecamatan" },
      { text: "Kelurahan", value: "kelurahan" },
      { text: "Kodepos", value: "kodepos" },
      { text: "Action", value: "action", sortable: false },
    ],
    zipcodes: [],
    loading: false,
    page: 1,
    pageCount: 0,
    search: {
      provinsi: "",
      kabupaten: "",
      kecamatan: "",
      kelurahan: "",
    },
    provinsi: [],
    kabupaten: [],
    kecamatan: [],
    kelurahan: [],
    disable: {
      kabupaten: true,
      kecamatan: true,
      kelurahan: true,
    },
    jobs: [],
    otherJob: "",
    positions: [],
    otherPos: "",
    hobbies: [],
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
          if (data.length > 0) {
            this.form = {
              info: this.profiles[0].info,
              ig_dtl: this.profiles[0].ig_dtl,
              zipcode_id: this.profiles[0].zipcode_id,
              marital: this.profiles[0].marital,
              job_id: this.profiles[0].job_id,
              position_id: this.profiles[0].position_id,
              hobby_id: this.profiles[0].hobby_id,
            };
          }
        });
    },
    async getReason() {
      await this.axios
        .get("/setup-webinar/v1/reason", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.reasons = data;
        });
    },
    async getInfo() {
      await this.axios
        .get("/setup-webinar/v1/info", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.informations = data;
        });
    },
    async getZipcode() {
      this.loading = true;

      await this.axios
        .get("/setup-webinar/v1/zipcode?page=" + this.page, {
          params: {
            id: this.form.zipcode_id,
            provinsi: this.search.provinsi,
            kabupaten: this.search.kabupaten,
            kecamatan: this.search.kecamatan,
            kelurahan: this.search.kelurahan,
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.zipcodes = data.data;
          this.page = data.current_page;
          this.pageCount = data.last_page;
          this.loading = false;
        });
    },
    async getProvinsi() {
      await this.axios
        .get("/setup-webinar/v1/provinsi", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.provinsi = data;
        });
    },
    selectProvinsi() {
      this.getKabupaten();
      this.disable.kabupaten = false;
      this.page = 1;
      // this.getZipcode();
    },
    async getKabupaten() {
      await this.axios
        .get("/setup-webinar/v1/kabupaten", {
          params: {
            provinsi: this.search.provinsi,
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.kabupaten = data;
        });
    },
    selectKabupaten() {
      this.getKecamatan();
      this.disable.kecamatan = false;
      this.page = 1;
      // this.getZipcode();
    },
    async getKecamatan() {
      await this.axios
        .get("/setup-webinar/v1/kecamatan", {
          params: {
            kabupaten: this.search.kabupaten,
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.kecamatan = data;
        });
    },
    selectKecamatan() {
      this.getKelurahan();
      this.disable.kelurahan = false;
      this.page = 1;
      // this.getZipcode();
    },
    async getKelurahan() {
      await this.axios
        .get("/setup-webinar/v1/kelurahan", {
          params: {
            kecamatan: this.search.kecamatan,
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.kelurahan = data;
        });
    },
    selectKelurahan() {
      this.page = 1;
      this.getZipcode();
    },
    async getJob() {
      await this.axios
        .get("/setup-webinar/v1/job", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.jobs = data;
        });
    },
    async getPos() {
      await this.axios
        .get("/setup-webinar/v1/position", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.positions = data;
        });
    },
    async getHobby() {
      await this.axios
        .get("/setup-webinar/v1/hobby", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.hobbies = data;
        });
    },
    async saveInfo() {
      let formData = new FormData();
      formData.set("information", this.otherInfo.toUpperCase());
      formData.set("created_by", this.user.id);

      await this.axios
        .post("/setup-webinar/v1/info", formData, {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response;
          this.informations.push(data.data)
          this.form.info = data.data.id;
        });
    },
    async saveJob() {
      let formData = new FormData();
      formData.set("job", this.otherJob.toUpperCase());
      formData.set("created_by", this.user.id);

      await this.axios
        .post("/setup-webinar/v1/job", formData, {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response;
          this.jobs.push(data.data)
          this.form.job_id = data.data.id;
        });
    },
    async savePos() {
      let formData = new FormData();
      formData.set("position", this.otherPos.toUpperCase());
      formData.set("created_by", this.user.id);

      await this.axios
        .post("/setup-webinar/v1/position", formData, {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response;
          this.positions.push(data.data)
          this.form.position_id = data.data.id;
        });
    },
    async check() {
      if (this.form.info == -1) {
        await this.saveInfo();
      }
      if (this.form.job_id == -1) {
        await this.saveJob();
      }
      if (this.form.position_id == -1) {
        await this.savePos();
      }
      if (
        this.form.info > 0 ||
        this.form.job_id > 0 ||
        this.form.position_id > 0
      ) {
        await this.survey();
      }
    },
    async survey() {
      this.loading = true;

      let formData = new FormData();
      formData.set("user_id", this.user.id);
      formData.set("reason_id", this.form.reason_id);
      formData.set("info", this.form.info);
      formData.set("ig_dtl", this.form.ig_dtl);
      formData.set("zipcode_id", this.form.zipcode_id);
      formData.set("marital", this.form.marital);
      formData.set("job_id", this.form.job_id);
      formData.set("position_id", this.form.position_id);
      formData.set("hobby_id", this.form.hobby_id);

      await this.axios
        .post("/peserta/v1/survey", formData, {
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
          this.loading = false;
          this.$router.push("/checkout");
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
    },
  },
  async created() {
    await this.getProfile();
    await this.getReason()
    await this.getInfo();
    // await this.getZipcode();
    await this.getProvinsi();
    await this.getJob();
    await this.getPos();
    await this.getHobby();
  },
};
</script>

<style>
</style>