import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

export const getActivities =
  async (workspaceId) => {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    const config = {
      headers: {
        Authorization:
          `Bearer ${user.token}`
      }
    };

    const { data } =
      await axios.get(
        `${API_URL}/api/activities/${workspaceId}`,
        config
      );

    return data;
  };