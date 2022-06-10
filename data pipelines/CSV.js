// eslint-disable-next-line import/no-cycle
import { clear, extend } from "../Initiation.js"; // clear funktion removes all existing ".temp" DOM elements, extend creates a new DOM element.
// eslint-disable-next-line import/no-cycle
import { pipelineEnd } from "../DataCollector.js";

/** *******************************************************************************************
 *******************************  Function declarations **************************************
 ** *****************************************************************************************/
// function (array[],string). Prepends a string to existing array string
// is called in DataStartPos() of this module
const prependLiteral = (arr, str) => {
    // eslint-disable-next-line no-param-reassign
    arr = `${str} ${arr}`;
    return arr;
};

// function(). Returns the DOM element with inputted file
// is called in CSV() of this module.
const fileSelector = function() {
    document.querySelector(".progressBar").style = "width: 25%;padding: 1px";

    document.querySelector(".sub-header").innerHTML = " Select the data file you would like to use.";
    extend("div", "Collector", true, "", ".maincontent", true).style = "text-align: center;";

    const fileselection = extend("input", "fileinput", true, "", ".Collector", true);
    fileselection.accept = ".csv";
    fileselection.type = "file";
    fileselection.style = " margin-top: 20px; margin-bottom:20px; height:25px";
};

// function(e, headerRowPos, dataRowPos). Returns the read data file as Array[Object].
// e is the event, headerRowPos is the row number of the headers and dataRowPos is the row where the data starts.
// Calls prependLiteral(). Is called in readFile of this module.
const DataStartPos = function(e, headerRowPos, dataRowPos) {
    const rows = e.target.result.split("\n");
    const data = [];
    const headerDict = [];

    // Split header row into columns on delimiter , and store them in
    // variable v (don't split , when embedded in "").
    const v = rows[headerRowPos - 1].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    // Loop through all entries in variable v and store them by indexin dictionary headerDict
    for (let i = 0; i < v.length; i++) {
        headerDict[i] = v[i];
    }
    // save the column numbers and add to document
    sessionStorage.setItem("ColLength", v.length);

    // Loop through all data rows (starting from specified data row), and store data objects, using header as variable names
    for (let i = dataRowPos; i < rows.length; i++) {
        const cells = rows[i - 1].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (cells.length > 1) {
            const datarow = {};
            for (let j = 0; j < cells.length; j++) {
                /*  if (headerDict[j] !== "Key parameter") // Enable this section if there is repetitive headers distinguished by the information found in the cells of the key parameter*/
                datarow[headerDict[j]] = cells[j];
                /* else {
                     const n = j;
                     datarow[headerDict[j]] = cells[j];
                     j += 1;
                     for (j; j < cells.length && !["Key parameter"].includes(headerDict[j]); j++) {
                         if (!headerDict[j].includes(`${cells[n]}`)) {
                             headerDict[j] = prependLiteral(headerDict[j], cells[n]);
                         }
                         datarow[headerDict[j]] = cells[j];
                     }
                     j -= 1;
                 }*/
            }
            data[i - dataRowPos] = datarow;
        }
    }
    return data;
};

// function(). Reads the selected data and sends it forward to another module.
// Calls DataStratPos() and pipelineEnd(). Is called in CSV() of this module.
const readFile = function() {
    const fileReader = new FileReader();
    let data = [];

    const fileselection = document.querySelector(".fileinput");
    fileReader.readAsBinaryString(fileselection.files[0]);

    fileReader.onload = (e) => {
        // Adapting CSV file reading style based on file name. Add if function or switch function if data reading starting position depends on file name or other distingushing feature. Specify NAME KEY, X and Y.
        /* const fileName = fileselection.files[0].name;
         if (fileName.includes("NAME KEY") ) {
              const tempDF = DataStartPos(e, X, Y);
              data = tempDF;
          } else {*/
        const tempDF = DataStartPos(e, 1, 2);
        data = tempDF;
        /* }*/
    };

    fileReader.onloadend = () => {
        sessionStorage.setItem("DF", JSON.stringify(data));
        const p1 = extend("il", "FileName", true, `<b>Selected filename: </b>
            <i>${fileselection.files[0].name}</i>`, ".Collector", true);
        p1.style = "font-size: 20px;";
        p1.append(document.createElement("br"));
        if (sessionStorage.getItem("DF")) {
            pipelineEnd(data);
        } else { alert("data has not been loaded"); }
    };
};

/** *******************************************************************************************
 ********************************  Start of Script *******************************************
 ** *****************************************************************************************/

// function(). Initiation of the data read in.
// Calls fileSelector() and readFile(). Is called in swith function of Initiation module.
const CSV = function() {
    clear();
    fileSelector();
    document.querySelector(".fileinput").addEventListener("change", readFile);
    // will take you to dataCollector.js
};

export default CSV;