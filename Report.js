/* eslint-disable import/no-cycle */
import {
    clear,
    extend,
    reportTitle,
    descrText,
    textInfo,
    graphTitle,
    yAxisInfo,
    xAxisInfo,
    yReScale,
    bkgroundClr,
} from "./Initiation.js"; // clear funktion removes all existing ".temp" DOM elements, extend creates a new DOM element.
import { updatedplot, selectionCollect } from "./Graphs.js";
import { docStructure, dataReformat } from "./DataCollector.js";

/** *******************************************************************************************
 ******************************* Gather information to use ***********************************
 ********************************************************************************************/
// function(). Adds information in graph selection boxes from session storage.
// is called in infoRewrite() of this module.
const updateWithPreviousInfo = function() {
    const GraphText = JSON.parse(sessionStorage.getItem("GraphText"));
    const TextSpecs = JSON.parse(sessionStorage.getItem("TextSpecs"));
    document.querySelector(".TitleInput.temp").value = TextSpecs[0];
    document.querySelector(".DescTextInput.temp").value = TextSpecs[1];
    if (TextSpecs[2] === "Yes") {
        document.querySelector(".yesNo.temp").value = TextSpecs[2];
        document.querySelector(".headText.temp").value = TextSpecs[3];
        document.querySelector(".sectText.temp").value = TextSpecs[4];
    }

    for (let i = 0; i < Math.min(sessionStorage.getItem("graphNR"), GraphText.length); i++) {
        if (GraphText[i][5] !== null || GraphText[i][5] !== undefined) {
            document.querySelector(`.TitleGraph${i}.temp`).value = GraphText[i][5];
            document.querySelector(`.xAxisGraph${i}.temp`).value = GraphText[i][7];
            document.querySelector(`.yAxisGraph${i}.temp`).value = GraphText[i][6];
        }
        if (GraphText[i][10] === true) {
            document.querySelectorAll(".checkBox.temp")[i].checked = GraphText[i][10];
            if (GraphText[i][8] !== null) { document.querySelectorAll(".minY.temp")[i].value = GraphText[i][8]; }
            if (GraphText[i][9] !== null) { document.querySelectorAll(".maxY.temp")[i].value = GraphText[i][9]; }
        }
    }
};

// function(graphSpecs, i). Returns an array with the selections from changing graph title, xaxis and yaxis texts.
// graphSpecs are the specs of session storage [graphtype,ydata,xdata,ydatatype,xdatatype] and i is the graph number.
// Is called in infoRewrite of this module.
const getGraphSpecs = function(graphSpecs, i) {
    let dataframe = [];
    dataframe = graphSpecs;

    if (document.getElementsByClassName(`TitleGraph${i}`)[0].value === "") {
        dataframe[5] = `Graph ${i + 1} - ${graphSpecs[1]} vs ${graphSpecs[2]}`;
    } else dataframe[5] = document.getElementsByClassName(`TitleGraph${i}`)[0].value;

    if (document.getElementsByClassName(`yAxisGraph${i}`)[0].value === "") {
        dataframe[6] = graphSpecs[1];
    } else dataframe[6] = document.getElementsByClassName(`yAxisGraph${i}`)[0].value;

    if (document.getElementsByClassName(`xAxisGraph${i}`)[0].value === "") {
        dataframe[7] = graphSpecs[2];
    } else dataframe[7] = document.getElementsByClassName(`xAxisGraph${i}`)[0].value;

    if (document.querySelectorAll(".checkBox")[i].checked === "") {
        dataframe[10] = false;
    } else dataframe[10] = document.querySelectorAll(".checkBox")[i].checked;

    if (document.querySelectorAll(".checkBox")[i].checked === true) {
        dataframe[8] = document.querySelectorAll(".minY.temp")[i].value;
    }
    if (document.querySelectorAll(".checkBox")[i].checked === true) {
        dataframe[9] = document.querySelectorAll(".maxY.temp")[i].value;
    }
    return dataframe;
};

