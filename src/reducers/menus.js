import { handleActions } from 'redux-actions';
import { combineReducer } from 'redux';

const DefaultData = {
  time:'',
  shop:{loading:true,name:'',activelist:[],supplierdishlist:[],isopendoor:true},
  lists: {},
  loading: true
};

const menus = handleActions({
  ['menus/get'](state, action) {
    return { ...state,loading: true};
  },
  ['menus/get/success'](state, action) {
    let lists = state.lists;
    lists[action.categoryid] = action.payload;
    //时间处理为本地偏移时间
    let tempTime = action.time - new Date().getTime();
    return { ...state, lists: lists, loading: false, time:tempTime};
  },
  ['menus/get/failed'](state, action) {
    return { ...state, err: action.err, loading: false, };
  },
  ['menus/toggleComplete'](state, action) {
    const id = action.payload;
    const newList = state.list.map(todo => {
      if (id === todo.id) {
        return { ...todo, isComplete: !todo.isComplete };
      } else {
        return todo;
      }
    });
    return { ...state, list: newList, };
  },
  ['menus/toggleCompleteAll'](state, action) {
    const isComplete = action.payload;
    const newList = state.list.map(todo => ({ ...todo, isComplete }));
    return { ...state, list: newList, };
  },
  ['menus/getShopInfo/success'](state, action) {
    const shop = {...action.payload,loading:false}
    return { ...state, shop: shop,loading:false };
  },
  ['menus/getShopInfo'](state, action) {

    return { ...state};
  },
  ['menus/clear'](state, action) {

    return { ...state, ...DefaultData};
  }


}, DefaultData);

export default menus;
