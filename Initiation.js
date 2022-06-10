// import data collection from all data collection scripts
import CSV from "./data pipelines/CSV.js";

/** ***********************************************************************/
/** ********Global functions to be used in all other scripts *************/
/** *********************************************************************/
// function(array). returns the average value of the array
// array is an array with numeric data to be averaged
// is used in the function avgArray()
const average = function(array) {
    let total = 0;
    array.forEach((item) => { total += Number(item); });
    const avg = (total / array.length);
    return avg.toFixed(2);
};
// function(array). returns the sum of the array.
// array is an array with numeric data to be summed
// is used in the function sumArray()
const sum = function(array) {
    let total = 0;
    array.forEach((item) => { total += Number(item); });
    return total.toFixed(2);
};

// function(). returns 2 arrays with the average Y values for each unique X value and each unique X value.
// arraayX and arrayY are empty arrays. meanDataSet is an empty object. Dataset is the original dataset to be changed.GraphSpecs are the graphspecs for the graph.
// Calls the function average()
const avgArray = function(arrayX, arrayY, meanDataSet, dataset, graphSpecs) {
    dataset.forEach((item, i) => {
        // eslint-disable-next-line no-param-reassign
        arrayX[i] = item[graphSpecs[2]];
        // eslint-disable-next-line no-param-reassign
        arrayY[i] = item[graphSpecs[1]];
    });
    const uniqueArrayX = [...new Set(arrayX)];
    uniqueArrayX.sort((a, b) => a - b);
    for (let i = 0; i < uniqueArrayX.length; i++) {
        let n = 0;
        const row = [];
        for (let j = 0; j < dataset.length; j++) {
            if (dataset[j][graphSpecs[2]] === uniqueArrayX[i]) {
                row[n] = dataset[j][graphSpecs[1]];
                n += 1;
            }
        }
        // eslint-disable-next-line no-param-reassign
        const temp = {};
        temp[graphSpecs[1]] = average(row);
        temp[graphSpecs[2]] = uniqueArrayX[i];
        // eslint-disable-next-line no-param-reassign
        meanDataSet[i] = temp;
    }
};

// function(). returns 2 arrays with the average Y values for each unique X value and each unique X value.
// arrayX, arrayY and sumDataSet are empty arrays. Dataset is the original dataset to be changed. GraphSpecs are the graphspecs for the graph
// Calls the function sum()
const sumArray = function(arrayX, arrayY, sumDataSet, dataset, graphSpecs) {
    dataset.forEach((item, i) => {
        // eslint-disable-next-line no-param-reassign
        arrayX[i] = item[graphSpecs[2]];
        // eslint-disable-next-line no-param-reassign
        arrayY[i] = item[graphSpecs[1]];
    });
    const uniqueArrayX = [...new Set(arrayX)];
    uniqueArrayX.sort((a, b) => a - b);
    for (let i = 0; i < uniqueArrayX.length; i++) {
        let n = 0;
        const row = [];
        for (let j = 0; j < dataset.length; j++) {
            if (dataset[j][graphSpecs[2]] === uniqueArrayX[i]) {
                row[n] = dataset[j][graphSpecs[1]];
                n += 1;
            }
        }
        const temp = {};
        temp[graphSpecs[1]] = sum(row);
        temp[graphSpecs[2]] = uniqueArrayX[i];
        // eslint-disable-next-line no-param-reassign
        sumDataSet[i] = temp;
    }
};

// function (). Does not retun anything
// Removes all DOM objects on page with class temp (Not header and image)
const clear = function() {
    const temp = document.querySelectorAll(".temp");

    if (temp.length !== 0) {
        temp.forEach((e) => {
            e.remove();
        });
    }
    document.querySelector(".sub-header").innerHTML = ".";
};