// function(dataset). Creates document for and saves selection for information overwrite.
// Dataset is the dataset to be plotted (only X and Y data)
// Calls information functions for selections and functions getGraphSpecs(), updateWithPreviousInfo() and finaldocstructure(). Is initiated from selectionCollect of Graphs module
const infoRewrite = function(dataset) {
    const GraphText = [];
    const graphSpecs = JSON.parse(sessionStorage.getItem("graphSpecs"));
    document.querySelector(".sub-header").innerHTML = "Choose specifications for your report";
    document.querySelector(".subsection").style = `background-color: ${bkgroundClr};
        height: 100px; margin-bottom: 15px`;
    // section for report title
    extend("div", "ReportTitle", true, "", ".subsection", true).style = "float: left; font-size: 16px; padding-top:0px";
    reportTitle(extend("div", "Title", true, "Report Title<b>* </b>", ".ReportTitle"));
    extend("input", "TitleInput", true, "Type here", ".ReportTitle");
    descrText(extend("div", "DescText", true, "Descriptive Text<b>* </b>", ".ReportTitle"));
    extend("input", "DescTextInput", true, "Type here", ".ReportTitle");
    extend("div", "ReportText", true, "", ".Graph0", false).style = "float: right;font-size: 16px";
    // section for text input
    {
        const textsect = extend("div", "TextSect", true, "Would you like to add a text section?", ".subsection");
        textsect.style = "float:right; margin-right: 20px";
        textInfo(textsect);
        const textbtn = extend("select", "yesNo", true, "", ".TextSect");

        // Text section selection
        extend("option", "NA", true, " ", ".yesNo").value = " ";
        extend("option", "yes", true, "Yes", ".yesNo").value = "Yes";
        extend("option", "no", true, "No", ".yesNo").value = "No";
        extend("div", "headtext", true, "Header:", ".TextSect").style = "display: none";
        extend("input", "headText", true, "", ".TextSect").style = "display: none";
        // extend("div", "posittext", true, `Position:`, ".TextSect").style = "display: none";
        // postionSelection("TextSect").style = "display: none";
        extend("div", "secttext", true, "Text:", ".TextSect").style = "display: none";
        extend("input", "sectText", true, "", ".TextSect").style = "display: none";
        textbtn.onclick = () => {
            if (textbtn.value === "Yes") {
                document.querySelector(".subsection").style = `background-color: ${bkgroundClr};
        height: 120px; margin-bottom: 15px`;
                document.querySelector(".headtext").style = "display: block; padding: 0px;";
                document.querySelector(".headText").style = "display: block; padding: 0px, margin-bottom: 0px";
                document.querySelector(".secttext").style = "display: block; padding: 0px;";
                document.querySelector(".sectText").style = "display: block; padding: 0px";
            }
            if (textbtn.value === "No") {
                document.querySelector(".subsection").style = `background-color: ${bkgroundClr};
                height: 100px; margin-bottom: 15px`;
                document.querySelector(".headtext").style = "display: none";
                document.querySelector(".headText").style = "display: none";
                document.querySelector(".secttext").style = "display: none";
                document.querySelector(".sectText").style = "display: none";
            }
        };
    }
    for (let i = 0; i < sessionStorage.getItem("graphNR"); i++) {
        // eslint-disable-next-line max-len
        extend("div", `reWriteGraph${i}`, true, "<b>Optional </b>- Choose different text/labels of your graph", `.Graph${i}`).style = "float: none";
        extend("br", "spacer", true, "", `.reWriteGraph${i}`).style = "float: none";
        const title = extend("div", `title${i}`, true, "Title: ", `.reWriteGraph${i}`);
        title.style = "float:left; margin-bottom: 0px; padding-left: 0px";
        graphTitle(title);
        extend("input", `TitleGraph${i}`, true, "", `.reWriteGraph${i}`).style = "margin-bottom:2px";
        yAxisInfo(extend("div", `yaxis${i}`, true, "Y-axis: ", `.reWriteGraph${i}`));
        extend("input", `yAxisGraph${i}`, true, "", `.reWriteGraph${i}`).style = "margin-bottom:2px";
        xAxisInfo(extend("div", `axis${i}`, true, "X-axis: ", `.reWriteGraph${i}`));
        extend("input", `xAxisGraph${i}`, true, "", `.reWriteGraph${i}`).style = "margin-bottom:2px";

        // For y-scale adaptation
        {
            yReScale(extend("div", `yScaleEdit${i}`, true, "Change the y-scale ", `.reWriteGraph${i}`));
            const checkBox = extend("input", "checkBox", true, "", `.yScaleEdit${i}`);
            const minText = extend("div", `min${i}`, true, "Min value: ", `.yScaleEdit${i}`);
            const minInput = extend("input", "minY", true, "", `.min${i}`);
            const maxText = extend("div", `max${i}`, true, "Max value:", `.yScaleEdit${i}`);
            const maxInput = extend("input", "maxY", true, "", `.max${i}`);

            checkBox.classList.add(`${i}`);
            checkBox.type = "checkbox";
            checkBox.style = "margin-right: 0px";
            minText.style = "display: none;";
            minInput.style = "display: none;";
            minInput.classList.add(i);
            maxText.style = "display: none;";
            maxInput.style = "display: none;";
            maxInput.classList.add(i);

            checkBox.onchange = () => {
                if (checkBox.checked === true) {
                    minText.style = "display: flex;height:25px";
                    minInput.style = "display: block; width: 30px; margin-left: 10px;";
                    maxText.style = "display: flex;height:25px";
                    maxInput.style = "display: block; width: 31px; margin-left: 6px;";
                }
                if (checkBox.checked === false) {
                    minText.style = "display: none;";
                    minInput.style = "display: none;";
                    maxText.style = "display: none;";
                    maxInput.style = "display: none;";
                }
            };
        }
    }

    if (sessionStorage.getItem("GraphText") !== null) {
        updateWithPreviousInfo();
    }

    extend("div", "btnCollector").style = "text-align: center; display: flex; justify-content: center;";
    const backBtn = extend("button", "btn", true, "Back", ".btnCollector");
    backBtn.style = "margin-top: 5px";

    backBtn.onclick = () => {
        document.querySelector(".subsection").style = "display: none;";
        // update progressbar
        document.querySelector(".progressBar").style = "width: 60%";
        docStructure(sessionStorage.getItem("graphNR"), dataReformat(JSON.parse(sessionStorage.getItem("DF"))));
    };

    const nextBtn = extend("button", "btn", true, "Finish Report", ".btnCollector");
    nextBtn.style = "margin-left: 35px; font-size:15px; width:110px;margin-top: 5px ";
    nextBtn.onclick = () => {
        // Report Title, descriptive text, text section yes/no, header, text.
        const TextSpecs = [
            document.getElementsByClassName("TitleInput")[0].value,
            document.getElementsByClassName("DescTextInput")[0].value,
            document.querySelector(".yesNo.temp").value,
            "",
            "",
        ];
        if (document.querySelector(".yesNo.temp").value === "Yes") {
            TextSpecs[3] = document.getElementsByClassName("headText")[0].value;
            TextSpecs[4] = document.getElementsByClassName("sectText")[0].value;
        }
        sessionStorage.setItem("TextSpecs", JSON.stringify(TextSpecs));
        for (let i = 0; i < sessionStorage.getItem("graphNR"); i++) {
            GraphText[i] = getGraphSpecs(graphSpecs[i], i);
        }
        sessionStorage.setItem("GraphText", JSON.stringify(GraphText));

        let counter = 0;
        document.querySelectorAll(".checkBox").forEach((box, i) => {
            if (box.checked === false || (box.checked === true && document.querySelectorAll(".minY")[i].value !== "" &&
                    document.querySelectorAll(".maxY")[i].value !== "")) {
                counter += 1;
            } else { alert(`please ensure min and max values are added to the Y-Scale selection of Graph ${i + 1}`); }
        });
        if (counter === Number(JSON.parse(sessionStorage.getItem("graphNR")))) {
            // eslint-disable-next-line no-use-before-define
            finalDocStructure(TextSpecs, GraphText, dataset, sessionStorage.getItem("graphNR")); // TextSpecs, GraphSpecs, dataset, graphNR
        }
    };
};

