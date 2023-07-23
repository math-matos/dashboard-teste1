import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Plot from 'react-plotly.js';
import './App.css';

function App() {
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  // Dados simulados para o exemplo
  const data = [];
  const startDate = new Date('2023-01-01');
  for (let i = 0; i < 180; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    data.push({ Data: currentDate, Valor: i });
  }

  // Função para filtrar os dados com base nos filtros selecionados
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const itemMonth = item.Data.getMonth() + 1;
      if (selectedMonth && itemMonth !== selectedMonth) {
        return false;
      }
      if (selectedStartDate && item.Data < selectedStartDate) {
        return false;
      }
      if (selectedEndDate && item.Data > selectedEndDate) {
        return false;
      }
      return true;
    });
  }, [data, selectedMonth, selectedStartDate, selectedEndDate]);

  // Configuração do gráfico
  const plotData = [{
    x: filteredData.map(item => item.Data),
    y: filteredData.map(item => item.Valor),
    type: 'line',
    mode: 'lines+markers',
    marker: { color: 'blue' },
    line: { shape: 'linear' },
  }];

  // Key única com base nos filtros selecionados
  const plotKey = JSON.stringify({ selectedMonth, selectedStartDate, selectedEndDate });

  return (
    <div className="App">
      <h1>Dashboard com Gráfico e Filtros</h1>

      <div className="filters-container">
        <div className="filter">
          <label>Filtro por Mês:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            <option value={1}>Janeiro</option>
            <option value={2}>Fevereiro</option>
            <option value={3}>Março</option>
            <option value={4}>Abril</option>
            <option value={5}>Maio</option>
            <option value={6}>Junho</option>
            <option value={7}>Julho</option>
          </select>
        </div>

        <div className="filter">
          <label>Filtro por Range de Data:</label>
          <DatePicker
            selected={selectedStartDate}
            onChange={(date) => setSelectedStartDate(date)}
            selectsStart
            startDate={selectedStartDate}
            endDate={selectedEndDate}
            dateFormat="dd/MM/yyyy"
            isClearable
          />
          <DatePicker
            selected={selectedEndDate}
            onChange={(date) => setSelectedEndDate(date)}
            selectsEnd
            startDate={selectedStartDate}
            endDate={selectedEndDate}
            dateFormat="dd/MM/yyyy"
            isClearable
          />
        </div>
      </div>

      <div className="PlotlyGrid">
        <Plot
          key={plotKey} // key único aqui
          data={plotData}
          layout={{ title: 'Valores ao longo do tempo' }}
          config={{ responsive: true }}
        />
      </div>
    </div>
  );
}

export default App;
