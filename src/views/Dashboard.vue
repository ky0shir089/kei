<template>
  <div>
    <v-navigation-drawer v-model="drawer" app width="280">
      <v-img src="/img/kei_logo.png" width="64" height="64"></v-img>

      <v-list dense>
        <v-list-item>
          <v-list-item-avatar color="white">
            <v-icon large>mdi-account-circle</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item href="/dashboard">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>HOME</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group
          v-for="item in menus"
          :key="item.id"
          :prepend-icon="item.module_icon"
          no-action
          color="green darken-3"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ item.module_name }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="subItem in item.items"
            :key="subItem.menu_name"
            :to="subItem.menu_route"
          >
            <v-list-item-content>
              <v-list-item-title>{{ subItem.menu_name }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon>
              <v-icon left>{{ subItem.menu_icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="red" dark @click="signOut">
            <v-icon left>mdi-logout</v-icon>Keluar
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <a href="/" class="white--text">{{ appName }}</a>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-tooltip bottom>
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
    </v-app-bar>

    <v-container fluid>
      <v-slide-y-transition>
        <router-view></router-view>
      </v-slide-y-transition>
    </v-container>

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
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: 'dashboard',
  data: () => ({
    drawer: null,
    menus: [],
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
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
      removeCart: 'cart/remove',
      setCart: 'cart/set',
    }),
    async navDrawer() {
      await this.axios
        .get("/setup-aplikasi/v1/navigation", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
          params: {
            user_id: this.user.id,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.menus = data;
        })
    },
    checkout() {
      this.dialog = false
      this.$router.push("/checkout")
    },
    signOut() {
      let r = confirm("Apakah anda yakin akan keluar?");

      if (r == true) {
        this.drawer = false;
        this.setAuth({});
        this.setAlert({
          status: true,
          color: "success",
          text: "Logout successfully",
        });
        this.$router.push("/");
      }
    },
  },
  async created() {
    await this.navDrawer()
  },
}
</script>

<style>
a:link {
  text-decoration: none;
}
</style>