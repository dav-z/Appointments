import React, { Component } from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios'
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

class Cal extends Component {

  constructor(props) {
    super(props)

    this.state = {
      cal_events: [],
    }

  }

  convertDate = (date) => {
    return moment.utc(date).toDate()
  }

  componentDidMount() {


    axios.get('http://0.0.0.0:5000/appointments')
      .then(response => {
        console.log(response.data);
        let appointments = response.data;

        for (let i = 0; i < appointments.length; i++) {

          appointments[i].start = this.convertDate(appointments[i].time)
          appointments[i].end = this.convertDate(moment(appointments[i].start).add(1, 'hours'))
          appointments[i].title = appointments[i].customer;
          appointments[i].description = appointments[i].notes;
        }

        this.setState({
          cal_events:appointments
        })

      })
      .catch(function (error) {
        console.log(error);
      });
  }


  render() {

    const { cal_events } = this.state

    return (
      <div className="App">
        <div style={{ height: 700 }}>
          <Calendar
          localizer={localizer}
            events={cal_events}
            onSelectEvent={event => window.location.href="/appointments/" + event.id}
            step={30}
            defaultView='month'
            views={['month','week','day']}
            defaultDate={new Date()}
          />
        </div>
      </div>
    );
  }
}

export default Cal;
