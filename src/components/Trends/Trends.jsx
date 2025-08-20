import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Trends.css'; // Import custom CSS
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Changed from useHistory to useNavigate

const Trends = () => {
  const [trends, setTrends] = useState([]);
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

  return (
    <div className="trends">
      <Navbar />
      <div className="container-fluid p-0 m-0">
        <h1>Trends</h1>
        <div>
          <table className="table table-striped">
            <thead>
              <tr>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trends.map(trend => (
                <tr key={trend.ID}>
                  <td className="truncate-text">{trend.Name}</td>
                  <td className="truncate-text">{trend.Abstract}</td>
                  <td className="truncate-text">{trend.Stage}</td>
                  <td className="truncate-text">{trend.DefinitionAndScope}</td>
                  <td className="truncate-text">{trend.RelevanceAndImpact}</td>
                  <td className="truncate-text">{trend.trendSegment}</td>
                  <td className="truncate-text">{trend.trendMaturity}</td>
                  <td className="truncate-text">{trend.RecommendedAction}</td>
                  <td className="truncate-text">{trend.ContentSource}</td>
                  <td className="truncate-text">{trend.LastReviewDate}</td>
                  <td className="truncate-text">{trend.Timestamp}</td>
                  <td className="truncate-text action-cell">
                    <FontAwesomeIcon 
                      icon={faEye} 
                      onClick={() => handleViewTrend(trend)}
                      className="action-icon"
                    />
                  </td>
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