import Vue from 'vue';
import {
  createFormSubmit,
  messageTips
} from './utils';
import axios from './axios-default';
const lang_id = Vue.prototype.lang_id;

// 支付api
export const payment = (id, type, device, e_dollar, token) => {
  let sendData = {
    pay_id: id,
    type: type,
    device: device,
  }
  if (type == 'order') sendData.e_dollar = e_dollar;
  let request = {
    method: 'post',
    url: `api/web/v1/payments/psp?lang_id=${lang_id}`,
    data: sendData,
  }
  if (token) request.headers = {
    'Authorization': `Bearer ${token}`
  }
  axios(request).then(res => {
    if (res.data.code != '1000') {
      messageTips(res.data.code, 'error');
      return false;
    }
    let url = res.data.data.url;
    let data = res.data.data.formData;
    createFormSubmit(url, data);
  });
}

//獲取錢包
export const wallets = () => {
  return new Promise((resolve, rejects) => {
    axios({
      method: 'get',
      url: 'api/web/v1/wallets',
      params: {
        lang_id: lang_id,
      }
    }).then(res => {
      if (res.data.code != '1000') {
        messageTips(res.data.code, 'error');
        return false;
      }
      resolve(res);
    }).catch(error => {
      rejects(error);
    });
  });
}
