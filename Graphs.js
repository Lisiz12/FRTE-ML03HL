/* global Chart*/
// eslint-disable-next-line object-curly-newline
import { clear, extend, avgArray, sumArray, bkgroundClr } from "./Initiation.js"; // clear funktion removes all existing ".temp" DOM elements, extend creates a new DOM element,
import infoRewrite from "./Report.js";

/** *********************************************************************************************
 ***This script will create the foundation for all graphical represenations to be selected******
 ********************************************************************************************* */

/** *******************************************************************************************
 ******************************* Data manipulation *********************************************
 ** *****************************************************************************************/
// function (letter, dataentry, i, datatype, dataselection). Returns a dataframe with updated valuetype.
// letter is what data selection (y/x),dataentry is the dataset to be updated, i is the index in a forEach loop, datatype from selection and dataselection the column of dataset to be changed.
// is called in dataTypeRewrite() of this module
const switcher = function(letter, dataentry, i, datatype, dataframe, dataselection) {
    // eslint-disable-next-line valid-typeof
    if (typeof(dataentry) !== datatype) {
        switch (datatype) {
            case "number":
                // eslint-disable-next-line no-param-reassign
                dataframe[i] = Number(dataentry[dataselection]);
                break;
            case "decmal":
                // eslint-disable-next-line no-param-reassign
                dataframe[i] = Number(dataentry[dataselection]);
                break;
            case "string":
                // eslint-disable-next-line no-param-reassign
                dataframe[i] = String(dataentry[dataselection]);
                break;
            default:
                // alert(`no match for ${letter} data type, hold Esc button for remaining alerts`);
        }
    }
    return dataframe;
};

// function(spec, container). Returns a variable of data type for axis
// spec is the swich variable (x or y datatype), container is the variable to be assigned a value.
// is called in updatedplot() and initialplot() of this module
const switcherType = function(spec) {
    let container = "";
    switch (spec) {
        case "number":
            container = "linear";
            break;
        case "sum":
            container = "linear";
            break;
        case "average":
            container = "linear";
            break;
        case "string":
            container = "category";
            break;
        default:
            container = "default";
    }
    return container;
};

// function (graphSpecs, data). Returns an array with only selected x and y values which have been reformatted
// Require an array with the selection options plot, ydata, xdata, ydatatype, xdatatype. data is the dataset.
// calls sumArray() and avgArray(). Is called in selectionCollect() of this module.
const dataTypeRewrite = function(graphSpecs, data) {
    // const data = JSON.parse(sessionStorage.getItem("DF"));
    let newxdata = [];
    let newydata = [];
    const newdata = [];

    switch (graphSpecs[3]) {
        case "sum":
            data.forEach((dataentry, i) => {
                newxdata = switcher("X", dataentry, i, graphSpecs[4], newxdata, graphSpecs[2]);
            });
            sumArray(newxdata, newydata, newdata, data, graphSpecs);
            break;
        case "average":
            data.forEach((dataentry, i) => {
                newxdata = switcher("X", dataentry, i, graphSpecs[4], newxdata, graphSpecs[2]);
            });
            avgArray(newxdata, newydata, newdata, data, graphSpecs);
            break;
        default:
            {
                data.forEach((dataentry, i) => {
                    newydata = switcher("Y", dataentry, i, graphSpecs[3], newydata, graphSpecs[1]);
                    newxdata = switcher("X", dataentry, i, graphSpecs[4], newxdata, graphSpecs[2]);
                    const temp = {};
                    temp[graphSpecs[1]] = newydata[i];
                    temp[graphSpecs[2]] = newxdata[i];
                    newdata[i] = temp;
                });
            }
    }

    if (typeof(newdata[0][graphSpecs[1]]) !== "undefined" && typeof(newdata[0][graphSpecs[2]]) !== "undefined") {
        return newdata;
    }
    alert("Datatype overwrite did not work! Please refresh the page and start over.");
    return false;
};

