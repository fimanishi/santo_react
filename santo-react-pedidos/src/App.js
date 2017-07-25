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
  marginTop: 10,
  marginLeft: 20,
};

const iconStyles2 = {
  marginLeft: 20,
  marginBottom: 10,
};


class List extends Component {
  constructor (props){
    super(props);
    this.state = {showModalClient: false, showModal: false, nome: "", telefone: "", data: "", status: "", pagamento: ""};
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

  handleClick (event, id, nome, telefone, tipo, endereco, bairro, cidade, referencia, credito) {
    this.setState({showModal: true, id: id, nome: nome, telefone: telefone, tipo: tipo, endereco: endereco, bairro: bairro, cidade: cidade, referencia: referencia, credito: credito});
  }

  close(event) {
    this.setState({showModal: false, showModalClient: false});
  }

  updateItem(event){
    if (this.state.telefone.length === 0 || this.state.telefone.length === 13 || this.state.telefone.length === 14){
      var data = {id: this.state.id, nome: this.state.nome, telefone: this.state.telefone, endereco: this.state.endereco, bairro: this.state.bairro, cidade: this.state.cidade}
      axios.post("/cliente/update/", data)
        .then((result) =>{
          sessionStorage.setItem("client_id", this.state.id);
          sessionStorage.setItem("client_name", this.state.nome);
          this.close(event);
          this.redirect();
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
    sessionStorage.setItem("client_id", id);
    sessionStorage.setItem("client_name", nome)
  }

  selectItem(event){
    this.close(event);
    this.redirect();
  }

  addCliente(event){
    window.location.href = "/adicionar_cliente/";
  }

  redirect(){
    var data = {user_id: this.state.id}
    axios.post("/cart_user/", data)
      .then((result) => {
        window.location.href = "/novo_pedido/";
      })
      .catch((e) =>{
        this.props.onUpdate([], "fail");
      })
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
                    <div className="add_block">
                      <div className="listing_double">
                        <div className="listing">
                          <p><strong>Nome:</strong></p>
                          <p>{ i.nome }</p>
                        </div>
                        <div className="listing">
                          <p><strong>Status:</strong></p>
                          <p className="align_center">{ i.status }</p>
                        </div>
                      </div>
                      <div className="listing_double">
                        <div className="listing">
                          <p><strong>Data:</strong></p>
                          <p>{ i.data }</p>
                        </div>
                        <div className="listing">
                          <p><strong>Pagamento:</strong></p>
                          <p className="align_center">{ i.pagamento }</p>
                        </div>
                      </div>
                    </div>
                    <div className="listing_half">
                      <div>
                        <div className="inline">
                          <FontIcon className="material-icons" color="#31708f" style={iconStyles2} onClick={event => this.updateClick(event, i.produto, i.quantidade)} >check_circle</FontIcon>
                        </div>
                        <div className="inline">
                          <FontIcon className="material-icons" color="#31708f" style={iconStyles} onClick={event => this.handleClick(event, i.produto, i.quantidade)} >delete</FontIcon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>) : ( this.props.displayType === "empty" ?
            <div className="filtered">
              <div className="alert alert-danger" role="alert">
                Nenhum pedido encontrado.
              </div>
            </div> :
            ( this.props.displayType === "add" ?
            <div className="filtered">
              <div className="alert alert-danger" role="alert">
                Insira pelo menos um filtro.
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