/** *******************************************************************************************
 ******************************* File creation and save ***************************************
 ********************************************************************************************/
// function(). Downloads the report as word
// Is called in finalDocStructure() of this module
const exportHTML = function() {
    const charts = document.querySelectorAll("a");
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='http://www.w3.org/TR/REC-html40'>" +
        "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>" +
        `<img src=${document.querySelector("img").src} width= "150" height="80"></img>` +
        `<h1>${document.querySelector(".title").innerHTML}</h1>`;
    const footer = "</body></html>";
    let sourceHTML = `${header}<div>${document.querySelector(".IntroText.temp").innerHTML}</div>`;
    if (document.querySelector(".TextSection.temp") !== null) {
        sourceHTML = `${sourceHTML}<div>${document.querySelector(".TextSection.temp").innerHTML}</div>`;
    }
    for (let i = 0; i < charts.length; i++) {
        sourceHTML = `${sourceHTML}<img src="${charts[i].href}">`;
    }
    sourceHTML += footer;

    const source = `data:application/vnd.ms-word;charset=utf-8,${encodeURIComponent(sourceHTML)}`;
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `Report ${new Date()}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
    // sessionStorage.clear();
};

// function(). Downloads the report as PDF
// Is called in finalDocStructure() of this module
const exportPDF = function() {
    const element = document.querySelector(".maincontent");
    // eslint-disable-next-line no-undef
    const opt = {
        margin: [0.2, 0.5, 0, 0.5],
        filename: `Report ${new Date()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 1.2, imageTimeout: 0 },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
        pagebreak: { avoid: "canvas" },

    };
    // eslint-disable-next-line no-undef
    html2pdf().set(opt).from(element).save();
    // sessionStorage.clear();
};

