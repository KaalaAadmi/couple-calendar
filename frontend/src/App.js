import "./App.css";
import {
  Calendar,
  dateFnsLocalizer,
  // momentLocalizer,
} from "react-big-calendar";
// import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
// import Navbar from "./components/Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// const DnDCalendar = withDragAndDrop(Calendar);
import Popup from "reactjs-popup";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// const localizer = momentLocalizer(moment);

function App() {
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    allDay: true,
    colorEvent: "",
    color: "white",
  });
  const [modifyEvent, setModifyEvent] = useState({
    title: "",
    start: "",
    end: "",
    allDay: true,
    colorEvent: "",
    color: "white",
  });

  const getEvents = async () => {
    try {
      const res = await axios.get("https://calendar-couple.herokuapp.com/api/v1/all-events");
      setAllEvents(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  React.useEffect(() => {
    getEvents();
    // eslint-disable-next-line
  }, []);

  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(undefined);
  const [modalState, setModalState] = useState(false);
  const [addEvent, setAddEvent] = useState(0);
  const [popupState, setPopupState] = useState(false);
  const [popupButton, setPopupButton] = useState(false);

  function handleAddEvent(e) {
    // e.preventDefault();
    setAllEvents([...allEvents, newEvent]);
    setAddEvent(addEvent + 1);
    setPopupState(false);
    toast("Event Added");
  }

  function handleOptionChange(e) {
    // const { name, value } = e.target;
    setNewEvent({ ...newEvent, colorEvent: e.target.value });
  }

  const postEvent = async () => {
    try {
      const res = await axios.post(
        "https://calendar-couple.herokuapp.com/api/v1/add",
        allEvents[allEvents.length - 1]
      );
      console.log(allEvents[allEvents.length - 1]);
    } catch (e) {
      console.log(e);
    }
  };
  React.useEffect(() => {
    postEvent();
    // eslint-disable-next-line
  }, [addEvent]);

  function handleSelectedEvent(event) {
    // console.log(event, "Event Data");
    setSelectedEvent(event);
    setModalState(true);
  }

  function handleClose() {
    setModalState(false);
  }

  async function handleDelete(event) {
    // axios call to delete selected event
    const res = await axios.post("https://calendar-couple.herokuapp.com/api/v1/delete", event);
    // console.log(res.data);
    // console.log(event);
    setModalState(false);
    refreshPage();
    toast("Event Deleted");
  }

  function handleModify(event) {
    // axios call to delete selected event
    const test = allEvents[allEvents.length - 1];
    let usefulEvent = {
      ...test,
      newTitle: modifyEvent.title === "" ? test.title : modifyEvent.title,
      newStart: modifyEvent.start === "" ? test.start : modifyEvent.start,
      newEnd: modifyEvent.end === "" ? test.end : modifyEvent.end,
    };
    axios.post("https://calendar-couple.herokuapp.com/api/v1/modify", usefulEvent);
    setModalState(false);
    refreshPage();
    toast("Event Modified");
  }

  const refreshPage = () => {
    window.location.reload();
  };

  function handleNavbarAdd() {
    setPopupState(true);
  }

  function handlePopupClose(event) {
    setPopupState(false);
  }

  const Modal = () => {
    return (
      <>
        <div className={modalState === true ? "modal-show" : "modal-hide"}>
          <div>
            <div style={{ fontSize: "16px" }}>
              <div className="popup__headers">
                <div style={{ width: "50%" }}>Event Title:</div>
                <div style={{ width: "50%" }}>
                  <input
                    type="text"
                    placeholder={selectedEvent.title}
                    value={modifyEvent.title}
                    onChange={(e) =>
                      setModifyEvent({ ...modifyEvent, title: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="popup__headers">
                <div className="popup__title">Start Date:</div>
                <DatePicker
                  placeholderText={selectedEvent.start.split("T")[0]}
                  style={{ marginRight: "10px" }}
                  selected={modifyEvent.start}
                  onChange={(start) =>
                    setModifyEvent({ ...modifyEvent, start: start })
                  }
                />
              </div>
              <div className="popup__headers">
                <div className="popup__title">End Date:</div>
                <DatePicker
                  placeholderText={selectedEvent.end.split("T")[0]}
                  selected={modifyEvent.end}
                  onChange={(end) =>
                    setModifyEvent({ ...modifyEvent, end: end })
                  }
                />
              </div>
            </div>
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div style={{ display: "flex" }}>
                <button className="btn-close" onClick={() => handleClose()}>
                  Close
                </button>
                <button
                  className="btn-modify"
                  onClick={() => handleModify(modifyEvent)}
                >
                  Modify
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(selectedEvent)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const NavBar = () => {
    return (
      <div className="navbar">
        <div className="title">CALENDAR</div>
        {/* <div style={{ paddingRight: "20px" }}>
          <button className="btn-add" onClick={() => setPopupButton(true)}>
            Add
          </button>
        </div> */}
      </div>
    );
  };

  const RadioButton = ({ label, value, onChange, name }) => {
    return (
      <label>
        <input type="radio" value={value} onChange={onChange} name={name} />
        {label}
      </label>
    );
  };

  const Popup = () => {
    return (
      <div className={popupButton === true ? "popup-show" : "popup-hide"}>
        <h2>Add New Event</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Add Title"
            style={{ width: "20%", marginRight: "10px" }}
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <DatePicker
            placeholderText="Start Date"
            style={{ marginRight: "10px" }}
            selected={newEvent.start}
            onChange={(start) => setNewEvent({ ...newEvent, start: start })}
          />
          <DatePicker
            placeholderText="End Date"
            selected={newEvent.end}
            onChange={(end) => setNewEvent({ ...newEvent, end: end })}
          />
          <div>
            <div>
              <RadioButton
                label="Puchki"
                value="#F7ACCF"
                onChange={(e) => handleOptionChange(e)}
                name="person"
              />
              <RadioButton
                label="Momo"
                value="#3F88C5"
                onChange={(e) => handleOptionChange(e)}
                name="person"
              />
              {/* <label>
                <input
                  type="radio"
                  value="#F7ACCF"
                  onClick={(e) => handleOptionChange(e)}
                  name="colorEvent"
                />
                Puchki
              </label> */}
            </div>
            <div>
              {/* <label>
                <input
                  type="radio"
                  value="#3F88C5"
                  onClick={(e) => handleOptionChange(e)}
                  name="colorEvent"
                />
                Momo
              </label> */}
            </div>
          </div>

          <div>
            <button
              style={{ marginTop: "10px" }}
              onClick={(e) => handlePopupClose(e)}
              className="btn-close"
            >
              CLOSE
            </button>
            <button
              style={{ marginTop: "10px" }}
              onClick={(e) => handleAddEvent(e)}
              className="btn-add"
            >
              Add Event
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <NavBar />
      {modalState === true ? (
        <Modal />
      ) : (
        <div>
          {/* {popupButton === true ? (
            <Popup />
          ) : ( */}
          <Calendar
            draggableAccessor={(event) => true}
            localizer={localizer}
            events={allEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, margin: "50px" }}
            onSelectSlot="green"
            onSelectEvent={(e) => handleSelectedEvent(e)}
            eventPropGetter={(allEvents) => {
              const backgroundColor = allEvents.colorEvent
                ? allEvents.colorEvent
                : "blue";
              const color = allEvents.color ? allEvents.color : "blue";
              return { style: { backgroundColor, color } };
            }}
          />
          {/* )} */}
          <h2>Add New Event</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                border: "3px solid gray",
                borderRadius: "5px",
                width: "400px",
                marginBottom: "10px",
                marginTop: "10px",
                paddingTop: "10px",
              }}
            >
              <input
                type="text"
                placeholder="Add Title"
                style={{ width: "87%", marginRight: "5px", marginLeft: "5px" }}
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
              <DatePicker
                popperPlacement="left"
                placeholderText="Start Date"
                style={{ marginRight: "10px" }}
                selected={newEvent.start}
                onChange={(start) => setNewEvent({ ...newEvent, start: start })}
              />
              <DatePicker
                popperPlacement="left"
                placeholderText="End Date"
                selected={newEvent.end}
                onChange={(end) => setNewEvent({ ...newEvent, end: end })}
              />
              <div className="radio">
                <label>
                  <input
                    type="radio"
                    value="#F7ACCF"
                    onChange={handleOptionChange}
                    name="person"
                  />
                  Puchki
                </label>
              </div>
              <div className="radio">
                <label>
                  <input
                    type="radio"
                    value="#3F88C5"
                    onChange={handleOptionChange}
                    name="person"
                  />
                  Momo
                </label>
              </div>
              <div>
                {/* <button
                  style={{ marginTop: "10px" }}
                  onClick={(e) => handlePopupClose(e)}
                  className="btn-close"
                >
                  CLOSE
                </button> */}
                <button
                  style={{ marginTop: "10px" }}
                  onClick={(e) => handleAddEvent(e)}
                  className="btn-add"
                >
                  Add Event
                </button>
              </div>
            </div>
            <ToastContainer
              position="bottom-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
