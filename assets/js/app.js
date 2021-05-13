// from data.js
const tableData = data;

// Add toProperCase() method to String objects
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// Render function for table rows
const renderTableRows = function(element, data, columns) {
    let rows = element.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    rows.selectAll("td")
        .data(row => {
            return columns.map(col => {
                return {column: col, value: row[col]};
            });
        })
        .enter()
        .append("td")
        .text(d => {
            let value;
            switch(d.column) {
                case "state":
                case "country":
                    value = d.value.toUpperCase();
                    break;
                case "city":
                case"shape":
                    value = d.value.toProperCase();
                    break;
                default:
                    value = d.value;
                    break;
            }
            return value;
        });
}

// Create object of filter criteria
const getFiltersToApply = function() {
    const objFilters = {};
    let date = d3.select("#datetime").property("value").toLowerCase();
    let city = d3.select("#city").property("value").toLowerCase();
    let state = d3.select("#state").property("value").toLowerCase();
    let country = d3.select("#country").property("value").toLowerCase();
    let shape = d3.select("#shape").property("value").toLowerCase();

    if (date.length) {
        objFilters.datetime = date;
    }

    if (city.length) {
        objFilters.city = city;
    }

    if (state.length) {
        objFilters.state = state;
    }

    if (country.length) {
        objFilters.country = country;
    }

    if (shape.length) {
        objFilters.shape = shape;
    }

    return objFilters;
}

// Filter the sightings using a criteria object
const filterSightings = function(array, filters) {
    const filterKeys = Object.keys(filters);
    return array.filter((item) => {
        return filterKeys.every(key => filters[key] === item[key]);
    });
}

// Render sightings
const renderSightings = function() {
    let criteria = getFiltersToApply();
    let results;

    // If criteria is provided, then filter data otherwise render all records
    if (criteria) {
        results = filterSightings(tableData, criteria);
    }
    else {
        results = tableData;
    }

    const tbody = d3.select("table#ufo-table>tbody");
    const resultBar = d3.select("#result-bar");
    
    // Clear the table body and result bar div
    tbody.selectAll("*").remove();
    resultBar.selectAll("*").remove();
    
    // Render the table rows
    if (results.length) {
        renderTableRows(tbody, results, Object.keys(results[0]));
    }
    else {
        // Display a message if no results
        resultBar.html(`<div class="px-3; pb-3; text-center;"><em>No sightings match the criteria provided.<em></div>`);
    }
}

// Event Listeners
// Event handlers for filter button
d3.select("#filter-btn").on("click", renderSightings);
d3.select("form").on("submit", () => {
    d3.event.preventDefault();
    renderSightings();
});

// Event handler to clear filters
d3.select("#clear-btn").on("click", () => {
    d3.selectAll("input").property("value","");
    renderSightings();

});

// Vanilla JS document ready using statechange
// Render inital data when document is ready
document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        const tbody = d3.select("table#ufo-table>tbody");
        const columns = Object.keys(tableData[0]);
        renderTableRows(tbody, tableData, columns);
    }
  }