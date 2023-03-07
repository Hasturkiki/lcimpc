/**
 * 登录数据类型
 */
export interface LoginData {
  username: string;
  password: string;
}

/**
 * 注册数据类型
 */
export interface RegisterData {
  username: string
  password: string
  type: number
  telephone: string
  email: string
}

/**
 * Token响应类型
 */
export interface TokenResult {
  accessToken: string;
  refreshToken: string;
  expires: number;
}
