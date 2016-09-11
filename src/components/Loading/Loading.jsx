import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import style from './Loading.less';
import classnames from 'classnames';

export default class Loading extends Component{
   
  render(){
    if(this.props.show == false){
      return null;
    }
    let newClass = this.props.newClass||'';
      return (
        <div>
            <div className={style['loading'] + ' ' + newClass}><img src={require('../../static/img/loading.gif')} alt="" /><p>努力加载中...</p></div>
        </div>
      );
  }
}
Loading.propTypes = {
	//data: PropTypes.object.isRequired,
	//onToggleComplete: PropTypes.func.isRequired,
};

