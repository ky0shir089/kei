<template>
  <div>
    <v-app-bar app clipped-left class="white">
      <v-app-bar-nav-icon @click.stop="toggle"></v-app-bar-nav-icon>

      <v-toolbar-title class="text-body-2 text-md-h6 font-weight-bold">
        <a href="/" class="text--primary d-flex align-center">
          <v-img src="/img/kei_logo.png" width="64" height="64"></v-img>
          <div class="mx-4">{{ appName.toUpperCase() }}</div>
        </a>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <template v-slot:extension v-if="$vuetify.breakpoint.xs && isHome">
        <v-row align="center" v-if="guest">
          <v-col cols="6">
            <v-btn color="primary" rounded outlined block to="/login">
              <b>Login</b>
            </v-btn>
          </v-col>

          <v-col cols="6">
            <v-btn color="primary" rounded block to="/register">Register</v-btn>
          </v-col>
        </v-row>

        <div class="d-flex align-center ml-auto" v-else>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" class="mx-2" @click="dialog = true">
                <v-badge color="orange" :content="countCart" :value="countCart" overlap>
                  <v-icon>mdi-cart</v-icon>
                </v-badge>
              </v-btn>
            </template>
            <span>Keranjang</span>
          </v-tooltip>

          <div
            class="d-flex align-center"
            @click="$router.push('/dashboard')"
            style="cursor: pointer;"
          >
            <v-avatar>
              <v-img src="/img/profile.png" contain v-if="user.avatar == null"></v-img>
              <v-img :src="getImage(user.avatar)" alt="Avatar" v-else></v-img>
            </v-avatar>

            <div class="flex-column mx-2">
              <b>{{ user.name }}</b>

              <div>{{ user.email }}</div>
            </div>
          </div>
        </div>
      </template>

      <div v-if="$vuetify.breakpoint.smAndUp">
        <div v-if="guest">
          <v-btn color="primary" rounded outlined to="/login">
            <b>Login</b>
          </v-btn>
          <v-btn color="primary" rounded class="mx-2" to="/register">Register</v-btn>
        </div>

        <div class="d-flex align-center" v-else>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" class="mx-2" @click="dialog = true">
                <v-badge color="orange" :content="countCart" :value="countCart" overlap>
                  <v-icon>mdi-cart</v-icon>
                </v-badge>
              </v-btn>
            </template>
            <span>Keranjang</span>
          </v-tooltip>

          <div
            class="d-flex align-center"
            @click="$router.push('/dashboard')"
            style="cursor: pointer;"
          >
            <v-avatar>
              <v-img src="/img/profile.png" contain v-if="user.avatar == null"></v-img>
              <v-img :src="getImage(user.avatar)" alt="Avatar" v-else></v-img>
            </v-avatar>

            <div class="flex-column mx-2">
              <b>{{ user.name }}</b>

              <div>{{ user.email }}</div>
            </div>
          </div>
        </div>
      </div>
    </v-app-bar>

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
  name: 'app-bar',
  data: () => ({
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
  },
  methods: {
    ...mapActions({
      setAuth: "auth/set",
      removeCart: 'cart/remove',
      setCart: 'cart/set',
    }),
    toggle() {
      this.$root.$children[0].drawer = !this.$root.$children[0].drawer
    },
    checkout() {
      this.dialog = false
      this.$router.push("/checkout")
    },
  },
}
</script>

<style>
a:link {
  text-decoration: none;
}
</style>