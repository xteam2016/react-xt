import fetch from 'isomorphic-fetch';
import { Modal} from 'antd-mobile';

const alert = Modal.alert;

function check404(res) {
    if (res.status === 404) {
        // return Promise.reject(errorMessages(res));
        res.error = true;
        res.jsonResult = {
          msg:'接口404了',
          code: 404,
          data:{}
        }
    }
    if (res.status === 401) {
        // return Promise.reject(errorMessages(res));
        res.error = true;
        res.jsonResult = {
          msg:'无访问权限',
          code: 401,
          data:{}
        }
    }
    // else if(res.status >= 200 && res.status < 300){
    //     return res;
    // }
    return res;
}

function jsonParse(res) {
    if(res.error){
      return res;
    }
    try{
        return res.json().then(jsonResult => {
          return ({...res,
            jsonResult
          })
        }).catch(err=>{
          return res
        });
    }catch(error){
        console.error('加载失败', res);
        return res
    }
}

function errorMessageParse(res) {
    if(!res.jsonResult){
      alert('','网络不稳定')
      return {
        msg:'接口异常',
        code: 101,
        data:{}
      }
    }
    const {
        code,
        msg
    } = res.jsonResult;
    if (code == 1) {
        setTimeout(
          function(){
            alert('',msg || '接口异常')
          }, 350)
        //console.error('接口结果', res.jsonResult);
        // return Promise.reject(msg || '接口异常');
    }
    //console.log('errorMessageParse', res.jsonResult);
    return res.jsonResult;
}
function toQueryString(obj) {
    return obj ? Object.keys(obj).sort().map(function(key) {
        var val = obj[key];
        if (Array.isArray(val)) {
            return val.sort().map(function(val2) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
            }).join('&');
        }
        return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : '';
}
function checkError(error) {
    if(error.timeout){
        alert('','网络请求超时')
    }
    return {
      code: 103,
      msg: error,
      data:{}
    }
}
function timer(t) {
    return new Promise(resolve=>setTimeout(function(){
        let error ={timeout:true}
        resolve(error)
    }, t));
}
function checkTimeout(obj){
    if(obj.timeout){
      return {
        msg:'接口超时',
        code: 101,
        data:{}
      }
    }

    return obj;
}
window.$config = window.$config || {}; 

class xFetch {
    static io(url, options={}) {
        const opts = {
          ...options
        };
        opts.headers = {...opts.headers,
            authorization: window.$config.token || ''
        };
        return Promise.race([ fetch(url, opts), timer(30000)])
        .then(checkTimeout)
        .then(check404)
        .then(jsonParse)
        .then(errorMessageParse)
        .catch(checkError);
    }
    static get(url, params) {
        if (params) {
            url += (url.indexOf('?') > -1 ? '&' : '?') + toQueryString(params)
        }
        return this.io(url)
    }
    static post(url, data) {
        let opts = {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
            // body: toQueryString(data)
        }
        return this.io(url, opts)
    }
}
export default xFetch;