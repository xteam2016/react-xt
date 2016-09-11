import React, { Component, PropTypes } from 'react';
import style from './PackageMenu.less';
import classnames from 'classnames';
import format from '../../utils/format'
import {getDishPackage} from '../../services/menus'

class MenuItem extends React.Component{

//const BigMenu = ({ data,cat,onEditCart,onTouchTap,time,style}) => {
	

	constructor(props){
		//初始化过期
		super(props);
		this.menu = this.props.data;
		this.state = {
			loading : true,
			selectItem : {}
		}
		this.packages = [];
        this.packagePrice = {};

	}
	componentWillMount() {
		
        //获取规格
        getDishPackage(this.menu.supplierdishid).then(res=>{
            if(res.code == 0){
                //重新处理价格数据
                this.packagePrice = {};
                res.data.skulist.map(item=>{
                    this.packagePrice[item.skuno] = item;
                })
                this.packages =  res.data.attrlist;
                //默认选中第一套
                //初始化选中规格
                let select = {};
				res.data.attrlist.map(item=>{
					item.attritemlist.map((item1,key)=>{
						if(key!=0) return
						select[item.attrid] = {
				    		data:item,
				    		attritemid:item1.attritemid,
				    		attritemvalue:item1.attritemvalue,
				    	}
					})
                    
                })


                this.setState({loading:false,selectItem:select})
            }
        })
    }
    handleSelect(kind,item){
    	let select = this.state.selectItem;
    	select[kind.attrid] = {
    		data:kind,
    		attritemid:item.attritemid,
    		attritemvalue:item.attritemvalue
    	}
    	this.setState({selectItem:select})
    }
    getIDTests(){
    	//匹配价格自断筛选
		let idText = [];
		const tempItems = this.state.selectItem;
		for (var key in tempItems) {
		  if(tempItems[key].data.isaffectprice){
		  	idText.push(tempItems[key].attritemid);
		  }
		}
		return this.menu.supplierdishid+'_'+idText.join('_')
    }
    getTag(){
    	let temp = [];
		const tempItems = this.state.selectItem;
		for (var key in tempItems) {
		  if(!tempItems[key].data.isaffectprice){
		  	temp.push(tempItems[key].attritemvalue);
		  }
		}
		return temp;
    }
    renderControl(){
    	//如果购物车内有对应规则
    	const cars = this.props.carData;
    	const tag = this.getTag();

    	
    	let thisCar = null;
    	if(cars.length!=0){
    		cars.map(car=>{
    			let has = false;
    				//判断tag是否在购物车
		    	for(var i=0;i<tag.length;i++){
		    		if(car.tag.indexOf(tag[i])<0){
		    			has =  false;
		    			break;
		    		}else{
		    			has = true;
		    		}
		    	}
		    	console.log(car.tag)
		    	//判断价格是否满足
		    	has =has && car.dishskuno == this.getIDTests();
		    	
		    	if(has){
		    		thisCar = car;
		    	}
    		})
    		

    	}
    
    	if(!thisCar){
    		return(
    			<a className={style["d-add"]} onTouchTap={this.props.handleEditCart.bind(this,'add',this.menu)}>加入购物车</a>
    		)
    	}else{
    		return(
    			<span className={style["add-opc"]}>
                	<i className={"m-icon i-minus"} onTouchTap={this.props.handleEditCart.bind(this,'minu',this.menu)}></i>
                	<em>{thisCar.count}</em>
                	<i className={"m-icon i-plus2" + " " + style["plus"]} onTouchTap={this.props.handleEditCart.bind(this,'add',this.menu)}></i>
            	</span>
    		)

    	}
    }
	render() {
		if(this.state.loading){
			return(null)
		}
		//匹配价格自断筛选

		const ids = this.getIDTests();
		console.log(ids)
		
		let price = 0;
		if( this.packagePrice[ids]){	
			price = this.packagePrice[ids].prince
		}
		this.menu['_packege'] = this.state.selectItem;
		return(
			
            <div className={style["dialog-style"]}>
                <h2><i onTouchTap={this.props.handleClose.bind(this)} className={'m-icon i-close'+ ' '+style['i-close']} ></i>{this.menu.supplierdishname}</h2>

                <div className={style["d-price"]}><span className={style["a-price"]}>¥<em>{price}</em></span>
                	{this.renderControl()}
                </div>

                <div className={style["d-style"]}>
                    {this.packages.map((item,key)=>{
                        return(
                            <div key={key}>
                                <h4>{item.attrname}</h4>
                                <ul>
                                    {item.attritemlist.map((item1,key2)=>{
                                    	let select = false;
                                    	if(this.state.selectItem[item.attrid]){
                                    		if(this.state.selectItem[item.attrid].attritemid == item1.attritemid){
                                    			select = true
                                    		}
                                    		
                                    	}
                                        const active = classnames({
                                        	[style["active"]]:select
                                        })
                                        return(
                                            <li className={active} key={item1.attritemid} onTouchTap={this.handleSelect.bind(this,item,item1)}>{item1.attritemvalue}</li>
                                        )
                                    })}  
                                </ul>
                            </div>
                        )
                    })}
                  
                </div>
             </div>

            

		)

	}



	
};


export default MenuItem;

