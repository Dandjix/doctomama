import Vuex from 'vuex';
import LoginService from './services/LoginService';
import Cookies from 'js-cookie';

export default new Vuex.Store({
  state: {
    session: Cookies.get('session') || '',
    isLoggedIn: !!Cookies.get('session'),
  },
  mutations: {
    setSession(state, session) {
      state.session = session;
      state.isLoggedIn = true;
      Cookies.set('session', session); // Set cookie
    },
    clearSession(state) {
      state.session = '';
      state.isLoggedIn = false;
      Cookies.remove('session'); // Remove cookie
    }
  },
  actions: {
    async login({ commit }, { password }) {
      try {
        const { session, success } = await LoginService.login(password);
        if (success) {
          commit('setSession', session);
        }
        return success;
      } catch (error) {
        console.error('Error during login:', error);
        return false;
      }
    },
    async logout({ commit, state }) {
      try {
        console.log("about to logout");
        const session = state.session
        await LoginService.logout(session)
        commit('clearSession');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },
    tryLoadingSessionCookie({ commit }) {

      const session = Cookies.get('session');
      if (session) {
        commit('setSession', session);
      } else {
        commit('clearSession');
      }
    }
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    session: state => state.session,
  }
});