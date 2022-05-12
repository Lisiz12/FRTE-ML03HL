# FRTE-ML03HL
This is the second iteration of a prototype for a flexible report template editor as part of my thesis project in 2022.

This project was created in a study with the aim to investigate this possibility to create a prototype of a flexible template editor, suitable for usage by users of low to moderate computer literacy, for generation of simple data visualization reports. The prototype was built using JavaScript and the linter library ESlint.js, graphical representation library Chart.js, file download libraries html2pdf.js, pptxgen.js and exportHTML.js.

The prototype was built in 5 modules: 1.	Initiation and file type selection, 2.	Data pipeline (CSV), 3.	Data collection, selection, and structuring, 4.	Graph generation, 5.	Final report structure. Similarly, the user will move though 5 stages: 1.	Selection of data file type and selection of file, 2.	Selection of number of graphs to depict, 3.	Selection of data to depict in each graph, 4.	Adaptation of graph labels and report information, 5.	Final report output.
This structure was selected to facilitate future adaptation of the prototype. As this prototype is aimed at being flexible with regards to data input and output, it will require a structure which allows for easy updates and additions. By separating the different functions of the script, with clear input and outputs, future updates or adaptations will be facilitated, as only the module/function of interest need to be updated.
