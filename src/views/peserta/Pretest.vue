<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-row>
      <v-col cols="12" sm="10">
        <v-card>
          <v-card-title>{{ title }} Post Test</v-card-title>
          <v-card-subtitle
            class="text--primary"
          >Form ini digunakan untuk menguji kemampuan sobat dalam menggunakan excel.</v-card-subtitle>
          <v-card-text>
            <div>Durasi pengerjaan 8 menit</div>
            <div>Ketentuan Kelulusan:</div>
            <div>&gt;= 70 : lulus</div>
            <div>&lt; 70 : belum lulus</div>
            <div>Sertifikat kelulusan hanya diberikan kepada peserta yang memenuhi ketentuan nilai kelulusan</div>
          </v-card-text>
        </v-card>

        <br />

        <v-card>
          <v-card-subtitle class="primary white--text">Silahkan dikerjakan, semoga lulus sob!</v-card-subtitle>
        </v-card>

        <br />

        <v-form v-model="valid">
          <div v-for="item in pretests" :key="item.id">
            <v-card>
              <v-card-subtitle class="text--primary" v-html="item.question"></v-card-subtitle>

              <v-container fluid>
                <v-radio-group v-model="item.jawaban" class="mt-0" :rules="[rules.required]">
                  <v-radio :label="item.option_a.toLowerCase()" value="A" class="toCapitalFirst"></v-radio>
                  <v-radio :label="item.option_b.toLowerCase()" value="B" class="toCapitalFirst"></v-radio>
                  <v-radio :label="item.option_c.toLowerCase()" value="C" class="toCapitalFirst"></v-radio>
                  <v-radio :label="item.option_d.toLowerCase()" value="D" class="toCapitalFirst"></v-radio>
                </v-radio-group>
              </v-container>
            </v-card>

            <br />
          </div>
        </v-form>

        <v-btn color="primary" block @click="answer">Submit</v-btn>
      </v-col>

      <v-col cols="12" sm="2">
        <div class="fixed" v-if="time != ''">
          <vac :end-time="time" @finish="answer">
            <template v-slot:process="{ timeObj }">
              <span>{{ `Lefttime: ${timeObj.m}:${timeObj.s}` }}</span>
            </template>

            <template v-slot:finish>
              <span>Done!</span>
            </template>
          </vac>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Vue from 'vue'
import vueAwesomeCountdown from 'vue-awesome-countdown'

Vue.use(vueAwesomeCountdown, 'vac')

export default {
  name: "post-test",
  data: () => ({
    jawaban: [],
    pretest_id: 0,
    package_id: 0,
    pretests: [],
    title: "",
    point: 0,
    valid: true,
    rules: {
      required: (value) => !!value || "This field is required.",
    },
    time: 0,
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
      pretest: "pretest/pretest",
      posttest: "posttest/posttest",
    }),
  },
  watch: {
    time: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.time--;
          }, 2000);
        }
      },
      immediate: true
    }

  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setPretest: "pretest/set",
      setPosttest: "posttest/set",
    }),
    async getJawaban() {
      await this.axios
        .get("/peserta/v1/answer", {
          params: {
            user_id: this.user.id,
            webinar_id: this.pretest_id
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.jawaban = data
          if (this.jawaban.length > 0) {
            this.setAlert({
              status: true,
              color: "error",
              text: "Anda telah mengikuti pretest ini",
            });
            this.$router.go(-1)
          } else {
            if (this.posttest.length > 0) {
              this.pretests = this.posttest.map((value) => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value)
            } else {
              this.getPretest()
            }
          }
        })
    },
    async getPretest() {
      await this.axios
        .get("/peserta/v1/pretest", {
          params: {
            webinar_id: this.pretest_id,
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.title = data[0].webinar_name

          this.pretests = data
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)

          this.pretests.forEach((element) => {
            Object.assign(element, { jawaban: null });
          });
        })
        .catch(() => {
          this.setAlert({
            status: true,
            color: "error",
            text: "Anda sudah tidak dapat mengakses halaman ini",
          });
          this.$router.go(-1)
        });
    },
    async answer() {
      let calculate = this.pretests.filter((item) => {
        return item.jawaban == item.answer
      })

      let score = calculate.length * 10

      this.setPosttest(calculate)

      this.loading = true;

      let formData = new FormData();
      formData.set("user_id", this.user.id);
      formData.set("pretests", JSON.stringify(this.pretests));
      formData.set("webinar_id", this.pretest_id);
      formData.set("package_id", this.package_id);
      formData.set("point", score);

      await this.axios
        .post("/peserta/v1/answer", formData, {
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
          this.$router.push("/peserta/post-test-score");
        })
    },
  },
  async created() {
    this.pretest_id = this.pretest.webinar_id
    this.package_id = this.pretest.package_id

    await this.getJawaban()

    if (this.pretest.timeleft == undefined) {
      this.time = this.moment().add(8, 'm').valueOf();
    } else {
      this.time = this.pretest.timeleft
    }
  },
  beforeRouteLeave(to, from, next) {
    this.setPretest({ timeleft: this.time })
    next()
  },
};
</script>

<style>
div.fixed {
  position: fixed;
  top: 8%;
}

.toCapitalFirst {
  text-transform: capitalize;
}
</style>