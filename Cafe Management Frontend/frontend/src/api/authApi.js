import axios from 'axios';

const BASE_URL = 'http://localhost:8082';

export const registerCustomer = async (formData) => {
  return axios.post(`${BASE_URL}/customer/register`, formData);
};

export const loginCustomer = async (credentials) => {
  return axios.post(`${BASE_URL}/customer/login`, credentials);
};

export const makeReservation = async (reservationData) => {
  return axios.post(`${BASE_URL}/reservation/add`, reservationData);
};
