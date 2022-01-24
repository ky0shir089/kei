<template>
  <v-app>
    <v-app-bar app color="primary" dark dense v-if="isHome || isCheckout || isSearch || isRincian || isBanner || isProfile">
      <v-toolbar-title class="text-body-2 text-md-h6 white--text">
        <a href="/" class="white--text">{{ appName }}</a>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div v-if="guest">
        <v-btn rounded outlined small to="/login">Login</v-btn>
        <v-btn rounded small class="mx-2" to="/register">Register</v-btn>
      </div>

      <div class="d-flex align-center" v-else>
        <v-tooltip bottom v-if="isHome || isSearch || isRincian">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              color="white"
              dark
              v-bind="attrs"
              v-on="on"
              class="mx-2"
              @click="dialog = true"
            >
              <v-badge color="orange" :content="countCart" :value="countCart" overlap>
                <v-icon>mdi-cart</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <span>Keranjang</span>
        </v-tooltip>

        <v-menu
          :open-on-hover="$vuetify.breakpoint.xsOnly ? false : true"
          offset-y
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn large icon v-bind="attrs" v-on="on">
              <v-avatar size="32" item>
                <v-img src="/img/profile.png" contain v-if="user.avatar == null"></v-img>
                <v-img :src="getImage(user.avatar)" alt="Avatar" v-else></v-img>
              </v-avatar>
            </v-btn>
          </template>

          <v-card rounded="lg" raised width="250">
            <v-list dense subheader>
              <v-subheader>Menu</v-subheader>

              <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item to="/dashboard">
                  <v-list-item-icon>
                    <v-icon>mdi-star</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Dashboard</v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="red" outlined small @click="signOut">
                <v-icon left>mdi-logout</v-icon>Keluar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>

    <alert />

    <v-main>
      <v-slide-y-transition>
        <router-view></router-view>
      </v-slide-y-transition>
    </v-main>

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
    selectedItem: "",
    dialog: false,
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
      guest: "auth/guest",
      carts: 'cart/carts',
      countCart: 'cart/count',
      totalPrice: 'cart/totalPrice',
    }),
    isHome() {
      return this.$route.path === "/";
    },
    isCheckout() {
      return this.$route.path === "/checkout";
    },
    isSearch() {
      return this.$route.path === "/search";
    },
    isBanner() {
      return this.$route.name === "banner-detail";
    },
    isRincian() {
      return this.$route.name === "workshop";
    },
    isProfile() {
      return this.$route.name === "profile";
    },
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
      removeCart: 'cart/remove',
      setCart: 'cart/set',
    }),
    checkout() {
      this.dialog = false
      this.$router.push("/checkout")
    },
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
};
</script>
