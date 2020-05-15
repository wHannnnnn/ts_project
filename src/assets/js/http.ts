import axios from 'axios'
import qs from 'qs'
import router from "@/router";
import { Dialog, Notify, Toast} from 'vant'
axios.defaults.baseURL = 'https://api.it120.cc/wanghan/'
const CancelToken = axios.CancelToken;
let cancel;
//请求拦截器
axios.interceptors.request.use((config: any) => {
  //发起请求时，取消掉当前正在进行的相同请求
  // if (promiseArr[config.url]) {
  //     promiseArr[config.url]('操作取消')
  //     promiseArr[config.url] = cancel
  // } else {
  //     promiseArr[config.url] = cancel
  // }
  return config
}, (error: any) => {
  return Promise.reject(error)
})

//响应拦截器即异常处理
axios.interceptors.response.use((response: any) => {
  return response
}, (err: any) => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '错误请求'
        break;
      case 401:
        err.message = '未授权，请重新登录'
        break;
      case 403:
        err.message = '拒绝访问'
        break;
      case 404:
        err.message = '请求错误,未找到该资源'
        break;
      case 405:
        err.message = '请求方法未允许'
        break;
      case 408:
        err.message = '请求超时'
        break;
      case 500:
        err.message = '服务器端出错'
        break;
      case 501:
        err.message = '网络未实现'
        break;
      case 502:
        err.message = '网络错误'
        break;
      case 503:
        err.message = '服务不可用'
        break;
      case 504:
        err.message = '网络超时'
        break;
      case 505:
        err.message = 'http版本不支持该请求'
        break;
      default:
        err.message = `连接错误${err.response.status}`
    }
  } else {
    err.message = "连接到服务器失败"
  }
  Notify({ type: 'danger', message: err.message });
  return Promise.resolve(err.response)
})
function getToken(){
  if (!localStorage.getItem('token')) {
    return ''
  }
  return localStorage.getItem('token');
}
//设置默认请求头
// axios.defaults.headers = {
//     "content-type": 'application/x-www-form-urlencoded'
// }

export default {
  //get请求
    get (url: string,param: any) {
      return new Promise((resolve,reject) => {
        axios({
          method: 'get',
          url,
          params: Object.assign({token: getToken()},param),
          headers: { "content-type": 'application/x-www-form-urlencoded' },
          cancelToken: new CancelToken((c: any) => {
            cancel = c
          })
        }).then((res: any) => {
          if(res.data.code == 2000){
            Toast.clear()
            Dialog.confirm({
              message: '请先进行登录'
            }).then(() => {
              router.push({path: '/login'})
            }).catch(() => {
              // on cancel
            });
          } else {
            resolve(res)
          }
        }).catch((res: any)=>{
          Toast.clear()
          reject(res)
        })
      })
    },
  //post请求
    post (url: string,data: any) {
      return new Promise((resolve,reject) => {
        axios({
          method: 'post',
          url,
          data: qs.stringify(Object.assign({token: getToken()}, data)),
          headers: {
            "content-type": 'application/x-www-form-urlencoded'
          },
          cancelToken: new CancelToken((c: any) => {
            cancel = c
          })
        }).then((res: any) => {
            if(res.data.code == 2000){
              Toast.clear()
              Dialog.confirm({
                message: '请先进行登录'
              }).then(() => {
                router.push({path: '/login'})
              }).catch(() => {
                // on cancel
              });
            } else {
              resolve(res)
            }
        }).catch((res: any) => {
          Toast.clear();
          reject(res)
        })
      })
    },
    file(url: string, data: any) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url,
          data: data,
          headers: {
            "content-type": 'multipart/form-data'
          },
          cancelToken: new CancelToken((c: any) => {
            cancel = c
          })
        }).then((res: any) => {
          if (res.data.code == 2000) {
            Toast.clear()
            Dialog.confirm({
              message: '请先进行登录'
            }).then(() => {
              router.push({ path: '/login' })
            }).catch(() => {
            });
          } else {
            resolve(res)
          }
        })
      })
    },
    pic(url: string, param: any) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url,
          responseType: 'blob',
          params: Object.assign({ token: getToken() }, param),
          cancelToken: new CancelToken((c: any) => {
            cancel = c
          })
        }).then((res: any) => {
            resolve(res)
        }).catch((res: any) => {
          reject(res)
        })
      })
    },
  }
