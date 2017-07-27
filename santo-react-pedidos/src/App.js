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

  handleClick (event, id, nome, data, status, pagamento) {
    this.setState({showModal: true, id: id, nome: nome, data: data, status: status, pagamento: pagamento});
  }

  close(event) {
    this.setState({showModal: false, showModalClient: false});
  }

  deleteItem(event){
    var data = {id: this.state.id};
    axios.post("/pedidos/filter/delete/", data)
      .then((result)=>{
        this.props.onDelete([], "delete");
        this.close(event);
      })
      .catch((e)=>{
        this.props.onDelete([], "fail")
      })
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
                          <p>{ i.data_output }</p>
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
                          <FontIcon className="material-icons" color="#31708f" style={iconStyles} onClick={event => this.handleClick(event, i.id, i.nome, i.data, i.status, i.pagamento)} >delete</FontIcon>
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
            ( this.props.displayType === "delete" ?
            <div className="filtered">
              <div className="alert alert-success" role="alert">
                Pedido removido com sucesso.
              </div>
            </div> :
            ( this.props.displayType === "fail" ?
            <div className="filtered">
              <div className="alert alert-danger" role="alert">
                Insira os dados corretamente.
              </div>
            </div> :
              <p></p>))))}
            <div>
              <Modal show={this.state.showModal} onHide={event => this.close(event)}>
                <Modal.Header closeButton>
                  <Modal.Title>Remover Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Deseja remover o pedido abaixo?<br/><br/>
                  Nome: {this.state.nome}<br/>
                  Data: {this.state.data_output}<br/>
                  Entregue: {this.state.status}<br/>
                  Pago: {this.state.pagamento}<br/>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="btn-danger" onClick={event => this.close(event)}>Não</Button>
                  <Button className="btn-primary" onClick={event => this.deleteItem(event)}>Sim</Button>
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
