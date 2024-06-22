import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Assuming you have a router setup
import store from './store'; // Assuming you have a Vuex store setup

const app = createApp(App);

// Register plugins
app.use(router);
app.use(store);

// Mount the app
app.mount('#app');

store.dispatch('tryLoadingSessionCookie');
