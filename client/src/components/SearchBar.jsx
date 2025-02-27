import React from "react";
import Autocomplete from "./Autocomplete";
import Modetooltip from "./ModeTooltip";

export default function SearchBar({
  handleSubmit,
  submitRef,
  query,
  handleInputChange,
  getExample,
  proteinOptions,
  goTermOptions,
  handleGuide,
  handleSpeciesChange,
  handleQueryMode,
  activeModeButton,
}) {
  return (
    // Search Bar Component
    <div className="query-container">
      {/* search inputs and button */}
      <form method="post" onSubmit={handleSubmit}>
        <div className="search-container">
          <div className="search-input-wrapper">
            <Autocomplete
              suggestions={proteinOptions} // Pass the protein suggestions to the Autocomplete component
              inputName="protein"
              inputValue={query.protein}
              onInputChange={handleInputChange}
              placeholder="Protein"
            />
            <Autocomplete
              className="go-term-input"
              suggestions={goTermOptions} // Pass the go term suggestions to the Autocomplete component
              inputName="goTerm"
              inputValue={query.goTerm}
              onInputChange={handleInputChange}
              placeholder="GO Term"
            />
            <input
              className="k-input" // User input for k
              type="number"
              min="0"
              name="k"
              placeholder="k"
              value={query.k}
              onChange={handleInputChange}
              required
            />
            <select
              style={{ width: "180px" }}
              name="species" // User input for species
              value={query.species}
              onChange={handleSpeciesChange}
            >
              <option value="txid224308">B. subtilis (224308)</option>
              <option value="txid7227">D. melanogaster (7227)</option>
              <option value="txid7955">D. rerio (7955)</option>
            </select>
            <button type="submit" className="search-button" ref={submitRef}>
              Search
            </button>
          </div>
        </div>
      </form>

      {/* change query mode */}
      <div className="mode-container">
        <h4>Mode:</h4>
        <input
          data-tooltip-id="path-tooltip"
          type="button"
          className={
            activeModeButton === "path" ? "active-button" : "inactive-button"
          }
          onClick={handleQueryMode}
          value="Paths"
        />
        <input
          data-tooltip-id="node-tooltip"
          type="button"
          className={
            activeModeButton === "node" ? "active-button" : "inactive-button"
          }
          onClick={handleQueryMode}
          value="Nodes"
        />
        <Modetooltip></Modetooltip>

        {/* user examples */}
        <h4 className="example">
          Examples: <a onClick={() => getExample(1)}>#1</a>{" "}
          <a onClick={() => getExample(2)}>#2</a>{" "}
          <a onClick={() => getExample(3)}>#3</a>
        </h4>
      </div>

      {/* user guide */}
      <button className="guide-button" onClick={handleGuide}>
        ?
      </button>
    </div>
  );
}
