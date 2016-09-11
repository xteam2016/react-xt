import React, { Component, PropTypes } from 'react';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import { Router, Route, IndexRoute, Link } from 'react-router';
import styles from './LazyLoader.less';
import LazyLoader from '../../components/LazyLoader'
import {lazyloader} from '../../services/example'
import Datasource from '../../services/datasource';
import ListEmpty from '../../components/ListEmpty';
import Format from '../../utils/format';
import {pageSize} from '../../utils/base';


export default class ExLazyLoader extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      end     : false,
      loading : false,
      pageIndex: 1,
      list   :[],
      listLoaded: false
    }
  }

  componentDidMount() {
    Datasource.bind(this, [
    {
      map:['list:*'],
      fn: lazyloader,
      accumulate: true,
      data:{
          pagesize  : pageSize,
          pageindex : ()=>{
            return this.state.pageIndex
          }
      },
      before:()=>{
        this.state.loading = true;
      },
      success:(res)=>{
        this.state.pageIndex++;
        if(res.code != 0 || !res.data || res.data.length < pageSize){
          this.state.end = true;
        }
        this.state.listLoaded=true
        this.state.loading = false;
      }
    }]);
  }
  // 滚动加载
  load(){
    if(!this.state.loading && !this.state.end){
      this.$ds.update('list')
    }
  }

	render() {
    const {list} = this.state;
      return (
        <MainLayout title={'LazyLoader'} backurl='comlist'>
  		     <div className="g-main">  
            <div className="views">
                <div className={"view "}>
                    {list.map((item,i)=>{
                        return(
                            <div className={styles["list"]} key={i}>
                              <p><img src={require('../../static/img/component.png')} alt="" /></p>
                              <div>
                                  <dl>
                                    <dt>{item.name}</dt>
                                    <dd>{Format.date(new Date(),"yyyy/mm/dd HH:MM:SS")}</dd>
                                  </dl> 
                              </div>
                            </div>
                          )
                      })
                    }
                  <ListEmpty txt={"很抱歉，没有list"} show={ this.state.listLoaded && list.length==0} />
                  <LazyLoader load={this.load.bind(this)} end={this.state.end} loading={this.state.loading} />
                </div>
            </div>
          </div>
  	    </MainLayout>
      );
    }
}
