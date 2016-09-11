import React, { Component, PropTypes } from 'react';
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.css'
import style from './ListMenu.less';
import classnames from 'classnames';
import format from '../../utils/format'
import MenuItem from '../MenuItem/MenuItem'

//有图模式
class ListMenu extends React.Component{



	constructor(props) {
        super(props);
        const { shop } = this.props;
        //分类选中
        this.state = {kindNum:0,titleName:shop.supplierdishlist[0].categoryname,showItemTime:false,itemList:[]}
        this.titleList = [];
        this.topList = [];
    }
    componentDidMount(){
        //获取所有分类标题的顶部距离
        //console.log(this.titleList)
        this.topList = this.titleList.map(item=>{

            return item.offsetTop;
        })
    }

    handleTab(key,name){
        this.setState({kindNum:key,titleName:name})
        //滚动到对应分类
        this.refs['list'].scrollTop = this.topList[key]
    }
    //滚动监控
    handleScroll(event){
        //查找是否超过对应分类
        const tempList = this.topList.filter(item=>{
            if(this.refs['list'].scrollTop>=item){
                return true;
            }
        })
        if(tempList.length-1<0){
            return;
        }
        const newNum = tempList.length-1;
        if(this.state.kindNum!=newNum){
            const { shop } = this.props;
            const name = shop.supplierdishlist[newNum].categoryname;
            this.setState({kindNum:newNum,titleName:name})
        }
    }
    //渲染分类购物车数据
    renderKindNum(one){
        const {data} = this.props.cat;
        if(!data.category){
            return;
        }
        const temp = data.category.filter(item=>{

            if(item.categoryid == one.categoryid){
                return true;
            }
        })
        if(temp.length!=0){
            return(
                <em className={style["pubr"]}>{temp[0].count}</em>
            )
        }
        
    }
    handleEdit(type,data,event){
        if(!data.isSell){
            this.setState({showItemTime:true,itemList:data.strTimes})
            setTimeout(()=>{
                this.setState({showItemTime:false,itemList:data.strTimes})
            },500)
            return;
        }
        this.props.handleEditCart(type,data,event)
    }
	render(){
        const { lists,time,shop,cat } = this.props;
        const {data} = this.props.cat;
        //现实售卖时间
        const itemTime = classnames({
            [style["open-times"]]:true,
            [style["open-times-hide"]]:!this.state.showItemTime
        })
		return(
			<section className={style["menu-main"]}>
                    <div className={style["menu-list"]}>
                        <div className={style["menu-nav"]}>
                            <div className={style["nav-lst"]}>
                                <ul>
                                {shop.supplierdishlist.map((item,key)=>{
                                    return( 
                                          <li key={key} className={key==this.state.kindNum?style["active"]:null} onTouchTap={this.handleTab.bind(this,key,item.categoryname)}>
                                            <span>
                                                {this.renderKindNum(item)}                                           
                                                <b>{item.categoryname}</b>
                                            </span>
                                          </li>  
                                    )
                                })}
                                </ul>
                            </div>
                        </div>



                        <div className={style["menu-foods"]}>
                            <h3 className={style["dishes-title"]}>{this.state.titleName}</h3>
                            <div className={style["lst-wrap"]} ref='list' onScroll={this.handleScroll.bind(this)}>  
                            {shop.supplierdishlist.map(item=>{
                                return(
                                    <div key={item.categoryid}>
                                        <h3 ref={fn=>{this.titleList.push(fn)}}>{item.categoryname}</h3>
                                        <ul className={style["foods-lst"]}>
                                            {item.supplierdishlist.map(item2=>{
                                                let num = 0;
                                                //获取购物车数量
                                                
                                                let catDate = data.dishlist.filter(function(items){
                                                    return items.dishid == item2.supplierdishid;
                                                });
                                                if(catDate.length!=0){
                                                    num = catDate[0].count;
                                                }

                                                return(
                                                    <MenuItem style='small' key={item2.supplierdishid} data={item2} catNum={num} onEditCart={this.handleEdit.bind(this)} time={time} onClickSpec={this.props.handleSpec.bind(this)}/>
                                             
                                                )
                                            })}
                                        </ul>
                                    </div>
                                )
 
                            })}
                            </div>
                        </div>
                    </div>
                    <div className={itemTime}>
                        <h3> — 售卖时间 —</h3>
                        {this.state.itemList.map((item,key)=><p key={key}>{item.startTime} - {item.endTime}</p>)}
                    </div>
                </section>
		)
	}

	
};

export default ListMenu;

