import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const login = async (email, password) => {
  try {
      const body = { email, password };
      const response = await axios.post(`${apiUrl}/login`, body);

      if (response.status === 200) {
          return response.data;
      } else {
          return null;
      }
  } catch (error) {
      console.error('Error during login:', error);
      return null;
  }
};