// function(). Downloads the report as PowerPoint
// Is called in finalDocStructure() of this module
const exportPPT = function() {
    const charts = document.querySelectorAll("a");

    // eslint-disable-next-line no-undef
    const pptx = new PptxGenJS();
    let slide = pptx.addSlide();
    slide.addText(JSON.parse(sessionStorage.getItem("TextSpecs"))[0], {
        x: 0,
        y: 1,
        w: 10,
        fontSize: 36,
        fill: { color: "F1F1F1" },
        align: "center",
    });
    slide.addText(JSON.parse(sessionStorage.getItem("TextSpecs"))[1], {
        x: 0,
        y: 2,
        w: 10,
        fontSize: 18,
        fill: { color: "F1F1F1" },
        align: "center",
    });

    if (JSON.parse(sessionStorage.getItem("TextSpecs"))[2] === "Yes") {
        slide = pptx.addSlide();
        slide.addText(JSON.parse(sessionStorage.getItem("TextSpecs"))[3], {
            x: 0,
            y: 1,
            w: 10,
            fontSize: 24,
            fill: { color: "F1F1F1" },
            align: "center",
        });
        slide.addText(JSON.parse(sessionStorage.getItem("TextSpecs"))[4], {
            x: 0,
            y: 2,
            w: 10,
            fontSize: 18,
            fill: { color: "F1F1F1" },
            align: "center",
        });
    }

    for (let i = 0; i < charts.length; i++) {
        // eslint-disable-next-line no-shadow
        slide = pptx.addSlide();
        slide.addImage({
            path: charts[i].href,
            x: 0.5,
            y: 0.5,
            w: "45%",
            h: "45%",
        });
    }

    pptx.writeFile({ fileName: `Report ${new Date()}.pdf` });
};

