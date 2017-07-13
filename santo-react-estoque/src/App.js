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
    this.state = {showModal: false, estoque: 0, id: 0, ingrediente: "", unidade: "", estoque_new: ""};
  }

  update_state(event){
    var re = /^[\d]+(,[\d]*)?/g;
    var check = re.exec(event.target.value);
    if (check){
      this.setState({estoque_new: event.target.value});
    }
  }

  handle_click (event, id, ingrediente, estoque, unidade) {
    this.setState({showModal: true, estoque: estoque, id: id, ingrediente: ingrediente, unidade: unidade});
  }

  close(event) {
    this.setState({showModal: false, estoque_new:""});
  }

  updateItem(event){
    if (this.state.estoque_new !== ""){
      var data = {id: this.state.id, estoque: this.state.estoque_new}
      axios.post("/estoque/update/", data)
        .then((result) =>
          this.props.onUpdate([], result)
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
                      <p><strong>Ingrediente:</strong></p>
                      <p>{ i.ingrediente }</p>
                    </div>
                    <div className="listing_half">
                      <p><strong>Estoque:</strong></p>
                      <p className="align_center">{ i.estoque } { i.unidade }</p>
                    </div>
                    <div className="listing">
                      <p><strong>Última compra:</strong></p>
                      <p>{ i.data_output }</p>
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
              <p></p>))))}
            <div>
              <Modal show={this.state.showModal} onHide={event => this.close(event)}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirmar Remoção</Modal.Title>
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
    onDelete: function (data, displayType) {
      dispatch(updateFiltered(data, displayType))
    }
  }
}

List = connect(
  mapStateToProps, mapDispatchToProps
)(List)

export default List;
