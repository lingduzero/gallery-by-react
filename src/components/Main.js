require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
//get the images data
let imageDatas = require('../sources/imageDatas.json');

imageDatas = (function genImageURL(imageDatasArr){
  for(let i = 0 ; i < imageDatasArr.length; i++){
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.filename);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

//get the random number from low to high
function getRangeRandom(low, high){
    return Math.floor(Math.random() * (high - low) + low);
}
//get the random 0 - 30 degree
function get30DegRandom(){
  return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}
class ImgFigure extends React.Component{

  /*
   *Handle Click function
   */
  handleClick(e){

    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
      e.stopPropagation();
      e.preventDefault();
  }
  render(){
    let styleObj = {};
    //if props has the position property then use it
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
    if(this.props.arrange.rotate){
    (['Moz','ms','Webkit','']).forEach(function(value){
        styleObj[ value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
    }.bind(this));

    }

    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }
    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse ' : '';
    return(
      <figure className={imgFigureClassName} style={styleObj} onClick = {this.handleClick.bind(this)}>
        <img src = {this.props.data.imageURL}
             alt = {this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className = "img-back" onClick = {this.handleClick.bind(this)}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}


class ControllerUnit extends React.Component {

  handleClick(e){

    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render(){
    let controllerUnitClassName = 'controller-unit';
    if(this.props.arrange.isCenter){
      controllerUnitClassName += ' is-center ';
    }
    if(this.props.arrange.isInverse){
      controllerUnitClassName += ' is-inverse ';
    }
    return (
      <span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
    );
  }

}
class AppComponent extends React.Component {
  constructor(props) {
      super(props);
      this.Constant = {
        centerPos: {
          left: 0,
          top: 0
        },
        hPosRange: {   //the range for the horizontal
          leftSecX: [0,0],
          rightSecX: [0,0],
          y: [0,0]
        },
        vPosRange: {   // the range for the Vertical
          x: [0,0],
          topY: [0,0]
        }
      };

      this.state = {
        imgsArrangeArr:[
          // {
          //   pos:{
          //     left:'0',
          //     top:'0'
          //   }
          //    rotate:0,  //rotating
          //    isInverse: false, //two faces of the image
          //    isCenter: false  //test the picture if centered
          // }
        ]
      }
    }

/*
 *Reverse an array
 *@param index the inverse picture
 *return {functio} this is a closure function
 */
  inverse(index){
    return function(){
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this);
  }
  /*Center the clicked pictures
   *@param index is the clicked picture index
   *return a closure {function}
   */

   center(index){
    return function () {
      this.rearrange(index)
    }.bind(this);
  }
  /*
   * rearrange all the pictures
   * @paramenter to define which one should be centered
   */
  rearrange(centerIndex){
    let imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,

        vPosRange = Constant.vPosRange,
        vPosRangeX = vPosRange.x,
        vPosRangeTopY = vPosRange.topY,

        imgsArrangeTopArr = [],
        //get 0 or 1
        topImgNum = Math.floor(Math.random() * 2),
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        //Center the picture of centerIndex, the center picture does not need rotation
        imgsArrangeCenterArr[0] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true
        }

        //get the information of the picture on the top
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //range the top picture
        imgsArrangeTopArr.forEach(function(value, index){
          imgsArrangeTopArr[index] = {
            pos:{
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            },
            rotate: get30DegRandom(),
            isCenter: false
          }
        });

        //range the left and right side pictures
        for(let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
            let hPosRangeLorR = null;

            //the upper half is on the left side
            if(i < k) {
              hPosRangeLorR = hPosRangeLeftSecX;
            } else{
              hPosRangeLorR = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
              pos:{
                top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                left: getRangeRandom(hPosRangeLorR[0], hPosRangeLorR[1])
              },
              rotate:get30DegRandom(),
              isCenter: false
            }
        }

        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
  }

  componentDidMount(){

    //get the size of the stage
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil( stageW / 2),
        halfStageH = Math.ceil( stageH / 2);

    //get the size of the imageFigure
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.ImgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil( imgW / 2),
        halfImgH = Math.ceil( imgH / 2);
    //compute the positon of the centeral image
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    //compute the range for the left and right side pictures
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    //compute the range for the top side pictures
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);

  }


  render() {
    let controllerUnits = [];
    let ImgFigures = [];
    imageDatas.forEach(function(value, index){
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          },
          rotate: 0,
          isInverse:false,
          isCenter:false
        };
      }
      ImgFigures.push(<ImgFigure
                        data = {value}
                        key = {index}
                        ref = {'ImgFigure' + index}
                        arrange = {this.state.imgsArrangeArr[index]}
                        inverse = {this.inverse(index)}
                        center = {this.center(index)}
                      />);
      controllerUnits.push(<ControllerUnit
                            arrange = {this.state.imgsArrangeArr[index]}
                            key = {index}
                            inverse = {this.inverse(index)}
                            center = {this.center(index)}
                      />);
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className = "img-sec">
          {ImgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
