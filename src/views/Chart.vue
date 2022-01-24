<template>
  <v-container fluid>
    <home v-if="user.role == 3" />

    <br />

    <v-row v-if="user.role == 1">
      <v-col cols="12" sm="3">
        <v-card rounded raised>
          <v-card-title>Best Selling</v-card-title>

          <v-container fluid>
            <doughnut-chart :chart-data="bestSelling" :options="options"></doughnut-chart>

            <div class="d-flex justify-space-around mt-4">
              <div class="text-center">
                <v-chip color="#41B883" small class="px-4"></v-chip>
                <div class="text-subtitle-2">{{ basic.length }}</div>
                <div class="text-caption">Basic</div>
              </div>

              <div class="text-center">
                <v-chip color="#E46651" small class="px-4"></v-chip>
                <div class="text-subtitle-2">{{ intermediate.length }}</div>
                <div class="text-caption">intermediate</div>
              </div>

              <div class="text-center">
                <v-chip color="#00D8FF" small class="px-4"></v-chip>
                <div class="text-subtitle-2">{{ advance.length }}</div>
                <div class="text-caption">Advance</div>
              </div>

              <div class="text-center">
                <v-chip color="#DD1B16" small class="px-4"></v-chip>
                <div class="text-subtitle-2">{{ vba.length }}</div>
                <div class="text-caption">VBA</div>
              </div>
            </div>
          </v-container>
        </v-card>
      </v-col>

      <v-col cols="12" sm="3">
        <v-card rounded raised>
          <v-card-title>Total Peserta</v-card-title>

          <v-card-text class="text--primary">
            <div class="d-flex justify-space-around align-center">
              <h1>{{ totalPeserta }}</h1>

              <v-icon color="primary" x-large>mdi-chart-bar mdi-flip-h</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="3">
        <v-card rounded raised>
          <v-card-title>Total Tiket</v-card-title>

          <v-card-text class="text--primary">
            <div class="d-flex justify-space-around align-center">
              <h1>{{ totalTiket }}</h1>

              <v-icon color="primary" x-large>mdi-chart-arc</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="3">
        <v-card rounded raised>
          <v-card-title>Total Revenue</v-card-title>

          <v-card-text class="text--primary">
            <div class="d-flex justify-space-around align-center">
              <h1 v-if="totalRevenue != ''">Rp {{ parseInt(totalRevenue).toLocaleString("id-ID") }}</h1>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DoughnutChart from '../components/best-selling-chart.js'

export default {
  name: 'dashboard',
  components: {
    DoughnutChart,
    Home: () =>
      import(/* webpackChunkName: "home" */ "@/components/Home.vue"),
  },
  data: () => ({
    bestSelling: {},
    basic: "",
    intermediate: "",
    advance: "",
    vba: "",
    totalPeserta: "",
    totalTiket: "",
    totalRevenue: "",
    options: {
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.labels[tooltipItem.index] || '';

            if (label) {
              label += ': ';
            }

            label += (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] / data.datasets[tooltipItem.datasetIndex].data.length) * 100 + "%";

            return label;
          }
        }
      }
    }
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
      guest: "auth/guest",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    async bestSellingData() {
      await this.axios
        .get("/dashboard/v1/best-selling", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;

          this.basic = data.filter((item) => {
            return item.webinar_level == "BASIC"
          })
          this.intermediate = data.filter((item) => {
            return item.webinar_level == "INTERMEDIATE"
          })
          this.advance = data.filter((item) => {
            return item.webinar_level == "ADVANCE"
          })
          this.vba = data.filter((item) => {
            return item.webinar_level == "VBA"
          })

          this.bestSelling = {
            labels: ["BASIC", "INTERMEDIATE", "ADVANCE", "VBA"],
            datasets: [
              {
                backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                data: [
                  this.basic.length,
                  this.intermediate.length,
                  this.advance.length,
                  this.vba.length
                ],
              }
            ]
          }
        });
    },
    async totalPesertaData() {
      await this.axios
        .get("/dashboard/v1/total-peserta", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.totalPeserta = data.length
        });
    },
    async totalTiketData() {
      await this.axios
        .get("/dashboard/v1/total-tiket", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.totalTiket = data.length
        });
    },
    async totalRevenueData() {
      await this.axios
        .get("/dashboard/v1/total-revenue", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.totalRevenue = data[0].total_revenue
        });
    },
  },
  async created() {
    await this.bestSellingData()
    await this.totalPesertaData()
    await this.totalTiketData()
    await this.totalRevenueData()
  }
}
</script>

<style>
</style>