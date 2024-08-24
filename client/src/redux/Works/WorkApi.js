import axios from "axios";
import { getCurrentWorks } from "./WorksSlice";
import API_URL from "./api";

export const searchWorks = async (dispatch, date) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/searchWorks/${date}`);
    console.log(data);
    dispatch(getCurrentWorks(data));
  } catch (error) {
    console.error(error);
  }
};

export const getWorks = async (dispatch) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/works`);

    console.log(data);
    dispatch(getCurrentWorks(data));
  } catch (error) {
    console.error(error);
  }
};

export const createWorks = async (dispatch, createContent) => {
  try {
    const response = await axios.post(`${API_URL}/api/addworks`, createContent);
    console.log(response);
    // dispatch(getCurrentWorks(data));
  } catch (error) {}
};
