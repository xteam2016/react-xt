//列表为空时的提示
import React from 'react';

const ListEmpty = ({txt, show}) => {
  if(!show){
    return null;
  }
  return (<div className="list-empty">
        <img src={require('./img/none.png')} alt=""/>
        <p>{txt}</p>
    </div>);
};

export default ListEmpty;
