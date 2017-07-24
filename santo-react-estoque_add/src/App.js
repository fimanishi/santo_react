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
}


class List extends Component {
  constructor (props){
    super(props);
    this.state = {showModal: false, showModalUpdate: false, showModalFinish: false, ingrediente: "", quantidade: 0, valor: 0, unidade: 0};
  }

  handleClick (event, ingrediente, quantidade, valor, unidade) {
    this.setState({showModal: true, ingrediente: ingrediente, quantidade: quantidade, valor: valor, unidade: unidade});
  }

  updateClick (event, ingrediente, quantidade, valor, unidade) {
    this.setState({showModalUpdate: true, ingrediente: ingrediente, quantidade: quantidade, valor: valor, unidade: unidade});
  }

  finishClick (event) {
    this.setState({showModalFinish: true});
  }

  close(event) {
    this.setState({showModal: false, showModalUpdate: false, showModalFinish: false});
  }

  removeItem(event){
    var data = {quantidade: this.state.quantidade, ingrediente: this.state.ingrediente, unidade: this.state.unidade}
    axios.post("/estoque/add/delete/", data)
      .then((result) =>{
        this.props.onDelete(result.data.cart, "delete");
        document.getElementById("subtotal").innerHTML = result.data.valor;
      })
      .catch(function (e){
        console.error(e);
      })
    this.close(event);
  }

  updateQuantidade(event){
    var re = /^[\d]*(,[\d]{0,3})?$/;
    if (re.test(event.target.value)){
      this.setState({[event.target.id]: event.target.value});
    }
  }

  updateValor(event){
    var re = /^[\d]*(,[\d]{0,2})?$/;
    if (re.test(event.target.value)){
      this.setState({valor: event.target.value});
    }
  }

  updateItem(event){
    var data = {quantidade: this.state.quantidade, ingrediente: this.state.ingrediente, valor: this.state.valor, unidade: this.state.unidade}
    axios.post("/estoque/add/update/", data)
      .then((result) =>{
        this.props.onDelete(result.data.cart, "update");
        document.getElementById("subtotal").innerHTML = result.data.valor;
      })
      .catch(function (e){
        console.error(e);
      })
    this.close(event);
  }

  finishCompra(event){
    var data = {confirm: "true"}
    axios.post("/estoque/add/finish/", data)
      .then((result) =>{
        this.close(event)
        window.location.href = "/estoque_selection/"
      })
      .catch(function (e){
        console.error(e);
      })
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          { this.props.displayType === "fail" ?
          <div className="filtered">
            <div className="alert alert-danger" role="alert">
              Ingrediente não pode ser adicionado.
            </div>
          </div>:
          ( this.props.displayType === "delete" ?
            <div className="filtered">
              <div className="alert alert-success" role="alert">
                Ingrediente removido com sucesso.
              </div>
            </div>:
          ( this.props.displayType === "add" ?
          <div className="filtered">
            <div className="alert alert-danger" role="alert">
              Selecione tipo, ingrediente, quantidade e valor.
            </div>
          </div> :
          ( this.props.displayType === "update" ?
            <div className="filtered">
              <div className="alert alert-success" role="alert">
                Ingrediente atualizado com sucesso.
              </div>
            </div>:
          <p></p>)))}
          { this.props.results.length >= 0 ? this.props.results.map((i) =>
            <div key={i.id}>
              <div className="filtered">
                <div className="alert alert-info" role="alert">
                  <div className="add_flex">
                    <div className="listing">
                      <p><strong>Ingrediente:</strong></p>
                      <p>{ i.ingrediente }</p>
                    </div>
                    <div className="listing_half">
                      <p className="align_center"><strong>Qtd:</strong></p>
                      <p className="align_center">{ i.quantidade }</p>
                    </div>
                    <div className="listing_half">
                      <p className="align_center"><strong>Valor:</strong></p>
                      <p className="align_center">{ i.valor }</p>
                    </div>
                    <div className="listing_half">
                      <FontIcon className="material-icons" color="#31708f" style={iconStyles} onClick={event => this.updateClick(event, i.ingrediente, i.quantidade, i.valor, i.unidade)} >update</FontIcon>
                    </div>
                    <div className="listing_half">
                      <FontIcon className="material-icons" color="#31708f" style={iconStyles} onClick={event => this.handleClick(event, i.ingrediente, i.quantidade, i.valor, i.unidade)} >delete</FontIcon>
                    </div>
                  </div>
                </div>
              </div>
            </div>):
              <p></p>}
            <br/>
            <div className="align_center">
              <Button className="btn-primary" style={widthButton} onClick={event => this.finishClick(event)}>Finalizar Compra</Button>
            </div>
            <div>
              <Modal show={this.state.showModal} onHide={event => this.close(event)}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirmar Remoção</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Deseja remover o ingrediente abaixo?<br/><br/>
                  Ingrediente: {this.state.ingrediente}<br/>
                  Quantidade: {this.state.quantidade}<br/>
                  Por Unidade: {this.state.unidade}<br/>
                  Valor: {this.state.valor}
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
                  <Modal.Title>Atualizar Ingrediente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Deseja alterar os dados do ingrediente abaixo?<br/><br/>
                  Ingrediente: {this.state.ingrediente}<br/>
                  <TextField id="quantidade" floatingLabelText="Quantidade" value={this.state.quantidade} onChange={event => this.updateQuantidade(event)}/>
                  <TextField id="unidade" floatingLabelText="Por Unidade" value={this.state.unidade} onChange={event => this.updateQuantidade(event)}/>
                  <TextField id="valor" floatingLabelText="Valor" value={this.state.valor} onChange={event => this.updateValor(event)}/>
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
                  <Modal.Title>Finalizar Compra</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Deseja finalizar a compra?
                </Modal.Body>
                <Modal.Footer>
                  <Button className="btn-danger" onClick={event => this.close(event)}>Não</Button>
                  <Button className="btn-primary" onClick={event => this.finishCompra(event)}>Sim</Button>
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
