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

class List extends Component {
  constructor (props){
    super(props);
    this.state = {showModalClient: false, showModal: false, nome: "", id: 0, telefone: "", tipo: "", endereco: "", bairro: "", cidade: "", referencia: "", credito: 0};
  }

  updateState (event){
    this.setState({[event.target.id]: event.target.value});
  }

  handleClick (event, id, nome, telefone, tipo, endereco, bairro, cidade, referencia, credito) {
    this.setState({showModal: true, id: id, nome: nome, telefone: telefone, tipo: tipo, endereco: endereco, bairro: bairro, cidade: cidade, referencia: referencia, credito: credito});
  }

  close(event) {
    this.setState({showModal: false, showModalClient: false});
  }

  updateItem(event){
    var data = {id: this.state.id, nome: this.state.nome, telefone: this.state.telefone, endereco: this.state.endereco, bairro: this.state.bairro, cidade: this.state.cidade}
    axios.post("/cliente/update/", data)
      .then((result) =>
        this.props.onUpdate([], result.data)
      )
      .catch(function (e){
        console.error(e);
      })
    this.close(event);
  }

  checkClick(event, id, nome){
    this.setState({showModalClient: true, id: id, nome: nome});
    sessionStorage.setItem("client_id", id);
  }

  selectItem(event){
    this.close(event);
    window.location.href("/novo_pedido/");
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          { this.props.displayType === "list" ? this.props.results.map((i) =>
            <div key={i.id}>
              <div className="filtered">
                <div className="alert alert-info" role="alert">
                  <div className="add_flex">
                    <div className="listing">
                      <p><strong>Nome:</strong></p>
                      <p>{ i.nome }</p>
                    </div>
                    <div className="listing">
                      <p><strong>Telefone:</strong></p>
                      <p className="align_center">{ i.telefone }</p>
                    </div>
                    <div className="listing_half">
                      <FontIcon className="material-icons" color="#31708f" style={iconStyles} onClick={event => this.checkClick(event, i.id, i.nome)}>check_circle</FontIcon>
                    </div>
                    <div className="listing_half">
                      <FontIcon className="material-icons" color="#31708f" style={iconStyles} onClick={event => this.handleClick(event, i.id, i.nome, i.telefone, i.tipo, i.endereco, i.bairro, i.cidade, i.referencia, i.credito)} >update</FontIcon>
                    </div>
                  </div>
                </div>
              </div>
            </div>) : ( this.props.displayType === "empty" ?
              <div className="filtered">
                <div className="alert alert-danger" role="alert">
                  Nenhum cliente encontrado.
                </div>
              </div> :
            ( this.props.displayType === "update" ?
              <div className="filtered">
                <div className="alert alert-success" role="alert">
                  Cliente atualizado com sucesso.
                </div>
              </div>:
            ( this.props.displayType === "added" ?
            <div className="filtered">
              <div className="alert alert-success" role="alert">
                Cliente adicionado com sucesso.
              </div>
            </div>:
            ( this.props.displayType === "add" ?
            <div className="filtered">
              <div className="alert alert-danger" role="alert">
                Insira nome ou telefone.
              </div>
            </div> :
            ( this.props.displayType === "fail" ?
            <div className="filtered">
              <div className="alert alert-danger" role="alert">
                Insira o telefone corretamente (XX)XXXX-XXXX ou (XX)XXXXX-XXXX.
              </div>
            </div> :
              <p></p>)))))}
            <div>
              <Modal show={this.state.showModal} onHide={event => this.close(event)}>
                <Modal.Header closeButton>
                  <Modal.Title>Atualizar Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Deseja atualizar as informações do cliente abaixo?<br/><br/>
                  <TextField id="nome" floatingLabelText="Nome" value={this.state.nome} onChange={event => this.updateState(event)}/>
                  <TextField id="telefone" floatingLabelText="Telefone" value={this.state.telefone} onChange={event => this.updateState(event)}/>
                  <TextField id="endereco" floatingLabelText="Endereço" value={this.state.endereco} onChange={event => this.updateState(event)}/>
                  <TextField id="bairro" floatingLabelText="Bairro" value={this.state.bairro} onChange={event => this.updateState(event)}/>
                  <TextField id="cidade" floatingLabelText="Cidade" value={this.state.cidade} onChange={event => this.updateState(event)}/>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="btn-danger" onClick={event => this.close(event)}>Não</Button>
                  <Button className="btn-primary" onClick={event => this.updateItem(event)}>Sim</Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div>
              <Modal show={this.state.showModalClient} onHide={event => this.close(event)}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirmar Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Deseja selecionar o cliente abaixo?<br/><br/>
                  Nome: {this.state.nome}
                </Modal.Body>
                <Modal.Footer>
                  <Button className="btn-danger" onClick={event => this.close(event)}>Não</Button>
                  <Button className="btn-primary" onClick={event => this.selectItem(event)}>Sim</Button>
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
    onUpdate: function (data, displayType) {
      dispatch(updateFiltered(data, displayType))
    }
  }
}

List = connect(
  mapStateToProps, mapDispatchToProps
)(List)

export default List;
