import { takeLatest } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { getMenus,addDish,deleteDish,getCat,getShopInfo,clearCat } from '../services/menus';
//获取分类菜单
function* getMenusS(action) {

    try {
        const { code,data } = yield call(getMenus,action.payload.categoryId,action.payload.supplierId);
        if (code==0) {
          yield put({
            type: 'menus/get/success',
            payload: data.list,
            categoryid:action.payload.categoryId,
            time:data.time
          });
        }
        } catch (err) {
        console.error(err);
    }
}

//获取购物车
function* getCatS(action) {
    try {
       
        const { data } = yield call(getCat,action.payload);
        if (data) {
            //如果购物车为空，自动跳回点菜页面
            if(data.dishlist.length == 0 && action.payload.toMenu){
                const type = action.payload.type == 1?'take-out':'dineIn'
                action.router.push('menu/'+type+'/'+action.payload.supplierid)
                return
            }
          yield put({
            type: 'cat/get/success',
            payload: data
          });
        }
        } catch (err) {
        console.error(err);
    }
}

//编辑购物车
function* editCartS(action) {
    try {
        
        //加减2个接口
        let data = {};
        const cartid = '333333-'+action.payload.supplierid+'-'+action.payload.type;
        if(action.payload.method == 'add'){
            data  = yield call(addDish,action.payload);
        }else{
            data  = yield call(deleteDish,action.payload);
        }
        
        if (data.code == 0) {
          yield put({
            type: 'cat/editCart/success',
            payload: data.data,
            categoryid:action.payload.categoryId
          });
        }
        } catch (err) {
        console.error(err);
    }
}

//获取店铺信息
function* editShopInfoS(action) {

    try {
        const { data,code } = yield call(getShopInfo,action.payload);
        if (code==0) {
            yield put({
                type: 'menus/getShopInfo/success',
                payload: data,
                categoryid:action.payload.categoryId
            });
            //成功后出发菜品以及购物车
            //获取菜品
            // yield put({
            //     type: 'menus/get',
            //     payload:{categoryId:949702,supplierId:2}
            // });
            //获取购物车
            yield put({
                type: 'cat/get',
                router: action.router,
                payload:{supplierid:action.payload.supplierid,type:action.payload.menutypeid}
                //payload:{cartid:'5775139-'+action.payload.supplierid+'-'+action.payload.menutypeid}
            });
        }
        } catch (err) {
        console.error(err);
    }
}

function* clearCatS(action) {
    try {
        const { data } = yield call(clearCat,action.payload);
        if (data) {
            yield put({
                type: 'cat/clear/success'
            });
        }
        } catch (err) {
        console.error(err);
    }
}

function* watchMenusGet() {
    yield takeLatest('menus/get', getMenusS)
}
function* watchEditCart() {
    yield takeLatest('cat/editCart', editCartS)
}
function* watchCatGet() {
    yield takeLatest('cat/get', getCatS)
}
function* watchShopInfoGet() {
    yield takeLatest('menus/getShopInfo', editShopInfoS)
}
function* watchClearCat() {
    yield takeLatest('cat/clear', clearCatS)
}
export default function* () {
    yield fork(watchMenusGet);
    yield fork(watchEditCart);
    yield fork(watchCatGet);
    yield fork(watchShopInfoGet);
    yield fork(watchClearCat);
    // Load todos.
    // console.log('ss')
    // yield put({
    //   type: 'menus/get',
    // });
}
