import React from 'react';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import { Router, Route, IndexRoute, Link } from 'react-router';
import style from './Error.less';

export default class Error extends React.Component{
	render() {
    return (
      <MainLayout title='react-xt' navOpt={{noBack: true}}>
        <div>
          <div className={style.error}>
            <img src={require('../../static/img/error.jpg')} alt="" />
            <p>出错啦！试试返回首页</p>
          </div>
          <div className='btn-box'>
            <Link to="/" className={['m-btn']+ ' ' +['btn-define-m']} >
            去首页</Link>
          </div>
        </div>
    	</MainLayout>
     );
   }
}