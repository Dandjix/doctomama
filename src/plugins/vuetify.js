// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import {fr} from 'vuetify/locale'

export default createVuetify({
    locale: {
      locale:'fr',
      fallback:'en',
      messages:{fr}
    }
  }
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
)
