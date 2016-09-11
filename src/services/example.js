// 订单相关操作
import xFetch from './xFetch.js'

/**
 * 获取lazyloader demo列表
 * @param  {[type]} options.pageindex       页码
 * @param  {[type]} options.pagesize        页大小
 */
export async function lazyloader({pageindex, pagesize}) {
  return xFetch.get($config.api+'/api/v1/example/lazyloader',{
    pageindex,
    pagesize
  });
}
