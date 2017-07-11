import React, { Component } from 'react';
import { updateFiltered } from './actions.js';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import './App.css';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import "./Modal.css";
import axios from 'axios';

const iconStyles = {
  marginLeft: 20,
  marginTop: 20
};

class List extends Component {
  constructor (props){
    super(props);
    this.state = {showModal: false, produto: "", data: "", quantidade: 0, id: 0};
  }

  handle_click (event, id, produto, data, quantidade) {
    this.setState({showModal: true, produto: produto, data: data, quantidade: quantidade, id: id});
  }

  close(event) {
    this.setState({showModal: false});
  }

  removeItem(event){
    var data = {id: this.state.id}
    axios.post("/producao/delete/", data)
      .then(function(result){
        console.log(result)
      })
      .catch(function (e){
        console.error(e);
      })
    this.close(event);
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          { this.props.results ? this.props.results.map((i) =>
            <div key={i.id}>
              <div className="filtered">
                <div className="alert alert-info" role="alert">
                  <div className="add_flex">
                    <div className="listing">
                      <p><strong>Produto:</strong></p>
                      <p>{ i.produto }</p>
                    </div>
                    <div className="listing">
                      <p><strong>Quantidade:</strong></p>
                      <p className="align_center">{ i.quantidade }</p>
                    </div>
                    <div className="listing_half">
                      <p><strong>Data:</strong></p>
                      <p>{ i.data_output }</p>
                    </div>
                    <div className="listing_half">
                      <FontIcon className="material-icons" color="#31708f" style={iconStyles} onClick={event => this.handle_click(event, i.id, i.produto, i.data_output, i.quantidade)} >delete</FontIcon>
                    </div>
                  </div>
                </div>
              </div>
            </div>) : <p></p>}
            <div>
              <Modal show={this.state.showModal} onHide={event => this.close(event)}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirmar Remoção</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Deseja deletar o produto abaixo?<br/><br/>
                  Produto: {this.state.produto}<br/>
                  Quantidade: {this.state.quantidade}<br/>
                  Data: {this.state.data}

                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={event => this.close(event)}>Não</Button>
                  <Button onClick={event => this.removeItem(event)}>Sim</Button>
                </Modal.Footer>
              </Modal>
            </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps (state) {
  return {
    results: state
  }
}

List = connect(
  mapStateToProps
)(List)

export default List;
