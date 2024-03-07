import axios from 'axios'

const API = 'http://192.168.100.218:8080/api'

export const fetchSupervisors = async () => {
  const response = await axios.get(`${API}/supervisors`)
  return response.data.data;
}


export const register = async (userData) => {
  const response = await axios.post(`${API}/submit`, userData)
  return response.data;
}