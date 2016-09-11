import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import NavBar from '../../components/NavBar/NavBar';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './NoHeadLayout.less'

const MainLayout = ({ 
  children, 
  title,
  className
}) => {

  return (
    <div id="main" className={className}>
      <div className={'g-wrap'}>
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
