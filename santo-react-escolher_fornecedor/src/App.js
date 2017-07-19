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
    this.state = {showModalClient: false, showModal: false, nome: "", id: 0, telefone: "", tipo: "", endereco: "", estado: "", cidade: "", razao_social: "", cnpj: "", whatsapp: "", contato: ""};
  }

  updateState (event){
    if(event.target.id === "telefone"){
      var re = /^[\d]+$/g;
      var input = event.target.value.replace(/\D/g, "");
      if(input.length === 10){
        this.setState({[event.target.id]: "(" + input.slice(0,2) + ")" + input.slice(2,6) + "-" + input.slice(-4)});
      }
      else if(input.length === 11){
        this.setState({[event.target.id]: "(" + input.slice(0,2) + ")" + input.slice(2,7) + "-" + input.slice(-4)});
      }
      else if(re.test(event.target.value)){
        this.setState({[event.target.id]: event.target.value});
      }
      else if(event.target.value.length > 14){
      }
      else{
        this.setState({[event.target.id]: ""});
      }
    }
    else{
      this.setState({[event.target.id]: event.target.value});
    }
  }

  handleClick (event, id, razao_social, nome, telefone, tipo, endereco, estado, cidade, cnpj, whatsapp, contato) {
    this.setState({showModal: true, id: id, razao_social: razao_social, nome: nome, telefone: telefone, tipo: tipo, endereco: endereco, estado: estado, cidade: cidade, cnpj: cnpj, whatsapp: whatsapp, contato: contato});
  }

  close(event) {
    this.setState({showModal: false, showModalClient: false});
  }

  updateItem(event){
    if (this.state.telefone.length === 0 || this.state.telefone.length === 13 || this.state.telefone.length === 14){
      var data = {id: this.state.id, nome: this.state.nome, telefone: this.state.telefone, endereco: this.state.endereco, estado: this.state.estado, cidade: this.state.cidade, contato: this.state.contato}
      axios.post("/fornecedor/update/", data)
        .then((result) =>{
          sessionStorage.setItem("fornecedor_id", this.state.id);
          sessionStorage.setItem("fornecedor_name", this.state.nome);
          this.close(event);
          window.location.href = "/nova_compra/";
        })
        .catch(function (e){
          this.props.onUpdate([], "fail")
        })
      this.close(event);
    }
    else{
      this.setState({telefone: ""});
    }
  }

  checkClick(event, id, nome){
    this.setState({showModalClient: true, id: id, nome: nome});
    sessionStorage.setItem("fornecedor_id", id);
    sessionStorage.setItem("fornecedor_name", nome)
  }

  selectItem(event){
    this.close(event);
    window.location.href = "/nova_compra/";
  }

  addCliente(event){
    window.location.href = "/adicionar_fornecedor/";
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
                      <p className="align_center"><strong>Contato:</strong></p>
                      <p className="align_center">{ i.contato }</p>
                    </div>
                    <div className="listing_half">
                      <FontIcon className="material-icons" color="#31708f" style={iconStyles} onClick={event => this.checkClick(event, i.id, i.nome)}>check_circle</FontIcon>
                    </div>
                    <div className="listing_half">
                      <FontIcon className="material-icons" color="#31708f" style={iconStyles} onClick={event => this.handleClick(event, i.id, i.razao_social, i.nome, i.telefone, i.tipo, i.endereco, i.estado, i.cidade, i.cnpj, i.whatsapp, i.contato)} >update</FontIcon>
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
            ( this.props.displayType === "add" ?
            <div className="filtered">
              <div className="alert alert-danger" role="alert">
                Insira nome ou telefone.
              </div>
            </div> :
            ( this.props.displayType === "fail" ?
            <div className="filtered">
              <div className="alert alert-danger" role="alert">
                Insira os dados corretamente.
              </div>
            </div> :
              <p></p>)))}
            <div>
              { this.props.displayType !== "" &&  this.props.displayType !== "add"?
              <div className="my_menu2">
                <Button className="btn btn-danger" onClick={event => this.addCliente(event)}>Adicionar Novo Fornecedor</Button>
              </div> : <p></p>}
            </div>
            <div>
              <Modal show={this.state.showModal} onHide={event => this.close(event)}>
                <Modal.Header closeButton>
                  <Modal.Title>Atualizar Fornecedor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Deseja atualizar as informações do cliente abaixo?<br/><br/>
                  <TextField id="nome" floatingLabelText="Nome" value={this.state.nome} onChange={event => this.updateState(event)}/>
                  <TextField id="telefone" floatingLabelText="Telefone" value={this.state.telefone} onChange={event => this.updateState(event)}/>
                  <TextField id="endereco" floatingLabelText="Endereço" value={this.state.endereco} onChange={event => this.updateState(event)}/>
                  <TextField id="cidade" floatingLabelText="Cidade" value={this.state.cidade} onChange={event => this.updateState(event)}/>
                  <TextField id="estado" floatingLabelText="Estado" value={this.state.estado} onChange={event => this.updateState(event)}/>
                  <TextField id="contato" floatingLabelText="Contato" value={this.state.contato} onChange={event => this.updateState(event)}/>
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
                  <Modal.Title>Confirmar Fornecedor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Deseja selecionar o fornecedor abaixo?<br/><br/>
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
