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
                Insira nome, tipo, cidade e estado.
              </div>
            </div> :
            ( this.props.displayType === "fail" ?
            <div className="filtered">
              <div className="alert alert-danger" role="alert">
                Insira os dados corretamente.
              </div>
            </div> :
            ( this.props.displayType === "exists" ?
            <div className="filtered">
              <div className="alert alert-danger" role="alert">
                Fornecedor já existente.
              </div>
            </div> :
            ( this.props.displayType === "added" ?
            <div>
              <div className="filtered">
                <div className="alert alert-success" role="alert">
                  Fornecedor adionado com sucesso.
                </div>
              </div>
              <div className="my_menu2">
                <Button className="btn btn-primary" onClick={event => window.location.href = "/nova_compra/"}>Adicionar Compra</Button>
              </div>
            </div> :
              <p></p>)))}
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
