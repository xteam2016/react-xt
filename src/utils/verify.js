var verify = {
  isNumber : function(val){
    return /^\d+(\.\d*)?$/.test(val)
  },
  isObject: function(obj){
    return typeof obj === 'object'
  },
  isInt   : function(val){
    return /^\d+$/.test(val)
  },
  isFunction: function(obj){
    return typeof obj === 'function'
  },
  isArray: function(obj){
    return Object.prototype.toString.apply(obj).toLocaleLowerCase() == '[object array]'
  },
  isEmpty:function(obj){
    for(var i in obj){
      return false;
    }
    return true;
  }
}
export default verify;