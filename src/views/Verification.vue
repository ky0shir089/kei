<template>
  <div>
    <v-app-bar app color="primary" dark dense v-if="$vuetify.breakpoint.smAndUp">
      <v-toolbar-title>
        <a href="/" class="white--text">{{ appName }}</a>
      </v-toolbar-title>
    </v-app-bar>

    <v-container fluid class="fill-height">
      <div class="blue white--text my-16">
        <ul>
          <li>
            <h1>Terima kasih anda telah mendaftar</h1>
          </li>

          <li>
            <h1>Silahkan tunggu beberapa saat dan cek email anda pada folder inbox / spam untuk mendapatkan link aktivasi</h1>
          </li>
        </ul>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "verification"
}
</script>

<style>
</style>