import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import MainLayout from '../../layouts/NoHeadLayout/NoHeadLayout';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import style from './NewMenu.less'
import classnames from 'classnames';
import jQuery from "jquery";
import "../../components/fly.js";
import ReactIScroll from "react-iscroll"
import iScroll from "iscroll"
import Ball from '../../components/Ball/Ball'
import Loading from '../../components/Loading/Loading'
import PicMenu from '../../components/PicMenu/PicMenu'
import ListMenu from '../../components/ListMenu/ListMenu'
import PackageMenu from '../../components/Package/PackageMenu'


import { Modal} from 'antd-mobile';

const alert = Modal.alert;




//console.log(fly)
class NewMenu extends React.Component{
  
    constructor(props) {
        super(props);
        this.state = {
          showCat: false,
          viewNum:0,
          balls:[],
          style:null,
          dayangShow:true,
          oldNum:null,
          activelist:[],
          showPackage:false,
          selectPack:{}
        };
        //小球列表
        this.galleryThumbs = null;
        this.galleryTop = null;
        this.styleId = {
            'take-out':1,
            'dineIn':2
        }
        this.scrollOptions={
            click: true
        }
    }


    componentDidMount = next =>{
        
        //初始化店铺
        this.props.dispatch({
            type: 'menus/getShopInfo',
            router: this.props.router,
            payload:{menutypeid:this.styleId[this.props.params.style],supplierid:this.props.params.id}
        });

       // <Loading show={this.state.loaded}
        
    }
    componentWillUnmount() {
      this.props.dispatch({
        type: 'orderConfirm/selectTime/clear'
      })    

      this.props.dispatch({
          type: 'menus/clear'
      });
      this.props.dispatch({
          type: 'cat/front/clear'
      });
    }
    componentDidUpdate() {
        //初始化优惠
        
    }



    //修改购物车
    handleEditCart(type,data,event){
        //店铺打烊
        if(!this.checkOpen()){
            return
        }
        //不再售卖时间
        if(type == 'add'){
            if(!data.isSell){
                return
            }
        }
        //从图片点击的菜品绘制小球动画

        event.stopPropagation();
        let $ = jQuery;
        // setTimeout(()=>{
        //      this.setState({test:'sdddd'})
        //      //this.render();
        //      console.log('改变了')
        // },200)
        let that = this;

        let id = data.supplierdishid || data.dishid;
        let dom = $('.'+style["monkey"]);
        if(type == 'add' ){
            let tLeft = dom.offset().left + dom.width() / 2,
                tTop = dom.offset().top - dom.scrollTop();
            if(tTop == 0){
                tTop = document.body.clientHeight
            }
            var flyer = $('<div class="ball"></div>')
                .css({
                    'position': 'fixed',
                    'height': '30px',
                    'width': '30px',
                    'z-index': '100',
                    'background': '#ff5346',
                    'border-radius': '50%'
                });
            
            $(flyer).fly({
                start: {
                    left: event.nativeEvent.changedTouches[0].pageX,
                    top: event.nativeEvent.changedTouches[0].pageY - $("body").scrollTop()
                },
                end: {
                    left: tLeft,
                    top: tTop,
                    width: 20,
                    height: 20
                },
                onEnd: function() {
                    flyer.remove();
                }
            });
        
        }


       
        if(type == 'add-n'){
            type = 'add'
        }
        let postData = {
            dishid:id,
            supplierid:this.props.params.id,
            method:type,
            type:this.styleId[this.props.params.style]
        }
        //规则属性
        //attritemids 
        //tag
        if(data['_packege']){
            let attritemids = [];
            let tag = [];
            const temp = data['_packege'];
            for(var key in temp){
                if(temp[key].data.isaffectprice){
                    attritemids.push(temp[key].attritemid);
                }else{
                    tag.push(temp[key].attritemvalue);
                }
            }
            postData.attritemids = attritemids;
            postData.tag = tag;
        }
        //直接添加删除购物车时
        if(data.dishskuno){
            let attritemids = [];
            let tag = [];
            data.dishattr.map(item=>{
                attritemids.push(item.attritemid);
            })
            postData.attritemids = attritemids;
            postData.tag = data.tag;
        }
        //type为类型,外卖1，堂食2
        //method为加减，add,minu
        this.props.dispatch({
            type: 'cat/editCart',
            payload:postData
        });
    }

    

    //
    handleClickCat = ()=>{
        if(!this.checkOpen()){
            return
        }
        if(this.props.cat.data['dishlist'].length==0){
            return
        }
        this.setState({'showCat':!this.state.showCat,showPackage:false})
    }

    handleClickBg = ()=>{
        this.setState({'showCat':false})
    }

