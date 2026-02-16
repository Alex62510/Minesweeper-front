import api from '../store/axios';

export type GameResultDto = {
  userId: number;
  email: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  time: number;
};

export const GamesApi = {
  async getResults() {
    const { data } = await api.get('/games/results');
    return data;
  },

  async saveResult(dto: GameResultDto) {
    const { data } = await api.post('/games/result', dto);
    return data;
  },
};
