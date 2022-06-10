// eslint-disable-next-line object-curly-newline
import { clear, extend, graphInfo, graphType, dataType, dataSelection, bkgroundClr } from "./Initiation.js";
import { selectionCollect } from "./Graphs.js";

/** *******************************************************************************************
 ********************************* Plot number selection **************************************
 ********************************************************************************************/

// function (). Creates Graph number selection box, saves it in local storage
// Calls graphInfo(). Is called in dataCollector() of this module.
const graphSelectionBox = function() {
    // create the drop down options and button
    extend("div", "selector", true, "Select the number of graphs to depict:<b>* </b>").style = `background-color: ${bkgroundClr}; 
         font-size: 18px; padding-bottom:5px;`;
    const helpbtn = extend("button", "helpbtn", true, "?", ".selector");
    graphInfo(helpbtn);
    const button = extend("select", "graphNRSelect", true, "graph NR selection", ".selector");
    button.style = " margin-left: 15px; padding-top:2px";

    extend("option", "option", true, " ", ".graphNRSelect").value = "";
    // populate the dop down menu graphNRSelect
    for (let i = 1; i < 5; i++) {
        extend("option", "option", true, `${i}`, ".graphNRSelect").value = i;
    }
    // save the selected graph number
    button.onclick = () => { sessionStorage.setItem("graphNR", button.value); };
};

/** *******************************************************************************************
 *********************************  Graph data selection *************************************
 ********************************************************************************************/

// function (graphNR). populates the drop down for graph type selection.
// graphNR is the number of graphs selected.
// called in docStructure of this module.
const graphSelectionPopulation = function(graphNR, data) {
    // graphTypeDropDown to populate the graphtype drop donws
    {
        const graphs = ["", "Histogram", "Line Plot", "Scatter plot"]; // seen by user
        const graphscall = ["", "bar", "line", "scatter"]; // used by chart.js

        // populate the drop down list with contents of graphs
        for (let j = 0; j < graphNR; j++) {
            for (let i = 0; i < graphs.length; i++) {
                extend("option", `option-graph${j}`, true, graphs[i], `.graph${j}.temp.graphtype`).value = graphscall[i];
            }
        }
        // save graphtype as sessionstorage item
        document.querySelectorAll(".graphtype").forEach((select) => {
            // eslint-disable-next-line no-param-reassign
            select.onclick = (e) => {
                sessionStorage.setItem(`graphtype.${e.srcElement.classList[0]}`, select.value);
            };
        });
    }

    // dataTypeDropDown to populate the datatype drop donws
    {
        const dataTypeX = ["Text", "Numeric"];
        const dataTypeVX = ["string", "number"];
        const dataTypeY = ["Text", "Numeric", "Sum", "Average"];
        const dataTypeVY = ["string", "number", "sum", "average"];

        // populate the X and Y drop down lists with contents of dataType
        for (let j = 0; j < graphNR; j++) {
            extend("option", `option-graph${j}`, true, "", `.graph${j}.temp.datatype.X`).value = "";
            extend("option", `option-graph${j}`, true, "", `.graph${j}.temp.datatype.Y`).value = "";
            for (let i = 0; i < dataTypeX.length; i++) {
                extend("option", `option-graph${j}`, true, dataTypeX[i], `.graph${j}.temp.datatype.X`).value = dataTypeVX[i];
            }
            for (let i = 0; i < dataTypeY.length; i++) {
                extend("option", `option-graph${j}`, true, dataTypeY[i], `.graph${j}.temp.datatype.Y`).value = dataTypeVY[i];
            }
        }
    }

    // graphDataDropDown to populate dataselection drop downs
    {
        const dataset = data;
        for (let j = 0; j < graphNR; j++) {
            extend("option", `option-graph${j}`, true, "", `.graph${j}.temp.graphdataX`).value = "";
            extend("option", `option-graph${j}`, true, "", `.graph${j}.temp.graphdataY`).value = "";

            for (let i = 0; i < Object.keys(dataset[1]).length; i++) {
                extend("option", `option-graph${j}`, true, Object.keys(dataset[1])[i], `.graph${j}.temp.graphdataX`).value =
                    Object.keys(dataset[1])[i];
                extend("option", `option-graph${j}`, true, Object.keys(dataset[1])[i], `.graph${j}.temp.graphdataY`).value =
                    Object.keys(dataset[1])[i];
            }
        }
        document.querySelectorAll(".graphdataX").forEach((select) => {
            // eslint-disable-next-line no-param-reassign
            select.onchange = (e) => {
                sessionStorage.setItem(`graphdataX.${e.srcElement.classList[0]}`, select.value);
                document.querySelector(`.${e.srcElement.classList[0]}.temp.datatype.X`).value = typeof(dataset[0][select.value]);
            };
        });
        document.querySelectorAll(".graphdataY").forEach((select) => {
            // eslint-disable-next-line no-param-reassign
            select.onchange = (e) => {
                sessionStorage.setItem(`graphdataY.${e.srcElement.classList[0]}`, select.value);
                document.querySelector(`.${e.srcElement.classList[0]}.temp.datatype.Y`).value = typeof(dataset[0][select.value]);
            };
        });

        for (let i = 0; i < graphNR; i++) {
            if (sessionStorage.getItem(`graphtype.graph${i}`) !== null) {
                document.querySelector(`.graph${i}.temp.graphtype`).value = sessionStorage.getItem(`graphtype.graph${i}`);
            }
            if (sessionStorage.getItem(`graphdataX.graph${i}`) !== null) {
                document.querySelector(`.graph${i}.temp.graphdataX`).value = sessionStorage.getItem(`graphdataX.graph${i}`);
                document.querySelector(`.graph${i}.temp.datatype.X`).value = sessionStorage.getItem(`datatype.X.graph${i}`);
            }
            if (sessionStorage.getItem(`graphdataY.graph${i}`) !== null) {
                document.querySelector(`.graph${i}.temp.graphdataY`).value = sessionStorage.getItem(`graphdataY.graph${i}`);
                document.querySelector(`.graph${i}.temp.datatype.Y`).value = sessionStorage.getItem(`datatype.Y.graph${i}`);
            }
        }
    }
};

