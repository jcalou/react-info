import React, { Component } from "react";
import './styles.css';
import ReactDOM from "react-dom";

class Battery{
  constructor(isactive = false){
    this.displayName = "Battery";
    this.dataDescription = this.getDescription();
    this.active = isactive;
  }

  generateData(){
    return new Promise((resolve, reject) => {
      navigator.getBattery().then((batterydata) => {
        resolve(`${batterydata.level * 100} %`);
      });
    });
  }

  getDescription(){
    return "The navigator.getBattery method returns a battery promise that is resolved in a BatteryManager interface which you can use to interact with the Battery Status API."
  }
}

class Language{
  constructor(isactive = false){
    this.displayName = "Language";
    this.dataDescription = this.getDescription();
    this.active = isactive;
  }

  generateData(){
    return new Promise((resolve, reject) => {
      resolve(navigator.language);
    });

  }

  getDescription(){
    return "The language property returns the language version of the browser. Examples of valid language codes are: \"en\", \"en-US\", \"de\", \"fr\", etc."
  }
}
class Coordinates{
  constructor(isactive = false){
    this.displayName = "Coordinates";
    this.dataDescription = this.getDescription();
    this.active = isactive;
  }

  generateData(){
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve(`lat: ${position.coords.latitude} \n lon: ${position.coords.longitude}`);
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
  })
  }

  getDescription(){
    return "The Geolocation.getCurrentPosition() method is used to get the current position of the device.";
  }
}
class TimeZone{
  constructor(isactive = false){
    this.displayName = "Time Zone";
    this.dataDescription = this.getDescription();
    this.active = isactive;
  }

  generateData(){
    return new Promise((resolve, reject) => {
      resolve(new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1]);
    });
  }

  getDescription(){
    return "The Date object is a datatype built into the JavaScript language. Date objects are created with the new Date()"
  }
}
let Collection = {
  "categories": [
    {
      "name": "Position",
      "active": true,
      "items" : [
        new Coordinates(true),
        new TimeZone()
      ]
    },
    {
      "name": "Device",
      "active": false,
      "items" : [
        new Battery(true),
        new Language()
      ]
    }
  ]
};
class Page extends React.Component {
  constructor(){
    super();
    this.state = Collection;
  }
  setFooterActive(i){
    this.state.categories.map((c) => {
      c.active = false;
    });
    this.state.categories[i].active = true;

    this.setState({ categories: this.state.categories });
  }

  setItemActive(i){
    let activecategoryindex = this.state.categories.map((e) => {
      return e.active;
    }).indexOf(true);

    this.state.categories[activecategoryindex].items.map((c) => {
      c.active = false;
    });
    this.state.categories[activecategoryindex].items[i].active = true;

    this.setState({ categories: this.state.categories });
  }

  render() {
    let activecategory = this.state.categories.filter((category) => { return category.active; })[0];
    return(
      <div className="container">
        <Header activeCategory={activecategory} />
        <MainView setActive={this.setItemActive.bind(this)} activeCategory={activecategory} />
        <Footer setActive={this.setFooterActive.bind(this)} categories={this.state.categories} />
      </div>
    );
  }
}
class Footer extends React.Component {

  render() {
    return(
      <div className="footer">
        <div className="container-bottom">
          <div className="separator left-side"></div>
          {this.props.categories.map((category, index) => {
            let setActive = this.props.setActive.bind(this, index);
            return <div onClick={setActive} className= {category.active ? 'active menu-option' : 'menu-option'}>{category.name}</div>
          })}
          <div className="separator right-side"></div>
        </div>
      </div>
    );
  }
}
class Header extends React.Component {
  render() {
    return(
        <div className="header">
          <div className="stats">
            <div className="separator left-side">
            </div>
            <div className="title">{this.props.activeCategory.name}</div>
            <div className="separator right-side">
            </div>
          </div>
          <div className="hp">
            <div className="label">
              HP
            </div>
            <div className="value">
              170/170
            </div>
          </div>
          <div className="ap">
            <div className="label">
              AP
            </div>
            <div className="value">
              8/8
            </div>
          </div>
          <div className="xp">
            <div className="label">
              XP
            </div>
            <div className="value">
              10/1000
            </div>
          </div>
        </div>
    );
  }
}
class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      datavalue: ''
    };
  }
  componentDidMount(){
    this.updateDatavalue();
  }
  componentDidUpdate(prevProps, prevState){
    if(prevState.datavalue === this.state.datavalue){
      this.updateDatavalue();
    }
  }

  updateDatavalue(){
    let activeitem = this.props.activeCategory.items.filter((item) => { return item.active; })[0];
    let self = this;
    activeitem.generateData().then((datavalue) => {
      self.setState({datavalue: datavalue});
    });
  }
  render() {

    let activeitem = this.props.activeCategory.items.filter((item) => { return item.active; })[0];
    return(
      <div className="main-content">
        <div className="list-view">
          <ul>
            {this.props.activeCategory.items.map((item, index) => {
              let setActive = this.props.setActive.bind(this, index);
              return <li onClick={setActive} className= {item.active ? 'active menu-option' : 'menu-option'}>{item.displayName}</li>
            })}
          </ul>
        </div>
        <div className="main-view">
          <div className="container-main">
            <div className="center">
              <div className="title">{activeitem.displayName}</div>
              <div className="value">{this.state.datavalue}</div>
            </div>
          </div>
          <div className="description">{activeitem.dataDescription}</div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Page />, document.getElementById('app'));
