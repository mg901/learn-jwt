import type { AxiosError } from 'axios';
import axios from 'axios';
import * as user from '@/entities/user';
import { makeAutoObservable } from 'mobx';
import * as api from './api';
import * as types from './types';

class Store {
  user = {} as user.types.User;
  isAuth = false;

  static create() {
    return new this();
  }

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(isAuth: boolean) {
    this.isAuth = isAuth;
  }

  setUser(user: user.types.User) {
    this.user = user;
  }

  registration(email: Email, password: Password) {
    api
      .registration(email, password)
      .then((response) => {
        localStorage.setItem('token', response.accessToken);
        this.setAuth(true);
        this.setUser(response.user);
      })
      .catch((error) => {
        console.log(error.data);
      });
  }

  login(email: Email, password: Password) {
    api
      .login(email, password)
      .then((response) => {
        localStorage.setItem('token', response.accessToken);
        this.setAuth(true);
        this.setUser(response.user);
      })
      .catch((error) => {
        console.log(error.data);
      });
  }

  logout() {
    api
      .logout()
      .then(() => {
        localStorage.removeItem('token');
        this.setAuth(false);
        this.setUser({} as user.types.User);
      })
      .catch((error) => {
        console.log(error.data);
      });
  }

  checkAuth() {
    axios
      .request<types.AuthResponse>({
        url: `${process.env.REACT_APP_API_URL}/refresh`,
        method: 'GET',
        withCredentials: true,
      })
      .then((response) => {
        localStorage.setItem('token', response.data.accessToken);
        this.setAuth(true);
        this.setUser(response.data.user);
      })
      .catch((error: AxiosError) => {
        console.error(error.response?.data);
      });
  }
}

export const store = Store.create();