// function (graphNR). Updates the document with the wanted structure.
// graphNR is the selected number of graphs to be generated
// Calls information functions dataSelection(), graphType(), dataType() and drop down functions graphSelectionPopulation(),  selectionCollect(). is called in dataCollector() of this module.
const docStructure = function(graphNR, data) {
    // update progressbar
    document.querySelector(".progressBar").style = "width: 60%;padding: 1px";

    /** ****update document structure******/
    clear();
    document.querySelector(".sub-header").innerHTML = "Select what data you want to depict";
    extend("div", "Primary", true, `Number of graphs to generate: ${graphNR}`).style =
        "font-size: 20px; font-weight: bold; margin-block-end: 5px;padding: 5px;";

    /** *****populate the sections*********/
    for (let i = 0; i < graphNR; i++) {
        // raph section structure division
        extend("div", `Graph${i + 1}Selection`, true).style = `background-color: ${bkgroundClr};
         padding-bottom:5px; margin-bottom: 15px`;
        extend("div", `section${i}`, true, `Graph ${i + 1}: `, `.Graph${i + 1}Selection`).style =
            "font-size: 18px; font-weight: bold; padding:0px";
        // graph type selection
        const section1 = extend("div", `graphsection${i}`, true, "Select graph type:<b>* </b>", `.section${i}`);
        section1.style = "font-size: 15px; font-weight: normal; padding-bottom:5px";
        graphType(section1);
        const b3 = extend("select", `graph${i}`, true, "Data representation", `.graphsection${i}`);
        b3.classList.add("graphtype");
        b3.style = "margin-left: 48px; ";

        // Graph data selection
        // eslint-disable-next-line max-len
        const section2 = extend("div", `TextSection${i}`, true, "Select Data to depict:<b>* </b>", `.section${i}`);
        section2.style = "font-size: 15px; font-weight: normal; height: 18px; padding-top: 1px;";
        dataSelection(section2);
        extend("a", `graph${i}`, true, "Data for Y-axis ", `.TextSection${i}`).style = "margin-left: 26px; font-size: 13px";
        extend("a", `graph${i}`, true, "Data for X-axis ", `.TextSection${i}`).style = "margin-left: 13px; font-size: 13px";
        extend("div", `DataSection${i}`, true, "   ", `.section${i}`).style =
            "font-size: 15px; font-weight: normal; margin-left: 19px; padding-top:0px;";
        const b1 = extend("select", `graph${i}`, true, "Data for Y-axis", `.DataSection${i}`);
        b1.classList.add("graphdataY");
        b1.style = "margin-left: 179px; ";
        const b2 = extend("select", `graph${i}`, true, "Data for X-axis ", `.DataSection${i}`);
        b2.classList.add("graphdataX");
        b2.style = "margin-left: 11px; ";

        // optional data type overwrite
        const section3 = extend("div", `typesection${i}`, true, "<i> Optional </i> - Change data type: ", `.section${i}`);
        section3.style = "font-size: 13px; font-weight: normal;";
        dataType(section3);
        const b4 = extend("select", `graph${i}`, true, "Datatype for Y-axis ", `.typesection${i}`);
        b4.classList.add("datatype");
        b4.classList.add("Y");
        b4.style = "margin-left: 9px;";
        const b5 = extend("select", `graph${i}`, true, "Datatype for X-axis ", `.typesection${i}`);
        b5.classList.add("datatype");
        b5.classList.add("X");
        b5.style = "margin-left: 10px; ";
    }

    const backBtn = extend("button", "btn", true, "Back");
    backBtn.style = "margin-left: 220px; margin-top: 5px ";
    backBtn.onclick = () => {
        clear();
        // update progressbar
        document.querySelector(".progressBar").style = "width: 40%;padding: 1px";
        // eslint-disable-next-line no-use-before-define
        dataCollector(data);
    };
    const nextBtn = extend("button", "btn", true, "Next");
    nextBtn.style = "margin-left: 35px; margin-top: 5px ";
    nextBtn.onclick = () => {
        let j = 0;
        for (let i = 0; i < document.querySelectorAll("select").length; i++) {
            // eslint-disable-next-line no-loop-func
            document.querySelectorAll("select").forEach((select) => {
                if (select.value === "") {
                    j += 1;
                }
            });
        }
        if (j === 0) {
            // obtain data from X data type to make optional
            document.querySelectorAll(".datatype.X").forEach((select) => {
                sessionStorage.setItem(`datatype.X.${select.classList[0]}`, select.value);
            });
            // obtain data from Y data type to make optional
            document.querySelectorAll(".datatype.Y").forEach((select) => {
                sessionStorage.setItem(`datatype.Y.${select.classList[0]}`, select.value);
            });
            selectionCollect(data);
        } else alert("Please fill all selection boxes");
    };

    // call functions to populate the drop down menus
    graphSelectionPopulation(graphNR, data);
};

