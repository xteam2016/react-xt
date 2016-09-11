// 用户相关操作
// 
import xFetch from './xFetch.js'
import WebStorageCache from '../components/web-storage-cache.js'





//获取组件列表
export async function getComponentsList() {
  return xFetch.get($config.api+'/api/v1/components/list');
}
//获取组件详情
export async function getComponentsDetail(data) {
  return xFetch.get($config.api+'/api/v1/components/detail',data);
}




/**
 * 获取全部优惠
 * @return {[type]} [description]
 */
export async function getPromotionD(data) {
  return xFetch.get('/api/activity/activitylist',data);

}



//获取购物车
export async function getRestaurantList(data) {
  return xFetch.get('/aj/supplier/list',data);
  // WaiMaiDingCan/Supplier/GetDishInfoByCategoryId
  // return xFetch.io('/aj/userinfo',{
  //   token:'tkk'
  // });
}

//获取地址
export async function getLocation() {
    return new Promise(function(resolve, reject) {
        //2种获取方式，先查找缓存
        var wsCache = new WebStorageCache();
        var location = wsCache.get('location')
        if(location){
             resolve(location);
        }


        // 浏览器定位
        var geoc = new BMap.Geocoder(), // 地址解析器的实例
            convertor = new BMap.Convertor(); // 坐标转换，纠偏
        var getPosition = function(successCallback, errorCallback, type) {
                var isError = false;
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function(value) {
                            var longitude = value.coords.longitude;
                            var latitude = value.coords.latitude;
                            if (type == 'baidu') {
                                lo.convertGpsToBaidu(longitude, latitude, successCallback);
                            } else {
                                successCallback({
                                    lng: longitude,
                                    lat: latitude
                                });
                            }
                        },
                        function(err) {
                            // 请求错误后，规避第二次请求
                            if (isError) {
                                return;
                            }
                            isError = true;
                            switch (err.code) {
                                case err.TIMEOUT:
                                    errorCallback("连接超时请重试");
                                    break;
                                case err.PERMISSION_DENIED:
                                    errorCallback("您拒绝了使用共享位置");
                                    break;
                                case err.POSITION_UNAVAILABLE:
                                    errorCallback("抱歉，无法通过您的浏览器获取您的信息");
                                    break;
                                default:
                                    errorCallback("未知错误");
                                    break;
                            }
                        }, {
                            enableHighAccuracy: true, //表示是否启用高精确度模式，如果启用这种模式，浏览器在获取位置信息时可能需要耗费更多的时间
                            maximumAge: 1000, //表示浏览器重新获取位置信息的时间间隔
                            timeout: 5000 //表示浏览需要在指定的时间内获取位置信息，否则触发errorCallback。
                        });
                } else {
                    errorCallback("抱歉，无法通过您的浏览器获取您的信息");
                }
            },

            // 成功回调
            successCallback = function(coords) {
                var pointArr = [];
                pointArr.push(new BMap.Point(coords.lng, coords.lat));
                convertor.translate(pointArr, 1, 5, coordsTranslateCallback)
            },

            // 失败回调
            errorCallback = function(msg) {
                resolve({
                    error: 1
                });
            },

            // 纠偏
            coordsTranslateCallback = function(data) {
                if (data.status == 0) {
                    geoc.getLocation(new BMap.Point(data.points[0].lng, data.points[0].lat), translateCallback);
                }
            },

            // 解析地址
            translateCallback = function(rs) {
                //保存在浏览器缓存
                var wsCache = new WebStorageCache();
                wsCache.set('location', rs, {exp : 100});
                resolve(rs);
            };

        getPosition(successCallback, errorCallback);
    });
}
