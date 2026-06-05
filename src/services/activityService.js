//activityService.js
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

export const getActivities =
  async (workspaceId) => {

    const token =
      localStorage.getItem(
        "token"
      );

    const config = {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    };

    const { data } =
      await axios.get(
        `${API_URL}/api/activities/${workspaceId}`,
        config
      );

    return data;
  };