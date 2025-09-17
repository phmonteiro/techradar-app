import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Trends.css'; // Import custom CSS
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Changed from useHistory to useNavigate

const Trends = () => {
  const [trends, setTrends] = useState([]);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate(); // Changed from history to navigate

  useEffect(() => {
    // Fetch the list of trends from the backend
    axios.get(`${import.meta.env.VITE_API_URL}/api/trends`)
      .then(response => {
        setTrends(response.data.data);
      })      
      .catch(error => {
        console.error("Error fetching trends:", error);
      });
  }, []);

  // Function to handle viewing a technology
  const handleViewTrend = (trend) => {
    console.log("trend");
    console.log(trend);
    // Navigate to the tech details page
    navigate(`/trends/${trend.Label}`); // Changed from history.push to navigate
  };

  // Filter trends based on filter input
  const filteredTrends = trends.filter(trend => {
    if (!filter) return true;
    
    const searchTerm = filter.toLowerCase();
    
    return (
      trend.Name?.toLowerCase().includes(searchTerm) ||
      trend.Abstract?.toLowerCase().includes(searchTerm) ||
      trend.Stage?.toLowerCase().includes(searchTerm) ||
      trend.DefinitionAndScope?.toLowerCase().includes(searchTerm) ||
      trend.RelevanceAndImpact?.toLowerCase().includes(searchTerm) ||
      trend.trendSegment?.toLowerCase().includes(searchTerm) ||
      trend.trendMaturity?.toLowerCase().includes(searchTerm) ||
      trend.RecommendedAction?.toLowerCase().includes(searchTerm) ||
      trend.ContentSource?.toLowerCase().includes(searchTerm) ||
      trend.LastReviewDate?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="trends">
      <Navbar />
      <div className="container-fluid p-0 m-0">
        <h1>Trends</h1>
        <div className="search-container" style={{marginBottom: '0px', padding: '0 15px', display: 'flex', justifyContent: 'flex-start', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', marginTop: '10px'}}>
          <div className="search-group" style={{maxWidth: '400px'}}>
            <input
              type="text"
              placeholder="Filter all fields..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button type="button">
              <FontAwesomeIcon icon={faSearch} /> Filter
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-striped responsive-table">
            <thead>
              <tr>
                <th>Actions</th>
                <th>Name</th>
                <th>Abstract</th>
                <th>Stage</th>
                <th>Definition And Scope</th>
                <th>Relevance And Impact</th>
                <th>Technology Segment</th>
                <th>Technology Maturity</th>
                <th>Recommended Action</th>
                <th>Content Source</th>
                <th>Last Review Date</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrends.map(trend => (
                <tr key={trend.ID}>
                  <td className="action-cell">
                    <FontAwesomeIcon 
                      icon={faEye} 
                      onClick={() => handleViewTrend(trend)}
                      className="action-icon"
                      title="View Trend Details"
                    />
                  </td>
                  <td data-title={trend.Name}>{trend.Name}</td>
                  <td data-title={trend.Abstract}>{trend.Abstract}</td>
                  <td data-title={trend.Stage}>{trend.Stage}</td>
                  <td data-title={trend.DefinitionAndScope}>{trend.DefinitionAndScope}</td>
                  <td data-title={trend.RelevanceAndImpact}>{trend.RelevanceAndImpact}</td>
                  <td data-title={trend.trendSegment}>{trend.trendSegment}</td>
                  <td data-title={trend.trendMaturity}>{trend.trendMaturity}</td>
                  <td data-title={trend.RecommendedAction}>{trend.RecommendedAction}</td>
                  <td data-title={trend.ContentSource}>{trend.ContentSource}</td>
                  <td data-title={trend.LastReviewDate}>{trend.LastReviewDate}</td>
                  <td data-title={trend.Timestamp}>{trend.Timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Trends;