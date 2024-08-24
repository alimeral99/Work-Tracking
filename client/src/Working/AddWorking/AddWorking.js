import React, { useState, useEffect } from "react";
import "./AddWorking.css";
import Alert from "../Alert";
import API_URL from "../../redux/Works/api";
import { createWorks } from "../../redux/Works/WorkApi";

import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddWorking() {
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddWorks = async (e) => {
    e.preventDefault();

    const createContent = {
      date,
      name,
      duration,
    };

    createWorks(dispatch, createContent);
  };

  return (
    <div className="add-working">
      <form onSubmit={handleAddWorks}>
        <h2 className="form-header">Add Working</h2>

        <div className="input-container">
          <label>Date</label>

          <DatePicker
            style={{ border: "block" }}
            wrapperClassName="date-picker"
            selected={date}
            onChange={(date) => setDate(date)}
          />
        </div>

        <div className="input-container">
          <label>Name </label>
          <input
            placeholder="name"
            onChange={(e) => setName(e.target.value)}
            type="text"
          />
        </div>

        <div className="input-container">
          <label>Durations</label>
          <input
            placeholder="duration"
            onChange={(e) => setDuration(e.target.value)}
            type="number"
          />
        </div>

        <div className="button-container">
          <button className="add-button">Add Working</button>
        </div>
      </form>
    </div>
  );
}

export default AddWorking;
