/* Traduction en du parcours R (générée par generateur/gen_trad.py). Le code R reste celui de la version française (<!--code:N-->). */
window.TRAD = window.TRAD || {};
window.TRAD.en = Object.assign(window.TRAD.en || {}, {
 "r": {
  "nom": "R",
  "accroche": "R, from your first script to hazard mapping",
  "lead": "A step-by-step course to learn R with RStudio: language basics, data frames and dplyr, ggplot2 graphics, statistics applied to the environment, programming, then spatial data with sf and terra up to susceptibility maps for natural hazards (floods, forest fires, landslides). Each lesson offers an exercise, videos and an end-of-level quiz."
 },
 "r1": {
  "titre": "Discover R and RStudio",
  "resume": "Install R and RStudio, understand the interface, work with scripts and projects, install packages and find help.",
  "quiz": [
   {
    "question": "Which software must be installed first?",
    "choix": [
     "Both at the same time",
     "RStudio",
     "R",
     "The tidyverse package"
    ],
    "explication": "RStudio is the workshop; it needs R, the engine, already installed."
   },
   {
    "question": "Which shortcut runs the current line of a script in RStudio?",
    "choix": [
     "Ctrl + Enter",
     "F5",
     "Ctrl + S",
     "Ctrl + Shift + N"
    ],
    "explication": "Ctrl + Enter sends the line (or selection) to the console."
   },
   {
    "question": "What is the # symbol for in an R script?",
    "choix": [
     "To write a comment ignored by R",
     "To load a package",
     "To create an object",
     "To multiply"
    ],
    "explication": "Everything after # on the line is a comment."
   },
   {
    "question": "Why use an RStudio project (.Rproj)?",
    "choix": [
     "To set the working folder and use relative paths",
     "To make R faster",
     "To save graphics as PDF",
     "To install packages"
    ],
    "explication": "The project sets the working directory: the same script works on every computer."
   },
   {
    "question": "What is the right way to use the sf package?",
    "choix": [
     "install.packages(\"sf\") every session",
     "library(sf) once, install.packages every session",
     "Nothing: sf is built into R",
     "install.packages(\"sf\") once, then library(sf) every session"
    ],
    "explication": "Install once per computer, load every session."
   },
   {
    "question": "In the console, what does a + at the start of the line mean?",
    "choix": [
     "A package is being installed",
     "R crashed",
     "The previous command is not finished",
     "An addition is running"
    ],
    "explication": "Often a bracket or quote is missing; Esc cancels."
   }
  ]
 },
 "r1-l1": {
  "titre": "R and RStudio: install and discover",
  "duree": "20 min",
  "objectifs": [
   "Know what R and RStudio are and why use them in geomatics",
   "Install R then RStudio on Windows",
   "Find the four panes of RStudio"
  ],
  "contenu": "\n<p><b>R</b> is a free, open-source language and software for data analysis, statistics, graphics and mapping. <b>RStudio</b> is the working environment (the “workshop”) that makes R comfortable: script editor, console, file browser, help and plots.</p>\n<p>Why R in a geomatics and environment school?</p>\n<ul>\n  <li>Everything is <b>written in a script</b>: the analysis can be reread, corrected and rerun on new data (reproducibility).</li>\n  <li>Thousands of free <b>packages</b>: statistics, <code>ggplot2</code> for graphics, <code>sf</code> for vector layers, <code>terra</code> for rasters and DEMs.</li>\n  <li>R complements ArcGIS and QGIS: prepare data and run statistics in R, finish a layout in a GIS if needed.</li>\n</ul>\n<h4>Installation (in this order)</h4>\n<ol>\n  <li>Install <b>R</b> from the CRAN website: <code>cran.r-project.org</code> &gt; <i>Download R for Windows</i> &gt; <i>base</i>.</li>\n  <li>Install <b>RStudio Desktop</b> (free) from the Posit website: <code>posit.co</code> &gt; <i>RStudio Desktop</i>.</li>\n  <li>Launch <b>RStudio</b> (not R): it finds R automatically.</li>\n</ol>\n<h4>The four panes of RStudio</h4>\n<ul>\n  <li><b>Source</b> (top left): your <code>.R</code> scripts.</li>\n  <li><b>Console</b> (bottom left): where R runs commands and prints results.</li>\n  <li><b>Environment / History</b> (top right): objects created during the session.</li>\n  <li><b>Files / Plots / Packages / Help</b> (bottom right).</li>\n</ul>\n<div class=\"astuce\"><b>Remember:</b> set once and for all <i>Tools &gt; Global Options &gt; General</i>: untick <i>Restore .RData into workspace at startup</i> and choose <i>Never</i> for <i>Save workspace to .RData on exit</i>. Your results must come from the script, not from a hidden memory.</div>",
  "exercice": "<ol>\n  <li>Install R then RStudio on your computer (or check they are installed in the computer room).</li>\n  <li>Open RStudio and find the four panes.</li>\n  <li>In the console, type <code>R.version.string</code> then Enter: write down the R version.</li>\n  <li>Apply the settings from the “Remember” box.</li>\n</ol>"
 },
 "r1-l2": {
  "titre": "The console, scripts and comments",
  "duree": "25 min",
  "objectifs": [
   "Use R as a calculator in the console",
   "Write, comment and save an .R script",
   "Run a line or a selection with Ctrl + Enter"
  ],
  "contenu": "\n<p>The <b>console</b> runs what you type immediately. Try:</p>\n<!--code:0-->\n<p>But what you type in the console is quickly lost. So we work in a <b>script</b>: <i>File &gt; New File &gt; R Script</i> (or <kbd>Ctrl + Shift + N</kbd>). A script is a plain text file with the <code>.R</code> extension.</p>\n<ul>\n  <li><kbd>Ctrl + Enter</kbd> runs the line where the cursor is (or the selection);</li>\n  <li><kbd>Ctrl + Shift + S</kbd> runs the whole script (<i>Source</i>);</li>\n  <li><kbd>Ctrl + S</kbd> saves the script.</li>\n</ul>\n<p>Everything after a <code>#</code> is a <b>comment</b>: R ignores it, but it explains your approach to the reader (and to you in three months).</p>\n<!--code:1-->\n<div class=\"astuce\"><b>The <code>&gt;</code> and <code>+</code> signs</b> in the console: <code>&gt;</code> means R is waiting for a command; <code>+</code> means a command is not finished (missing bracket or quote). Press <kbd>Esc</kbd> to cancel.</div>",
  "exercice": "<ol>\n  <li>Create a script <code>TP1_calculs.R</code> with a commented header.</li>\n  <li>Compute the population density of a municipality of 26,024 inhabitants and 38.5 km².</li>\n  <li>Convert 852 m into feet (1 ft = 0.3048 m) and round with <code>round()</code>.</li>\n  <li>Run the script line by line, then all at once with <i>Source</i>.</li>\n</ol>"
 },
 "r1-l3": {
  "titre": "RStudio projects and the working folder",
  "duree": "20 min",
  "objectifs": [
   "Understand the working directory and relative paths",
   "Open the TP_R.Rproj project supplied with the data",
   "Organise a project: data, scripts, outputs"
  ],
  "contenu": "\n<p>R reads and writes files from a <b>working directory</b>. To avoid paths like <code>C:/Users/.../Desktop/...</code> that only work on one computer, we use an <b>RStudio project</b>: a <code>.Rproj</code> file that sets the working folder automatically.</p>\n<p>The practical data of this site come as a project:</p>\n<!--code:0-->\n<p>Once the project is open, paths are <b>relative</b> to the <code>TP_R</code> folder:</p>\n<!--code:1-->\n<div class=\"astuce\"><b>On Windows</b>, R writes paths with forward slashes <code>/</code> (or double backslashes <code>\\\\</code>). A path copied from Explorer with single <code>\\</code> causes an error.</div>",
  "exercice": "<ol>\n  <li>Download <code>TP_R_ENIV.zip</code> (Downloads page) and unzip it into <code>C:\\ENIV\\</code>.</li>\n  <li>Double-click <code>C:\\ENIV\\TP_R\\TP_R.Rproj</code>: RStudio opens the project (its name appears top right).</li>\n  <li>In the console, check <code>getwd()</code> and list the files of <code>donnees/tables</code>.</li>\n  <li>Open <code>scripts/01_premiers_pas.R</code> and run it line by line.</li>\n</ol>"
 },
 "r1-l4": {
  "titre": "Packages and help",
  "duree": "20 min",
  "objectifs": [
   "Install a package once and load it every session",
   "Install the course packages",
   "Read a help page and its examples"
  ],
  "contenu": "\n<p>A <b>package</b> adds functions to R. It is <b>installed once</b> per computer (downloaded from CRAN), then <b>loaded</b> every session with <code>library()</code>.</p>\n<!--code:0-->\n<p>The course packages:</p>\n<ul>\n  <li><code>tidyverse</code>: a set (dplyr, tidyr, readr, ggplot2…) to handle and plot data;</li>\n  <li><code>readxl</code>: read Excel files;</li>\n  <li><code>sf</code>: vector data (shapefile, GeoPackage), projections, geoprocessing;</li>\n  <li><code>terra</code>: rasters, DEMs, terrain analysis, map algebra.</li>\n</ul>\n<h4>Finding help</h4>\n<!--code:1-->\n<div class=\"astuce\"><b>Reading an error message:</b> <code>Error in library(sf) : there is no package called 'sf'</code> simply means the package is not installed. Paste the error message into a search engine: someone has almost always had the same problem.</div>",
  "exercice": "<ol>\n  <li>Install the course packages with <code>install.packages()</code>.</li>\n  <li>Load <code>sf</code> and <code>terra</code>: note the GDAL and PROJ versions shown.</li>\n  <li>Open the help of <code>mean</code>: what is the <code>na.rm</code> argument for?</li>\n  <li>Run <code>example(boxplot)</code> and look at the Plots pane.</li>\n</ol>"
 },
 "r2": {
  "titre": "R language basics",
  "resume": "Objects and assignment, data types, vectors and vectorised computing, indexing, missing values, factors, lists and matrices.",
  "quiz": [
   {
    "question": "Which operator assigns a value to an object in R?",
    "choix": [
     "==",
     "->>",
     "<-",
     "="
    ],
    "explication": "<- is the recommended assignment operator; == compares."
   },
   {
    "question": "What does mean(c(4, NA, 8)) return?",
    "choix": [
     "6",
     "4",
     "NA",
     "An error"
    ],
    "explication": "Add na.rm = TRUE to ignore the missing value."
   },
   {
    "question": "What does c(2, 4, 6) * 10 return?",
    "choix": [
     "An error",
     "120",
     "20 40 60",
     "2 4 6 10"
    ],
    "explication": "The computation is vectorised: each element is multiplied by 10."
   },
   {
    "question": "How do you extract rainfall values greater than 50?",
    "choix": [
     "pluie[pluie > 50]",
     "which(pluie)",
     "pluie(> 50)",
     "pluie[[50]]"
    ],
    "explication": "Index the vector with a logical condition in square brackets."
   },
   {
    "question": "Which object type suits a “borehole status” variable (in service, stopped, abandoned)?",
    "choix": [
     "list",
     "numeric",
     "matrix",
     "factor"
    ],
    "explication": "Qualitative variables are represented by factors."
   },
   {
    "question": "What is the decimal separator in R?",
    "choix": [
     "The comma",
     "The point",
     "Both",
     "The semicolon"
    ],
    "explication": "R always uses the point: 12.5."
   }
  ]
 },
 "r2-l1": {
  "titre": "Objects, assignment and types",
  "duree": "25 min",
  "objectifs": [
   "Create objects with <-",
   "Recognise numeric, character and logical types",
   "Follow naming rules"
  ],
  "contenu": "\n<p>In R, a value is stored in an <b>object</b> with the assignment arrow <code>&lt;-</code> (shortcut <kbd>Alt + -</kbd>).</p>\n<!--code:0-->\n<p>Naming rules: start with a letter, no spaces, accents or hyphens. R is case-sensitive (<code>Pluie</code> ≠ <code>pluie</code>). Prefer explicit names: <code>pluie_annuelle</code> rather than <code>x</code>.</p>\n<h4>Comparisons and logical operators</h4>\n<!--code:1-->\n<div class=\"astuce\"><b>Decimals:</b> R always uses the <b>point</b> as decimal separator: <code>12.5</code>, never <code>12,5</code>.</div>",
  "exercice": "<ol>\n  <li>Create the objects <code>nom_commune</code>, <code>population</code> (26024) and <code>surface</code> (38.5).</li>\n  <li>Compute <code>densite</code> and check its class.</li>\n  <li>Test whether the density exceeds 500 inhabitants/km².</li>\n  <li>What does <code>as.numeric(\"12,5\")</code> return? Explain.</li>\n</ol>"
 },
 "r2-l2": {
  "titre": "Vectors and vectorised computing",
  "duree": "30 min",
  "objectifs": [
   "Create a vector with c(), seq() and rep()",
   "Apply a computation to all elements at once",
   "Use summary functions: sum, mean, min, max, length"
  ],
  "contenu": "\n<p>A <b>vector</b> is a sequence of values of the same type. It is the basic building block of R: a column of a table is a vector.</p>\n<!--code:0-->\n<p>Operations are <b>vectorised</b>: they apply to each element without writing a loop.</p>\n<!--code:1-->\n<div class=\"astuce\"><b>Beware of mixing types:</b> <code>c(1, \"a\", TRUE)</code> turns everything into text. A vector holds a single type.</div>",
  "exercice": "<ol>\n  <li>Enter the monthly temperatures <code>temp</code> above and compute the annual mean.</li>\n  <li>Compute the temperature range (max − min).</li>\n  <li>How many months are dry (P &lt; 2T)? Which ones? (hint: <code>names(pluie)[pluie &lt; 2 * temp]</code>)</li>\n  <li>Compute the De Martonne index <code>sum(pluie) / (mean(temp) + 10)</code>.</li>\n</ol>"
 },
 "r2-l3": {
  "titre": "Indexing and missing values (NA)",
  "duree": "25 min",
  "objectifs": [
   "Extract elements by position, name or condition",
   "Spot and handle NA missing values",
   "Use which(), is.na() and the na.rm argument"
  ],
  "contenu": "\n<p><b>Square brackets</b> <code>[ ]</code> extract elements from a vector.</p>\n<!--code:0-->\n<h4>Missing values</h4>\n<p>A missing measurement (broken rain gauge, borehole not gauged) is written <code>NA</code> (<i>Not Available</i>). A computation containing an <code>NA</code> returns <code>NA</code>: this is deliberate, R refuses to invent.</p>\n<!--code:1-->\n<div class=\"astuce\"><b>Remember:</b> never replace an <code>NA</code> by 0 without thinking: 0 mm of rain and “no measurement” do not mean the same thing.</div>",
  "exercice": "<ol>\n  <li>With the <code>pluie</code> vector, extract the winter months (Déc, Jan, Fév) by name.</li>\n  <li>Which is the driest month? (use <code>which.min</code> and <code>names</code>)</li>\n  <li>Create <code>prof &lt;- c(175, 65, NA, 235, 250, NA, 160)</code>: count the NAs and compute the mean depth.</li>\n  <li>How many boreholes are deeper than 150 m (ignoring NAs)?</li>\n</ol>"
 },
 "r2-l4": {
  "titre": "Factors, lists and matrices",
  "duree": "25 min",
  "objectifs": [
   "Use factors for qualitative variables",
   "Group different objects in a list",
   "Create and handle a matrix"
  ],
  "contenu": "\n<p>A <b>factor</b> represents a qualitative variable (categories): borehole status, land cover type, slope class.</p>\n<!--code:0-->\n<p>A <b>list</b> groups objects of different types and lengths. Many R results (tests, models) are lists.</p>\n<!--code:1-->\n<p>A <b>matrix</b> is a two-dimensional table of a single type; a raster is, deep down, a large matrix of values.</p>\n<!--code:2-->\n<div class=\"astuce\">The script <code>scripts/02_bases_langage.R</code> gathers all the examples of the level.</div>",
  "exercice": "<ol>\n  <li>Create a factor <code>occup</code> with the values Forêt, Agriculture, Forêt, Parcours, Urbain, Forêt and print its counts.</li>\n  <li>Create a list <code>station</code> holding the name, the altitude and the monthly rainfall vector; compute the total from the list.</li>\n  <li>Create a 3 × 3 matrix of altitudes and compute the difference between the central cell and the mean of the cells.</li>\n</ol>"
 },
 "r3": {
  "titre": "Data frames: import and manipulate",
  "resume": "Data frames, importing CSV and Excel files, data handling with dplyr (filter, select, compute, summarise, join) and exporting results.",
  "quiz": [
   {
    "question": "Which function reads a “French-style” CSV (semicolon, decimal comma)?",
    "choix": [
     "read.csv2()",
     "read.table(dec = \".\")",
     "read.csv()",
     "read_excel()"
    ],
    "explication": "read.csv2 uses sep = \";\" and dec = \",\" by default."
   },
   {
    "question": "Which dplyr verb keeps certain ROWS of a table?",
    "choix": [
     "filter()",
     "mutate()",
     "select()",
     "arrange()"
    ],
    "explication": "filter keeps rows; select keeps columns."
   },
   {
    "question": "What does mutate(DENSITE = POP / SURF) do?",
    "choix": [
     "Deletes the POP column",
     "Filters dense municipalities",
     "Sorts the table",
     "Creates or modifies the DENSITE column"
    ],
    "explication": "mutate adds or replaces columns."
   },
   {
    "question": "How do you compute the annual rainfall of each station?",
    "choix": [
     "left_join()",
     "group_by(ID_ST, ANNEE) then summarise(sum(PLUIE_MM))",
     "filter() then arrange()",
     "select(PLUIE_MM)"
    ],
    "explication": "group_by defines the groups, summarise computes one value per group."
   },
   {
    "question": "A numeric column shows up as “chr” after import. Most likely cause?",
    "choix": [
     "Wrong decimal separator",
     "The file is too big",
     "library(dplyr) is missing",
     "The file contains NAs"
    ],
    "explication": "Values like 38,7 read with read.csv stay as text."
   },
   {
    "question": "What is left_join(stations, moyennes, by = \"ID_ST\") for?",
    "choix": [
     "Adding to the stations the columns of moyennes with the same ID_ST",
     "Sorting by ID_ST",
     "Stacking two tables",
     "Removing duplicates"
    ],
    "explication": "It is an attribute join on the ID_ST key."
   }
  ]
 },
 "r3-l1": {
  "titre": "Data frames",
  "duree": "25 min",
  "objectifs": [
   "Create a data frame and access its columns",
   "Explore a table: head, str, summary, nrow",
   "Add a computed column"
  ],
  "contenu": "\n<p>A <b>data frame</b> is a table: each <b>row</b> is an observation (a borehole, a station, a month), each <b>column</b> a variable (a vector). It is the equivalent of the attribute table of a GIS layer.</p>\n<!--code:0-->\n<h4>Exploring a table</h4>\n<!--code:1-->\n<div class=\"astuce\"><b>RStudio tip:</b> click the name of a table in the <i>Environment</i> pane to display, sort and filter it visually.</div>",
  "exercice": "<ol>\n  <li>Create a data frame <code>communes</code> with 4 municipalities (CODE, NOM, POP, SURF_KM2) of your choice.</li>\n  <li>Add a <code>DENSITE</code> column.</li>\n  <li>Display the municipalities with more than 10,000 inhabitants.</li>\n  <li>Use <code>str()</code> and <code>summary()</code> and comment on the result.</li>\n</ol>"
 },
 "r3-l2": {
  "titre": "Importing CSV and Excel files",
  "duree": "30 min",
  "objectifs": [
   "Read an international (read.csv) or French (read.csv2) CSV",
   "Read an Excel sheet with readxl",
   "Check the import and fix common problems"
  ],
  "contenu": "\n<p>CSV files come in two “dialects”:</p>\n<ul>\n  <li><b>international</b>: comma separator, decimal point → <code>read.csv()</code>;</li>\n  <li><b>French</b> (Excel set to French): semicolon separator, decimal comma → <code>read.csv2()</code>.</li>\n</ul>\n<!--code:0-->\n<h4>Always check the import</h4>\n<!--code:1-->\n<p>Common problems: a numeric column read as text (wrong decimal separator), unreadable accents (add <code>encoding = \"UTF-8\"</code>), a single column instead of several (wrong <code>sep</code>).</p>\n<div class=\"astuce\"><b>Export:</b> <code>write.csv(tableau, \"sorties/resultat.csv\", row.names = FALSE)</code> for an international CSV, <code>write.csv2()</code> for a file that opens directly in a French Excel.</div>",
  "exercice": "<ol>\n  <li>Import the five tables of the <code>donnees/tables</code> folder with the right function.</li>\n  <li>Wrongly read <code>qualite_eau_forages.csv</code> with <code>read.csv()</code>: what happens?</li>\n  <li>How many missing values does the <code>PLUIE_MM</code> column contain?</li>\n  <li>How many stations and years does the rainfall table cover?</li>\n</ol>"
 },
 "r3-l3": {
  "titre": "Handling data with dplyr",
  "duree": "35 min",
  "objectifs": [
   "Chain operations with the |> pipe",
   "Use filter, select, mutate and arrange",
   "Create classes with case_when"
  ],
  "contenu": "\n<p>The <code>dplyr</code> package provides simple “verbs” to handle a table. The <b>pipe</b> <code>|&gt;</code> (shortcut <kbd>Ctrl + Shift + M</kbd>) passes the result of one step to the next: read it as “then”.</p>\n<!--code:0-->\n<p><code>case_when()</code> creates classes from conditions, like a reclassification:</p>\n<!--code:1-->\n<div class=\"astuce\"><b>Readability:</b> one step per line, pipe at the end of the line. If a step fails, run the chain piece by piece to find which one.</div>",
  "exercice": "<ol>\n  <li>From <code>qualite</code>, keep the boreholes whose nitrates exceed 50 mg/L at low water, sorted from most to least polluted.</li>\n  <li>Add a <code>COND_MSCM</code> column (conductivity in mS/cm = µS/cm / 1000).</li>\n  <li>In <code>pluie</code>, keep station S03 from 2020 to 2024 and the dry months (PLUIE_MM &lt; 2 × TMOY_C).</li>\n</ol>"
 },
 "r3-l4": {
  "titre": "Summarise, join and reshape",
  "duree": "35 min",
  "objectifs": [
   "Compute statistics by group with group_by and summarise",
   "Join two tables by a key (left_join)",
   "Switch between long and wide formats (tidyr)"
  ],
  "contenu": "\n<p><code>group_by()</code> + <code>summarise()</code> computes a statistic per group, like the “Summary Statistics” tool of a GIS.</p>\n<!--code:0-->\n<p>A <b>join</b> brings together two tables that share a key (like an attribute join in ArcGIS or QGIS).</p>\n<!--code:1-->\n<p><code>tidyr</code> changes the shape of a table: <b>long</b> format (one row per station and year) or <b>wide</b> (one column per station).</p>\n<!--code:2-->\n<div class=\"astuce\">The full script of the level is <code>scripts/03_tableaux_dplyr.R</code>.</div>",
  "exercice": "<ol>\n  <li>For each campaign, compute the mean, minimum and maximum nitrates and the number of boreholes above 50 mg/L.</li>\n  <li>Join <code>forages_attributs.csv</code> to the quality table by <code>ID_FOR</code>.</li>\n  <li>Compute the mean rainfall per month (1 to 12) over all stations.</li>\n  <li>Export your summary as a French CSV in <code>sorties/</code> and open it in Excel.</li>\n</ol>"
 },
 "r4": {
  "titre": "Graphics with ggplot2",
  "resume": "Quick base R plots, the grammar of graphics of ggplot2, ombrothermic diagram, facets, themes and high-resolution export.",
  "quiz": [
   {
    "question": "In ggplot2, what does aes() define?",
    "choix": [
     "The export format",
     "The mapping between variables and visual properties (x, y, colour…)",
     "The title",
     "The background colour"
    ],
    "explication": "aes = aesthetics: which variables go on the axes, colours, sizes."
   },
   {
    "question": "Which plot compares the conductivity of two campaigns?",
    "choix": [
     "Map",
     "Line",
     "Box plots",
     "Pie chart"
    ],
    "explication": "A box plot compares the distribution of a variable between groups."
   },
   {
    "question": "In a Gaussen ombrothermic diagram, a month is dry when:",
    "choix": [
     "P = 0",
     "P < 2T",
     "P > 2T",
     "T > 30 °C"
    ],
    "explication": "The month is dry when the 2T curve goes above the rainfall."
   },
   {
    "question": "Which function repeats a plot for each station?",
    "choix": [
     "theme_bw()",
     "facet_wrap(~ ID_ST)",
     "group_by(ID_ST)",
     "geom_line()"
    ],
    "explication": "facet_wrap makes one small plot per category."
   },
   {
    "question": "How do you save a ggplot as a 300 dpi PNG?",
    "choix": [
     "ggsave(\"fichier.png\", graphique, dpi = 300)",
     "save.png()",
     "write.csv()",
     "png = TRUE"
    ],
    "explication": "ggsave picks the format from the file extension."
   },
   {
    "question": "Where does the + that adds a ggplot layer go?",
    "choix": [
     "At the end of the line",
     "Inside brackets",
     "At the start of the next line",
     "It is not needed"
    ],
    "explication": "At the start of a line, R considers the previous command finished."
   }
  ]
 },
 "r4-l1": {
  "titre": "Quick plots with base R",
  "duree": "20 min",
  "objectifs": [
   "Draw a histogram, a box plot and a scatter plot",
   "Customise titles, axes and colours",
   "Choose the plot that fits the question"
  ],
  "contenu": "\n<p>Base R lets you explore a variable quickly:</p>\n<!--code:0-->\n<table class=\"list\"><tr><th>Question</th><th>Plot</th></tr>\n<tr><td>How is a variable distributed?</td><td>Histogram</td></tr>\n<tr><td>Do the groups differ?</td><td>Box plots</td></tr>\n<tr><td>Are two variables related?</td><td>Scatter plot</td></tr>\n<tr><td>How does a value change over time?</td><td>Line</td></tr>\n<tr><td>How many items per category?</td><td>Bar chart</td></tr></table>",
  "exercice": "<ol>\n  <li>Plot the histogram of nitrates and add a vertical line at the 50 mg/L threshold (<code>abline(v = 50)</code>).</li>\n  <li>Compare the conductivity of the two campaigns with a boxplot.</li>\n  <li>Save a plot from the Plots pane (<i>Export &gt; Save as Image</i>).</li>\n</ol>"
 },
 "r4-l2": {
  "titre": "The grammar of ggplot2",
  "duree": "35 min",
  "objectifs": [
   "Build a plot layer by layer: data, aes, geom",
   "Map colour, size and shape to variables",
   "Add titles, legends and reference lines"
  ],
  "contenu": "\n<p><code>ggplot2</code> builds a plot in <b>layers</b>, a bit like a map in a GIS:</p>\n<ul>\n  <li><code>ggplot(data, aes(...))</code>: the table and the mapping variables → axes, colours, sizes (<i>aesthetics</i>);</li>\n  <li><code>geom_...()</code>: the geometric shape (points, lines, bars, boxes);</li>\n  <li><code>labs()</code>, <code>theme_...()</code>, <code>scale_...()</code>: styling.</li>\n</ul>\n<!--code:0-->\n<p>A few useful geometries:</p>\n<!--code:1-->\n<div class=\"astuce\"><b>The + at the end of the line:</b> each layer is added with <code>+</code> placed at the end of the previous line, never at the start of the next one.</div>",
  "exercice": "<ol>\n  <li>With ggplot2, draw a scatter plot of nitrates against depth (first join <code>forages_attributs.csv</code>).</li>\n  <li>Colour the points by borehole status and add <code>geom_smooth(method = \"lm\")</code>.</li>\n  <li>Give a title, axis names with units and a theme of your choice.</li>\n</ol>"
 },
 "r4-l3": {
  "titre": "Ombrothermic diagram, facets and export",
  "duree": "35 min",
  "objectifs": [
   "Build a Gaussen ombrothermic diagram",
   "Repeat a plot by group with facet_wrap",
   "Export a high-resolution PNG with ggsave"
  ],
  "contenu": "\n<p>The Bagnouls and Gaussen <b>ombrothermic diagram</b> overlays rainfall (bars) and temperature (line) with the scale <b>P = 2T</b>: a month is dry when the bar drops below the line.</p>\n<!--code:0-->\n<p><b>Facets</b> repeat the same plot for each group:</p>\n<!--code:1-->\n<div class=\"astuce\">300 dpi is enough for a printed thesis. The script <code>scripts/04_graphiques.R</code> holds all the plots of the level.</div>",
  "exercice": "<ol>\n  <li>Draw the ombrothermic diagram of station S04 (the highest). How many dry months does it have?</li>\n  <li>Make an ombrothermic diagram for every station with <code>facet_wrap(~ ID_ST)</code>.</li>\n  <li>Export it as a 300 dpi PNG and insert it in a Word document.</li>\n</ol>"
 },
 "r5": {
  "titre": "Statistics for the environment",
  "resume": "Descriptive statistics, normality, comparison tests (Student, Wilcoxon, ANOVA, chi-square), correlation, linear regression and trends in climate series.",
  "quiz": [
   {
    "question": "A p-value of 0.002 at the 5% level means:",
    "choix": [
     "The effect is necessarily large",
     "We reject the null hypothesis",
     "The test is invalid",
     "We accept the null hypothesis"
    ],
    "explication": "p < 0.05: the observed difference is unlikely under chance alone."
   },
   {
    "question": "The same 30 boreholes are measured at high and low water. Which test?",
    "choix": [
     "cor.test",
     "chisq.test",
     "Independent t.test",
     "t.test(..., paired = TRUE)"
    ],
    "explication": "Repeated measures on the same individuals: paired test."
   },
   {
    "question": "What does the R² of a regression measure?",
    "choix": [
     "The slope of the line",
     "The share of variability explained by the model",
     "The p-value",
     "The number of observations"
    ],
    "explication": "R² ranges from 0 to 1."
   },
   {
    "question": "Which test for a trend in an annual rainfall series?",
    "choix": [
     "Kruskal-Wallis",
     "Mann-Kendall (Kendall with time)",
     "Shapiro-Wilk",
     "Chi-square"
    ],
    "explication": "Mann-Kendall is a non-parametric test of monotonic trend."
   },
   {
    "question": "Which indicator best describes the typical value of a variable with a few extreme values?",
    "choix": [
     "The mean",
     "The maximum",
     "The median",
     "The variance"
    ],
    "explication": "The median is robust to extreme values."
   },
   {
    "question": "To test the link between two qualitative variables (land cover and fire cause):",
    "choix": [
     "chisq.test on a cross-table",
     "t.test",
     "lm",
     "cor.test"
    ],
    "explication": "The chi-square tests the independence of two qualitative variables."
   }
  ]
 },
 "r5-l1": {
  "titre": "Descriptive statistics",
  "duree": "30 min",
  "objectifs": [
   "Compute location and dispersion indicators",
   "Summarise a variable by group",
   "Interpret mean, median, standard deviation and coefficient of variation"
  ],
  "contenu": "\n<p>Before any test, we <b>describe</b> the data: location (mean, median), dispersion (standard deviation, quartiles) and shape (histogram).</p>\n<!--code:0-->\n<p>By group, with dplyr:</p>\n<!--code:1-->\n<div class=\"astuce\"><b>Mean or median?</b> If a few extreme values pull the mean (an exceptional flood, a very polluted borehole), the median better describes the “typical” value. A CV &gt; 30% indicates high variability, common for rainfall in a Mediterranean climate.</div>",
  "exercice": "<ol>\n  <li>Describe conductivity (COND_USCM): mean, median, standard deviation, CV.</li>\n  <li>Compare these indicators between high and low water.</li>\n  <li>Compute the annual rainfall of each station then its CV: which station is the most irregular?</li>\n</ol>"
 },
 "r5-l2": {
  "titre": "Comparison tests",
  "duree": "35 min",
  "objectifs": [
   "Check normality (Shapiro-Wilk, Q-Q plot)",
   "Compare two means: paired or unpaired Student test, and Wilcoxon",
   "Compare several groups (ANOVA, Kruskal-Wallis) and test independence (chi-square)"
  ],
  "contenu": "\n<p>A statistical test answers a question like “can the observed difference be due to chance?”. Read the <b>p-value</b>: if p &lt; 0.05, reject the null hypothesis (no difference) at the 5% risk level.</p>\n<!--code:0-->\n<p>More than two groups: ANOVA (parametric) or Kruskal-Wallis. Two qualitative variables: chi-square.</p>\n<!--code:1-->\n<table class=\"list\"><tr><th>Situation</th><th>Parametric</th><th>Non-parametric</th></tr>\n<tr><td>2 independent groups</td><td><code>t.test(x, y)</code></td><td><code>wilcox.test(x, y)</code></td></tr>\n<tr><td>2 measurements on the same individuals</td><td><code>t.test(x, y, paired = TRUE)</code></td><td><code>wilcox.test(..., paired = TRUE)</code></td></tr>\n<tr><td>3 or more groups</td><td><code>aov()</code></td><td><code>kruskal.test()</code></td></tr>\n<tr><td>2 qualitative variables</td><td colspan=\"2\"><code>chisq.test(table(...))</code></td></tr></table>\n<div class=\"astuce\"><b>Significant does not mean important:</b> always give the effect size (here, by how many mg/L nitrates rise at low water), not only the p-value.</div>",
  "exercice": "<ol>\n  <li>Do nitrates rise significantly at low water? By how much on average (confidence interval)?</li>\n  <li>Same question for conductivity.</li>\n  <li>Do burnt areas (SURF_HA) differ between forest and rangeland? Choose the test after looking at the distribution.</li>\n</ol>"
 },
 "r5-l3": {
  "titre": "Correlation and linear regression",
  "duree": "35 min",
  "objectifs": [
   "Measure and test a correlation (Pearson, Spearman)",
   "Fit a linear model with lm() and read summary()",
   "Check the residuals and make a prediction"
  ],
  "contenu": "\n<p>Are nitrates lower in deep boreholes? We measure the link with the <b>correlation coefficient</b> r (from −1 to 1), then model it with a <b>regression line</b>.</p>\n<!--code:0-->\n<p>Reading <code>summary(modele)</code>:</p>\n<ul>\n  <li><b>Estimate</b> of PROF_M: change in nitrates for 1 m more depth (negative here);</li>\n  <li><b>Pr(&gt;|t|)</b>: p-value of the slope;</li>\n  <li><b>R²</b> (<i>Multiple R-squared</i>): share of variability explained by depth.</li>\n</ul>\n<!--code:1-->\n<div class=\"astuce\"><b>Correlation is not causation:</b> depth does not “remove” nitrates; deep aquifers are simply better protected from fertilisers spread at the surface.</div>",
  "exercice": "<ol>\n  <li>Compute the correlation between conductivity and depth. Is it significant?</li>\n  <li>Fit the model <code>NITRATES_MGL ~ PROF_M</code> for low water and compare the slope with high water.</li>\n  <li>Predict the nitrate content of a new 120 m borehole and give the prediction interval.</li>\n</ol>"
 },
 "r5-l4": {
  "titre": "Trends in climate series",
  "duree": "30 min",
  "objectifs": [
   "Build an annual series from monthly data",
   "Test a trend with the Mann-Kendall test",
   "Estimate the slope of a trend and plot it"
  ],
  "contenu": "\n<p>Is rainfall decreasing over the basin? First build the series of annual totals, then test the trend. The <b>Mann-Kendall test</b>, widely used in hydroclimatology, is a Kendall rank correlation test between the variable and time.</p>\n<!--code:0--><!--code:1-->\n<p>A useful indicator for droughts: the <b>rainfall index</b> (deviation from the mean divided by the standard deviation).</p>\n<!--code:2-->\n<div class=\"astuce\">Fifteen years is a short series: a non-significant result does not prove there is no trend. The <code>trend</code> package also offers <code>mk.test()</code> and Sen's slope (<code>sens.slope()</code>). Full script: <code>scripts/05_statistiques.R</code>.</div>",
  "exercice": "<ol>\n  <li>Test the trend of the mean annual temperature (TMOY_C). How many °C per decade?</li>\n  <li>Run the Mann-Kendall test station by station: are the conclusions the same?</li>\n  <li>Plot the rainfall index as coloured bars (blue surplus, orange deficit).</li>\n</ol>"
 },
 "r6": {
  "titre": "Programming with R",
  "resume": "Conditions, loops, writing functions and automation: apply a processing step to every station and produce plots in batch.",
  "quiz": [
   {
    "question": "Which function suits classifying ALL the values of a column?",
    "choix": [
     "stop",
     "while",
     "if",
     "ifelse or case_when"
    ],
    "explication": "if only handles a single logical value."
   },
   {
    "question": "What does an R function return?",
    "choix": [
     "Always a list",
     "Nothing",
     "A plot",
     "The value of the last evaluated expression (or return())"
    ],
    "explication": "The last evaluated expression is returned."
   },
   {
    "question": "What is stop() for in a function?",
    "choix": [
     "Leaving a loop without error",
     "Pausing",
     "Stopping R",
     "Interrupting the function with a clear error message"
    ],
    "explication": "stop() signals an invalid input."
   },
   {
    "question": "What does sapply(list, f) do?",
    "choix": [
     "Applies f to each element and simplifies the result to a vector",
     "Removes NAs",
     "Sorts the list",
     "Creates an infinite loop"
    ],
    "explication": "sapply = lapply + simplification."
   },
   {
    "question": "How do you reuse functions written in another file?",
    "choix": [
     "load()",
     "library(\"mes_fonctions.R\")",
     "source(\"scripts/mes_fonctions.R\")",
     "install.packages()"
    ],
    "explication": "source() runs the file and creates the functions."
   }
  ]
 },
 "r6-l1": {
  "titre": "Conditions and loops",
  "duree": "30 min",
  "objectifs": [
   "Write an if / else condition",
   "Use ifelse and case_when on vectors",
   "Repeat a task with for and while"
  ],
  "contenu": "\n<p>First load the packages and tables used throughout the level:</p>\n<!--code:0-->\n<h4>The if / else condition</h4>\n<!--code:1-->\n<p><code>if</code> handles only <b>one</b> value. For a vector or a column, use <code>ifelse()</code> or <code>case_when()</code>:</p>\n<!--code:2-->\n<h4>The for loop</h4>\n<!--code:3-->\n<h4>The while loop</h4>\n<!--code:4-->\n<div class=\"astuce\"><b>Loop or vectorised computing?</b> In R, prefer vectorised functions and dplyr when possible; keep loops for repeating heavy tasks (reading files, producing maps).</div>",
  "exercice": "<ol>\n  <li>Write a condition that prints “Drinkable” or “Not drinkable” depending on a nitrate value.</li>\n  <li>With <code>case_when</code>, classify all values of <code>qualite$NITRATES_MGL</code> into three classes.</li>\n  <li>With a <code>for</code> loop, print for each year 2010-2024 the total rainfall of station S02.</li>\n</ol>"
 },
 "r6-l2": {
  "titre": "Writing your own functions",
  "duree": "30 min",
  "objectifs": [
   "Define a function with arguments and a return value",
   "Check inputs with stop()",
   "Document and reuse your functions"
  ],
  "contenu": "\n<p>As soon as you copy-paste a computation three times, write a <b>function</b>. Example: the De Martonne aridity index, I = P / (T + 10).</p>\n<!--code:0-->\n<p>A function can have <b>default values</b> and return a list:</p>\n<!--code:1-->\n<div class=\"astuce\">Keep your functions in a file <code>scripts/mes_fonctions.R</code> and load them in each script with <code>source(\"scripts/mes_fonctions.R\")</code>.</div>",
  "exercice": "<ol>\n  <li>Write <code>gravelius(perimetre_km, surface_km2)</code> returning the compactness index Kc = 0.28 × P / √A.</li>\n  <li>Write <code>densite(pop, surface)</code> that refuses a zero or negative area with <code>stop()</code>.</li>\n  <li>Put them in <code>mes_fonctions.R</code> and use them from another script with <code>source()</code>.</li>\n</ol>"
 },
 "r6-l3": {
  "titre": "Automate: apply and produce in batch",
  "duree": "35 min",
  "objectifs": [
   "Apply a function to each element with sapply, lapply and vapply",
   "Produce and save one plot per station",
   "Process all the files of a folder"
  ],
  "contenu": "<!--code:0-->\n<h4>One plot per station, saved automatically</h4>\n<!--code:1-->\n<h4>Read all the CSVs of a folder</h4>\n<!--code:2-->\n<div class=\"astuce\">This is the same logic as ModelBuilder iterators or ArcPy loops, but in a few lines. Full script: <code>scripts/06_fonctions_boucles.R</code>.</div>",
  "exercice": "<ol>\n  <li>Run <code>scripts/06_fonctions_boucles.R</code> and open the <code>sorties/graphiques</code> folder.</li>\n  <li>Modify the function to add the number of dry months to the title.</li>\n  <li>Write a loop that exports one rainfall CSV per station (<code>pluie_S01.csv</code>, …).</li>\n</ol>"
 },
 "r7": {
  "titre": "Vector data and mapping with sf",
  "resume": "Read shapefiles and GeoPackages, coordinate systems and reprojection, points from XY coordinates, geoprocessing (buffer, intersection, spatial join, distances) and thematic maps with ggplot2.",
  "quiz": [
   {
    "question": "What is an sf object?",
    "choix": [
     "A data frame with a geometry column",
     "A raster",
     "An Excel file",
     "An image"
    ],
    "explication": "Attributes are ordinary columns, the geometry is in the geometry column."
   },
   {
    "question": "What is the EPSG code of WGS 84 / UTM zone 30N?",
    "choix": [
     "32631",
     "4326",
     "3857",
     "32630"
    ],
    "explication": "4326 = geographic WGS 84; 32630 = UTM 30N."
   },
   {
    "question": "Which function CONVERTS coordinates into another system?",
    "choix": [
     "st_as_sf()",
     "st_crs()",
     "st_set_crs()",
     "st_transform()"
    ],
    "explication": "st_set_crs only declares the system, without changing coordinates."
   },
   {
    "question": "How do you create points from a table with X and Y columns?",
    "choix": [
     "st_as_sf(tableau, coords = c(\"X\", \"Y\"), crs = 32630)",
     "st_read()",
     "st_buffer()",
     "plot(X, Y)"
    ],
    "explication": "st_as_sf converts a data frame into a point layer."
   },
   {
    "question": "Which function performs a spatial join?",
    "choix": [
     "st_union()",
     "merge()",
     "left_join()",
     "st_join()"
    ],
    "explication": "left_join joins by an attribute key, st_join by location."
   },
   {
    "question": "In a map ggplot, which layer should be added first?",
    "choix": [
     "The legend",
     "The labels",
     "The background polygons",
     "The points"
    ],
    "explication": "Layers stack up: the first one is drawn underneath."
   }
  ]
 },
 "r7-l1": {
  "titre": "Reading and exploring vector layers",
  "duree": "30 min",
  "objectifs": [
   "Read a shapefile and a GeoPackage layer with st_read",
   "Understand the sf object: a data frame with a geometry column",
   "Display a layer quickly"
  ],
  "contenu": "\n<p>The <code>sf</code> package (<i>simple features</i>) reads common GIS formats (shapefile, GeoPackage, GeoJSON, KML…). A layer becomes an ordinary <b>data frame</b> with a special <code>geometry</code> column: everything you learned about dplyr applies.</p>\n<!--code:0--><!--code:1-->\n<div class=\"astuce\"><b>GeoPackage or shapefile?</b> A GeoPackage (<code>.gpkg</code>) is a single file holding several layers, without the 10-character field-name limit or separate .shx/.dbf/.prj files. It is the recommended format to exchange with QGIS and ArcGIS Pro.</div>",
  "exercice": "<ol>\n  <li>Read all the layers of <code>tamda.gpkg</code> and note for each its geometry type and number of features.</li>\n  <li>Display municipalities, roads and schools on the same quick map.</li>\n  <li>With dplyr, keep the urban municipalities (<code>TYPE == \"Urbain\"</code>) and show them in red.</li>\n</ol>"
 },
 "r7-l2": {
  "titre": "Coordinate systems and XY points",
  "duree": "30 min",
  "objectifs": [
   "Read and set the coordinate system (st_crs, st_set_crs)",
   "Reproject a layer with st_transform",
   "Create a point layer from an XY table with st_as_sf"
  ],
  "contenu": "\n<p>The basin data are in <b>WGS 84 / UTM zone 30N</b> (EPSG code <b>32630</b>), the metric system suited to western Algeria. GPS receivers give longitudes/latitudes in <b>WGS 84</b> (EPSG <b>4326</b>). Old INCT maps use <b>Nord Sahara 1959</b>.</p>\n<!--code:0-->\n<h4>Points from a table of coordinates</h4>\n<!--code:1-->\n<div class=\"astuce\"><b>Do not confuse</b> <code>st_set_crs()</code> (you <i>declare</i> the system of a layer that has none, like “Define Projection”) and <code>st_transform()</code> (you <i>convert</i> the coordinates, like “Project”). Mind the order too: <code>coords = c(\"LON\", \"LAT\")</code>, longitude first.</div>",
  "exercice": "<ol>\n  <li>Reproject the municipalities to WGS 84 and check that longitudes are close to −1.4°.</li>\n  <li>Create the weather station layer from <code>stations_meteo.csv</code> and overlay it on the municipalities.</li>\n  <li>Compute the distance (km) between each station and station S01 with <code>st_distance</code>.</li>\n</ol>"
 },
 "r7-l3": {
  "titre": "Vector geoprocessing",
  "duree": "40 min",
  "objectifs": [
   "Compute areas, lengths and distances",
   "Create buffers and intersections",
   "Perform a spatial join and count points per polygon"
  ],
  "contenu": "\n<p>The tools of a GIS “Analysis” toolbox exist in sf as <code>st_...</code> functions.</p>\n<!--code:0-->\n<table class=\"list\"><tr><th>GIS tool</th><th>sf function</th></tr>\n<tr><td>Buffer</td><td><code>st_buffer()</code></td></tr>\n<tr><td>Intersect</td><td><code>st_intersection()</code></td></tr>\n<tr><td>Dissolve</td><td><code>st_union()</code> or <code>group_by() |&gt; summarise()</code></td></tr>\n<tr><td>Clip</td><td><code>st_intersection()</code> or <code>st_crop()</code></td></tr>\n<tr><td>Spatial join</td><td><code>st_join()</code></td></tr>\n<tr><td>Select by location</td><td><code>st_filter()</code>, <code>st_intersects()</code></td></tr>\n<tr><td>Centroids</td><td><code>st_centroid()</code></td></tr></table>",
  "exercice": "<ol>\n  <li>How many schools are less than 500 m from a wadi? Which ones?</li>\n  <li>Compute for each municipality the number of schools and the total number of pupils (spatial join + summarise).</li>\n  <li>What share (%) of each municipality is covered by forest?</li>\n</ol>"
 },
 "r7-l4": {
  "titre": "Thematic maps with ggplot2",
  "duree": "40 min",
  "objectifs": [
   "Draw sf layers with geom_sf",
   "Make a choropleth map with labels and legend",
   "Export the map and the result layer"
  ],
  "contenu": "\n<p><code>geom_sf()</code> draws an sf layer in a ggplot: layers are stacked as in the table of contents of a GIS, from the “lowest” to the “highest”.</p>\n<!--code:0-->\n<p>For classes rather than a continuous gradient, cut the variable with <code>cut()</code> and use <code>scale_fill_brewer()</code>:</p>\n<!--code:1-->\n<div class=\"astuce\">For a scale bar and a north arrow, install the <code>ggspatial</code> package: <code>annotation_scale()</code> and <code>annotation_north_arrow()</code>. For interactive maps, try <code>mapview</code> or <code>leaflet</code>. Full script: <code>scripts/07_vecteur_sf.R</code>.</div>",
  "exercice": "<ol>\n  <li>Map the 2008-2020 growth rate by municipality in 4 classes.</li>\n  <li>Add the schools with a size proportional to the number of pupils.</li>\n  <li>Export the map as a 300 dpi PNG and the layer <code>communes_stats.gpkg</code>; open the latter in QGIS or ArcGIS.</li>\n</ol>"
 },
 "r8": {
  "titre": "Rasters, DEMs and natural hazards with terra",
  "resume": "Read and analyse a DEM with terra: slope, aspect, hillshade, reclassification, zonal statistics, then susceptibility maps for floods, forest fires and landslides by multi-criteria analysis.",
  "quiz": [
   {
    "question": "Which function reads a raster with terra?",
    "choix": [
     "rast()",
     "read.csv()",
     "raster.read()",
     "st_read()"
    ],
    "explication": "rast() reads GeoTIFF, ASCII and most raster formats."
   },
   {
    "question": "Which function computes the slope of a DEM?",
    "choix": [
     "slope(mnt)",
     "global(mnt)",
     "terrain(mnt, v = \"slope\")",
     "classify(mnt)"
    ],
    "explication": "terrain() computes slope, aspect, roughness…"
   },
   {
    "question": "What is classify() for?",
    "choix": [
     "Reclassifying raster values into intervals",
     "Clipping",
     "Reprojecting",
     "Reading a file"
    ],
    "explication": "It is the equivalent of the Reclassify tool."
   },
   {
    "question": "What does zonal(mnt, zones, fun = \"mean\") do?",
    "choix": [
     "Creates buffers",
     "Clips the DEM",
     "Smooths the DEM",
     "Computes the mean altitude of each zone"
    ],
    "explication": "Zonal statistics: one value per zone."
   },
   {
    "question": "In a multi-criteria analysis, what do the weights add up to?",
    "choix": [
     "100% (or 1)",
     "The number of criteria",
     "5",
     "It does not matter"
    ],
    "explication": "The weights share 100% of the importance."
   },
   {
    "question": "How do you check that a fire susceptibility map is consistent?",
    "choix": [
     "It is not possible",
     "By checking that observed fires fall mostly in the high classes",
     "By increasing the resolution",
     "By changing the colours"
    ],
    "explication": "The map is compared with observed events (validation)."
   }
  ]
 },
 "r8-l1": {
  "titre": "Reading and describing a raster",
  "duree": "30 min",
  "objectifs": [
   "Read a DEM with rast() and describe its resolution, extent and CRS",
   "Compute global statistics and a histogram",
   "Use the raster calculator"
  ],
  "contenu": "\n<p>The <code>terra</code> package handles rasters (DEMs, satellite images, hazard maps). A raster is a grid of cells; each cell holds a value (here an altitude in metres).</p>\n<!--code:0-->\n<h4>Raster calculator</h4>\n<p>Operations apply to every cell, like the “Raster Calculator” of a GIS:</p>\n<!--code:1-->\n<div class=\"astuce\"><b>sf or terra for vectors?</b> terra has its own vector format (<code>vect()</code>), faster for exchanges with rasters. Convert with <code>vect(sf_object)</code> and <code>sf::st_as_sf(terra_object)</code>.</div>",
  "exercice": "<ol>\n  <li>What are the minimum, maximum and mean altitudes of the basin? What area (km²) lies above 800 m? (hint: <code>global(haut, \"sum\") * 50 * 50 / 1e6</code>)</li>\n  <li>Clip the DEM to the municipality of Taourirt Nath and give its mean altitude.</li>\n  <li>Save the altitude-zone raster with <code>writeRaster()</code> in <code>sorties/</code>.</li>\n</ol>"
 },
 "r8-l2": {
  "titre": "Terrain analysis: slope, aspect, hillshade",
  "duree": "35 min",
  "objectifs": [
   "Compute slope, aspect and hillshade with terrain() and shade()",
   "Reclassify slope into classes with classify()",
   "Extract raster values at points and by municipality"
  ],
  "contenu": "<!--code:0-->\n<h4>Reclassification</h4>\n<p><code>classify()</code> takes a “from, to, new value” matrix:</p>\n<!--code:1-->\n<h4>Extract and summarise</h4>\n<!--code:2-->\n<div class=\"astuce\">Full script: <code>scripts/08_raster_terra.R</code>. Rasters written as GeoTIFF open directly in ArcGIS and QGIS.</div>",
  "exercice": "<ol>\n  <li>Compute the share (%) of the basin in each slope class.</li>\n  <li>Reclassify aspect into 4 classes (North, East, South, West) and map it.</li>\n  <li>Which municipality has the steepest mean slope? Are boreholes in service on gentler slopes?</li>\n</ol>"
 },
 "r8-l3": {
  "titre": "Flooding: distance and height above the wadi",
  "duree": "40 min",
  "objectifs": [
   "Compute a raster distance to wadis",
   "Approximate the height above the nearest stream (simplified HAND)",
   "Combine criteria scored 1 to 5 with weights"
  ],
  "contenu": "\n<p>A simple flood susceptibility method combines criteria scored from 1 (low) to 5 (high) and weighted: <b>distance to the wadi</b> (35%), <b>height above the nearest wadi</b> (25%), <b>slope</b> (20%) and <b>land cover</b> (20%). The weights are given in <code>tables/poids_multicritere.csv</code>.</p>\n<!--code:0-->\n<h4>Score each criterion from 1 to 5</h4>\n<!--code:1-->\n<div class=\"astuce\"><b>Validate:</b> the observed flood marks (<code>laisses_crues</code>) should fall in the high classes: <code>extract(inond, vect(\"donnees/tamda.gpkg\", layer = \"laisses_crues\"))</code>. For real hydrology (fill, flow direction and accumulation), use the <code>whitebox</code> package or the hydrology tools of ArcGIS / GRASS.</div>",
  "exercice": "<ol>\n  <li>Reproduce the flood susceptibility map.</li>\n  <li>Change the weights (for example 50% for distance): do the high zones change a lot?</li>\n  <li>How many flood marks fall in the 20% most susceptible cells?</li>\n</ol>"
 },
 "r8-l4": {
  "titre": "Fires, landslides and multi-hazard synthesis",
  "duree": "45 min",
  "objectifs": [
   "Build forest fire and landslide susceptibility maps",
   "Classify into 5 levels and validate with observed events",
   "Produce a multi-hazard synthesis and a summary by municipality"
  ],
  "contenu": "\n<p>The same method is applied with other criteria (<b>fictional</b> data: this is a method exercise, not a real risk assessment).</p>\n<!--code:0-->\n<h4>Classify, validate, synthesise</h4>\n<!--code:1-->\n<div class=\"astuce\">If the method is sound, most observed fires and landslides fall in classes 4 and 5. Full script, tested on the practical data: <code>scripts/09_risques_multicritere.R</code>.</div>",
  "exercice": "<ol>\n  <li>Run <code>scripts/09_risques_multicritere.R</code> and comment on the validation: what share of fires falls in classes 4-5?</li>\n  <li>Which municipality has the largest share of its territory in class 5 (synthesis)? Suggest two prevention measures.</li>\n  <li>Make a board of three maps (flood, fires, landslides) with ggplot2 (hint: <code>as.data.frame(cartes, xy = TRUE)</code> and <code>geom_raster()</code>), exported as PNG.</li>\n</ol>"
 }
});
