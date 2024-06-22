import { fetchPlanningData } from '../models/Planning';

const PlanningService = {
  async getPlanningData() {
    try {
      return await fetchPlanningData();
    } catch (error) {
      console.error('PlanningService Error:', error);
      throw error; // Re-throw the error to handle it in the component
    }
  },
};

export default PlanningService;