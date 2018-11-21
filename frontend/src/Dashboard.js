import React, { Component } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./Dashboard.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import cellEditFactory from "react-bootstrap-table2-editor";
import axios from "axios";
import FileDownload from "js-file-download";

const headerSortingStyle = { backgroundColor: "#c8e6c9" };
const centertitle = (column, colIndex) => "center";

const columns = [
  {
    dataField: "id",
    text: "ID",
    headerAlign: centertitle
  },
  {
    dataField: "description",
    text: "Product Name",
    filter: textFilter(),
    sort: true,
    headerSortingStyle,
    headerAlign: centertitle
  },
  {
    dataField: "datetime",
    text: "Date",
    sort: true,
    headerSortingStyle,
    headerAlign: centertitle,
    formatter: cell => {
      let dateObj = cell;
      if (typeof cell !== "object") {
        dateObj = new Date(cell);
      }
      return `${("0" + dateObj.getDate()).slice(-2)}/${(
        "0" +
        (dateObj.getMonth() + 1)
      ).slice(-2)}/${dateObj.getFullYear()}`;
    },
    editor: {
      //   type: Type.DATE
    }
  },
  {
    dataField: "longitude",
    text: "Longitude",
    editable: true,
    headerAlign: centertitle
  },
  {
    dataField: "latitude",
    text: "Latitude",
    editable: true,
    headerAlign: centertitle
  },
  {
    dataField: "elevation",
    text: "Elevation",
    editable: true,
    headerAlign: centertitle
  }
];

const defaultSorted = [
  {
    dataField: "datetime",
    order: "desc"
  }
];

const customTotal = (from, to, size) => (
  <span className="react-bootstrap-table-pagination-total">
    Showing {from} to {to} of {size} Results
  </span>
);

const CaptionElement = () => (
  <h3
    style={{
      textAlign: "center",
      color: "purple",
      borderWidth: "3px 0px 3px 0px",
      borderStyle: "solid",
      padding: "0.5em"
    }}
  >
    Trip Logger
  </h3>
);

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      isLoaded: false,
      selected: [],
      selectedjson: []
    };
  }

  handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      this.setState(() => ({
        selected: [...this.state.selected, row.primaryid],
        selectedjson: [...this.state.selectedjson, row]
      }));
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== row.primaryid)
      }));
    }
  };

  handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map(r => r.primaryid);
    if (isSelect) {
      this.setState(() => ({
        selected: ids
      }));
    } else {
      this.setState(() => ({
        selected: []
      }));
    }
  };

  delete = e => {
    e.preventDefault();
    const deleteUrl = "http://localhost:5000/api/v1/resources/records";
    const httpReqHeaders = {
      "Content-Type": "application/json"
    };
    const axiosConfigObject = {
      headers: httpReqHeaders
    };
    for (var c = 0; c < this.state.selectedjson.length; c++) {
      axios
        .delete(
          deleteUrl,
          { data: this.state.selectedjson[c] },
          axiosConfigObject
        )
        .then(resp => {
          if (resp.status === 200) {
            this.setState({
              products: resp.data,
              isLoaded: true
            });
            alert("Successfully deleted");
          } else {
            alert("An error occured");
          }
        });
    }
  };

  download() {
    axios
      .get("http://localhost:5000/api/v1/resources/records/docxfile")
      .then(response => {
        FileDownload(response.data, "file.txt.docx");
      });
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/api/v1/resources/records")
      .then(response => {
        this.setState({
          products: response.data,
          isLoaded: true
        });
      });
  }
  render() {
    if (!this.state.isLoaded) {
      return (
        <div>
          <h3
            style={{
              textAlign: "center",
              color: "green",
              padding: "0.5em"
            }}
          >
            Loading...
          </h3>
        </div>
      );
    } else {
      const selectRow = {
        mode: "checkbox",
        clickToSelect: true,
        style: { backgroundColor: "gold" },
        selected: this.state.selected,
        onSelect: this.handleOnSelect,
        onSelectAll: this.handleOnSelectAll
      };
      const options = {
        paginationSize: 4,
        pageStartIndex: 1,
        withFirstAndLast: true,
        firstPageText: "First",
        prePageText: "Back",
        nextPageText: "Next",
        lastPageText: "Last",
        nextPageTitle: "First page",
        prePageTitle: "Pre page",
        firstPageTitle: "Next page",
        lastPageTitle: "Last page",
        showTotal: true,
        paginationTotalRenderer: customTotal,
        sizePerPageList: [
          {
            text: "5",
            value: 5
          },
          {
            text: "10",
            value: 10
          },
          {
            text: "All",
            value: this.state.products.length
          }
        ]
      };
      return (
        <div>
          <button onClick={this.delete} disabled={!this.state.selected.length}>
            Delete
          </button>
          {/* <button onClick={this.download}>Download data</button> */}
          <BootstrapTable
            bootstrap4
            keyField="primaryid"
            data={this.state.products}
            caption={<CaptionElement />}
            columns={columns}
            cellEdit={cellEditFactory({ mode: "click", blurToSave: true })}
            filter={filterFactory()}
            pagination={paginationFactory(options)}
            selectRow={selectRow}
            striped
            hover
            condensed
            noDataIndication="Table is Empty"
            defaultSorted={defaultSorted}
          />
        </div>
      );
    }
  }
}

export default Dashboard;