// function (type, class1, boolean1, innerHTML, where, boolean2, ). Returns the DOM object which is created
// Type is DOC element type, class1 is element class, boolean1 is if temp class, innertext is inner HTML text, boolean2 is if append, where is to what DOC element.
// Adds and appends a DOC element to another DOC element
const extend = function(type, class1, boolean1 = true, innertext = "", where = ".maincontent", boolean2 = true) {
    const object = document.createElement(type);
    object.classList.add(class1);
    object.innerHTML = innertext;

    const place = document.querySelector(where);

    if (boolean1) {
        object.classList.add("temp");
    } else {
        object.classList.add("standard");
    }

    if (boolean2) {
        place.append(object);
    } else {
        place.prepend(object);
    }
    return object;
};

/** *********************************************************************************************
 *************************On hover description functions ****************************************
 **********************************************************************************************/
// function(element). Appends "?"" icon and text upon hover
// element is the DOM element to append the info icon and text to.
// called in function graphSelectionBox() of module DataCollector.
const graphInfo = function(element) {
    const info = extend("span", "info", true, "", `.${element.classList[0]}`);
    // eslint-disable-next-line max-len
    info.innerHTML = "In this step, you are to select the number of graphs you would like to look at or present in your final report.";
    info.style = "visibility: hidden; display: none ";

    // eslint-disable-next-line no-param-reassign
    element.onmouseover = () => {
        info.style = "visibility: absolute;  ";
    };
    // eslint-disable-next-line no-param-reassign
    element.onmouseout = () => {
        info.style = "visibility: hidden; display: none";
    };
};

