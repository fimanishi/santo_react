import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateFiltered } from './actions.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import './App.css';
import { Button } from 'react-bootstrap';


class List extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
          { this.props.displayType === "add" ?
            <div className="filtered">
              <div className="alert alert-danger" role="alert">
                Insira o valor da nota.
              </div>
            </div> :
            ( this.props.displayType === "fail" ?
            <div className="filtered">
              <div className="alert alert-danger" role="alert">
                Insira os dados corretamente.
              </div>
            </div> :
              <p></p>)}
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps (state) {
  return {
    displayType: state.displayType
  }
}


List = connect(
  mapStateToProps
)(List)

export default List;
