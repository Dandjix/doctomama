
const WeekPlanningService = {
  async getPlagesHoraires(session) {
    try {
        return await getPlagesHoraires(hashed_password);
    } catch (error) {
      console.error('WeekPlanningService Error:', error);
      throw error; // Re-throw the error to handle it in the component
    }
  },

  async setPlagesHoraires(session,events){
    
  }
};

export default WeekPlanningService;