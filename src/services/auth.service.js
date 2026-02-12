import api from './api';
import * as SecureStore from 'expo-secure-store';

const login = async (username, password) => {
  const response = await api.post('/auth/signin', {
    username,
    password,
  });
  if (response.data.accessToken) {
    await SecureStore.setItemAsync('userToken', response.data.accessToken);
    await SecureStore.setItemAsync('userInfo', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = async () => {
  await SecureStore.deleteItemAsync('userToken');
  await SecureStore.deleteItemAsync('userInfo');
};

const getCurrentUser = async () => {
  const userInfo = await SecureStore.getItemAsync('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

export default {
  login,
  logout,
  getCurrentUser,
};
