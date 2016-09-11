import { takeLatest } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { getPromotionD,getPromotionUser,getUserAddressList } from '../services/view.js';

function* getPromotionDS(action) {

    try {
        //通过action.style判断请求地址 view,select
        let data;
        if(action.style == 'view'){
            data  = yield call(getPromotionD,action.data);
        }else{
            data  = yield call(getPromotionUser,action.data);
        }
        if (data) {
          yield put({
            type: 'promotionD/get/success',
            lists: data.data.list
          });
        }
        } catch (err) {
        console.error(err);
    }
}



function* watchPromotionDGat() {
    yield takeLatest('promotionD/get', getPromotionDS)
}



export default function* () {
    yield fork(watchPromotionDGat);
    // Load todos.
    // console.log('ss')
    // yield put({
    //   type: 'menus/get',
    // });
}
