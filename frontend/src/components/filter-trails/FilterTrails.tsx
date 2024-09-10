import React, { useState } from 'react';
import './FilterTrails.scss';

interface FilterTrailsProps {
  onApplyFilters: (filters: any) => void;
}

const FilterTrails: React.FC<FilterTrailsProps> = ({ onApplyFilters }) => {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedDistances, setSelectedDistances] = useState<string[]>([]);
  const [selectedElevations, setSelectedElevations] = useState<string[]>([]);

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const { value, checked } = event.target;
    setter(prevState =>
      checked ? [...prevState, value] : prevState.filter(item => item !== value)
    );
  };

  const applyFilters = () => {
    const filters = {
      sports: selectedSports,
      difficulties: selectedDifficulties,
      times: selectedTimes,
      distances: selectedDistances,
      elevations: selectedElevations,
    };
    onApplyFilters(filters); // Pass the filters to the parent (Sidebar)
  };

  return (
    <div className="filter-trails">
    <h3>Filter Trails</h3>

    {/* Sport Type */}
    <div className="filter-item">
        <label>Sport Type:</label>
        <div>
            <label>
                <input
                    type="checkbox"
                    value="hiking"
                    onChange={(e) => handleCheckboxChange(e, setSelectedSports)}
                />
                Hiking
            </label>
            <label>
                <input
                    type="checkbox"
                    value="biking"
                    onChange={(e) => handleCheckboxChange(e, setSelectedSports)}
                />
                Biking
            </label>
            <label>
                <input
                    type="checkbox"
                    value="running"
                    onChange={(e) => handleCheckboxChange(e, setSelectedSports)}
                />
                Running
            </label>
        </div>
    </div>

    {/* Difficulty */}
    <div className="filter-item">
        <label>Difficulty:</label>
        <div>
            <label>
                <input
                    type="checkbox"
                    value="easy"
                    onChange={(e) => handleCheckboxChange(e, setSelectedDifficulties)}
                />
                Easy
            </label>
            <label>
                <input
                    type="checkbox"
                    value="medium"
                    onChange={(e) => handleCheckboxChange(e, setSelectedDifficulties)}
                />
                Medium
            </label>
            <label>
                <input
                    type="checkbox"
                    value="hard"
                    onChange={(e) => handleCheckboxChange(e, setSelectedDifficulties)}
                />
                Hard
            </label>
            <label>
                <input
                    type="checkbox"
                    value="extreme"
                    onChange={(e) => handleCheckboxChange(e, setSelectedDifficulties)}
                />
                Extreme
            </label>
        </div>
    </div>

    {/* Time */}
    <div className="filter-item">
        <label>Time:</label>
        <div>
            <label>
                <input
                    type="checkbox"
                    value="<1"
                    onChange={(e) => handleCheckboxChange(e, setSelectedTimes)}
                />
                &lt; 1 hour
            </label>
            <label>
                <input
                    type="checkbox"
                    value="1-3"
                    onChange={(e) => handleCheckboxChange(e, setSelectedTimes)}
                />
                1-3 hours
            </label>
            <label>
                <input
                    type="checkbox"
                    value=">3"
                    onChange={(e) => handleCheckboxChange(e, setSelectedTimes)}
                />
                3+ hours
            </label>
        </div>
    </div>

    {/* Distance */}
    <div className="filter-item">
        <label>Distance:</label>
        <div>
            <label>
                <input
                    type="checkbox"
                    value="<5"
                    onChange={(e) => handleCheckboxChange(e, setSelectedDistances)}
                />
                &lt; 5 km
            </label>
            <label>
                <input
                    type="checkbox"
                    value="5-10"
                    onChange={(e) => handleCheckboxChange(e, setSelectedDistances)}
                />
                5-10 km
            </label>
            <label>
                <input
                    type="checkbox"
                    value="10-30"
                    onChange={(e) => handleCheckboxChange(e, setSelectedDistances)}
                />
                10-30 km
            </label>
            <label>
                <input
                    type="checkbox"
                    value="30-50"
                    onChange={(e) => handleCheckboxChange(e, setSelectedDistances)}
                />
                30-50 km
            </label>
            <label>
                <input
                    type="checkbox"
                    value=">50"
                    onChange={(e) => handleCheckboxChange(e, setSelectedDistances)}
                />
                50+ km
            </label>
        </div>
    </div>

    {/* Elevation */}
    <div className="filter-item">
        <label>Elevation:</label>
        <div>
            <label>
                <input
                    type="checkbox"
                    value="500"
                    onChange={(e) => handleCheckboxChange(e, setSelectedElevations)}
                />
                &lt; 500m
            </label>
            <label>
                <input
                    type="checkbox"
                    value="500-1000"
                    onChange={(e) => handleCheckboxChange(e, setSelectedElevations)}
                />
                500-1000m
            </label>
            <label>
                <input
                    type="checkbox"
                    value="1000-2000"
                    onChange={(e) => handleCheckboxChange(e, setSelectedElevations)}
                />
                1000-2000m
            </label>
            <label>
                <input
                    type="checkbox"
                    value="2000-3000"
                    onChange={(e) => handleCheckboxChange(e, setSelectedElevations)}
                />
                2000-3000m
            </label>
            <label>
                <input
                    type="checkbox"
                    value=">3000"
                    onChange={(e) => handleCheckboxChange(e, setSelectedElevations)}
                />
                3000+ m
            </label>
            
        </div>
       <button className="apply-filter-button" onClick={applyFilters}>
        Apply Filters
    </button>
    </div>

    
</div>

  );
};

export default FilterTrails;