/** *******************************************************************************************
 ********************************* Final report ***********************************************
 ********************************************************************************************/
// function(TextSpecs, GraphSpecs, dataset, graphNR). Creates the final report structure.
// TextSpecs is an array with the text inputs, GraphSpecs is an array with graph information, dataset is an array (Array[Object]) with the dataset, graphNR is number of graphs that was selected.
// Calls updatedplot(). Is called in infoRewrite().
const finalDocStructure = function(TextSpecs, GraphText, dataset, graphNR) {
    // update progressbar
    document.querySelector(".progressBar").style = "width: 100%";
    document.querySelector(".progressBarText").innerHTML = "FINISHED";

    document.querySelector(".subsection").style = "display: none;";
    document.querySelector("t1").style = "display: none";
    clear();
    extend("div", "IntroText", true, "");
    extend("h1", "Title", true, `${TextSpecs[0]}`, ".IntroText").style = "font-size: 34px; margin-bottom: 5px";
    extend("div", "DescText", true, `${TextSpecs[1]}`, ".IntroText").style = "font-size: 24px; margin-bottom: 20px";
    if (TextSpecs[2] === "Yes") {
        extend("div", "TextSection").style = "margin-top: 25px; margin-bottom: 20px;";
        extend("div", "TextHeader", true, `${TextSpecs[3]}`, ".TextSection").style = "font-size: 20px ";
        extend("br", "Spacer", true, "", ".TextSection");
        extend("div", "TextWritten", true, `${TextSpecs[4]}`, ".TextSection").style = "font-size: 16px ";
    }
    for (let i = 0; i < graphNR; i++) {
        updatedplot(dataset[i], GraphText[i], i);
    }
    // eslint-disable-next-line max-len
    extend("div", "bottomBtn", true, "", "footer", false).style = "text-alighn: center; display: flex; justify-content: center";
    extend("div", "buttonCollector", true, "", "footer", false).style = `display: block;text-align: center; 
    display: flex;justify-content: center; background-color:${bkgroundClr} `;
    const btn = extend("button", "btn", true, "Back", ".bottomBtn");
    btn.style = " margin-right: 40px; margin-left:40px; margin-top: 15px";
    btn.onclick = () => {
        clear();
        // update progressbar
        document.querySelector(".progressBar").style = "width: 80%; height:11px";
        document.querySelector(".progressBarText").innerHTML = "PROGRESS";
        selectionCollect(dataset);
    };
    const newBtn = extend("button", "btn", true, "Create new report", ".bottomBtn");
    newBtn.style = "font-size: 15px; width: 140px; margin-top: 15px";
    newBtn.onclick = () => {
        sessionStorage.clear();
        // eslint-disable-next-line no-restricted-globals
        location.reload();
    };
    extend("div", "buttonText", true, "Options:", ".buttonCollector").style = "margin-right:30px; font-size: 18px";
    extend("button", "btns", true, "Print <br> report", ".buttonCollector").onclick = () => {
        // eslint-disable-next-line no-param-reassign
        document.querySelectorAll(".btns").forEach((item) => { item.style = "display: none"; });
        document.querySelector(".btn").style = "display: none";

        window.print();
        // eslint-disable-next-line no-param-reassign
        document.querySelectorAll(".btns").forEach((item) => { item.style = "display: block"; });
        document.querySelectorAll(".bottomBtn").style = "display: block";
    };
    extend("button", "btns", true, "Save as Word", ".buttonCollector").onclick = () => {
        exportHTML();
    };
    extend("button", "btns", true, "Save as Powerpoint", ".buttonCollector").onclick = () => {
        exportPPT();
    };
    extend("button", "btns", true, "Save as PDF", ".buttonCollector").onclick = () => {
        document.querySelectorAll(".bottomBtn")[0].style = "display: none";
        exportPDF();
        // eslint-disable-next-line no-implied-eval
        setTimeout(() => { document.querySelectorAll(".bottomBtn")[0].style = "display: block"; }, 5000);
    };
};

export default infoRewrite;