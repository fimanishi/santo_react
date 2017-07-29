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
import Checkbox from 'material-ui/Checkbox'

const iconStyles = {
  marginTop: 10,
  marginLeft: 20,
};

const iconStyles2 = {
  marginLeft: 20,
  marginBottom: 10,
};

const widthButton = {
  width: 300,
};

const styles = {
  checkbox: {
    marginTop: 40,
    fontSize: 15
  },
};

class List extends Component {
  constructor (props){
    super(props);
    this.state = {showModal: false, showModalUpdate: false, showModalPedido: false, produto: "", quantidade: 0, valor_pago: "", checked: "", valor: 0, total: 0, id: 0};
  }

  handleClick (event, id, produto, quantidade, valor, total) {
    this.setState({showModal: true, id: id, produto: produto, quantidade: quantidade, valor: valor, total: total});
  }

  updateClick (event, id, produto, quantidade, valor, total) {
    this.setState({showModalUpdate: true, id: id, produto: produto, quantidade: quantidade, valor: valor, total: total});
  }

  clickPedido (event) {
    if (this.state.checked === ""){
      this.setState({checked: this.props.info.boolean});
    }
    this.setState({showModalPedido: true});
  }

  close(event) {
    this.setState({showModal: false, showModalUpdate: false, showModalPedido: false});
  }

  checkStatus(event){
    if(this.state.checked){
      this.setState({checked: false})
    } else {
      this.setState({checked: true})
    }
  }

  removeItem(event){
    var data = {id: this.state.id}
    axios.post("/pedidos/detalhe/delete/", data)
      .then((result) =>{
        this.props.onUpdate(result.data.list, result.data.info, "delete");
        document.getElementById("debito").innerHTML = result.data.info.debito;
        document.getElementById("valor").innerHTML = result.data.info.valor;
      })
      .catch((e) =>{
        this.props.onUpdate(this.props.results, this.props.info, "fail");
      })
    this.close(event);
  }

  updateItem(event){
    var data = {id: this.state.id, quantidade: this.state.quantidade, valor: this.state.valor, total: this.state.total}
    axios.post("/pedidos/detalhe/update/", data)
      .then((result) =>{
        this.props.onUpdate(result.data.list, result.data.info, result.data.message);
        document.getElementById("debito").innerHTML = result.data.info.debito;
        document.getElementById("valor").innerHTML = result.data.info.valor;
      })
      .catch((e) =>{
        this.props.onUpdate(this.props.results, this.props.info, "fail");
      })
    this.close(event);
  }

  updateValor(event){
    var re = /^[\d]*(,[\d]{0,2})?$/;
    if (re.test(event.target.value)){
      this.setState({valor_pago: event.target.value});
    }
  }

  updateQuantidade(event){
    var re = /^[\d]*(,[\d]{0,3})?$/;
    if (re.test(event.target.value)){
      this.setState({quantidade: event.target.value});
    }
  }

