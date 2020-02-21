import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';


class NewApt extends Component {

  constructor(props) {
    super(props);
    this.state = {
      time: moment.utc().toDate(),
      price: (0).toFixed(2)
    };
    this.onSubmit = this.formSubmit.bind(this);
  }

  formSubmit(e) {
    e.preventDefault();
    var self = this;
    const data = {
      customer: self.refs.customer.value,
      time: this.state.time.toISOString().slice(0, 19).replace('T', ' '),
      notes: (self.refs.notes.value) ? self.refs.notes.value : null,
      price: this.state.price,
    }
    // On submit of the form, send a POST request with the data to the server.
    console.log(data);
    axios.post('http://0.0.0.0:5000/add_appointment', data).then(response => {
      console.log(response.data);

      window.location = "/appointments/" + response.data;
    }).catch(function (error) {
      console.log(error);
    });
  }

  priceChanged(e){
    var price = e.target.value;
    this.setState({price: price});
  }

  dateChanged(e){
    var time = e;
    this.setState({time: time});
  }


  render() {

    return (
      <div className="new-appointment-page">
        <h1>New Appointment</h1>
        <form onSubmit={this.onSubmit}>
          <div className="formrow"><label>Customer:</label><input type="text" ref="customer" required/></div>
          <div className="formrow"><label>Time:</label> <DatePicker
            ref="time"
            selected={this.state.time}
            onChange={this.dateChanged.bind(this)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            timeCaption="time"
            dateFormat="MMMM d, yyyy HH:mm"
          /></div>
          <div className="formrow"><label>Price:</label> <input type="number" min="0.00" max="10000.00" step="0.01" ref="price" value={this.state.price} onChange={this.priceChanged.bind(this)}/></div>
          <div className="formrow"><label>Notes:</label> <textarea ref="notes" placeholder="notes" /></div>
          <input type="submit" />
        </form>
      </div>
    )
  }
}

export default NewApt;
