import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EC2DashboardPage({ onLogout }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState("");
  const [dropdownKey, setDropdownKey] = useState("");
   const [sortedData, setSortedData] = useState([]);
  const [sortError, setSortError] = useState("");
  const [region, setSelectedRegion] = useState("");
  const [showSortContainer, setShowContainer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEmptyTable, setShowEmptyTable] = useState(false);


  const pageSize = 20;


  const regions = [
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
    'ap-south-1',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-northeast-1',
    'ap-northeast-2',
    'ap-northeast-3',
    'ca-central-1',
    'eu-central-1',
    'eu-west-1',
    'eu-west-2',
    'eu-west-3',
    'eu-north-1',
    'sa-east-1',
    'af-south-1',
    'ap-east-1',
    'ap-south-2',
    'ap-southeast-3',
    'ap-southeast-4',
    'eu-south-1',
    'eu-south-2',
    'eu-central-2',
    'me-south-1',
    'me-central-1'
  ];
  const handleSort = async () => {
    if (!sortKey && !dropdownKey && !region) {
      setSortError("To sort, you must select the region you want, attribute to sort by, and the order. Please select attribute and order.");
    } else if (!sortKey) {
      setSortError("To sort, you must select the attribute to sort by. Please select attribute.");
    } else if (!dropdownKey) {
      setSortError("To sort, you must select the attribute to sort by and the order. Please select order.");
    } else {
      setSortError("");
  
        const sorted = [...sortedData].sort((a, b) => {
          if (dropdownKey === "ascending") {
            return a[sortKey].localeCompare(b[sortKey]);
          } else{ 
            return b[sortKey].localeCompare(a[sortKey]);
          }
        });
        
        setSortedData(sorted);
    }
  };
 
  const handleClickData = async () => {
    try {
      let response;

      if (sortKey && dropdownKey) {
        response = await axios.post("http://localhost:3001/sortData", { sortKey, dropdownKey, email,region });
      } else {
        setDropdownKey("ascending");
        setSortKey("name");
        response = await axios.post("http://localhost:3001/sortData", { sortKey, dropdownKey, email,region });
      }
      
      const newData = response.data;
      if (newData.length === 0) { 
        setSortedData(newData);
        setShowEmptyTable(false); }
        else{
        setSortedData(newData);
        setShowContainer(true);
      }
   
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3001/logout", { email });
      onLogout(); 
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleClickNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  const handleClickPrevious = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  
  

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "State",
        accessor: "state",
      },
      {
        Header: "AZ",
        accessor: "az",
      },
      {
        Header: "Public IP",
        accessor: "publicIP",
      },
      {
        Header: "Private IPs",
        accessor: "privateIPs",
      },
    ],
    []
  );


  return (
    <div className="App">
          <div className="data-button-container">
            {showSortContainer&&
            <h5>  ********************************************                    for retrieve other region change the region/ for retrieve more data - and click on the buttun  </h5>}
            <button className="data-button" onClick={handleClickData}>
            retrieve EC2 instance for Selected Region
            </button>
            <select
    className="region-dropdown"
    value={region}
    onChange={(e) => setSelectedRegion(e.target.value)}
  >
    <option value="">Select Region</option>
    {regions.map((region) => (
      <option key={region} value={region}>{region}</option>
    ))}
  </select>
            </div>
          
        
<div className="logout-button-container">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

      {sortedData.length === 0? <h1 className="title"> Active EC2 Instances is empyte </h1>: <h1 className="title"> Active EC2 Instances </h1>}
      {showSortContainer &&
      <div className="container">
        <div className="transparent-square">
          <div className="dropdown-container">
            <select
              className="attribute-dropdown"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
            >
              <option value="">Select Attribute</option>
              <option value="name">Name</option>
              <option value="id">ID</option>
              <option value="type">Type</option>
              <option value="state">State</option>
              <option value="az">AZ</option>
              <option value="publicIP">Public IP</option>
              <option value="privateIPs">Private IPs</option>
            </select>
            <select
              className="order-dropdown"
              value={dropdownKey}
              onChange={(e) => setDropdownKey(e.target.value)}
            >
              <option value="">Select Order</option>
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>
            <button className="sort-button" onClick={handleSort}>
              Sort
            </button>
          </div>
          {sortError && <div className="error-message">{sortError}</div>}
        </div>
        {showEmptyTable ? ( 
            <p className="title2">There are no Active EC2 Instances for the selected region</p>
          ) : (
            <div className="table-container">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.accessor}>{column.Header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
  {sortedData
    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
    .map((row, index) => (
      <tr key={index}>
        {columns.map((column) => (
          <td key={column.accessor}>{row[column.accessor]}</td>
        ))}
      </tr>
    ))}
</tbody>
            </table>
          
            </div>
      </div>)}
      {!showEmptyTable&& currentPage > 1 && (
  <button className="previous-page-button" onClick={handleClickPrevious}>
    Previous Page
  </button>
)}
{!showEmptyTable && currentPage * pageSize < sortedData.length && (
  <button className="next-page-button" onClick={handleClickNext}>
    Next Page
  </button>
)}

      </div>}

         

      </div>
 
  );
}

export default EC2DashboardPage;
