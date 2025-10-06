import { saveToLocalStorage, loadFromLocalStorage } from './api';

// Local storage keys
const STORAGE_KEYS = {
  PROJECTS: 'youthInvest_projects',
  PORTFOLIO: 'youthInvest_portfolio',
  USER_BALANCE: 'youthInvest_userBalance',
  SIMULATION_DATA: 'youthInvest_simulationData',
  LAST_SYNC: 'youthInvest_lastSync'
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const cacheProjects = (projects) => {
  const cacheData = {
    data: projects,
    timestamp: Date.now()
  };
  saveToLocalStorage(STORAGE_KEYS.PROJECTS, cacheData);
};

export const getCachedProjects = () => {
  const cachedData = loadFromLocalStorage(STORAGE_KEYS.PROJECTS);
  if (!cachedData) return null;
  
  const isExpired = Date.now() - cachedData.timestamp > CACHE_DURATION;
  if (isExpired) {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    return null;
  }
  
  return cachedData.data;
};

export const cachePortfolio = (portfolio) => {
  const cacheData = {
    data: portfolio,
    timestamp: Date.now()
  };
  saveToLocalStorage(STORAGE_KEYS.PORTFOLIO, cacheData);
};

export const getCachedPortfolio = () => {
  const cachedData = loadFromLocalStorage(STORAGE_KEYS.PORTFOLIO);
  if (!cachedData) return null;
  
  const isExpired = Date.now() - cachedData.timestamp > CACHE_DURATION;
  if (isExpired) {
    localStorage.removeItem(STORAGE_KEYS.PORTFOLIO);
    return null;
  }
  
  return cachedData.data;
};

export const cacheUserBalance = (balance) => {
  const cacheData = {
    data: balance,
    timestamp: Date.now()
  };
  saveToLocalStorage(STORAGE_KEYS.USER_BALANCE, cacheData);
};

export const getCachedUserBalance = () => {
  const cachedData = loadFromLocalStorage(STORAGE_KEYS.USER_BALANCE);
  if (!cachedData) return null;
  
  // User balance cache expires after 1 minute for accuracy
  const isExpired = Date.now() - cachedData.timestamp > 60000;
  if (isExpired) {
    localStorage.removeItem(STORAGE_KEYS.USER_BALANCE);
    return null;
  }
  
  return cachedData.data;
};

export const cacheSimulationData = (simulationData) => {
  const cacheData = {
    data: simulationData,
    timestamp: Date.now()
  };
  saveToLocalStorage(STORAGE_KEYS.SIMULATION_DATA, cacheData);
};

export const getCachedSimulationData = () => {
  const cachedData = loadFromLocalStorage(STORAGE_KEYS.SIMULATION_DATA);
  if (!cachedData) return null;
  
  // Simulation data cache expires after 10 minutes
  const isExpired = Date.now() - cachedData.timestamp > 10 * 60 * 1000;
  if (isExpired) {
    localStorage.removeItem(STORAGE_KEYS.SIMULATION_DATA);
    return null;
  }
  
  return cachedData.data;
};

// Utility function to clear all cache
export const clearAllCache = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Utility function to get cache status
export const getCacheStatus = () => {
  const status = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const cachedData = loadFromLocalStorage(key);
    status[name] = {
      exists: !!cachedData,
      timestamp: cachedData?.timestamp || null,
      age: cachedData ? Date.now() - cachedData.timestamp : null
    };
  });
  return status;
};

// Enhanced API wrapper with caching
export const getProjectsWithCache = async (getProjectsAPI) => {
  // Try to get from cache first
  const cachedProjects = getCachedProjects();
  if (cachedProjects) {
    return { success: true, projects: cachedProjects, fromCache: true };
  }
  
  // If not in cache, fetch from API
  try {
    const response = await getProjectsAPI();
    if (response.success) {
      cacheProjects(response.projects);
    }
    return { ...response, fromCache: false };
  } catch (error) {
    throw error;
  }
};

export const getPortfolioWithCache = async (getPortfolioAPI) => {
  // Try to get from cache first
  const cachedPortfolio = getCachedPortfolio();
  if (cachedPortfolio) {
    return { success: true, portfolio: cachedPortfolio, fromCache: true };
  }
  
  // If not in cache, fetch from API
  try {
    const response = await getPortfolioAPI();
    if (response.success) {
      cachePortfolio(response.portfolio);
    }
    return { ...response, fromCache: false };
  } catch (error) {
    throw error;
  }
};

export const getUserBalanceWithCache = async (getUserBalanceAPI) => {
  // Try to get from cache first
  const cachedBalance = getCachedUserBalance();
  if (cachedBalance !== null) {
    return { success: true, balance: cachedBalance, fromCache: true };
  }
  
  // If not in cache, fetch from API
  try {
    const response = await getUserBalanceAPI();
    if (response.success) {
      cacheUserBalance(response.balance);
    }
    return { ...response, fromCache: false };
  } catch (error) {
    throw error;
  }
};

export const getSimulationDataWithCache = async (getSimulationDataAPI) => {
  // Try to get from cache first
  const cachedData = getCachedSimulationData();
  if (cachedData) {
    return { success: true, simulation_data: cachedData, fromCache: true };
  }
  
  // If not in cache, fetch from API
  try {
    const response = await getSimulationDataAPI();
    if (response.success) {
      cacheSimulationData(response.simulation_data);
    }
    return { ...response, fromCache: false };
  } catch (error) {
    throw error;
  }
};

// Investment handler that updates cache
export const makeInvestmentWithCache = async (makeInvestmentAPI, projectId, amount) => {
  try {
    const response = await makeInvestmentAPI(projectId, amount);
    
    if (response.success) {
      // Clear relevant caches to force refresh
      localStorage.removeItem(STORAGE_KEYS.PROJECTS);
      localStorage.removeItem(STORAGE_KEYS.PORTFOLIO);
      localStorage.removeItem(STORAGE_KEYS.USER_BALANCE);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};