/** *******************************************************************************************
 ******************************* Data plot functions ******************************************
 ** *****************************************************************************************/
// function(graphSpecs, dataset, graphN). Creates the initial plot of data.
// graphSpecs are all initial selection parameters, dataset is the x and y data, graphnumber is the graphnumber
// Calls switcherType(), avgArray() and Chart(). Is called in selectionCollect() of this module.
const initialplot = function(graphSpecs, dataset, graphN) {
    const ytype = switcherType(graphSpecs[3]);
    const xtype = switcherType(graphSpecs[4]);

    // Sort dataset according to X data.
    dataset.sort((a, b) => a[1] - b[1]);
    extend("div", `Graph${graphN}`).style = `background-color: ${bkgroundClr};
     float: none; height: 300px; margin-bottom: 15px`;
    const ctx = extend("canvas", `Graph${graphN}Canvas`, true, `Graph${graphN}`, `.Graph${graphN}`);
    ctx.style = `background-color: white; border: solid; border-width: thin; border-color: grey;
     float:right; width: 480px; height: 280px; margin-left: 15px; margin-top: 10px; margin-right: 10px `;

    if (graphSpecs[0] !== "line") {
        // eslint-disable-next-line no-unused-vars
        const myChart = new Chart(ctx, {

            type: graphSpecs[0],
            data: {
                datasets: [{
                    display: false,
                    data: dataset,
                    barColors: ["#3e95cd"], // for bar plot
                    borderColor: "#3e95cd", // for line plot
                    backgroundColor: ["#3e95cd"], // for pie chart
                    pointBackgroundColor: ["#3e95cd"], // for scatter plot
                }],
                // labels: xdata,
                borderColor: "black",
            },
            options: {
                layout: {
                    padding: 20,
                },
                parsing: {
                    xAxisKey: graphSpecs[2],
                    yAxisKey: graphSpecs[1],
                },
                responsive: false,
                scales: {
                    y: {
                        display: true,
                        align: "center",
                        color: "black",
                        type: ytype,
                        title: {
                            display: true,
                            text: graphSpecs[1],
                            color: "black",
                            align: "center",
                            font: {
                                weight: "bold",
                            },
                        },
                    },
                    x: {
                        display: true,
                        align: "center",
                        color: "black",
                        type: xtype,
                        title: {
                            display: true,
                            text: graphSpecs[2],
                            color: "black",
                            align: "center",
                            font: {
                                weight: "bold",
                            },
                        },
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Graph ${graphN + 1} - ${graphSpecs[1]} vs ${graphSpecs[2]}`,
                        color: "black",
                        align: "center",
                        position: "top",
                        // This more specific font property overrides the global property
                        font: {
                            size: 16,
                            weight: "bold",
                        },
                    },
                    legend: {
                        display: false,
                    },
                },

            },
        });
    }
    if (graphSpecs[0] === "line") {
        const arrayX = [];
        const arrayY = [];
        const meanDataSet = [];
        avgArray(arrayX, arrayY, meanDataSet, dataset, graphSpecs);

        // eslint-disable-next-line no-unused-vars
        const myChart = new Chart(ctx, {

            data: {
                datasets: [{
                    type: "scatter",
                    display: true,
                    label: "Individual data points",
                    data: dataset.map((item) => ({ x: item[graphSpecs[2]], y: item[graphSpecs[1]] })),
                    pointBackgroundColor: ["#3e95cd"], // for scatter plot
                }, {
                    type: graphSpecs[0],
                    display: true,
                    label: "Mean value",
                    data: meanDataSet.map((item) => ({ x: item[graphSpecs[2]], y: item[graphSpecs[1]] })),
                    borderColor: "#276b97",
                    pointBackgroundColor: ["#276b97"], // for line plot
                }],
                //  labels: meanDataSet[graphSpecs[2]],
                borderColor: "black",
            },
            options: {
                layout: {
                    padding: 20,
                },
                responsive: false,
                scales: {
                    y: {
                        display: true,
                        align: "center",
                        color: "black",
                        type: ytype,
                        title: {
                            display: true,
                            text: graphSpecs[1],
                            color: "black",
                            align: "center",
                            font: {
                                weight: "bold",
                            },
                        },
                    },
                    x: {
                        display: true,
                        align: "center",
                        color: "black",
                        type: xtype,
                        title: {
                            display: true,
                            text: graphSpecs[2],
                            color: "black",
                            align: "center",
                            font: {
                                weight: "bold",
                            },
                        },
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Graph ${graphN + 1} - ${graphSpecs[1]} vs ${graphSpecs[2]}`,
                        color: "black",
                        align: "center",
                        position: "top",
                        // This more specific font property overrides the global property
                        font: {
                            size: 16,
                            weight: "bold",
                        },
                    },
                    legend: {
                        display: false,
                    },
                },

            },
        });
    }
};

