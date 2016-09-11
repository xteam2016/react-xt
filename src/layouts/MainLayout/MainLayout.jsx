import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import NavBar from '../../components/NavBar/NavBar';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './MainLayout.less'

const MainLayout = ({ 
  children, 
  title, 
  hasHeader,
  navOpt={},
  navRight,
  backurl,
  className}) => {

  let bar;
  hasHeader = hasHeader!=false

  if(hasHeader){
    bar = <NavBar title={title} backurl={backurl} opt={navOpt}>{navRight}</NavBar>
  }else{
    bar = '';
  }
  return (
    <div id="main" className={className}>
      {bar}
      <div className={'g-wrap'+(hasHeader && navOpt.fixed!==false?' fixedtop':'')}>
      {children}
      </div>  
    </div>
  );
};
 
MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
  title   : PropTypes.string
};

export default MainLayout;
