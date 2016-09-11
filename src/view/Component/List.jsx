import React, { Component, PropTypes } from 'react';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import { Link,withRouter } from 'react-router';
import style from './List.less';
import LazyLoader from '../../components/LazyLoader'
import DataSource from '../../services/datasource.js'
import * as Service from '../../services/view.js'
import ListEmpty from '../../components/ListEmpty.jsx'

class ComList extends React.Component{

	constructor(props) {
        super(props);
        this.state = {pageIndex:1,lists:[]};
        this.loading = false
        this.loaded = false
        this.end = true
    }
    componentWillMount(){

    	DataSource.bind(this, [
        {
            map:['lists:*'],
            fn: Service.getComponentsList,
            accumulate: true,
            before: ()=>{
                this.loading = true;
            },
            success: ((res)=>{
                this.setState({
                  pageIndex: this.state.pageIndex + 1
                })
                if(res.data.length < 20){
                  this.end = true;
                }else{
                  this.end = false;
                }
                this.loading = false;
                this.loaded = true
            }).bind(this)
        }]);
    }
    goto(item){
        setTimeout(()=>{
          this.props.router.push("component/detail/"+item.cid);          
        }, 350)
    }
    load(){
        if(!this.loading){
          this.$ds.update('lists')
        }
    }
	render() {
        return (
			<MainLayout title="组件列表" backurl="setting">
				<div className={style['card-lst']}>
                    <ListEmpty show={this.loaded && !this.state.lists.length} txt="没有组件信息"></ListEmpty>
					{this.state.lists.map((item,i)=>{
						return(
							<a onTouchTap={this.goto.bind(this,item)} className={style['card-items']}  key={i}>  
								<div className={style['card-info']}>
									<h3>{item.title}</h3>
								</div>
							</a>
						)
					})}
					<LazyLoader load={this.load.bind(this)} end={this.end} loading={this.loading} />
				</div>
			</MainLayout>
        );
    }
}

export default withRouter(ComList)