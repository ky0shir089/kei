import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#107C42',
        secondary: '#21A365',
        tertiary: '33C481'
      },
    },
  },
});
