import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, Link } from 'react-router';
import DataSource from '../../services/datasource.js'
import * as Service from '../../services/view.js'
import MainLayout from '../../layouts/MainLayout/MainLayout';
import style from './Detail.less';

export default class ComDetail extends React.Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }
  componentDidMount() {
    DataSource.bind(this, [
    {
        map:['info:*'],
        fn: Service.getComponentsDetail,
        data: {
            cid: this.props.params.id
        }
    }]);     
  }
  render() {
    const {info={}} = this.state;
    const url= info.url?info.url:'javascript:;';
      return (
        <MainLayout backurl="comlist" title={info.title}>
          <div>
            <div className={style['c-balance']}>
              <img src={require('../../static/img/component.png')} alt="" />
              <p>{info.title}</p>
              <p>{info.des}</p>
            </div>
            <div className={['btn-box']+ ' ' +style['btn-box']}>
              <Link to={url} className={['m-btn']+ ' ' +['btn-define-m']}>去试试</Link>
            </div>
          </div>
	    	</MainLayout>
      );
    }
}