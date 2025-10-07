import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projects API
export const getProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Investment API
export const makeInvestment = async (projectId, amount) => {
  try {
    const response = await api.post('/invest', {
      project_id: projectId,
      amount: amount,
      user_id: 1, // Default user for demo
    });
    return response.data;
  } catch (error) {
    console.error('Error making investment:', error);
    throw error;
  }
};

// Portfolio API
export const getPortfolio = async () => {
  try {
    const response = await api.get('/portfolio');
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};

// Simulation API
export const getSimulationData = async () => {
  try {
    const response = await api.get('/simulation');
    return response.data;
  } catch (error) {
    console.error('Error fetching simulation data:', error);
    throw error;
  }
};

// User API
export const getUserBalance = async () => {
  try {
    const response = await api.get('/user/balance');
    return response.data;
  } catch (error) {
    console.error('Error fetching user balance:', error);
    throw error;
  }
};

export const resetUserBalance = async () => {
  try {
    const response = await api.post('/user/reset-balance', {
      user_id: 1 // Default user for demo
    });
    return response.data;
  } catch (error) {
    console.error('Error resetting user balance:', error);
    throw error;
  }
};

export const updateInvestments = async () => {
  try {
    const response = await api.post('/user/update-investments', {
      user_id: 1 // Default user for demo
    });
    return response.data;
  } catch (error) {
    console.error('Error updating investments:', error);
    throw error;
  }
};

export const getInvestmentPerformance = async () => {
  try {
    const response = await api.get('/user/investment-performance');
    return response.data;
  } catch (error) {
    console.error('Error fetching investment performance:', error);
    throw error;
  }
};

// Local Storage helpers
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

export const clearLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export default api;