// function(dataset, graphSpecs, GraphText, graphN). Creates the updated plot of data.
// dataset is the x and y data, graphSpecs are all updated selection parameters, graphN is the graphnumber
// Calls switcherType(), avgArray() and Chart(). Is called in finalDocStructure of module Report.
const updatedplot = function(dataset, graphSpecs, graphN) {
    const ytype = switcherType(graphSpecs[3]);
    const xtype = switcherType(graphSpecs[4]);
    // Sort dataset according to X data.
    dataset.sort((a, b) => a[1] - b[1]);
    const ctx = extend("canvas", `Graph${graphN}Canvas`, true, `Graph${graphN}`);
    ctx.style = `background-color: white; border: solid; border-width: thin; 
     border-color: grey; margin-bottom: 20px; height:350px`;

    let yScaleContainer = {
        display: true,
        align: "center",
        color: "black",
        type: ytype,
        title: {
            display: true,
            text: graphSpecs[6],
            color: "black",
            align: "center",
            font: {
                weight: "bold",
            },
        },
    };
    if (graphSpecs[10] === true) {
        yScaleContainer = {
            min: Number(graphSpecs[8]),
            max: Number(graphSpecs[9]),
            display: true,
            align: "center",
            color: "black",
            type: ytype,
            title: {
                display: true,
                text: graphSpecs[6],
                color: "black",
                align: "center",
                font: {
                    weight: "bold",
                },
            },
        };
    }

    if (graphSpecs[0] !== "line") {
        // eslint-disable-next-line no-unused-vars
        const myChart = new Chart(ctx.getContext("2d"), {
            type: graphSpecs[0],
            data: {
                // label: `Graph${ graphN }`,
                datasets: [{
                    display: false,
                    data: dataset,
                    barColors: ["#3e95cd"], // for bar plot
                    borderColor: "#3e95cd", // for line plot
                    backgroundColor: ["#3e95cd"], // for pie chart
                    pointBackgroundColor: ["#3e95cd"], // for scatter plot
                }],
                borderColor: "black",
            },
            options: {
                layout: {
                    padding: 20,
                },
                parsing: {
                    xAxisKey: graphSpecs[2],
                    yAxisKey: graphSpecs[1],
                },
                // responsive: false,
                scales: {
                    y: yScaleContainer,
                    x: {
                        display: true,
                        align: "center",
                        color: "black",
                        type: xtype,
                        title: {
                            display: true,
                            text: graphSpecs[7],
                            color: "black",
                            align: "center",
                            font: {
                                weight: "bold",
                            },
                        },
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: graphSpecs[5],
                        color: "black",
                        align: "center",
                        position: "top",
                        // This more specific font property overrides the global property
                        font: {
                            size: 16,
                            weight: "bold",
                        },
                    },
                    legend: {
                        display: false,
                    },
                },
                animation: {
                    duration: 1500,
                    onComplete() {
                        this.options.animation.onComplete = null;
                        const link = extend("a", "chartlink");
                        link.href = this.toBase64Image();
                    },
                },

            },

        });
    }
    if (graphSpecs[0] === "line") {
        const arrayX = [];
        const arrayY = [];
        const meanDataSet = [];
        avgArray(arrayX, arrayY, meanDataSet, dataset, graphSpecs);

        // eslint-disable-next-line no-unused-vars
        const myChart = new Chart(ctx, {

            data: {
                datasets: [{
                    type: "scatter",
                    display: true,
                    label: "Individual data points",
                    data: dataset.map((item) => ({ x: item[graphSpecs[2]], y: item[graphSpecs[1]] })),
                    pointBackgroundColor: ["#3e95cd"], // for scatter plot
                }, {
                    type: graphSpecs[0],
                    display: true,
                    label: "Mean value",
                    data: meanDataSet.map((item) => ({ x: item[graphSpecs[2]], y: item[graphSpecs[1]] })),
                    borderColor: "#276b97",
                    pointBackgroundColor: ["#276b97"], // for line plot
                }],
                //  labels: meanDataSet[graphSpecs[2]],
                borderColor: "black",
            },
            options: {
                layout: {
                    padding: 20,
                },
                // responsive: false,
                scales: {
                    y: yScaleContainer,
                    x: {
                        display: true,
                        align: "center",
                        color: "black",
                        type: xtype,
                        title: {
                            display: true,
                            text: graphSpecs[7],
                            color: "black",
                            align: "center",
                            font: {
                                weight: "bold",
                            },
                        },
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: graphSpecs[5],
                        color: "black",
                        align: "center",
                        position: "top",
                        // This more specific font property overrides the global property
                        font: {
                            size: 16,
                            weight: "bold",
                        },
                    },
                    legend: {
                        display: true,
                    },
                },
                animation: {
                    duration: 1500,
                    onComplete() {
                        this.options.animation.onComplete = null;
                        const link = extend("a", "chartlink");
                        link.href = this.toBase64Image();
                    },
                },

            },

        });
    }
};

