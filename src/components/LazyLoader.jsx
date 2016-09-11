// 懒加载
import React, { Component, PropTypes } from 'react';
import * as styles from './LazyLoader.less'

function getOffsetTop(elem) {
  var offsetTop = 0;
  do {
    if (!isNaN(elem.offsetTop)) {
      offsetTop += elem.offsetTop;
    }
  } while (elem = elem.offsetParent);
  return offsetTop;
}
function docScrollY(doc) {
      var dv = doc.defaultView,
          pageOffset = (dv) ? dv.pageYOffset : 0;
      return Math.max(doc['documentElement'].scrollTop, doc.body.scrollTop, pageOffset);
  }
function getWinSize(doc) {
    var win = doc.defaultView || doc.parentWindow,
        mode = doc['compatMode'],
        h = win.innerHeight,
        w = win.innerWidth,
        root = doc['documentElement'];

    if (mode) { // IE, Gecko
        if (mode != 'CSS1Compat') { // Quirks
            root = doc.body;
        }
        h = root.clientHeight;
        w = root.clientWidth;
    }
    return {
        height: h,
        width: w
    };
}

class LazyLoader extends Component {
    constructor(props) {
      super(props)
      // return {};
    }
    // 滚动处理函数
    _scrollHandle(){
      // 未加载完毕，且未处于加载状态
      // 且loader到了可显示区域
      // console.log('this.props.end && !this.props.loading ',this.props.end ,this.props.loading );
      // !this.props.end && !this.props.loading && 
      if(this.props.loading || this.props.end || this.props.show==false){
        return;
      }
      if(getOffsetTop(this.refs['lazy-loader']) - 200 <= 
          getWinSize(document).height + docScrollY(this._ele)){
          this.props.load && this.props.load();
      }
    }
    componentDidMount() {
      this._ele = this.props.scrollBox || document;
      this.__scrollHandle_this = this._scrollHandle.bind(this);
      this._ele.addEventListener('scroll', this.__scrollHandle_this);
    }
    componentWillUnmount() {
      this._ele.removeEventListener('scroll', this.__scrollHandle_this)
    }
    render() {
      if(this.props.show === false){
        return null;
      }
      if(this.props.end && this.props.endTips){
        return <div>加载完毕</div>
      }
      if(!this.props.end)
        return (<div ref="lazy-loader" className={styles["list-loading"]}>
              <span><img src={require('./img/loading.png')} alt="" /></span>加载中
          </div>);
      return null
    }
}

// console.log(React.PropTypes);
LazyLoader.propTypes = {
  // opts: React.PropTypes.any.isRequired
}

export default LazyLoader