// Function to build the metadata panel for a given sample
function buildMetadata(sampleId) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Extract metadata field from the data
    var metadataList = data.metadata;

    // Filter the metadata to get the object for the selected sample
    var sampleMetadata = metadataList.find(metadata => metadata.id == sampleId);

    // Select the panel with id of `#sample-metadata`
    var metadataPanel = d3.select("#sample-metadata");

    // Clear any existing metadata
    metadataPanel.html("");

    // Append new tags for each key-value pair in the metadata
    Object.entries(sampleMetadata).forEach(([key, value]) => {
      metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Function to build charts for a given sample
function buildCharts(sampleId) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Extract samples field from the data
    var sampleData = data.samples;

    // Filter the samples to get the object for the selected sample
    var sampleDetails = sampleData.find(sample => sample.id == sampleId);

    // Extract otu_ids, otu_labels, and sample_values
    var otuIds = sampleDetails.otu_ids;
    var otuLabels = sampleDetails.otu_labels;
    var sampleValues = sampleDetails.sample_values;

    // Build a Bubble Chart
    var bubbleChartData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    }];

    var bubbleChartLayout = {
      title: "OTU Samples",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 }
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);

    // Prepare data for the Bar Chart
    var topOtuIds = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();
    var topSampleValues = sampleValues.slice(0, 10).reverse();
    var topOtuLabels = otuLabels.slice(0, 10).reverse();

    // Build a Bar Chart
    var barChartData = [{
      x: topSampleValues,
      y: topOtuIds,
      text: topOtuLabels,
      type: "bar",
      orientation: "h"
    }];

    var barChartLayout = {
      title: "Top 10 OTUs Found",
      margin: { t: 30, l: 150 }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barChartData, barChartLayout);

  });
}

// Function to initialize the dashboard
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Extract sample names from the data
    var sampleNames = data.names;

    // Select the dropdown element with id of `#selDataset`
    var dropdownMenu = d3.select("#selDataset");

    // Populate the dropdown menu with sample names
    sampleNames.forEach((name) => {
      dropdownMenu.append("option")
                  .text(name)
                  .property("value", name);
    });

    // Use the first sample as the default selection
    var firstSample = sampleNames[0];

    // Build charts and metadata panel for the default sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Function to handle changes in dropdown selection
function optionChanged(newSampleId) {
  // Update charts and metadata panel based on the new sample selection
  buildCharts(newSampleId);
  buildMetadata(newSampleId);
}

// Initialize the dashboard
init();
