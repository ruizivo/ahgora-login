import { React, Component} from "react";

import "./clock.css";
 
class Clock extends Component {
  constructor() {
    super();
    this.state = {
      tick: new Date(),
    };
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({
        tick: new Date()
      })
    }, 1000);
  }


  render() {
    return (
      <h2>{this.state.tick.toLocaleTimeString()}</h2>
    );
  }
}

export default Clock;
