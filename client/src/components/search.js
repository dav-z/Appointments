import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';



class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      events:[],
      start: moment.utc().toDate(),
      end: moment.utc().toDate(),
      search: 0,
      sort: 0
    };
    this.onSubmit = this.formSubmit.bind(this);
  }

  // form submission function
  formSubmit(e) {
    e.preventDefault();
    var self = this;
    // convert data for python
    const data = {
      start: self.refs.start.props.selected.toISOString().slice(0, 19).replace('T', ' '),
      end: self.refs.end.props.selected.toISOString().slice(0, 19).replace('T', ' '),
      sort: this.state.sort
    }
    console.log(data);
    axios.post('http://0.0.0.0:5000/search', data).then(response => {
      console.log(response.data);
      let appointments = response.data;

      for (let i = 0; i < appointments.length; i++) {
        console.log(appointments[i]);
        appointments[i].price = appointments[i].price.toFixed(2);
      }

      this.setState({
        events: appointments,
        search: 1
      })


    }).catch(function (error) {
      console.log(error);
    });
  }

  startChanged(e){
    var start = this.state.start;
    start = e;
    this.setState({start: start});
  }
  endChanged(e){
    var end = this.state.end;
    end = e;
    this.setState({end: end});
  }
  sortChanged(e){
    var sort = this.state.sort;
    if(sort === 0) {
      sort = 1;
    }
    else {
      sort = 0;
    }
    this.setState({sort: sort});
  }

  clearSearch(e){
    this.setState({search: 0});
  }

  mapEvents(aList) {
    var status = ["Scheduled", "Checked-In", "Checked-Out"];
    return aList.reverse().map((elem, i) => {
      return (
        <a href={"appointments/" + elem.id} key={elem.id}>
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


  render() {
    if(this.state.search === 0) {
      return (
        <div className="search-page">
        <h1>Search</h1>
          <form onSubmit={this.onSubmit}>
            <div className="formrow"><label>From:</label> <DatePicker
              ref="start"
              selected={this.state.start}
              onChange={this.startChanged.bind(this)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              timeCaption="time"
              dateFormat="MMMM d, yyyy HH:mm"
            /></div>
            <div className="formrow"><label>To:</label> <DatePicker
              ref="end"
              selected={this.state.end}
              minDate={this.state.start}
              onChange={this.endChanged.bind(this)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              timeCaption="time"
              dateFormat="MMMM d, yyyy HH:mm"
            /></div>
            <input type="submit" />
          </form>
        </div>
      );
    } else {
      var events;
      var sort;
      if(this.state.sort === 0) {
        sort = <div onClick={this.sortChanged.bind(this)} className="sort">SORT↓</div>;
        events = this.mapEvents(this.state.events);
      }
      else {
        sort = <div onClick={this.sortChanged.bind(this)} className="sort">SORT↑</div>;
        events = this.mapEvents(this.state.events);
      }
      return (
        <div className="search-page">
        <h1>Search</h1>
        <div onClick={this.clearSearch.bind(this)} className="reset">Reset Search</div>
        {sort}
        {events}
        </div>
      );
    }
  }
}

export default Search;
