import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Technologies.css'; // Import custom CSS
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Changed from useHistory to useNavigate

const Technologies = () => {
  const [technologies, setTechnologies] = useState([]);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate(); // Changed from history to navigate

  useEffect(() => {
    // Fetch the list of technologies from the backend
    axios.get(`${import.meta.env.VITE_API_URL}/api/technologies`)
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
    navigate(`/technologies/${tech.GeneratedID}`); // Changed from history.push to navigate
  };

  // Filter technologies based on filter input
  const filteredTechnologies = technologies.filter(tech => {
    if (!filter) return true;
    
    const searchTerm = filter.toLowerCase();
    
    return (
      tech.Name?.toLowerCase().includes(searchTerm) ||
      tech.Abstract?.toLowerCase().includes(searchTerm) ||
      tech.Stage?.toLowerCase().includes(searchTerm) ||
      tech.DefinitionAndScope?.toLowerCase().includes(searchTerm) ||
      tech.RelevanceAndImpact?.toLowerCase().includes(searchTerm) ||
      tech.TechnologySegment?.toLowerCase().includes(searchTerm) ||
      tech.TechnologyMaturity?.toLowerCase().includes(searchTerm) ||
      tech.RecommendedAction?.toLowerCase().includes(searchTerm) ||
      tech.ContentSource?.toLowerCase().includes(searchTerm) ||
      tech.LastReviewDate?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="technologies">
      <Navbar />
      <div className="container-fluid p-0 m-0">
        <h1>Technologies</h1>
        <div className="search-container">
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
              {filteredTechnologies.map(tech => (
                <tr key={tech.ID}>
                  <td data-title="Action">
                    <FontAwesomeIcon 
                      icon={faEye} 
                      onClick={() => handleViewTechnology(tech)}
                      className="action-icon"
                      title="View Technology Details"
                    />
                  </td>
                  <td data-title={tech.Name}>{tech.Name}</td>
                  <td data-title={tech.Abstract}>{tech.Abstract}</td>
                  <td data-title={tech.Stage}>{tech.Stage}</td>
                  <td data-title={tech.DefinitionAndScope}>{tech.DefinitionAndScope}</td>
                  <td data-title={tech.RelevanceAndImpact}>{tech.RelevanceAndImpact}</td>
                  <td data-title={tech.TechnologySegment}>{tech.TechnologySegment}</td>
                  <td data-title={tech.TechnologyMaturity}>{tech.TechnologyMaturity}</td>
                  <td data-title={tech.RecommendedAction}>{tech.RecommendedAction}</td>
                  <td data-title={tech.ContentSource}>{tech.ContentSource}</td>
                  <td data-title={tech.LastReviewDate}>{tech.LastReviewDate}</td>
                  <td data-title={tech.Timestamp}>{tech.Timestamp}</td>
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