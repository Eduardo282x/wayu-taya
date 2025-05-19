import { TableComponents } from "@/components/table/TableComponents";
import { columnPeople, dataPeople } from "./people.data";
import "./style.css";
import { useState } from 'react';

export const People = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    // Aquí puedes agregar la lógica que se ejecutará al hacer clic en el botón de búsqueda
    alert(`Buscando cédula: ${inputValue}`);
  };

  const handleAddPerson = () => {
    // ... tu lógica para agregar persona ...
  };

  return (
    <div>
      <div className="people-controls-container">
        <button className="people-add-button" onClick={handleAddPerson}> Agregar persona</button>
        <div className="search-container">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ingrese cedula"
            className="search-input"
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button onClick={handleButtonClick} className="search-button" style={{ marginLeft: '10px' }}>
            Buscar
          </button>
        </div>
      </div>

      <TableComponents column={columnPeople} data={dataPeople} />
    </div>
  );
};