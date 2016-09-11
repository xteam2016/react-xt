import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, Link } from 'react-router';
import style from './Center.less';

class Center extends React.Component{

  constructor(props){
    super(props)
  }

  componentWillMount() {
  }

	render() {
      return (
		     <div className={style['personal']}>
          <div className={style.login} >
            <div className={style.portrait} > 
            <Link to="/"><img src={require('./img/x.jpg')} alt= "" /> </Link>
            </div> 
            <div className={style.username} >
              x-team
            </div> 
          </div>
          <div className={style['list']}>
            <Link className={style['list_item']} to="comlist">
              <span className={style.lst_title}><i className='m-icon i-card'></i>组件列表</span>
              <span><i className='m-icon i-next'></i></span>
            </Link>
            <Link className={style['list_item']} to="promotion">
              <span className={style.lst_title}><i className='m-icon i-privilege'></i>关于我们</span>
              <span><i className='m-icon i-next'></i></span>
            </Link>
          </div>
        </div>
      );
    }
}

export default connect(function(){
  return {}
})(Center);