import Vuex from 'vuex';
import LoginService from './services/LoginService';
import Cookies from 'js-cookie';

export default new Vuex.Store({
  state: {
    session: Cookies.get('session') || '',
    isLoggedIn: !!Cookies.get('session'),
    heure_debut_calendrier:"00:00",
    heure_fin_calendrier:"00:00",

    email_patient:""
  },
  mutations: {
    SET_SESSION(state, session) {
      state.session = session;
      state.isLoggedIn = true;
      Cookies.set('session', session,'3h'); // Set cookie
    },
    CLEAR_SESSION(state) {
      state.session = '';
      state.isLoggedIn = false;
      Cookies.remove('session'); // Remove cookie
    },
    SET_PATIENT_EMAIL(state,email){
      state.email_patient = email;
    }
  },
  actions: {
    async login({ commit }, { password }) {
      try {
        const { session, success } = await LoginService.login(password);
        if (success) {
          commit('SET_SESSION', session);
        }
        return success;
      } catch (error) {
        console.error('Error during login:', error);
        return false;
      }
    },
    async logout({ commit, state }) {
      try {
        // console.log("about to logout");
        const session = state.session
        await LoginService.logout(session)
        commit('CLEAR_SESSION');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },
    tryLoadingSessionCookie({ commit }) {

      const session = Cookies.get('session');
      if (session) {
        commit('SET_SESSION', session);
      } else {
        commit('CLEAR_SESSION');
      }
    },
    setPatientEmail({commit},newEmail) {
      commit('SET_PATIENT_EMAIL',newEmail)
    }
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    session: state => state.session,
    email_patient:state =>state.email_patient
  }
});