// function(element). Appends "?"" icon and text upon hover
// element is the DOM element to append the info icon and text to.
// called in function docStructure() of module DataCollector.
const dataType = function(parentelement) {
    const element = extend("button", "helpbtn", true, "?", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    const info = extend("span", "info", true, "", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    // eslint-disable-next-line max-len
    info.innerHTML = "This is optional. Data type is if the selected data is a numberic, categorical or if you would like to calculate the sum or average of the data. The initially displayed value is what was read in. If you disagree, you can change the value. Numerical data types include Number, Sum and Average. <br> Sum is caluclated as the total value of all entries within a category of the x-axis data and average as the average value. ";
    info.style = "visibility: hidden; display: none ";

    element.onmouseover = () => {
        // eslint-disable-next-line max-len
        info.style = "visibility: absolute; ";
    };
    element.onmouseout = () => {
        info.style = "visibility: hidden; display: none";
    };
};

// function(element). Appends "?"" icon and text upon hover
// element is the DOM element to append the info icon and text to.
// called in function docStructure() of module DataCollector.
const dataSelection = function(parentelement) {
    const element = extend("button", "helpbtn", true, "?", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    const info = extend("span", "info", true, "", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    // eslint-disable-next-line max-len
    info.innerHTML = "Select what data you want in your graph. The drop down menues are populated with the column names found in your selected data file. It is recommended to have a non-text data in the Y-axis selection.";
    info.style = "visibility: hidden; display: none ";

    element.onmouseover = () => {
        info.style = "visibility: absolute; ";
    };
    element.onmouseout = () => {
        info.style = "visibility: hidden; display: none";
    };
};

// function(element). Appends "?"" icon and text upon hover
// element is the DOM element to append the info icon and text to.
// called in function docStructure() of module DataCollector.
const graphType = function(parentelement) {
    const element = extend("button", "helpbtn", true, "?", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    const info = extend("span", "info", true, "", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    // eslint-disable-next-line max-len
    info.innerHTML = "Please select what graphical representation you would like. It is recommended to have a numerical data type in the y-axis. Line plots cannot be gernerated if a categorical/text data type is selected in the y-axis. See depictions to the right for examples of the graph types.";
    info.style = "visibility: hidden; display: none ";
    if (parentelement.classList[0] === "graphsection0") {
        const pics = extend("img", "graphInfo", true, "", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
        pics.style = "display: none; ";
        pics.src = "./images/graphs.png";
    }

    element.onmouseover = () => {
        info.style = "visibility: absolute;";
        document.querySelector(".graphInfo.temp").style = "display: block; margin-left: 500px; height: 730px; position: absolute";
    };
    element.onmouseout = () => {
        info.style = "visibility: hidden; display: none";
        document.querySelector(".graphInfo.temp").style = "display: none;";
    };
};

// function(element). Appends "?"" icon and text upon hover
// element is the DOM element to append the info icon and text to.
// called in function infoRewrite() of module Report.
const reportTitle = function(parentelement) {
    // eslint-disable-next-line no-param-reassign
    parentelement.style = "padding: 0px";
    const element = extend("button", "helpbtn", true, "?", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    const info = extend("span", "info", true, "", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    info.innerHTML = "Text in this input box will yeild the title for the final report which includes all the graphs.";
    info.style = "visibility: hidden; display: none ";

    element.onmouseover = () => {
        info.style = "visibility: absolute; ";
    };
    element.onmouseout = () => {
        info.style = "visibility: hidden; display: none";
    };
};

// function(element). Appends "?"" icon and text upon hover
// element is the DOM element to append the info icon and text to.
// called in function infoRewrite() of module Report.
const descrText = function(parentelement) {
    // eslint-disable-next-line no-param-reassign
    parentelement.style = "padding: 0px";
    const element = extend("button", "helpbtn", true, "?", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    const info = extend("span", "info", true, "", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    // eslint-disable-next-line max-len
    info.innerHTML = "Text in this input box is for any description for the final report which includes all the graphs. In this section you can describe the report purpose and data further if wanted. Text box can be left empty.";
    info.style = "visibility: hidden; display: none ";

    element.onmouseover = () => {
        info.style = "visibility: absolute;";
    };
    element.onmouseout = () => {
        info.style = "visibility: hidden; display: none";
    };
};

// function(element). Appends "?"" icon and text upon hover
// element is the DOM element to append the info icon and text to.
// called in function infoRewrite() of module Report.
const textInfo = function(parentelement) {
    const element = extend("button", "helpbtn", true, "?", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    const info = extend("span", "info", true, "", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    // eslint-disable-next-line max-len
    info.innerHTML = "This section is optional. Yes in this section will allow for addition of an extra text section for any claiyfications or information which is more approriate under its own header rather than as a description of the report. This section will be placed below the report title and description box, above the generated graphs.";
    info.style = "visibility: hidden; display: none ";

    element.onmouseover = () => {
        info.style = "visibility: absolute; ";
    };
    element.onmouseout = () => {
        info.style = "visibility: hidden; display: none";
    };
};

// function(element). Appends "?"" icon and text upon hover
// element is the DOM element to append the info icon and text to.
// called in function infoRewrite() of module Report.
const graphTitle = function(parentelement) {
    const element = extend("button", "helpbtn", true, "?", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    const info = extend("span", "info", true, "", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    // eslint-disable-next-line max-len
    info.innerHTML = "This section is optional. Add text here if you would like to change the title which you see in the graph to the right. If title is okey, this section can be left empty.";
    info.style = "visibility: hidden; display: none ";

    element.onmouseover = () => {
        info.style = "visibility: absolute;";
    };
    element.onmouseout = () => {
        info.style = "visibility: hidden; display: none";
    };
};

// function(element). Appends "?"" icon and text upon hover
// element is the DOM element to append the info icon and text to.
// called in function infoRewrite() of module Report.
const xAxisInfo = function(parentelement) {
    // eslint-disable-next-line no-param-reassign
    parentelement.style = "padding-top: 0px; padding-left: 0px";
    const element = extend("button", "helpbtn", true, "?", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    const info = extend("span", "info", true, "", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    // eslint-disable-next-line max-len
    info.innerHTML = "This section is optional. Add text here if you would like to change the x-axis text which you see in the graph to the right. If axis text is okey, this section can be left empty.";
    info.style = "visibility: hidden; display: none ";

    element.onmouseover = () => {
        info.style = "visibility: absolute; ";
    };
    element.onmouseout = () => {
        info.style = "visibility: hidden; display: none";
    };
};

// function(element). Appends "?"" icon and text upon hover
// element is the DOM element to append the info icon and text to.
// called in function infoRewrite() of module Report.
const yAxisInfo = function(parentelement) {
    // eslint-disable-next-line no-param-reassign
    parentelement.style = "padding-top: 0px; padding-left: 0px";
    const element = extend("button", "helpbtn", true, "?", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    const info = extend("span", "info", true, "", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    // eslint-disable-next-line max-len
    info.innerHTML = "This section is optional. Add text here if you would like to change the y-axis text which you see in the graph to the right. If axis text is okey, this section can be left empty.";
    info.style = "visibility: hidden; display: none ";

    element.onmouseover = () => {
        info.style = "visibility: absolute;";
    };
    element.onmouseout = () => {
        info.style = "visibility: hidden; display: none";
    };
};

// function(element). Appends "?"" icon and text upon hover
// element is the DOM element to append the info icon and text to.
// called in function infoRewrite() of module Report.
const yReScale = function(parentelement) {
    // eslint-disable-next-line no-param-reassign
    parentelement.style = "padding-top: 0px; padding-left: 0px";
    const element = extend("button", "helpbtn", true, "?", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    const info = extend("span", "info", true, "", `.${parentelement.classList[0]}.${parentelement.classList[1]}`);
    // eslint-disable-next-line max-len
    info.innerHTML = "This section is optional. Check the box if you would like to specify the maximum and minimum values to be used on your Y-axis scale.";
    info.style = "visibility: hidden; display: none ";

    element.onmouseover = () => {
        info.style = "visibility: absolute;";
    };
    element.onmouseout = () => {
        info.style = "visibility: hidden; display: none";
    };
};

/** *********************************************************************************************
 ************************ Function Declarations for this script *********************************
 ******************************************************************************************** **/
// Filetypes for the buttonGenerator. Each array entry will have a button.
const fileTypes = ["CSV", "JSON", "Excel"];

// function (array).  Creates buttons on first page for data type selection.
// array is an array of strings stating what file types can be selected.
// is called in the script of this page.
const buttonGenerator = function(filetypes) {
    extend("ul", "ButtonCollector", true, "", ".maincontent", true).style =
        "align-content: stretch; text-align: center; padding: 0px";

    for (let i = 1; i <= filetypes.length; i++) {
        const dataselect = extend("button", "btn", true, `${filetypes[i - 1]}`, ".ButtonCollector", true);
        dataselect.id = filetypes[i - 1];
        dataselect.style.margin = "10px";
    }
};

// This is the background color to be used in all the div backgrounds.
const bkgroundClr = "rgb(235, 249, 255)";

/** *********************************************************************************************
 ********************************* Start of Script **********************************************
 ********************************************************************************************* **/

// update progressbar
document.querySelector(".progressBar").style = "width: 10%;padding: 1px";

/** ************* Page Structure ********************/
const subheader = document.querySelector(".sub-header");
subheader.innerHTML = " Select the data file type you would like to use.";

buttonGenerator(fileTypes);

// Eventlistner for data selection pipeline based on clicked file type button. Each enrty in the filetype array should have a case in the switch function.
document.querySelectorAll(".btn").forEach((button) => {
    // Select data import type based on button
    button.addEventListener("click", () => {
        switch (button.id) {
            case "CSV":
                CSV();
                break;
            case "JSON":
                // eslint-disable-next-line no-alert
                alert("This button is not yet activated, please select CSV");
                break;
            case "Excel":
                // eslint-disable-next-line no-alert
                alert("This button is not yet activated, please select CSV");
                break;
            default:
                // eslint-disable-next-line no-alert
                alert("Datatype selection missing");
        }
    });
});

export {
    clear,
    extend,
    avgArray,
    sumArray,
    graphInfo,
    graphType,
    dataType,
    dataSelection,
    reportTitle,
    descrText,
    textInfo,
    graphTitle,
    yAxisInfo,
    xAxisInfo,
    yReScale,
    bkgroundClr,
};