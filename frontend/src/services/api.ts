import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '30000');

class APIService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Error interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        let message = 'An error occurred';
        
        if (error.response) {
          message = error.response.data?.detail || error.response.statusText || message;
        } else if (error.request) {
          message = 'No response from server. Please check your connection.';
        } else {
          message = error.message;
        }
        
        return Promise.reject(new Error(message));
      }
    );
  }

  async analyzeVideo(url: string) {
    const response = await this.client.post('/analyze', { url });
    return response.data;
  }

  async getVideo(videoId: string) {
    const response = await this.client.get(`/videos/${videoId}`);
    return response.data;
  }

  async listVideos(skip: number = 0, limit: number = 50) {
    const response = await this.client.get('/videos', {
      params: { skip, limit }
    });
    return response.data;
  }

  async checkStatus(videoId: string) {
    const response = await this.client.get(`/status/${videoId}`);
    return response.data;
  }
}

export const apiService = new APIService();
