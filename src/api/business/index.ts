import request from "@/utils/request";
import {BusinessQuery, BusinessForm, BusinessStartForm} from './types';

export default {
  /**
   * 获取业务分页列表
   *
   * @param queryParams
   */
  listBusinessPages: (queryParams: BusinessQuery) => request({
    url: '/business/getBusinessListVoByPage',
    method: 'GET',
    params: queryParams
  }),

  /**
   * 获取业务表单详情
   *
   * @param businessId
   */
  getBusinessForm: (businessId: number) => request({
    url: '/business/' + businessId,
    method: 'GET'
  }),

  /**
   * 添加业务
   */
  addBusiness: (data: BusinessForm) => request({
    url: '/business/AdminAddBusiness',
    method: 'POST',
    data
  }),

  startBusiness: (data: BusinessStartForm) => request({
    url: '/business/businessStart',
    method: 'PUT',
    params: {
      id: data.id,
      goodsIds: data.goodsIds
    }
  }),

  /**
   * 修改业务
   *
   * @param data
   */
  updateBusiness: (data: BusinessForm) => request({
    url: '/business/updateBusiness',
    method: 'PUT',
    data
  }),

  /**
   * 删除业务
   *
   * @param ids
   */
  deleteBusinessList: (ids: string) => request({
    url: '/business//businessCancel' + ids,
    method: 'DELETE'
  }),

  /**
   * 企业确认业务已完成
   *
   * @param id
   */
  completeBusiness: (id: number) => request({
    url: '/business/businessComplete',
    method: 'PUT',
    params: {
      id
    }
  }),

  /**
   * 取消业务
   *
   * @param id
   */
  cancelBusiness: (id: number) => request({
    url: '/business/businessCancel',
    method: 'PUT',
    params: {
      id
    }
  })
}
