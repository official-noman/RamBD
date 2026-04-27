import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MockEndPoints } from "__server__";

// Axios instance
const axiosInstance = axios.create({
  // baseURL: "/remote-api",
  timeout: 20000,
});

// Basic retry mechanism
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (!config || !config.retry) config.retry = 0;

    // Retry up to 2 times for timeouts, socket errors, or server errors
    if (config.retry < 2 && (
      error.code === 'ECONNABORTED' ||
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT' ||
      error.message?.includes('socket hang up') ||
      (error.response && error.response.status >= 500)
    )) {
      config.retry += 1;
      console.log(`Retrying request (${config.retry}): ${config.url}`);
      return axiosInstance(config);
    }
    return Promise.reject(error);
  }
);

// passThrough: true ensures any request NOT matched by a mock endpoint
// goes through to the real network instead of getting a Network Error
export const Mock = new MockAdapter(axiosInstance, { onNoMatch: "passthrough" });
MockEndPoints(Mock);

export default axiosInstance;
