require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//get the images data
let imageDatas = require('../sources/imageDatas.json');

imageDatas = (function genImageURL(imageDatasArr){
  for(var i = 0 ; i < imageDatasArr.length; i++){
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.filename);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);


class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className = "img-sec">
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
