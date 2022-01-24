<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      width="260"
      v-if="isHome || isCheckout || isSearch || isRincian || isProfile || isLearn || isResult"
    >
      <v-list nav>
        <v-list-item-group v-model="selectedItem" color="primary">
          <v-list-item href="/">
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/search">
            <v-list-item-icon>
              <v-icon>mdi-compass</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Explore</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/peserta/my-learning">
            <v-list-item-icon>
              <v-icon>mdi-notebook</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>My Learning</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/peserta/settings">
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <template v-slot:append v-if="!guest">
        <div class="pa-2">
          <v-btn block color="red" dark @click="signOut">
            <v-icon left>mdi-logout</v-icon>Keluar
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <alert />

    <v-main>
      <v-slide-y-transition>
        <router-view></router-view>
      </v-slide-y-transition>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: 'App',
  components: {
    Alert: () =>
      import(/* webpackChunkName: "alert" */ "@/components/Alert.vue"),
  },
  data: () => ({
    drawer: true,
    selectedItem: 0,
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
      guest: "auth/guest",
    }),
    isHome() {
      return this.$route.path === "/";
    },
    isRincian() {
      return this.$route.name === "workshop";
    },
    isCheckout() {
      return this.$route.path === "/checkout";
    },
    isSearch() {
      return this.$route.path === "/search";
    },
    isLearn() {
      return this.$route.name === "continue-learning";
    },
    isResult() {
      return this.$route.path === "/result";
    },
    isProfile() {
      return this.$route.name === "profile";
    },
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
      setCart: 'cart/set',
    }),
    signOut() {
      let r = confirm("Apakah anda yakin akan keluar?");

      if (r == true) {
        this.drawer = false;
        this.setAuth({});
        this.setCart([])
        this.setAlert({
          status: true,
          color: "success",
          text: "Logout successfully",
        });
        location.href = "/"
      }
    },
  },
}
</script>

<style>
</style>