    //清空购物车
    handleClickClear(){
        alert('清空', '确定清空购物车么?', [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '确定', onPress: () => {
                this.setState({'showCat':false})
                this.props.dispatch({
                    type:'cat/clear',
                    payload:{
                        supplierid:this.props.params.id,
                        type:this.styleId[this.props.params.style]
                    }
                })

            } },
        ]);

    }
    handleTouchEnd(e){
        e.preventDefault();
    }
    renderCatPackage(item){
        let dishattr = [],tag = [];
        if(item.dishattr){
            dishattr = item.dishattr
        }
        if(item.tag){
            tag = item.tag;
        }

        return(
            <p>
                {dishattr.map((dish,key)=><span key={key}>{dish.attritem}</span>)}
                {tag.map((one,key)=><span key={key}>{one}</span>)}
           
            </p>
        )
    }
    //渲染购物车
    renderCat = () => {

        const {data} = this.props.cat;

        //处理为购物车数据

        if(data['dishlist'].length==0){
            return(
                <ul id="foo"></ul>
            );
        }
        return (
            <ul id="foo">
                {data.dishlist.map((item,key)=>{
                    return(
                        <li key={key} className={style["item"]}>
                        <div className={style["cat-one"]}>{item.dishname}
                        {this.renderCatPackage(item)}
                        </div>
                            <div className={style["cat-two"]}>
                            <span className={style["price"]}>¥{item.price}</span></div>
                            <div className={style["cat-three"]}>
                                <i className={"m-icon i-minus"} onClick={this.handleEditCart.bind(this,'minu',item)}></i>
                                    <em>{item.count}</em>
                                <i className={"m-icon i-plus2" + " " + style["plus"]} onClick={this.handleEditCart.bind(this,'add-n',item)}></i>
                            </div>
                        </li>

                    )

                })}
               

            </ul> 
        );
    };
    //渲染优惠信息
    renderPreferential(){
        const {shop} = this.props.menus;
        let activelist = [];
        if(this.styleId[this.props.params.style]==1){
            shop.activelist.forEach(item=>{
                if(!item.isstaggertime){
                    activelist.push(item.activityname+';');
                }
            }); 
        }else{
            shop.activelist.forEach(item=>{
              activelist.push(item.activityname+';');
            }); 
        }
        
        if(activelist.length!=0){
            return(
                <div className={style["h-coupon"]} onTouchTap={this.goto.bind(this,"promotion/detail/view/"+this.props.params.id+"/"+this.props.params.style)}>
                    <p><i className={'m-icon i-zhe' + ' ' + style['zhe']}></i>{activelist.join('')}</p><i className='m-icon i-next'></i>
                </div>
            )
        }
    }
    goto(url){
        this.props.router.push(url)
    }
    checkType(){
        const { shop } = this.props.menus;
        let tempStyle = 'big'
        if(shop.dishcountofsupplier>=100){
            tempStyle = 'small'
        }
        return tempStyle;
    }
    handleChangeMode(){
        
        const style = this.state.style?this.state.style:this.checkType();
        if(style == 'big'){
            this.setState({style:'small'})
        }else{
            this.setState({style:'big'})
        }
    }

    checkOpen(){
        const {shop} = this.props.menus;
        if(!shop.isopendoor){
            this.setState({dayangShow:true})
        }
        return shop.isopendoor
    }
    handleCloseTip(){
        // this.props.history.go(-1)
        this.setState({dayangShow:false});
    }

    renderDaYang(){
        const {shop} = this.props.menus;
        if(shop.isopendoor){
            return;
        }
        const dayang = classnames({
            [style['dayang']]:true,
            [style['hide']]:!this.state.dayangShow
        })

        return(
            <div className={dayang}>
            <div className={style['close-time']}>
                <h3>本店打烊啦</h3>
                <div className={style['times']}>

                    <div> 
                        {/*shop.activelist.map(item=><span>7:00-10:00</span>)*/}
                    </div>
                </div>
                <span className={style['closed']} onTouchTap={this.handleCloseTip.bind(this)}></span>
            </div>
            <div className={style['mark']}></div>
            </div> 
        )


    }
        //点击规格
    handleSpec(data,event){
        event.stopPropagation()
        this.menu = data;
        this.setState({showPackage:true});
    }
    renderMenuMain(shop,lists,cat,time){
        
        //大图模式。小图模式2套交互
        let style = this.state.style?this.state.style:this.checkType()
        if(style == 'big'){
            return(
                <PicMenu shop={shop} lists={lists} cat = {cat} time={time} handleEditCart={this.handleEditCart.bind(this)} handleSpec={this.handleSpec.bind(this)}/>
            )
        }else{
            return(
                <ListMenu shop={shop} lists={lists} cat = {cat} time={time} handleEditCart={this.handleEditCart.bind(this)}  handleSpec={this.handleSpec.bind(this)}/>
            )
        }
        
    }
    handleBack(){
        this.props.router.replace("shoplist/"+this.styleId[this.props.params.style]);
    }
    handleClosePack(){
         this.setState({showPackage:false});
    }
    renderPackage(){
        //筛选购物车内菜品
        if(!this.menu){
            return
        }
        let data = []
        const cat = this.props.cat.data
        cat.dishlist.map(item=>{
            if(item.dishid == this.menu.supplierdishid){
                data.push(item);
            }
        })
        if(this.state.showPackage){
            return(
                <PackageMenu data={this.menu} carData={data} handleClose={this.handleClosePack.bind(this)} handleEditCart={this.handleEditCart.bind(this)}/>

            )
        }
    }
    render() {
        //加载中        
        if(this.props.menus.loading)
        {
         
            return (<MainLayout navOpt={{fixed:true}}>
                <Loading />  
                </MainLayout>)
        }
        
        const {shop,lists,time} = this.props.menus;
        const cat = this.props.cat
        const showCat = (cat.data.dishlist.length != 0)
        var catClass = classnames({
            [style["box-cat"]]:true,
            [style['cart-show']]:this.state.showCat && showCat
        })
        var bgClass = classnames({
            [style["cat-mark"]]:true,
            [style['cat-mark-active']]:(this.state.showCat && showCat) ||this.state.showPackage
        })
        const {data} = this.props.cat;
        //无分类
        if(this.props.menus.shop.supplierdishlist.length == 0)
        {
         
            return (
                <MainLayout navOpt={{fixed:true}} title={shop.suppliername} backurl={"restaurant/"+this.styleId[this.props.params.style]}> 
                    <div className={style["null"]}>
                        <img src={require('../../static/img/shop-null.jpg')} alt="" />
                        <p>好吃的去哪了？</p>
                    </div>
                </MainLayout>
            )
        }
        //是否现实购物车等信息
        let catWrap = classnames({
            [style["cat-wrap"]]:true,
            [style['cat-wrap-hide']]:data.allcount == 0
        })
        var pointStr = 'lng='+shop.baidulong+"&lat="+shop.baidulat+"&suppliername="+shop.suppliername;
        pointStr=pointStr.replace(/\./g,"_");
      return ( 
        <MainLayout>
            
            <div className={style["menu-wrap"]}> 
                {this.renderDaYang()}
                <section className={style["header-wrap"]}>
                    <div className={style["header"]}>
                        <div className={style["h-header"]}>
                            <i className={"m-icon i-back"} onTouchTap={this.handleBack.bind(this)}></i>
                            <h3>{shop.suppliername}</h3>
                            <div className={style["shop-fav"]}></div>
                            <i className={"m-icon i-nopic"} onTouchTap={this.handleChangeMode.bind(this)}></i>
                        </div>
                        {this.renderPreferential()}
                    </div>
                </section>
                {this.renderMenuMain(shop,lists,cat,time)}
             
                <section className={catWrap}>
                    <div className={style["cat-pay"]}>
                        <div className={style["pay-money"]}>
                            <span onTouchTap={this.handleClickCat.bind(this)}>¥<em id="total1">{data.dishtotal}</em></span>
                            {data.deliveryfee!=0 && this.props.params.style!='dineIn'?<p>另需配送费 ¥{data.deliveryfee}</p>:null}
                        </div>
                        <Link className={style["pay-order"]} to={"order-confirm/"+this.props.params.style+'/'+this.props.params.id}>确认下单</Link>
                    </div>
                    <div className={catClass}>
                        <div className={style["monkey"]} onTouchTap={this.handleClickCat.bind(this)}>
                            <img src={require("../../static/img/monkey.png")}/>
                            <em className={style["pubr"]}>{data.allcount}</em>
                        </div>
                        <div className={style["get-cat"]}>
                            <h3><b className={style["cat-clear"]} onTouchTap={this.handleClickClear.bind(this)} onTouchEnd={this.handleTouchEnd}>清除</b></h3>                            
                            {this.renderCat()}  
                        </div>
                      
                    </div>
                 </section>
                {this.renderPackage()}
                <div className={bgClass} onTouchTap={this.handleClickBg}></div>
                <div className={style["cat-mark"]} onTouchTap={this.handleClickCat.bind(this)}></div>
            </div>
        </MainLayout>
      ); 
    }
};
            

NewMenu.propTypes = {
};

function mapStateToProps({menus,cat}, props) {
  return {
    menus: menus,
    cat: cat
  };
}



export default connect(mapStateToProps)(NewMenu);