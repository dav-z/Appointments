import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class Appointments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      events:[]
    };
    this.onSubmit = this.formSubmit.bind(this);
  }

  formSubmit(e) {
    e.preventDefault();
    var self = this;
    if(self.refs.status.value == 3) {
      axios.delete('http://0.0.0.0:5000/delete_appointment/' + this.props.match.params.id).then(response => {
        console.log(response.data);
        window.location = "/appointments";
      }).catch(function (error) {
        console.log(error);
      });
    } else {
      const data = {
        customer: self.refs.customer.value,
        time: self.refs.time.props.selected.toISOString().slice(0, 19).replace('T', ' '),
        notes: (self.refs.notes.value) ? self.refs.notes.value : null,
        price: self.refs.price.value,
        status: self.refs.status.value
      }
      // On submit of the form, send a POST request with the data to the server.
      console.log(data);
      axios.put('http://0.0.0.0:5000/update_appointment/' + this.props.match.params.id, data).then(response => {
        console.log(response.data);

        axios.get('http://0.0.0.0:5000/appointment/' + this.props.match.params.id)
          .then(response => {
            console.log(response.data);
            let appointments = response.data;

            for (let i = 0; i < appointments.length; i++) {
              console.log(appointments[i]);
              appointments[i].price = appointments[i].price.toFixed(2);
            }

            this.setState({
              events:appointments
            })
          })

      }).catch(function (error) {
        console.log(error);
      });
    }
  }

  mapEvents(aList) {
    var status = ["Scheduled", "Checked-In", "Checked-Out"]
    return aList.map((elem, i) => {
      return (
        <a href={"appointments/" + elem.id}  key={elem.id}>
        <div className="appointment">
          <div className="customer">{elem.customer} - {status[elem.status]}</div>
          <div className="time">{elem.time}</div>
          <div className="price">${elem.price}</div>
          <div className="notes">{elem.notes}</div>
        </div>
        </a>
      )
    })
  }

  statusChanged(e){
    var events = this.state.events;
    events[0].status = e.target.value;
    this.setState({events: events});
  }

  priceChanged(e){
    var events = this.state.events;
    events[0].price = e.target.value;
    this.setState({events: events});
  }

  dateChanged(e){
    var events = this.state.events;
    events[0].time = e;
    this.setState({events: events});
  }

  noteChanged(e){
    var events = this.state.events;
    events[0].notes = e.target.value;
    this.setState({events: events});
  }

  custChanged(e){
    var events = this.state.events;
    events[0].customer = e.target.value;
    this.setState({events: events});
  }



  showEvent(aList) {
    return aList.map((elem, i) => {
      return (
        <div className="appointment-page-form"  key={elem.id}>
          <form onSubmit={this.onSubmit}>
            <div className="formrow"><label>Customer:</label> <input type="text" ref="customer" value={elem.customer} onChange={this.custChanged.bind(this)} required/></div>
            <div className="formrow"><label>Time:</label> <DatePicker
              ref="time"
              selected={moment.utc(elem.time).toDate()}
              onChange={this.dateChanged.bind(this)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              timeCaption="time"
              dateFormat="MMMM d, yyyy HH:mm"
            /></div>
            <div className="formrow"><label>Price:</label> <input type="number" min="0.00" max="10000.00" step="0.01" ref="price" value={elem.price} onChange={this.priceChanged.bind(this)}/></div>
            <div className="formrow"><label>Notes:</label> <textarea ref="notes" placeholder="notes" value={elem.notes} onChange={this.noteChanged.bind(this)}/></div>
            <div className="formrow"><label>Status:</label> <select id="status" ref="status" value={elem.status} onChange={this.statusChanged.bind(this)}>
              <option value="0">Scheduled</option>
              <option value="1">Check-In</option>
              <option value="2">Check-Out</option>
              <option value="3">Cancel</option>
            </select></div>
            <input type="submit" />
          </form>
        </div>
      )
    })
  }

  componentDidMount() {
    console.log(this.props.match.params.id);
    if(this.props.match.params.id) {
      axios.get('http://0.0.0.0:5000/appointment/' + this.props.match.params.id)
        .then(response => {
          console.log(response.data);
          let appointments = response.data;

          for (let i = 0; i < appointments.length; i++) {
            console.log(appointments[i]);
            appointments[i].price = appointments[i].price.toFixed(2);
          }

          this.setState({
            events:appointments
          })

        })
        .catch(function (error) {
          console.log(error);
        });
    }
    else {
      axios.get('http://0.0.0.0:5000/appointments')
        .then(response => {
          let appointments = response.data;

          for (let i = 0; i < appointments.length; i++) {
            appointments[i].price = appointments[i].price.toFixed(2);
          }

          this.setState({
            events:appointments
          })

        })
        .catch(function (error) {
          console.log(error);
        });
    }

  }
  render() {
    var events;
    if(this.props.match.params.id) {
      events = this.showEvent(this.state.events);
    }
    else {
      events = this.mapEvents(this.state.events);
    }

    return (
      <div className="appointment-page">
      <h1>Appointments</h1>
      {events}
      </div>
    )
  }
}

export default Appointments;
