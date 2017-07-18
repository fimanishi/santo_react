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
    this.state = {showModal: false, estoque: 0, id: 0, produto: "", estoque_new: ""};
  }

  updateState(event){
    var re = /^([\d]+|$)(,[\d]{0,3})?$/g;
    var check = re.test(event.target.value);
    if (check){
      this.setState({estoque_new: event.target.value});
    }
  }

  handleClick (event, id, ingrediente, estoque) {
    this.setState({showModal: true, estoque: estoque, id: id, ingrediente: ingrediente});
  }

  close(event) {
    this.setState({showModal: false, estoque_new:""});
  }

  updateItem(event){
    if (this.state.estoque_new !== ""){
      var data = {id: this.state.id, estoque: this.state.estoque_new}
      axios.post("/producao/estoque/update/", data)
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
                      <p><strong>Produto:</strong></p>
                      <p>{ i.produto }</p>
                    </div>
                    <div className="listing_half">
                    </div>
                    <div className="listing">
                      <p><strong>Estoque:</strong></p>
                      <p>{ i.estoque }</p>
                    </div>
                    <div className="listing_half">
                      <FontIcon className="material-icons" color="#31708f" style={iconStyles} onClick={event => this.handleClick(event, i.id, i.ingrediente, i.estoque)} >update</FontIcon>
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
            ( this.props.displayType === "fail" ?
            <div className="filtered">
              <div className="alert alert-danger" role="alert">
                Insira quantidade e valor corretamente, usando apenas números e vírgula.
              </div>
            </div> :
              <p></p>)))}
            <div>
              <Modal show={this.state.showModal} onHide={event => this.close(event)}>
                <Modal.Header closeButton>
                  <Modal.Title>Atualizar Estoque</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Deseja atualizar o estoque do produto abaixo?<br/><br/>
                  Produto: {this.state.produto}<br/>
                  <TextField id="estoque_new" floatingLabelText="Estoque" value={this.state.estoque_new} onChange={event => this.updateState(event)}/> {this.state.unidade}<br/>


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
