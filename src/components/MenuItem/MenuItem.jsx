import React, { Component, PropTypes } from 'react';
import styles from './MenuItem.less';
import classnames from 'classnames';
import format from '../../utils/format'


class MenuItem extends React.Component{

//const BigMenu = ({ data,cat,onEditCart,onTouchTap,time,style}) => {
	

	constructor(props){
		//初始化过期
		super(props);
		this.data = this.props.data;
		this.beforeRender();

	}
	shouldComponentUpdate(nextProps,nextState){

		if(nextProps.catNum != this.props.catNum || nextProps.style != this.props.style){
			return true
		}else{
			return false;
		}
		
	}
	beforeRender(){

		this.data.isSell = this.getCanSell();

		this.data.strTimes = this.data.timelist.map(ctime=>{
			let temp = {startTime:format.date(new Date(parseInt(ctime.opentime)*1000),'H:M'),endTime:format.date(new Date(parseInt(ctime.closetime)*1000),'H:M')}
			return temp;
        })
	}


	getCanSell(){
		let data = this.props.data;
		const time = this.props.time;
		let res = false;
		//时间格式化以及数据处理
		data.timelist.map(ctime=>{

         	let tempStart = parseInt(ctime.opentime)*1000;
     		let tempEnd = parseInt(ctime.closetime)*1000;
     		let nowTime = new Date().getTime()+time;

     		if(nowTime>tempStart && nowTime<tempEnd){
     			res = true;
     		}

        })
		return res;
	}

	renderSmallType(hasOption,data){

		if(hasOption){
			const {onClickSpec} = this.props;
			return(

				<span className={styles["diz"]}>
                    <span  className={styles['style-choose']} onTouchTap={onClickSpec.bind(this,data)}>选择规格</span>
                </span>

			)
		}else{
			const {catNum,onEditCart} = this.props;
			//无图模式加件
			const plusBox = classnames({
				[styles["diz"]]:true,
				[styles["dishes-no"]]:catNum == 0,
			})

			return(
				<span className={plusBox}>
	                <i className={"m-icon i-minus " +styles["minus"]} onTouchTap={onEditCart.bind(this,'minu',data)}></i>
	                <em className={styles['dishes-count']}>{catNum}</em>
	                <i className={"m-icon i-plus2" + " " + styles["plus"]} onTouchTap={onEditCart.bind(this,'add',data)}></i>
	            </span>

			)
		}
	

        
	}

	renderBigType(hasOption,data){


		if(hasOption){
			const {onClickSpec} = this.props;
			return(

				<span  className={styles['style-choose']} onTouchTap={onClickSpec.bind(this,data)}>选择规格</span>
			)
		}else{
			const {catNum,onEditCart} = this.props;
					//大图模式加减
			const plusBox = classnames({
				[styles["plus-box"]]:true,
				[styles["dishes-no"]]:catNum == 0,
			})
			return(
				<div className={plusBox}>
           
		            <div className={styles['plus-minus']} onTouchTap={onEditCart.bind(this,'minu',data)}><img src={require('../../static/img/index_2.png')} /></div>
		            <i className={styles['dishes-count']}>{catNum}</i> 
		            <div className={styles["plus-added"]} onTouchTap={onEditCart.bind(this,'add',data)}><img src={require('../../static/img/index_3.png')} /></div>

		        </div>

			)
		}
	

        
	}


	render() {

		let data = this.data;
    const {catNum,onEditCart,onTouchTap,time,style, _ismemberprice=ismemberprice,onClickSpec} = this.props;
    let ismemberprice = _ismemberprice && data.memberprice != data.price;
		const sellTime = ()=>{
			//售卖时间通过时间判断
			if(!data.isSell){
				return(
					<div className={styles["times"]}>
			            售卖时间
			            {data.strTimes.map((time,key1)=>{
			            	return(
			            		<div key={key1}> <span>{time.startTime}-{time.endTime}</span></div>
			            	)
			            	
			            })}
			        </div>
				)
			}
		}


		const handleImageError = (e)=>{
			e.target.src = require('./img/monkey.png');
		}
		const foodClass = classnames({
			[styles['two-food']]:true,
			[styles['disabled']]:!data.isSell
		})


		const dishesOpc = classnames({
			[styles["dishes-opc"]]:true,
			[styles["dishes-no"]]:catNum == 0,
		})

		const dishesWrap = classnames({
			[styles['dishes-wrap']]:true,
			[styles['abled']]:data.isSell
		})

		//无图模式不再售卖时间
		const foodsItems = classnames({
			[styles["foods-items"]]:true,
			[styles["disabled"]]:!data.isSell,
		})
		if(style == 'small'){
			return(
				<li className={foodsItems}>
					{data.imagepath?<div className={styles["foods-pic"]}><img src={data.imagepath}/></div>:null}
					<div className={styles["foods-pro"]}>
	                    <h4>{data.supplierdishname}</h4>
	                    <p>{data.dishdescription}</p>
	                    <div className={styles["foods-diz"]}>
    	                    {ismemberprice?<span className={styles["price"]}>¥{data.memberprice}&nbsp;&nbsp;</span>:null}
    	                	  <span className={ismemberprice?styles['delprice']:''}>¥{data.price}</span>
	                        {this.renderSmallType(data.istwooption,data)}
	                    </div>
                    </div>
                </li>
			)
		}else{
			return (
			
			    <div className={foodClass} onTouchTap={data.istwooption?onClickSpec.bind(this,data):onEditCart.bind(this,'add',data)}>
			    	
			        <div className={styles["food-box"]}>
			        {sellTime()}
			        <div className={styles["mark"]}></div>
			        <div className={styles["food-h3"]}>
			            <h3>{data.supplierdishname}</h3>
			            <h4 className={styles["des-dish"]}>{data.dishdescription}</h4>
                  {ismemberprice?<span>¥ <i className={styles["price"]}>{data.memberprice}</i>&nbsp;&nbsp;</span>:null}
                  <span className={ismemberprice?styles['delprice']:''}>¥ <i className={styles["price"]}>{data.price}</i></span>
			        </div>
			        <div className={styles["food-img"]}>
			            <img src={data.imagepath}  height="720px" onError={handleImageError.bind(this)}/>
			        </div>
			        <div className={styles["food-plus"]}>

			            {this.renderBigType(data.istwooption,data)}
			        </div>
			        </div>
			    </div>
			);
		}


	}



	
};


export default MenuItem;

