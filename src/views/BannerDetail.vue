<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <div style="max-width: 1240px; margin: 0 auto !important">
      <v-container fluid>
        <v-card rounded="lg" color="cyan lighten-5">
          <v-card-title class="justify-center">{{ banners.banner_name }}</v-card-title>

          <v-img :src="getImage(banners.banner_img)" height="350" contain></v-img>

          <v-card-text v-html="banners.banner_dtl"></v-card-text>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'banner-detail',
  data: () => ({
    banners: [],
  }),
  methods: {
    async getBanner() {
      await this.axios
        .get("/home/v1/banner", {
          params: {
            banner_name: this.$route.params.id,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.banners = data[0];
        });
    },
  },
  async created() {
    await this.getBanner()
  },
}
</script>

<style>
</style>