import { React, Component} from "react";

import "./clock.css";
 
class Clock extends Component {
  constructor() {
    super();
    this.state = {
      clock: new Date(),
    };
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({
        clock: new Date()
      })
    }, 1000);
  }


  render() {
    return (
      <h2>{this.state.clock.toLocaleTimeString()}</h2>
    );
  }
}

export default Clock;
