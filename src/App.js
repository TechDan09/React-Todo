import React from 'react';
import Particles from 'react-particles-js';
import Header from './Components/Header';
import Form from './Components/Form';
import TodoList from './Components/TodoList';
import axios from 'axios';
import './App.css';
import 'tachyons';

const particlesOptions = {
      "particles": {
          "number": {
              "value": 80
          },
          "size": {
              "value": 2
          }
      },
      "interactivity": {
          "events": {
              "onhover": {
                  "enable": true,
                  "mode": "repulse"
              }
          }
      }
  }

class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        todos: [],
      }
      this.sendToServerUpdateTodosState = this.sendToServerUpdateTodosState.bind(this);
      this.handleCompletedState = this.handleCompletedState.bind(this);
      this.deleteTodo = this.deleteTodo.bind(this);
  }

  componentDidMount() {
    axios.get('https://jsonplaceholder.typicode.com/todos/?_limit=3')
      .then(response => this.setState({todos: response.data}))
      .catch(error => console.error('Error:', error))
  }

  handleCompletedState(id) {
    console.log(id);
    this.setState(prevState => ({
        todos: prevState.todos.map(aSingleTodo => {
          if (aSingleTodo.id === id) {
            aSingleTodo.completed = !aSingleTodo.completed;
          }
          return aSingleTodo;
        })
    }))
  }

  deleteTodo(id) {
    axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
    .then(response => {
      this.setState({
        todos: this.state.todos.filter(aSingleTodo => aSingleTodo.id != id)
      })
    })
    .catch((error) => {
        console.log(error);
      });
  }

  sendToServerUpdateTodosState(typedTodo) {
    let newTodo = {
      title: typedTodo,
      completed: false
    };

    axios.post('https://jsonplaceholder.typicode.com/todos/', newTodo)
      .then((response) => {
        this.setState({todos: [...this.state.todos, response.data]});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render (){
    return (
      <React.Fragment>
        <Particles className='particles' params={particlesOptions}/>
        <div className="todolist-wrapper shadow">
          <div className="todolist-container mt4 mb4">
            <Header />
            <Form sendToServerUpdateTodosState={this.sendToServerUpdateTodosState} />
            <TodoList 
              todos={this.state.todos}
              handleCompletedState={this.handleCompletedState}
              deleteTodo={this.deleteTodo}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
