import React, {Component} from 'react'
import logo from '../recon.jpg'

export default class Cabecera extends Component{
    render(){
        return(
            <div className="App">
            <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p> JARE</p>
            </header>
            </div>
        );
    }
}
