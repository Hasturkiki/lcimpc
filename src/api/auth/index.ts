import request from '@/utils/request';
import {AxiosPromise} from 'axios';
import {LoginData, RegisterData, TokenResult} from './types';

/**
 * 用户登录
 */
export function loginApi(data: LoginData): AxiosPromise<TokenResult> {
  return request({
    url: '/login',
    method: 'POST',
    params: data
  });
}

/**
 * 用户注册
 */
export function registerApi(data: RegisterData) {
  return request({
    url: '/register',
    method: 'POST',
    params: data
  });
}

/**
 * 登出
 */
export function logoutApi() {
  return request({
    url: '/user/logout',
    method: 'DELETE'
  });
}
