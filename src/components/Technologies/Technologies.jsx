import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Technologies.css'; // Import custom CSS
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Changed from useHistory to useNavigate

const Technologies = () => {
  const [technologies, setTechnologies] = useState([]);
  const navigate = useNavigate(); // Changed from history to navigate

  useEffect(() => {
    // Fetch the list of technologies from the backend
    axios.get('${import.meta.env.VITE_API_URL}/api/technologies')
      .then(response => {
        setTechnologies(response.data.data);
      })
      .catch(error => {
        console.error("Error fetching technologies:", error);
      });
  }, []);

  // Function to handle viewing a technology
  const handleViewTechnology = (tech) => {
    // Navigate to the tech details page
    navigate(`/technologies/${tech.Label}`); // Changed from history.push to navigate
  };

  return (
    <div className="technologies">
      <Navbar />
      <div className="container-fluid p-0 m-0">
        <h1>Technologies</h1>
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
              {technologies.map(tech => (
                <tr key={tech.ID}>
                  <td className="truncate-text">{tech.Name}</td>
                  <td className="truncate-text">{tech.Abstract}</td>
                  <td className="truncate-text">{tech.Stage}</td>
                  <td className="truncate-text">{tech.DefinitionAndScope}</td>
                  <td className="truncate-text">{tech.RelevanceAndImpact}</td>
                  <td className="truncate-text">{tech.TechnologySegment}</td>
                  <td className="truncate-text">{tech.TechnologyMaturity}</td>
                  <td className="truncate-text">{tech.RecommendedAction}</td>
                  <td className="truncate-text">{tech.ContentSource}</td>
                  <td className="truncate-text">{tech.LastReviewDate}</td>
                  <td className="truncate-text">{tech.Timestamp}</td>
                  <td className="truncate-text action-cell">
                    <FontAwesomeIcon 
                      icon={faEye} 
                      onClick={() => handleViewTechnology(tech)}
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

export default Technologies;