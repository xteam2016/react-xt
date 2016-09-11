import { handleActions } from 'redux-actions';
import { combineReducer } from 'redux';
const DefaultData = {
  data: {dishlist:[],dishtotal:0,allcount:0,promotionlist:[],category:[]},
  loading: true,
}
const cat = handleActions({
  ['cat/get'](state, action) {
    return { ...state,loading: true};
  },
  ['cat/get/success'](state, action) {
    if(!action.payload.promotionlist){
      action.payload.promotionlist=[]
    }
    return { ...state, data: action.payload, loading: false, };
  },
  ['cat/get/failed'](state, action) {
    return { ...state, err: action.err, loading: false, };
  },
  ['cat/clear/success'](state, action) {
    return DefaultData;
  },
  ['cat/editCart/success'](state, action) {
    const tempData = action.payload;
    let data = {...tempData,dishlist: tempData.dishlist,dishtotal:tempData.dishtotal, allcount:tempData.allcount,promotionlist:tempData.promotionlist,category:tempData.category}
    return { ...state, data,loading: false, };
  },
  ['cat/front/clear'](state, action) {

    return { ...state, ...DefaultData};
  }
}, DefaultData);

export default cat;