/** *******************************************************************************************
 ******************************* Collect selection Details ************************************
 ** *****************************************************************************************/
// function(data). Collects all selections and initiates data type rewrite.
// data is the dataset
// calls dataTypeRewrite(), initialplot() and infoRewrite(). is called from finalDocStructure().
const selectionCollect = function(data) {
    // update progressbar
    document.querySelector(".progressBar").style = "width: 80%";

    const graphSpecs = [];
    // makes array with each graphs selections in order graphtype, ydata, xdata, ydatatype, xdatatype
    for (let i = 0; i < sessionStorage.getItem("graphNR"); i++) {
        graphSpecs[i] = [
            sessionStorage.getItem(`graphtype.graph${i}`),
            sessionStorage.getItem(`graphdataY.graph${i}`),
            sessionStorage.getItem(`graphdataX.graph${i}`),
            sessionStorage.getItem(`datatype.Y.graph${i}`),
            sessionStorage.getItem(`datatype.X.graph${i}`),
        ];
    }
    sessionStorage.setItem("graphSpecs", JSON.stringify(graphSpecs));

    const graphdata = [];
    // send data type to be rewritten
    if (typeof data[0][0] === "undefined") {
        for (let i = 0; i < sessionStorage.getItem("graphNR"); i++) {
            graphdata[i] = dataTypeRewrite(graphSpecs[i], data);
        }
    }
    if (typeof data[0][0] !== "undefined") {
        for (let i = 0; i < sessionStorage.getItem("graphNR"); i++) {
            graphdata[i] = dataTypeRewrite(graphSpecs[i], data[i]);
        }
    }

    if (graphdata[0] !== false) {
        clear();
        for (let i = 0; i < sessionStorage.getItem("graphNR"); i++) {
            initialplot(graphSpecs[i], graphdata[i], i);
        }
        infoRewrite(graphdata);
    }
};

export { selectionCollect, updatedplot };