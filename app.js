// Store the source URL
const dataURL = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Fetch the JSON data and log it
d3.json(dataURL).then(function(data) {
    console.log(data);
}); 

// Create the init function to populate the dropdown, bar chart, and bubble chart with each sample's dataset
function init() {
    // Create the dropdown list variable for all sample IDs in the dataset
    let dropdown = d3.select("#selDataset");

    // Access sample data using d3
    d3.json(dataURL).then((data) => {
        // Gather the sample IDs from the names list in data and populate the dropdown
        let sampleIds = data.names;

        for (let id of sampleIds) {
            dropdown.append("option").attr("value", id).text(id);
        }

        // Store the first sample for display initialization
        let firstEntry = sampleIds[0];

        // Call the graph generating functions with the first entry (id 940)
        makeBar(firstEntry);
        makeBubble(firstEntry);
        makeDemographics(firstEntry);
    });
}

// Create a function to populate the horizontal bar chart graph
function makeBar(sample) {
    // Access the sample data for populating the bar chart
    d3.json(dataURL).then((data) => {
        let sampleData = data.samples;

        // Apply a filter that matches based on sample ID
        let results = sampleData.filter(entry => entry.id == sample);

        // Access and store the first entry in results filter
        let firstResult = results[0];

        // Store the first 10 results to display in the bar chart
        let sampleValues = firstResult.sample_values.slice(0, 10);
        let otuIds = firstResult.otu_ids.slice(0, 10);
        let otuLabels = firstResult.otu_labels.slice(0, 10);

        // Create the trace for bar chart
        let barTrace = {
            x: sampleValues.reverse(),
            y: otuIds.map(item => `OTU ${item}`).reverse(),
            text: otuLabels.reverse(),
            type: 'bar',
            orientation: 'h'
        };

        let layout = { title: "Top Ten OTUs" };
        Plotly.newPlot("bar", [barTrace], layout);
    });
}

// Create a function to populate the bubble chart graph
function makeBubble(sample) {
    // Access the sample data for populating the bubble chart
    d3.json(dataURL).then((data) => {
        let sampleData = data.samples;

        // Apply a filter that matches based on sample ID
        let results = sampleData.filter(entry => entry.id == sample);

        // Access and store the first entry in results filter
        let firstResult = results[0];

        // Store the results to display in the bubble chart
        let sampleValues = firstResult.sample_values;
        let otuIds = firstResult.otu_ids;
        let otuLabels = firstResult.otu_labels;

        // Create the trace for bubble chart
        let bubbleTrace = {
            x: otuIds.reverse(),
            y: sampleValues.reverse(),
            text: otuLabels.reverse(),
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIds,
            }
        };

        let layout = {
            title: "Bacteria Count for each Sample ID",
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Number of Bacteria' }
        };

        Plotly.newPlot("bubble", [bubbleTrace], layout);
    });
}

// Create the demographic info function to populate each sample's info
function makeDemographics(sample) {
    // Access the sample data for populating the demographics section
    d3.json(dataURL).then((data) => {
        // Access the demographic info (metadata) with d3
        let demographicInfo = data.metadata;

        // Apply a filter that matches based on sample ID
        let results = demographicInfo.filter(entry => entry.id == sample);

        // Store the first result to display in demographic info
        let firstResult = results[0];

        // Clear out previous entries in the demographic info section
        d3.select('#sample-metadata').text('');

        // Append new key-value pairs to the demographic info section
        Object.entries(firstResult).forEach(([key, value]) => {
            d3.select('#sample-metadata').append('h3').text(`${key}, ${value}`);
        });
    });
}

// Define the function when the dropdown detects a change (function name as defined in index.html)
function optionChanged(value) {
    // Log the value for debug
    console.log(value);

    // Call functions to update charts and demographics based on the selected sample
    makeBar(value);
    makeBubble(value);
    makeDemographics(value);
}

// Initialize the dashboard
init();
