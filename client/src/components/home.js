import React from 'react';

const home = () => {
    return (
       <div className="homepage">
          <h1>Home</h1>
           <a href="/appointment/new"><div className="homebtn">Create Appointment</div></a>
           <a href="/appointments"><div className="homebtn">Appointments List</div></a>
           <a href="/calendar"><div className="homebtn">Appointments Calendar</div></a>
           <a href="/search"><div className="homebtn">Search Appointments</div></a>
       </div>
    );
}

export default home;
