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
import TextField from 'material-ui/TextField';

const iconStyles = {
  marginLeft: 20,
  marginTop: 20
};

const widthButton = {
  width: 300,
};


class List extends Component {
  constructor (props){
    super(props);
    this.state = {showModal: false, showModalUpdate: false, showModalFinish: false, produto: "", quantidade: 0};
  }

  handleClick (event, produto, quantidade) {
    this.setState({showModal: true, produto: produto, quantidade: quantidade});
  }

  updateClick (event, produto, quantidade) {
    this.setState({showModalUpdate: true, produto: produto, quantidade: quantidade});
  }

  finishClick (event) {
    this.setState({showModalFinish: true});
  }

  close(event) {
    this.setState({showModal: false, showModalUpdate: false, showModalFinish: false});
  }

  removeItem(event){
    var data = {quantidade: this.state.quantidade, produto: this.state.produto}
    axios.post("/novo_pedido/delete/", data)
      .then((result) =>{
        this.props.onDelete(result.data.cart, "delete");
      })
      .catch(function (e){
        console.error(e);
      })
    this.close(event);
  }

  updateQuantidade(event){
    var re = /^[\d]*(,[\d]{0,3})?$/;
    if (re.test(event.target.value)){
      this.setState({quantidade: event.target.value});
    }
  }

  updateItem(event){
    var data = {quantidade: this.state.quantidade, produto: this.state.produto}
    axios.post("/novo_pedido/update/", data)
      .then((result) =>{
        this.props.onDelete(result.data.cart, "update");
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
          { this.props.displayType === "fail" ?
          <div className="filtered">
            <div className="alert alert-danger" role="alert">
              Produto não pode ser adicionado.
            </div>
          </div>:
          ( this.props.displayType === "delete" ?
            <div className="filtered">
              <div className="alert alert-success" role="alert">
                Produto removido com sucesso.
              </div>
            </div>:
          ( this.props.displayType === "add" ?
          <div className="filtered">
            <div className="alert alert-danger" role="alert">
              Selecione tipo, produto e quantidade
            </div>
          </div> :
          ( this.props.displayType === "update" ?
            <div className="filtered">
              <div className="alert alert-success" role="alert">
                Produto atualizado com sucesso.
              </div>
            </div>:
          <p></p>)))}
          { this.props.results.length >= 0 ? this.props.results.map((i) =>
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
                      <FontIcon className="material-icons" color="#31708f" style={iconStyles} onClick={event => this.updateClick(event, i.produto, i.quantidade)} >update</FontIcon>
                    </div>
                    <div className="listing_half">
                      <FontIcon className="material-icons" color="#31708f" style={iconStyles} onClick={event => this.handleClick(event, i.produto, i.quantidade)} >delete</FontIcon>
                    </div>
                  </div>
                </div>
              </div>
            </div>):<p></p>}
            <div className="align_center">
              <Button className="btn-primary" style={widthButton} onClick={event => this.finishClick(event)}>Finalizar Pedido</Button>
              <br/>
              <br/>
            </div>
            <div>
              <Modal show={this.state.showModal} onHide={event => this.close(event)}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirmar Remoção</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Deseja remover o produto abaixo?<br/><br/>
                  Produto: {this.state.produto}<br/>
                  Quantidade: {this.state.quantidade}<br/>

                </Modal.Body>
                <Modal.Footer>
                  <Button className="btn-danger" onClick={event => this.close(event)}>Não</Button>
                  <Button className="btn-primary" onClick={event => this.removeItem(event)}>Sim</Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div>
              <Modal show={this.state.showModalUpdate} onHide={event => this.close(event)}>
                <Modal.Header closeButton>
                  <Modal.Title>Atualizar Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Deseja alterar a quantidade do produto abaixo?<br/><br/>
                  Produto: {this.state.produto}<br/>
                  <TextField id="quantidade" floatingLabelText="Quantidade" value={this.state.quantidade} onChange={event => this.updateQuantidade(event)}/>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="btn-danger" onClick={event => this.close(event)}>Não</Button>
                  <Button className="btn-primary" onClick={event => this.updateItem(event)}>Sim</Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div>
              <Modal show={this.state.showModalFinish} onHide={event => this.close(event)}>
                <Modal.Header closeButton>
                  <Modal.Title>Finalizar Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Deseja finalizar o pedido?
                </Modal.Body>
                <Modal.Footer>
                  <Button className="btn-danger" onClick={event => this.close(event)}>Não</Button>
                  <Button className="btn-primary" onClick={event => window.location.href = "/finalizar_pedido/"}>Sim</Button>
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
    results: state.data,
    displayType: state.displayType
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onDelete: function (data, displayType) {
      dispatch(updateFiltered(data, displayType))
    }
  }
}

List = connect(
  mapStateToProps, mapDispatchToProps
)(List)

export default List;