/** *******************************************************************************************
 ************************* Main section - Graph number and data selection initiation **********
 ********************************************************************************************/
// function (data). Creates the graph number selection page.´
// data is the read in dataset in the form of array[objects]
// Calls functions graphSelectionbox() and docStructure(). is called in pipelineEnd() of this module.
const dataCollector = function(data) {
    document.querySelector(".sub-header").innerHTML = "Select number of graphs to generate: ";
    graphSelectionBox();
    // make next button to continue with data depiction selection
    const nextBtn = extend("button", "btn", true, "Next");
    nextBtn.style = "margin-left: 290px; ";
    nextBtn.onclick = () => {
        if (document.querySelector("select").value !== "") {
            docStructure(sessionStorage.getItem("graphNR"), data);
        } else alert("please select number of graphs to depict");
    };
};

// function (data). Outputs a dataframe with numeric variables where possible.
// data is the read in dataset in the form of array[objects]
// Is called from pipelineEnd of this module.
const dataReformat = function(data) {
    const dataset = [];
    const header = [];
    for (let i = 0; i < Object.keys(data[0]).length; i++) {
        header[i] = Object.keys(data[0])[i];
    }
    for (let i = 0; i < data.length; i++) {
        const entry = {};
        for (let j = 0; j < header.length; j++) {
            // eslint-disable-next-line eqeqeq
            if (data[i][header[j]] == Number(data[i][header[j]])) {
                entry[header[j]] = Number(data[i][header[j]]);
            } else {
                entry[header[j]] = data[i][header[j]];
            }
        }
        dataset[i] = entry;
    }
    return dataset;
};

// function(data). Outputs the read data in format Array[Object]
// data is the read in dataset with numeric variables where possible.
// calls dataCollector() and data reformat, is called at filereader.onloadend() of datapipelines module.
const pipelineEnd = function(data) {
    // update progressbar
    document.querySelector(".progressBar").style = "width: 40%;padding: 1px";

    document.querySelector(".sub-header").innerHTML = "Check that the data is read correctly:";
    // document.querySelector(".fileinput").style = "display: none"
    document.querySelector(".fileinput").remove();
    // exctract column length
    // eslint-disable-next-line max-len
    const p2 = extend("il", "ColInfo", true, `<b>Nr of attributes (Columns):</b> <i>${sessionStorage.getItem("ColLength")}</i>`, ".Collector", true);
    p2.style = "font-size: 20px;";
    p2.append(document.createElement("br"));

    // extract the row entry length
    const p3 = extend("il", "RowInfo", true, `<b> Nr of entries (Rows):</b><i>
     ${Object.keys(data).length}</i>`, ".Collector", true);
    p3.style = "font-size: 20px; margin-bottom: 10px";
    p3.append(document.createElement("br"));
    sessionStorage.setItem("RowLength", data.length);

    // Try to make all data Numeric, else keep as string
    const dataset = dataReformat(data);

    document.querySelector(".Collector").style = `background-color: ${bkgroundClr}; padding-bottom:5px; margin-bottom: 15px`;
    dataCollector(dataset);
};

// eslint-disable-next-line object-curly-newline
export { dataCollector, pipelineEnd, docStructure, dataReformat };