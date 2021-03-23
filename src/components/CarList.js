import React, { useState, useEffect, useRef } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { Button } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";

import AddCar from './AddCar';
import EditCar from './EditCar';


function CarList() {
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const gridRef = useRef();

  useEffect(() => {
    getCars();
  }, []);

  const columns = [
    {
      headerName: "Delete", field: "_links.self.href",
      sortable: false, filter: false, width: 100,
      cellRendererFramework: (row) => (<Button size="small"color="secondary" onClick={() => deleteCar(row.value) }> x</Button>
      ),
    },

    {
      headerName: "Edit", field: "_links.self.href",
      sortable: false, filter: false, width: 100,
      cellRendererFramework: (car) => <EditCar updateCar={updateCar} car={car}/>
      
    },

    { headerName: "Brand", field: "brand", sortable: true, filter: true },
    { headerName: "Model", field: "model", sortable: true, filter: true },
    { headerName: "Year", field: "year", sortable: true, filter: true },
    { headerName: "Price", field: "price", sortable: true, filter: true },
    { headerName: "Color", field: "color", sortable: true, filter: true },
    { headerName: "Fuel", field: "fuel", sortable: true, filter: true },

  ];

  const getCars = async () => {
    fetch("https://carstockrest.herokuapp.com/cars")
      .then((response) => response.json())
      .then((data) => setCars(data._embedded.cars))
      .catch((err) => console.error(err));
  };

  const deleteCar = (link) => {
    if (window.confirm("DELETE CAR?")) {
      fetch(link, { method: "DELETE" })
        .then((response) => getCars())
        .then(() => setMsg("CAR DELETED!"))
        .then(() => setOpen(true))
        .catch((e) => console.error(e));
    }
  };

  const saveCar = (car) => {
    fetch("https://carstockrest.herokuapp.com/cars", {
      method  : 'POST',
      headers : { 'Content-Type':'application/json' },
      body: JSON.stringify(car) })
      .then(on_response => getCars())
      .catch(err => console.error(err))
    }

    const updateCar = (car, link) => {
      fetch(link, {
        method: 'PUT',
        headers : { 'Content-Type':'application/json' },
        body: JSON.stringify(car) })
      .then(on_response => getCars())
      .catch(err => console.error(err))
    }


  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <AddCar saveCar = { saveCar }/>
      <div
        className="ag-theme-material"
        style={{ height: "900px", width: "1000px", margin: "auto" }}
      >
        <AgGridReact
          columnDefs         = {columns}
          rowData            = {cars}
          ref                = {gridRef}
          rowSelection       = "single"
          pagination         = { true }
          paginationPageSize = { 5 } 
        ></AgGridReact>
      </div>

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message={msg}
      />
    </div>
  );
}

export default CarList;
