import Verify from '../utils/verify';

var UNDEFINED = undefined;

function setObjValue(o, path, val) {
    var i,
        p = path.split('.'),
        l = p.length,
        ref = o;
    if (p.length > 0) {
        for (i = 0; ref !== UNDEFINED && i < l - 1; i++) {
            if (!ref[p[i]]) {
                ref[p[i]] = {};
            }
            ref = ref[p[i]]
        }
        ref[p[i]] = val;
    }
    return o;
}

function getObjValue(o, path) {
    if (!Verify.isObject(o)) {
        return UNDEFINED;
    }
    var i,
        p = path.split('.'),
        l = p.length;
    for (i = 0; i < l; i++) {
        if (o !== UNDEFINED) {
            o = o[p[i]];
        } else {
            return UNDEFINED;
        }
    }
    return o;
}

function fnEachDataGroup(component, $dataSource, gIndex, eachGroupFinish) {
    var dsGroup = $dataSource.group[gIndex];
    var gLength = dsGroup && dsGroup.length;
    if (gLength) {
        (function(dsGroup, dsLength) {
            dsGroup.forEach(function(api) {
                api.map.forEach(function(m) {
                    var m = m.split(':');
                    $dataSource.bind[m[0]] = api;
                });
                if (api.lazy) {
                    if (--dsLength === 0) {
                        fnEachDataGroup(component, $dataSource, ++gIndex, eachGroupFinish);
                    }
                    return;
                }
                api.io = io(api, component, function() {
                    if (--dsLength === 0) {
                        api.io = null;
                        fnEachDataGroup(component, $dataSource, ++gIndex, eachGroupFinish);
                    }
                });
            });
        }(dsGroup, dsGroup.length));
        return
    }
    if (gIndex < $dataSource.length) {
        fnEachDataGroup(component, $dataSource, ++gIndex, eachGroupFinish);
    } else {
        eachGroupFinish && eachGroupFinish();
    }
}

function io(api, component, callback) {
    if (api.before && api.before(api) === false) {
        return;
    };
    var params = {};
    for (let n in api.data){
        let p = api.data[n];
        params[n] = Verify.isFunction(p) ? p() : p;
    };
    let pms = api.fn(params);

    
    pms.then(function(res){
        api.first = api.first ? false : true;
        if (api.success) {
            api.success(res);
        }
        api.map.forEach(function(m) {
            m = m.split(':');
            let d = res.data;
            let data = m[1] == '*' ? d : getObjValue(d, m[1] || m[0]);
            // 默认给指定字段赋值
            // 需要累加数据，且原字段未定义时
            // 直接赋值
            if(!api.accumulate || api.accumulate && !component.state[m[0]]){
              component.setState({
                [m[0]]: data
              })
            }else if(data){
              component.setState({
                [m[0]]: component.state[m[0]].concat(data)
              })
            }
        });
        callback && callback();
    }).catch((res)=>{
        console.error('datasource:failure', res);
        console.error(res.stack)
        api.first = api.first ? false : true;
        if (api.failure) {
            api.failure();
            callback && callback();
        }      
    })
    return pms;
    // if (api.headers) {
    //     httpCfg.headers = api.headers;
    // }
    // httpCfg[httpCfg.method == 'POST' ? 'data' : 'params'] = params;
    // $http(httpCfg).
    // success(function(res, cfg) {
    //     api.first = api.first ? false : true;
    //     if (api.success) {
    //         api.success(res);
    //     }
    //     var data = res.data;
    //     api.map.forEach(api.map, function(m) {
    //         var m = m.split(':');
    //         setObjValue(component, m[0], m[1] == '*' ? data : getObjValue(data, m[1] || m[0]))
    //     });
    //     callback && callback();
    // }).
    // error(function(res) {
    //     // api.first = api.first ? false : true;
    //     // if (api.failure) {
    //     //     api.failure();
    //     //     callback && callback();
    //     // }
    //     // if(!api.ignoreError){
    //     //     toast.push('接口异常！');
    //     // }
    // });
}
module.exports = {
    bind: function(component, $dataSource, bindCbl) {
        if (!$dataSource.length) {
            return;
        }
        $dataSource.component = component;
        $dataSource.cancel = function(){
          var api;
          // debugger
          for (var k in this.bind) {
            api = this.bind[k];
            if(api.io){
              // debugger
              // api.io.cancel()
            }
          }
        }
        component.$ds = $dataSource;
        if(component.componentWillUnmount){
          component._componentWillUnmount = component.componentWillUnmount;
        }
        component.componentWillUnmount = (function(){
          this._componentWillUnmount && this._componentWillUnmount();
          // debugger
          this.$ds.cancel()
          // debuggermnmn
        }).bind(component)
        
        $dataSource.bind = {};
        /**
         * 更新数据源
         * @param  {String} key      要更新的字段
         * @param  {Object} data     参数
         * @param  {Boolean} overlay 是否覆盖之前的参数
         */
        $dataSource.update = function(key, data, overlay) {
            if (data) {
                this.data.apply(this, arguments);
            }
            var api;
            for (var k in this.bind) {
                if (k === key) {
                    api = this.bind[key];
                }
            }
            api.io = io(this.bind[key], this.component, function(){
              api.io = null;
            });
        };
        $dataSource.data = function(key, data, overlay) {
            var api;
            for (var k in this.bind) {
                if (k === key) {
                    api = this.bind[key];
                }
            }
            if (data) {
                if (overlay || !this.bind[key].data) {
                    api.data = assign({},data);
                } else {
                    Object.assign(api.data, data);
                }
            }
            return api.data;
        }
        $dataSource.group = []
        $dataSource.forEach(function(ds, idx) {
            var i = Verify.isInt(ds.order) ? ds.order : 1;
            $dataSource.group[i] = $dataSource.group[i] || [];
            $dataSource.group[i].push(ds);
        });
        // if ($rootScope.__ready) {
        fnEachDataGroup(component, $dataSource, 0, bindCbl);
        // } else {
        //     $rootScope.$on('appReady', function() {
        //         fnEachDataGroup(component, $dataSource, 0, bindCbl);
        //     })
        // }
    }
}