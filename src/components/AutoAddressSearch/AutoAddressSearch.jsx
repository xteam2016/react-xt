import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import style from './AutoAddressSearch.less';
import classnames from 'classnames';
import { Link} from 'react-router';
export default class AutoAddressSearch extends Component{

    constructor() {
        super();
        this.state = {addressList:[]};

    }

    handleInput(e){
        const that = this;
        if(e.target.value == ''){

            that.setState({addressList: []});
            return;
        }
        $.ajax({
            url      : 'http://map.baidu.com/su?callback=?',
            type     : 'GET',
            dataType : 'json',
            data :{
                    type: 0,
                    wd: e.target.value,
                    cid: 131,
                    t: new Date().getTime()
                }
        }).done(function(data) {
            if (data) {
                //keyUpLoadingFinished = true;
                var addressData = data.s;
                if (addressData.length <= 0) {
                    return;
                }

                let lis = '',
                    i = 0,
                    l = addressData.length,
                    list = [];

                for (; i < l; i++) {
                    let arrlist = addressData[i].split("$"),
                        city = arrlist[0],
                        district = arrlist[1],
                        street= arrlist[2],
                        streetNumber = arrlist[3]; 
                    let temp = {arrlist,city,district,street,streetNumber}
                    list.push(temp);
                }
                that.setState({addressList: list});
            }
            // failure
            else {

            }

        });

    }

    renderList(){
        if(this.state.addressList.length!=0){
            return(
                <section className={style["list-wrap"]}>
                    <div className={style["address-list"]}>
                        {this.state.addressList.map((item,key)=>{
                            return(
                                <div key={key} className={style["address-item"]} onTouchTap={this.props.onClick?this.props.onClick.bind(this,item):null}>
                                    <div className={style["interest-point"]}>{item.street+item.streetNumber}</div>
                                    <div className={style["address"]}>{item.city+' '+item.district}</div>
                                </div>

                            )

                        })}
                    </div>
                </section>
            )

        }
  
    }

    render(){
        const searchBox = classnames({
            [style["search-box"]]:true,
            [style['in-search']]:this.state.addressList.length!=0

        })
        return (
            <section className={searchBox}>
                <div className={style['location']}>
                   <div className={style['adr-search']}>
                        <label onTouchTap={this.props.handleClick || null}><i className={'m-icon i-site'}></i><input type="text" placeholder={this.props.text || '请输入地址'}  ref='searchBox' onInput={this.handleInput.bind(this)} readOnly={this.props.readOnly || false}/></label>
                        {this.props.searchButton?<Link to="/address-search"><i className={'m-icon i-search'}></i></Link>:<a><i className={'m-icon i-search'}></i></a>}   
                   </div>
                </div>
                {this.renderList()}
            </section>
        );
    }
}
AutoAddressSearch.propTypes = {
	//data: PropTypes.object.isRequired,
	//onToggleComplete: PropTypes.func.isRequired,
};



