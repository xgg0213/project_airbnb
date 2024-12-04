import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SpotsPage = () => {
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchSpots = async () => {
        try {
          const response = await fetch('/api/spots'); // Replace with your backend endpoint
          if (!response.ok) {
            throw new Error('Failed to fetch spots');
          }
          const data = await response.json();
          setSpots(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchSpots();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
      }
    
      if (error) {
        return <p>Error: {error}</p>;
      }
    return (
        <div className="spots-page">
          <h1>Explore Spots</h1>
          <div className="spots-container">
            {spots.map((spot) => (
              <div className="spot-card" key={spot.id}>
                <img src={spot.imageUrl} alt={spot.name} className="spot-image" />
                <h3>{spot.name}</h3>
                <p>{spot.description}</p>
                <Link to={`/spots/${spot.id}`} className="spot-link">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      );
    };
    
    export default SpotsPage;   