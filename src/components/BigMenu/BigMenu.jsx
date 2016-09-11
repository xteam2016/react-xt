import React, { Component, PropTypes } from 'react';
import styles from './BigMenu.less';
import classnames from 'classnames';
import format from '../../utils/format'

class BigMenu extends React.Component{

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

	render() {

		let data = this.data;
		const {catNum,onEditCart,onTouchTap,time,style, _ismemberprice=ismemberprice} = this.props;
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
		const plusBox = classnames({
			[styles["plus-box"]]:true,
			[styles["dishes-no"]]:catNum == 0,
		})
		if(style == 'small'){
			return(
				<div className={dishesWrap}>
					<div className={styles['dishes-items']}>
						<div className={styles['dishes-info']}>
							<h3>{data.supplierdishname}</h3>
                {ismemberprice?<span>¥ <i className={styles["price"]}>{data.memberprice}</i>&nbsp;&nbsp;</span>:null}
                <span className={ismemberprice?styles['delprice']:''}>¥ <i className={styles["price"]}>{data.price}</i></span>

						</div>
						<div className={dishesOpc}>
				                <div className={styles['plus-minus']} onTouchTap={onEditCart.bind(this,'minu',data)}><i className='m-icon i-minus'></i></div>
				                <b className={styles['dishes-count']}>{catNum}</b> 
				                <div className={styles["plus-added"]} onTouchTap={onEditCart.bind(this,'add',data)}><i className='m-icon i-plus2'></i></div>
				        </div>
				        <div className={styles["dishes-stop"]}>售卖时间：
				        	{data.strTimes.map((time,key1)=>{
			            	return(
			            		<i className={styles["dishes-time"]} key={key1}>{time.startTime}-{time.endTime}</i>
			            	)
			            	})}
				        </div>
					</div>
				</div>
			)
		}else{
			return (
			
			    <div className={foodClass} onTouchTap={onEditCart.bind(this,'add',data)}>
			    	
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
			            <div className={plusBox}>
			               
			                <div className={styles['plus-minus']} onTouchTap={onEditCart.bind(this,'minu',data)}><img src={require('../../static/img/index_2.png')} /></div>
			                <i className={styles['dishes-count']}>{catNum}</i> 
			                <div className={styles["plus-added"]} onTouchTap={onEditCart.bind(this,'add',data)}><img src={require('../../static/img/index_3.png')} /></div>

			            </div>
			        </div>
			        </div>
			    </div>
			);
		}


	}



	
};

BigMenu.propTypes = {
	data: PropTypes.object.isRequired,
	//onToggleComplete: PropTypes.func.isRequired,
};

export default BigMenu;

