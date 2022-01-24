<template>
  <div>
    <!-- <app-bar v-if="$vuetify.breakpoint.smAndUp" /> -->

    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container fluid>
      <h2 class="mb-2 ml-2">My Learning</h2>

      <v-row>
        <v-col cols="12" sm="8" order-sm="1" order="2">
          <v-tabs v-model="tab" @change="doWebinar" show-arrows>
            <v-tab>All Course ({{ all }})</v-tab>
            <v-tab>On Progress ({{ onProgress.length }})</v-tab>
            <v-tab>Completed ({{ completed.length }})</v-tab>
          </v-tabs>

          <div v-if="notes.length > 0">
            <v-col cols="12" v-for="(item,index) in notes" :key="index">
              <v-card>
                <v-container fluid class="d-flex align-center">
                  <v-avatar size="100">
                    <v-img :src="getImage(item.webinar_banner)" v-if="item.webinar_banner != null"></v-img>
                    <v-icon x-large v-else>mdi-account-circle</v-icon>
                  </v-avatar>

                  <div class="mx-4">
                    <div class="text-h6 font-weight-bold">{{ item.webinar_name }}</div>
                    <div class="text-subtitle-2">Level: {{ item.webinar_level }}</div>
                    <div
                      class="text-subtitle-2"
                    >Tanggal: {{ moment(item.webinar_start_date).format("DD MMM YYYY") }}</div>
                    <div
                      class="text-subtitle-2"
                    >Pukul: {{ item.webinar_start_time.substr(0, 5) }} - {{ item.webinar_end_time.substr(0, 5) }} WIB</div>
                  </div>

                  <div class="ml-auto align-self-end">
                    <v-btn
                      block
                      color="primary"
                      dark
                      small
                      @click="result(item)"
                      v-if="item.webinar_session == null"
                    >Detail</v-btn>

                    <v-btn icon @click="show = !show" v-if="item.webinar_session != null">
                      <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                    </v-btn>
                  </div>
                </v-container>

                <v-card-actions
                  v-if="item.webinar_pretest == 'OPEN' && item.post_test_score == null"
                >
                  <v-btn block color="primary" dark small @click="go(item)">Mulai Post Test</v-btn>
                </v-card-actions>

                <v-expand-transition>
                  <div v-show="show">
                    <v-divider></v-divider>

                    <v-card v-for="sub in item.webinar_session" :key="sub.id" class="my-2">
                      <v-container fluid class="d-flex align-end">
                        <v-avatar size="100">
                          <v-img
                            :src="getImage(sub.webinar_banner)"
                            v-if="sub.webinar_banner != null"
                          ></v-img>
                          <v-icon x-large v-else>mdi-account-circle</v-icon>
                        </v-avatar>

                        <div class="mx-4">
                          <div class="text-h6 font-weight-bold">{{ sub.webinar_name }}</div>
                          <div class="text-subtitle-2">Level: {{ sub.webinar_level }}</div>
                          <div
                            class="text-subtitle-2"
                          >Tanggal: {{ moment(sub.webinar_start_date).format("DD MMM YYYY") }}</div>
                          <div
                            class="text-subtitle-2"
                          >Pukul: {{ sub.webinar_start_time.substr(0, 5) }} - {{ sub.webinar_end_time.substr(0, 5) }} WIB</div>
                        </div>

                        <div class="ml-auto" v-if="$vuetify.breakpoint.smAndUp">
                          <v-btn block color="primary" dark @click="result(sub)">Detail</v-btn>
                        </div>
                      </v-container>

                      <v-card-actions
                        v-if="sub.webinar_pretest == 'OPEN' && sub.post_test_score == null"
                      >
                        <v-btn block color="primary" dark @click="go2(sub, item)">Mulai Post Test</v-btn>
                      </v-card-actions>
                    </v-card>
                  </div>
                </v-expand-transition>
              </v-card>
            </v-col>
          </div>

          <v-container v-else>
            <h2 class="text-center">Tidak ada data</h2>
          </v-container>
        </v-col>

        <v-col cols="12" sm="4" order-sm="2" order="1">
          <v-date-picker
            v-model="date"
            full-width
            :events="events"
            event-color="green lighten-1"
            @input="eventFilter"
          ></v-date-picker>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "my-learning",
  // components: {
  //   AppBar: () =>
  //     import(/* webpackChunkName: "app-bar" */ "@/components/AppBar.vue"),
  // },
  data: () => ({
    headers: [
      { text: "Nama Kelas", value: "webinar_name" },
      { text: "Level", value: "webinar_level" },
      { text: "Tanggal Mulai", value: "webinar_start_date" },
      { text: "Jam Mulai", value: "webinar_start_time" },
      { text: "Jam Selesai", value: "webinar_end_time" },
      { text: "Post-Test", value: "webinar_pretest" },
    ],
    webinars: [],
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    events: [],
    notes: [],
    show: false,
    tab: 0,
    all: 0,
    onProgress: [],
    completed: [],
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
      pretest: "pretest/pretest",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setPretest: "pretest/set",
      setResult: "result/set",
    }),
    async getWebinar() {
      let formData = new FormData();
      formData.set("user_id", this.user.id);
      if (this.tab == 1) {
        formData.set("tab", this.date);
      }
      if (this.tab == 2) {
        formData.set("status", "DONE");
      }

      await this.axios
        .post("/peserta/v1/user-webinar", formData, {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.webinars = data;
          this.all = data.length
          this.onProgress = data.filter((item) => {
            return item.webinar_start_date == this.moment().format("YYYY-MM-DD")
          })
          this.completed = data.filter((item) => {
            return item.webinar_status == "DONE"
          })
          this.events = this.webinars.map((item) => {
            return item.webinar_start_date
          })
          this.notes = this.webinars
        });
    },
    async doWebinar() {
      let formData = new FormData();
      formData.set("user_id", this.user.id);
      if (this.tab == 1) {
        formData.set("tab", this.date);
      }
      if (this.tab == 2) {
        formData.set("status", "DONE");
      }

      await this.axios
        .post("/peserta/v1/user-webinar", formData, {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.webinars = data;
          this.events = this.webinars.map((item) => {
            return item.webinar_start_date
          })
          if (this.tab == 0) {
            this.notes = this.webinars
          } else {
            this.eventFilter()
          }
        });
    },
    eventFilter() {
      this.notes = this.webinars.filter(item => item.webinar_start_date.includes(this.date))
    },
    go(item) {
      this.setPretest({
        webinar_id: item.id,
        timeleft: this.pretest.timeleft
      })
      this.$router.push("/peserta/post-test")
    },
    go2(item, sub) {
      this.setPretest({
        webinar_id: item.id,
        package_id: sub.id,
        timeleft: this.pretest.timeleft
      })
      this.$router.push("/peserta/post-test")
    },
    result(item) {
      this.setResult(item.id)
      this.$router.push("/peserta/result")
    },
  },
  async created() {
    await this.getWebinar()
  }
}
</script>

<style>
</style>