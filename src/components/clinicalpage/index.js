import React, { Component } from "react";
import {TailSpin} from 'react-loader-spinner'
import "./index.css";

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
};

class ClinicalDataRetrieval extends Component {
  state = {
    dieseasename: "",
    dieaseDeatils: {
      a: "",
      b: "",
      c: "",
    },
    dieasesList: [],
    apistatus: apiStatusConstants.inProgress,
  };

  componentDidMount() {
    this.getDieaseDetails();
  }

  onKey = (event) => {
    if (event.key.toLowerCase() === "enter") {
      this.getDieaseDetails();
    }
  }

  onChangeSearch = (event) => {
    this.setState({
      dieseasename: event.target.value,
    })
  }

  getDieaseDetails = async () => {
    this.setState({
      apistatus: apiStatusConstants.inProgress
    });
    const { dieseasename } = this.state;

    const apiUrl = `https://classic.clinicaltrials.gov/api/query/field_values?expr=${dieseasename}&field=Condition&fmt=json`;
    const options = {
      method: "GET",
    };

    try {
      const response = await fetch(apiUrl, options);
      if (response.ok) {
        const data = await response.json();
        this.setState(prevState => ({
          dieaseDeatils: {
            ...prevState.dieaseDeatils,
            a: data.FieldValuesResponse.Expression,
            b: data.FieldValuesResponse.NStudiesAvail,
            c: data.FieldValuesResponse.NStudiesFound,
          },
          dieasesList: data.FieldValuesResponse.FieldValues,
          apistatus: apiStatusConstants.success
        }));
      } else {
        this.setState({
          apistatus: apiStatusConstants.failure
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      this.setState({
        apistatus: apiStatusConstants.failure
      });
    }
  }

  renderLoader = () => {
    return (
      <div className="Loader-container" testid="loader">
        <TailSpin type="TailSpin" color="#0284C7" height={50} width={50} />
      </div>
    )
  }

  renderFailure = () => {
    return (
      <div className="failure-page">
         <img className="failure-image" src="https://img.freepik.com/free-vector/internet-network-warning-404-error-page-file-found-web-page-internet-error-page-issue-found-network-404-error-present-by-man-sleep-display_1150-55450.jpg?size=626&ext=jpg&ga=GA1.1.386372595.1698105600&semt=ais" alt="failure-view"/>
        <button className="retry-button" onClick={this.getDieaseDetails}>Retry</button>
      </div>
    )
  }

  renderSuccess = () => {
    const { dieseasename, dieaseDeatils, dieasesList } = this.state;
    const reducedList = dieasesList.slice(0, 600);

    return (
      <div className="clinical-page-container">
        <h1 className="clinical-heading">Clinical Trials Data Retrieval</h1>
        <div className="search-container">
          <input
            type="search"
            placeholder="Enter a Disease"
            value={dieseasename}
            onKeyDown={this.onKey}
            onChange={this.onChangeSearch}
          />
          <button onClick={this.getDieaseDetails} className="get-data-button">
            Get Data
          </button>
        </div>
        <div>
          <h1>{dieaseDeatils.a} Diseases</h1>
          <p className="studies">Number of Studies Available: {dieaseDeatils.b}</p>
          <p className="studies">Number of Studies Found: {dieaseDeatils.c}</p>
        </div>
        <div>
          <h1>{dieaseDeatils.a} diseases Syndromes:</h1>
          <ul>
            {reducedList.map((eachitem) => (
              <li className="list-container" key={eachitem.FieldValue}>
                <h1 className="medical-condition">medical condition: {eachitem.FieldValue}</h1>
                <p className="studies">No. of studies in this Database: {eachitem.NStudiesFoundWithValue}</p>
                <p className="studies">No. of studies: {eachitem.NStudiesWithValue}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
  renderViews=()=>{
    const {apistatus}=this.state
   
    switch(apistatus){
     
        case apiStatusConstants.inProgress:
        return this.renderLoader()
        case apiStatusConstants.success:
        return this.renderSuccess()
        case apiStatusConstants.failure:
        return this.renderFailure()
        default:
        return null

    }
    }

  render() {
    return (
      <>
       {this.renderViews()}
      </>
    )
  }
}

export default ClinicalDataRetrieval;
