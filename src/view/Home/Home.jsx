import React from 'react';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import {Router, Route, IndexRoute, Link} from 'react-router';
import style from './Home.less';

export default class Home extends React.Component {

    render() {  
        return (
            <MainLayout hasHeader={false}>
              <div>
          			<section className={style['take-out']+' '+ style['take-in']} >
                    <Link className={style['p']} to="setting"><img src={require('./img/x.jpg')} /></Link>
                    <p>react-xt</p>
                    <Link className={style['a']} to="setting">Start</Link>
                	</section>
              </div>
      		  </MainLayout>
        );
    }
}
