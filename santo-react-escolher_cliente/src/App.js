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
import RadioButton from 'material-ui/RadioButton';

const iconStyles = {
  marginLeft: 20,
  marginTop: 20
};

class List extends Component {
  constructor (props){
    super(props);
    this.state = {showModal: false, nome: "", id: 0, telefone: "", tipo: "", endereco: "", bairro: "", cidade: "", referencia: "", credito: 0};
  }

  // update_state(event){
  //   var re = /^([\d]+|$)(,[\d]{0,3})?$/g;
  //   var check = re.test(event.target.value);
  //   if (check){
  //     this.setState({estoque_new: event.target.value});
  //   }
  // }

  handle_click (event, id, nome, telefone, tipo, endereco, bairro, cidade, referencia, credito) {
    this.setState({showModal: true, id: id, nome: nome, telefone: telefone, tipo: tipo, endereco: endereco, bairro: bairro, cidade: cidade, referencia: referencia, credito: credito});
  }

  close(event) {
    this.setState({showModal: false, estoque_new:""});
  }

  updateItem(event){
    if (this.state.estoque_new !== ""){
      var data = {id: this.state.id, estoque: this.state.estoque_new}
      axios.post("/estoque/update/", data)
        .then((result) =>
          this.props.onUpdate([], result.data)
        )
        .catch(function (e){
          console.error(e);
        })
      this.close(event);
    }
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
                      <RadioButton name="select_client" onClick={event => this.radio_click(event, i.id)}
                    </div>
                    <div className="listing_half">
                      <FontIcon className="material-icons" color="#31708f" style={iconStyles} onClick={event => this.handle_click(event, i.id, i.ingrediente, i.estoque, i.unidade)} >update</FontIcon>
                    </div>
                  </div>
                </div>
              </div>
            </div>) : ( this.props.displayType === "empty" ?
              <div className="filtered">
                <div className="alert alert-danger" role="alert">
                  Nenhum ingrediente encontrado.
                </div>
              </div> :
            ( this.props.displayType === "update" ?
              <div className="filtered">
                <div className="alert alert-success" role="alert">
                  Estoque atualizado com sucesso.
                </div>
              </div>:
            ( this.props.displayType === "added" ?
            <div className="filtered">
              <div className="alert alert-success" role="alert">
                Estoque atualizado com sucesso.
              </div>
            </div>:
            ( this.props.displayType === "add" ?
            <div className="filtered">
              <div className="alert alert-danger" role="alert">
                Selecione tipo, ingrediente, quantidade e valor.
              </div>
            </div> :
            ( this.props.displayType === "fail" ?
            <div className="filtered">
              <div className="alert alert-danger" role="alert">
                Insira quantidade e valor corretamente, usando apenas números e vírgula.
              </div>
            </div> :
              <p></p>)))))}
            <div>
              <Modal show={this.state.showModal} onHide={event => this.close(event)}>
                <Modal.Header closeButton>
                  <Modal.Title>Atualizar Estoque</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Deseja atualizar o estoque do ingrediente abaixo?<br/><br/>
                  Ingrediente: {this.state.ingrediente}<br/>
                  <TextField id="estoque_new" floatingLabelText="Estoque" value={this.state.estoque_new} onChange={event => this.update_state(event)}/> {this.state.unidade}<br/>


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