  updatePedido(event){
    var debito;
    if (this.state.valor_pago === ""){
      debito = 0
    }
    else{
      debito = this.state.valor_pago;
    }
    var data = {boolean: this.state.checked, debito: debito, id: this.props.info.id}
    axios.post("/pedidos/detalhe/pedido/", data)
      .then((result) =>{
        this.props.onUpdate(result.data.list, result.data.info, "update");
        document.getElementById("debito").innerHTML = result.data.info.debito;
        document.getElementById("entregue").innerHTML = result.data.info.status;
      })
      .catch(function (e){
        console.error(e);
      })
    this.close(event);
    this.setState({valor_pago: ""})
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <div className="align_center">
            <Button className="btn-primary" style={widthButton} onClick={event => this.clickPedido(event)}>Atualizar Pedido</Button>
            <br/>
          </div>
          { this.props.displayType === "fail" ?
          <div className="filtered">
            <div className="alert alert-danger" role="alert">
              Ação não pôde ser concluída.
            </div>
          </div>:
          ( this.props.displayType === "delete" ?
            <div className="filtered">
              <div className="alert alert-success" role="alert">
                Produto removido com sucesso.
              </div>
            </div>:
          ( this.props.displayType === "update" ?
            <div className="filtered">
              <div className="alert alert-success" role="alert">
                Pedido atualizado com sucesso.
              </div>
            </div>:
          ( this.props.displayType === "failure" ?
            <div className="filtered">
              <div className="alert alert-danger" role="alert">
                Quantidade deve ser um número maior que zero.
              </div>
            </div>:
          <p></p>)))}
          { this.props.results.length >= 0 ? this.props.results.map((i) =>
            <div key={i.id}>
              <div className="filtered">
                <div className="alert alert-info" role="alert">
                  <div className="add_flex">
                    <div className="add_block">
                      <div className="listing_double">
                        <div className="listing">
                          <p><strong>Produto:</strong></p>
                          <p>{ i.produto }</p>
                        </div>
                        <div className="listing">
                          <p><strong>Quantidade:</strong></p>
                          <p className="align_center">{ i.quantidade }</p>
                        </div>
                      </div>
                      <div className="listing_double">
                        <div className="listing">
                          <p><strong>Valor:</strong></p>
                          <p>R${ i.valor }</p>
                        </div>
                        <div className="listing">
                          <p><strong>Total:</strong></p>
                          <p className="align_center">R${ i.total }</p>
                        </div>
                      </div>
                    </div>
                    <div className="listing_half">
                      <div>
                        <div className="inline">
                          <FontIcon className="material-icons" color="#31708f" style={iconStyles2} onClick={event => this.updateClick(event, i.id, i.produto, i.quantidade, i.valor, i.total)} >update</FontIcon>
                        </div>
                        <div className="inline">
                          <FontIcon className="material-icons" color="#31708f" style={iconStyles} onClick={event => this.handleClick(event, i.id, i.produto, i.quantidade, i.valor, i.total)} >delete</FontIcon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>):<p></p>}
            <div>
              <Modal show={this.state.showModal} onHide={event => this.close(event)}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirmar Remoção</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Deseja remover o produto abaixo?<br/><br/>
                  Produto: {this.state.produto}<br/>
                  Quantidade: {this.state.quantidade}<br/>
                  Valor: R${this.state.valor}<br/>
                  Total: R${this.state.total}

                </Modal.Body>
                <Modal.Footer>
                  <Button className="btn-danger" onClick={event => this.close(event)}>Não</Button>
                  <Button className="btn-primary" onClick={event => this.removeItem(event)}>Sim</Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div>
              <Modal show={this.state.showModalPedido} onHide={event => this.close(event)}>
                <Modal.Header closeButton>
                  <Modal.Title>Atualizar Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <TextField id="valor_pago" floatingLabelText="Valor Pago" value={this.state.valor_pago} onChange={event => this.updateValor(event)}/>
                  <Checkbox label="Entregue" labelPosition="left" checked={this.state.checked} style={styles.checkbox} onClick={event => this.checkStatus(event)}/>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="btn-danger" onClick={event => this.close(event)}>Não</Button>
                  <Button className="btn-primary" onClick={event => this.updatePedido(event)}>Sim</Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div>
              <Modal show={this.state.showModalUpdate} onHide={event => this.close(event)}>
                <Modal.Header closeButton>
                  <Modal.Title>Alterar Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Deseja alterar o pedido abaixo?<br/><br/>
                  Produto: {this.state.produto}
                  <TextField id="quantidade" floatingLabelText="Quantidade" value={this.state.quantidade} onChange={event => this.updateQuantidade(event)}/>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="btn-danger" onClick={event => this.close(event)}>Não</Button>
                  <Button className="btn-primary" onClick={event => this.updateItem(event)}>Sim</Button>
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
    info: state.info,
    displayType: state.displayType
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onUpdate: function (data, info, displayType) {
      dispatch(updateFiltered(data, info, displayType))
    }
  }
}

List = connect(
  mapStateToProps, mapDispatchToProps
)(List)

export default List;
