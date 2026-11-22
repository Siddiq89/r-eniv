/* Traduction en du parcours Biodiversité (générée par generateur/gen_trad_bio.py). Le code R reste celui de la version française (<!--code:N-->). */
window.TRAD = window.TRAD || {};
window.TRAD.en = Object.assign(window.TRAD.en || {}, {
 "bio": {
  "nom": "Biodiversity",
  "accroche": "Quantitative ecology with R: from open data to Bayesian models",
  "lead": "An advanced course in modern quantitative ecology methods with R, built on open data sources (GBIF, OBIS, WorldClim, Copernicus, MODIS): remote sensing and NDVI time series, beta diversity and neutrality, multiplex ecological networks, explainable machine learning, occupancy models with imperfect detection, environmental DNA, joint species distribution models (JSDM), and Bayesian multi-species and spatio-temporal models. Practical data are fictitious but realistic, in the Tlemcen area."
 },
 "b1": {
  "titre": "Online biodiversity data",
  "resume": "Download species occurrences (GBIF, OBIS), climate variables (WorldClim, CHELSA) and satellite images (Copernicus, MODIS) from R, then clean, filter and rasterise the occurrences.",
  "quiz": [
   {
    "question": "Which database gathers species occurrences from all over the world and gives a DOI for each download?",
    "choix": [
     "OpenStreetMap",
     "GBIF",
     "MODIS",
     "WorldClim"
    ],
    "explication": "GBIF (Global Biodiversity Information Facility) aggregates occurrences; occ_download() provides a DOI to cite."
   },
   {
    "question": "Why remove points with coordinates (0, 0)?",
    "choix": [
     "They are almost always badly coded missing values",
     "They are too precise",
     "GBIF forbids them",
     "They are in the Indian Ocean"
    ],
    "explication": "The point (0, 0) is in the Gulf of Guinea: it is usually missing coordinates recorded as 0."
   },
   {
    "question": "“Thinning” on a 1 km grid is used to…",
    "choix": [
     "increase the number of occurrences",
     "change the coordinate system",
     "reduce sampling bias by keeping one occurrence per species and per cell",
     "compute NDVI"
    ],
    "explication": "Heavily surveyed areas (roads, towns) weigh less after thinning."
   },
   {
    "question": "Which R package downloads the WorldClim bioclimatic variables?",
    "choix": [
     "ggplot2",
     "readxl",
     "dplyr",
     "geodata"
    ],
    "explication": "geodata::worldclim_country() or worldclim_global()."
   }
  ]
 },
 "b1-l1": {
  "titre": "Find and download open data",
  "duree": "35 min",
  "objectifs": [
   "Know the main open databases on biodiversity and the environment",
   "Query GBIF and OBIS from R with rgbif and robis",
   "Download WorldClim climate variables with geodata"
  ],
  "contenu": "\n<p>Modern quantitative ecology methods (occupancy models, JSDM, Bayesian models) need species <b>observation data</b> and <b>environmental variables</b>. Much of it is now <b>open</b> and directly accessible from R.</p>\n<table class=\"tab\">\n<tr><th>Source</th><th>Content</th><th>R package</th></tr>\n<tr><td><a href=\"https://www.gbif.org\" target=\"_blank\" rel=\"noopener\">GBIF</a></td><td>Over 2 billion species occurrences (museums, surveys, citizen science), including Algeria</td><td><code>rgbif</code></td></tr>\n<tr><td><a href=\"https://obis.org\" target=\"_blank\" rel=\"noopener\">OBIS</a></td><td>Marine biodiversity (Oran coast, Gulf of Arzew, Ghazaouet)</td><td><code>robis</code></td></tr>\n<tr><td><a href=\"https://www.worldclim.org\" target=\"_blank\" rel=\"noopener\">WorldClim</a> / <a href=\"https://chelsa-climate.org\" target=\"_blank\" rel=\"noopener\">CHELSA</a></td><td>Current and future climate (19 bioclimatic variables, 30 s ≈ 1 km)</td><td><code>geodata</code></td></tr>\n<tr><td><a href=\"https://esa-worldcover.org\" target=\"_blank\" rel=\"noopener\">ESA WorldCover</a> / <a href=\"https://land.copernicus.eu\" target=\"_blank\" rel=\"noopener\">Copernicus Land</a></td><td>Land cover at 10 m, vegetation indices</td><td><code>geodata</code>, <code>terra</code></td></tr>\n<tr><td><a href=\"https://modis.ornl.gov\" target=\"_blank\" rel=\"noopener\">MODIS (ORNL DAAC)</a></td><td>250 m NDVI every 16 days since 2000 (MOD13Q1 product)</td><td><code>MODISTools</code></td></tr>\n<tr><td><a href=\"https://www.iucnredlist.org\" target=\"_blank\" rel=\"noopener\">IUCN Red List</a></td><td>Threat status of species</td><td><code>rredlist</code></td></tr>\n</table>\n<p>The principle is always the same: describe <b>what</b> (species, variable), <b>where</b> (country, extent) and <b>when</b> (years), and the package queries the website's API.</p><!--code:0--><div class=\"astuce\"><b>Practical data:</b> the files in <code>donnees/biodiversite/</code> are <b>fictitious</b> (simulated values for the Oued Tamda basin, UTM 30N) but the species names are real. The “online” code of this lesson (<code>EN_LIGNE &lt;- TRUE</code>) downloads the real data; it needs an Internet connection and could not be run from our test server: check it in the computer room.</div>\n<p>Without a connection, we work on the simulated export <code>occurrences_gbif_simulees.csv</code>, which has <b>exactly the same columns</b> as a GBIF export: the rest of the code therefore works identically on real data.</p><!--code:1-->",
  "exercice": "<ol>\n  <li>On <a href=\"https://www.gbif.org/occurrence/search?country=DZ\" target=\"_blank\" rel=\"noopener\">gbif.org</a>, search for <i>Tetraclinis articulata</i> in Algeria: how many occurrences have coordinates?</li>\n  <li>In R, load <code>occurrences_gbif_simulees.csv</code> and count occurrences per species and per decade (<code>year %/% 10 * 10</code>).</li>\n  <li>What proportion of occurrences has no coordinate uncertainty recorded?</li>\n</ol>"
 },
 "b1-l2": {
  "titre": "Clean, filter and rasterise occurrences",
  "duree": "40 min",
  "objectifs": [
   "Spot the classic errors of occurrence data (null or inverted coordinates, duplicates)",
   "Filter by spatial uncertainty and type of record",
   "Reduce sampling bias with a grid (thinning) and produce a richness map"
  ],
  "contenu": "\n<p>Open data are valuable but <b>raw</b>. Before any modelling, apply a reproducible cleaning chain:</p>\n<ul>\n  <li><b>missing</b> coordinates or coordinates equal to <b>(0, 0)</b>;</li>\n  <li><b>inverted sign</b> of the longitude (point falling outside the area);</li>\n  <li><b>duplicates</b> (same species, same coordinates, same date);</li>\n  <li><b>uncertainty</b> too large for the resolution of the analysis (here &gt; 1,000 m);</li>\n  <li>old specimens or fossils depending on the question.</li>\n</ul><!--code:0-->\n<p>Observations often concentrate near roads and towns: this is <b>sampling bias</b>. A simple remedy is to keep <b>a single occurrence per species and per cell</b> (here 1 km).</p><!--code:1-->",
  "exercice": "<ol>\n  <li>How many occurrences are removed at each filtering step? Make a small table.</li>\n  <li>Redo the thinning with a 2 km cell: how many occurrences remain?</li>\n  <li>Export the clean occurrences to GeoPackage (<code>st_write</code>) and open them in QGIS or ArcGIS.</li>\n</ol>"
 },
 "b2": {
  "titre": "Ecological remote sensing and time series",
  "resume": "Analyse an annual NDVI series (2010-2024): per-pixel trend, Mann-Kendall test, disturbance detection, then measure the fragmentation of forest cover between two dates.",
  "quiz": [
   {
    "question": "NDVI is computed with…",
    "choix": [
     "near infrared and red",
     "blue and green",
     "temperature and rainfall",
     "elevation and slope"
    ],
    "explication": "NDVI = (NIR − R) / (NIR + R)."
   },
   {
    "question": "Which terra function applies a function to the time series of each pixel?",
    "choix": [
     "crop()",
     "freq()",
     "app()",
     "patches()"
    ],
    "explication": "app() goes through the cells and applies the function to the layer values."
   },
   {
    "question": "The Mann-Kendall test is popular in remote sensing because it…",
    "choix": [
     "only works with Sentinel-2",
     "requires normal data",
     "computes NDVI",
     "is non-parametric and robust to outliers"
    ],
    "explication": "It relies on the ranks of the values (Kendall's tau)."
   },
   {
    "question": "A more fragmented forest usually has…",
    "choix": [
     "a single large patch",
     "fewer patches and less edge",
     "a higher NDVI",
     "more patches and more edge"
    ],
    "explication": "Fragmentation increases the number of patches and edge density."
   }
  ]
 },
 "b2-l1": {
  "titre": "NDVI time series and trends",
  "duree": "40 min",
  "objectifs": [
   "Understand NDVI and free satellite products (MODIS, Sentinel-2, Landsat)",
   "Compute a per-pixel trend with terra::app()",
   "Test the significance of a trend (Mann-Kendall) and detect a disturbance"
  ],
  "contenu": "\n<p><b>NDVI</b> (normalised difference vegetation index) is computed from red and near infrared: <code>NDVI = (NIR − R) / (NIR + R)</code>. It ranges from −1 to 1; bare soil is around 0.1, dense maquis 0.5 to 0.7. Free series exist: <a href=\"https://lpdaac.usgs.gov/products/mod13q1v061/\" target=\"_blank\" rel=\"noopener\">MODIS MOD13Q1</a> (250 m, since 2000), <a href=\"https://dataspace.copernicus.eu\" target=\"_blank\" rel=\"noopener\">Sentinel-2</a> (10 m, since 2015) and Landsat (30 m, since 1984).</p><!--code:0--><div class=\"astuce\"><b>Practical data:</b> the files in <code>donnees/biodiversite/</code> are <b>fictitious</b> (simulated values for the Oued Tamda basin, UTM 30N) but the species names are real. The “online” code of this lesson (<code>EN_LIGNE &lt;- TRUE</code>) downloads the real data; it needs an Internet connection and could not be run from our test server: check it in the computer room.</div>\n<h4>Per-pixel trend</h4>\n<p><code>app()</code> applies a function to the time series of <b>each pixel</b>. We compute the slope of a linear regression (NDVI units per year) and <b>Kendall's tau</b>, the basis of the non-parametric <b>Mann-Kendall</b> test, robust to outliers.</p><!--code:1-->",
  "exercice": "<ol>\n  <li>What share of the area shows a significant decrease in NDVI? an increase?</li>\n  <li>Which year corresponds to the south-east disturbance? Suggest an explanation (fire, clearing…).</li>\n  <li>Compute the mean trend per municipality with <code>zonal()</code> and the <code>communes</code> layer.</li>\n</ol>"
 },
 "b2-l2": {
  "titre": "Fragmentation of forest cover",
  "duree": "35 min",
  "objectifs": [
   "Compare two forest maps and compute a change matrix",
   "Identify forest patches and compute landscape metrics",
   "Interpret fragmentation for biodiversity"
  ],
  "contenu": "\n<p><b>Fragmentation</b> breaks a continuous habitat into smaller, more isolated patches: forest interior shrinks and edges increase. Landscape ecology measures it with <b>metrics</b>: number of patches, mean area, largest patch, edge density. The <a href=\"https://r-spatialecology.github.io/landscapemetrics/\" target=\"_blank\" rel=\"noopener\">landscapemetrics</a> package computes more than 100; here we compute the main ones ourselves with <code>terra</code> to understand them well.</p><!--code:0-->",
  "exercice": "<ol>\n  <li>Has the forest area increased or decreased? And the number of patches?</li>\n  <li>A forest can gain area while fragmenting locally: check it by keeping only the south-east quarter (<code>crop()</code>).</li>\n  <li>With Internet access, install <code>landscapemetrics</code> and compare with <code>lsm_c_np()</code>, <code>lsm_c_ed()</code> and <code>lsm_c_lpi()</code>.</li>\n</ol>"
 },
 "b3": {
  "titre": "Beta diversity and neutrality",
  "resume": "Measure alpha, beta and gamma diversity, partition beta diversity into turnover and nestedness, then compare communities with null and neutral models.",
  "quiz": [
   {
    "question": "Gamma diversity corresponds to…",
    "choix": [
     "the difference between two plots",
     "the Simpson index",
     "the diversity of a single plot",
     "the diversity of the whole region"
    ],
    "explication": "Gamma = regional scale; alpha = local; beta = the difference between the two."
   },
   {
    "question": "In Baselga's partitioning, βsim measures…",
    "choix": [
     "species replacement (turnover)",
     "total richness",
     "mean abundance",
     "nestedness"
    ],
    "explication": "βsim = min(b, c) / (a + min(b, c)) is the turnover component."
   },
   {
    "question": "According to Hubbell's neutral theory, species…",
    "choix": [
     "are ranked by size",
     "all occupy a different niche",
     "are ecologically equivalent and composition changes by drift",
     "never migrate"
    ],
    "explication": "It is a null hypothesis for community structure."
   },
   {
    "question": "What does vegan's oecosimu() do?",
    "choix": [
     "draws a map",
     "compares an observed statistic with its distribution under a null model",
     "downloads occurrences",
     "computes NDVI"
    ],
    "explication": "It permutes the matrix with a null algorithm and computes a p-value."
   }
  ]
 },
 "b3-l1": {
  "titre": "Alpha, beta, gamma diversity and Baselga's partitioning",
  "duree": "40 min",
  "objectifs": [
   "Compute richness, Shannon and Simpson indices with vegan",
   "Distinguish alpha, beta and gamma diversity",
   "Partition beta diversity into turnover and nestedness"
  ],
  "contenu": "\n<p>Whittaker distinguishes three scales: <b>alpha diversity</b> (within a plot), <b>gamma diversity</b> (in the whole region) and <b>beta diversity</b> (the difference in composition between plots). The file <code>communautes_plantes.csv</code> contains 30 vegetation plots in three zones (foothill, slope, summit) along the elevation gradient.</p><!--code:0-->\n<h4>Turnover or nestedness?</h4>\n<p>Two communities can differ because species <b>replace</b> each other (turnover) or because the poorer one is a <b>subset</b> of the richer one (nestedness). With <i>a</i> shared species and <i>b</i> and <i>c</i> species unique to each plot, Baselga (2010) proposes:</p>\n<ul>\n  <li>β<sub>sor</sub> = (b + c) / (2a + b + c): total Sørensen dissimilarity;</li>\n  <li>β<sub>sim</sub> = min(b, c) / (a + min(b, c)): part due to <b>turnover</b>;</li>\n  <li>β<sub>sne</sub> = β<sub>sor</sub> − β<sub>sim</sub>: part due to <b>nestedness</b>.</li>\n</ul>\n<p>The <a href=\"https://cran.r-project.org/package=betapart\" target=\"_blank\" rel=\"noopener\">betapart</a> package does this (<code>beta.pair()</code>, <code>beta.multi()</code>); here is the “by hand” version, useful to understand.</p><!--code:1-->",
  "exercice": "<ol>\n  <li>Which zone has the highest Shannon diversity?</li>\n  <li>Between different zones, does dissimilarity come mainly from turnover or from nestedness? Interpret with the elevation gradient.</li>\n  <li>Try <code>betadisper()</code> to check whether the dispersion of plots differs between zones.</li>\n</ol>"
 },
 "b3-l2": {
  "titre": "Null models and neutral theory",
  "duree": "35 min",
  "objectifs": [
   "Fit species abundance distributions (Fisher's log-series, Preston's lognormal, radfit)",
   "Test community structure against a null model",
   "Simulate a neutral community (ecological drift) and compare it with the data"
  ],
  "contenu": "\n<p>Hubbell's <b>neutral theory</b> (2001) assumes that all species are ecologically equivalent: composition changes only through <b>drift</b> (random births and deaths), immigration and speciation. It is a <b>null hypothesis</b>: if the data depart from it, the niche (elevation, climate) plays a role. We start with the classic abundance distributions.</p><!--code:0-->\n<h4>A small neutral simulation</h4>\n<p>We simulate a local community of fixed size <i>J</i>: at each step, an individual dies and is replaced by the offspring of a local individual (probability 1 − <i>m</i>) or by an immigrant drawn from the regional pool (probability <i>m</i>).</p><!--code:1-->",
  "exercice": "<ol>\n  <li>Which <code>radfit</code> model has the lowest AIC?</li>\n  <li>Vary immigration <code>m</code> (0.01; 0.1; 0.5): how does the mean dissimilarity of neutral communities change?</li>\n  <li>Conclude: is the observed structure compatible with neutrality or dominated by the niche (elevation)?</li>\n</ol>"
 },
 "b4": {
  "titre": "Multiplex ecological networks",
  "resume": "Build plant-pollinator and plant-herbivore interaction networks, compute connectance, nestedness and modularity, assemble a multiplex network and simulate extinction cascades.",
  "quiz": [
   {
    "question": "A plant-pollinator network is a…",
    "choix": [
     "bipartite graph",
     "directed acyclic graph",
     "complete graph",
     "planar graph"
    ],
    "explication": "Links only connect plants to animals: two distinct groups."
   },
   {
    "question": "The connectance of a network is…",
    "choix": [
     "the maximum degree",
     "the number of species",
     "the proportion of possible interactions that are realised",
     "the length of the longest path"
    ],
    "explication": "Connectance = realised links / (number of plants × number of animals)."
   },
   {
    "question": "A multiplex network…",
    "choix": [
     "contains only one species",
     "overlays several types of interactions among the same species",
     "replaces GBIF data",
     "is always random"
    ],
    "explication": "Each layer is a type of interaction (pollination, herbivory…)."
   },
   {
    "question": "In an extinction simulation, robustness is lower when we first remove…",
    "choix": [
     "the least connected plants",
     "no species",
     "the most connected plants",
     "the animals"
    ],
    "explication": "Highly connected species support many partners."
   }
  ]
 },
 "b4-l1": {
  "titre": "Bipartite interaction networks",
  "duree": "35 min",
  "objectifs": [
   "Turn an interaction table into a matrix and an igraph graph",
   "Compute degree, connectance, nestedness (NODF) and modularity",
   "Identify key species of the network"
  ],
  "contenu": "\n<p>An <b>interaction network</b> links species from two groups: plants and their pollinators, or plants and their herbivores. It is a <b>bipartite</b> graph. Pollination networks are often <b>nested</b> (specialists visit plants already visited by generalists) and <b>modular</b> (groups of species interacting mostly among themselves). Real datasets are available on <a href=\"https://www.web-of-life.es\" target=\"_blank\" rel=\"noopener\">Web of Life</a> and <a href=\"https://www.globalbioticinteractions.org\" target=\"_blank\" rel=\"noopener\">GloBI</a> (<code>rglobi</code> package).</p><!--code:0-->",
  "exercice": "<ol>\n  <li>Which three plants receive the most different pollinators?</li>\n  <li>Compute the connectance and NODF of the herbivory network and compare with pollination.</li>\n  <li>Test nestedness against a null model with <code>oecosimu(M_pol &gt; 0, nestednodf, \"r00\")</code>.</li>\n</ol>"
 },
 "b4-l2": {
  "titre": "Multiplex network and robustness to extinctions",
  "duree": "40 min",
  "objectifs": [
   "Assemble two interaction layers sharing the same plants",
   "Compute multiplex degree and the participation coefficient",
   "Simulate plant loss and measure the robustness of animal communities"
  ],
  "contenu": "\n<p>In nature, the same plant is pollinated, browsed, dispersed… A <b>multiplex network</b> overlays several <b>layers</b> of interactions on the same species. We can then ask whether plants important for pollinators are also the most eaten, and what the loss of a plant (fire, overgrazing) causes in <b>all</b> layers.</p><!--code:0-->\n<h4>Extinction cascades</h4>\n<p>We remove plants one by one and count the animals left without any partner plant (secondary extinctions). <b>Robustness</b> R is the area under the survival curve (close to 1: robust network).</p><!--code:1-->",
  "exercice": "<ol>\n  <li>Which plant has the highest multiplex degree? Is it important in both layers?</li>\n  <li>Compute the robustness of the herbivory layer, then of the multiplex network (animals of both layers).</li>\n  <li>Which scenario is worse: random loss or loss of the most connected plants? What are the consequences for fire management in the Tlemcen mountains?</li>\n</ol>"
 },
 "b5": {
  "titre": "Distribution models and explainable AI",
  "resume": "Build a species distribution model (SDM) with random forest, evaluate it (AUC) and explain it: variable importance, partial dependence, individual curves and local explanation.",
  "quiz": [
   {
    "question": "A species distribution model has an AUC of 0.5. This means the model…",
    "choix": [
     "has no variables",
     "is perfect",
     "always overestimates",
     "does no better than chance"
    ],
    "explication": "AUC = 0.5: no discrimination; 1: perfect discrimination."
   },
   {
    "question": "Permutation importance measures…",
    "choix": [
     "the correlation between variables",
     "the number of trees",
     "the slope of a regression",
     "the loss of performance when a variable is shuffled"
    ],
    "explication": "If shuffling a variable degrades the model a lot, it is important."
   },
   {
    "question": "A partial dependence curve shows…",
    "choix": [
     "the confusion matrix",
     "the residuals",
     "the prediction map",
     "the average effect of a variable on the prediction"
    ],
    "explication": "Average of the individual ICE curves."
   },
   {
    "question": "Which R package provides explainable AI tools (Shapley, break-down)?",
    "choix": [
     "readr",
     "DALEX",
     "igraph",
     "sf"
    ],
    "explication": "DALEX (and iml) are dedicated to model explanation."
   }
  ]
 },
 "b5-l1": {
  "titre": "An SDM with random forest",
  "duree": "40 min",
  "objectifs": [
   "Join presence-absence and environmental variables",
   "Fit a random forest with ranger and evaluate it on test data (AUC)",
   "Predict and map the probability of presence"
  ],
  "contenu": "\n<p>A <b>species distribution model</b> (SDM) relates the presence of a species to environmental conditions. <b>Machine learning</b> methods (random forest, boosting) perform very well but work like “black boxes”. We model the <b>Barbary thuja</b> (<i>Tetraclinis articulata</i>), an emblematic tree of western Algeria, from 120 survey sites.</p><!--code:0-->",
  "exercice": "<ol>\n  <li>What is the AUC of the model on the test data? Rerun with another seed: does the AUC change a lot?</li>\n  <li>Compare with a generalised linear model <code>glm(..., family = binomial)</code>.</li>\n  <li>With Internet access, replace the covariates with the WorldClim variables (bio1, bio12) downloaded in level B1.</li>\n</ol>"
 },
 "b5-l2": {
  "titre": "Explaining the model: importance, partial dependence, local explanation",
  "duree": "40 min",
  "objectifs": [
   "Interpret permutation variable importance",
   "Build partial dependence and ICE curves",
   "Explain an individual prediction (“what if…” approach)"
  ],
  "contenu": "\n<p><b>Explainable AI</b> (XAI) opens the black box. Three simple tools, automated by the <a href=\"https://modeloriented.github.io/DALEX/\" target=\"_blank\" rel=\"noopener\">DALEX</a> and <code>iml</code> packages (Shapley values, break-down…):</p>\n<ul>\n  <li><b>permutation importance</b>: how much performance drops when a variable is shuffled;</li>\n  <li><b>partial dependence</b> (PDP): average effect of a variable when the others stay as observed; <b>ICE</b> curves show this effect site by site;</li>\n  <li><b>local explanation</b>: for a given site, how the prediction changes when each variable is replaced by its mean value.</li>\n</ul><!--code:0-->",
  "exercice": "<ol>\n  <li>Which variable is the most important? Is it ecologically consistent for the thuja (a thermophilous species of low elevations)?</li>\n  <li>Plot the partial dependence of rainfall and slope.</li>\n  <li>Are the ICE curves parallel? If not, what does it indicate (interactions)?</li>\n</ol>"
 },
 "b6": {
  "titre": "Occupancy and imperfect detection",
  "resume": "Understand why “not detected” does not mean “absent”, estimate occupancy and detection probabilities separately from repeated visits, and design a field protocol.",
  "quiz": [
   {
    "question": "In an occupancy model, p represents…",
    "choix": [
     "the probability of occupancy",
     "the proportion of sites visited",
     "the p-value",
     "the probability of detecting the species during a visit if it is present"
    ],
    "explication": "ψ = occupancy; p = detection conditional on presence."
   },
   {
    "question": "Why are repeated visits needed at each site?",
    "choix": [
     "to increase NDVI",
     "because GBIF requires it",
     "to reduce the number of sites",
     "to separate non-detection from true absence"
    ],
    "explication": "Repetition informs on the detection probability."
   },
   {
    "question": "Naive occupancy is usually…",
    "choix": [
     "lower than true occupancy",
     "equal to p",
     "higher than true occupancy",
     "equal to 1"
    ],
    "explication": "Occupied but never detected sites are counted as empty."
   },
   {
    "question": "With p = 0.4 per visit, the probability of detecting at least once in 3 visits is…",
    "choix": [
     "0.4³ ≈ 0.06",
     "1 − 0.6³ ≈ 0.78",
     "3 × 0.4 = 1.2",
     "0.4"
    ],
    "explication": "1 − (1 − p)^K."
   }
  ]
 },
 "b6-l1": {
  "titre": "The occupancy model step by step",
  "duree": "45 min",
  "objectifs": [
   "Organise repeated detections in a sites × visits matrix",
   "Write the likelihood of the occupancy model and fit it with optim()",
   "Compare estimated occupancy with naive occupancy"
  ],
  "contenu": "\n<p>In the field, a species that is present may <b>not be detected</b> (silent bird, wind, observer). If we only count the sites where it was seen, we <b>underestimate</b> its distribution. The <b>occupancy model</b> (MacKenzie et al., 2002) uses <b>repeated visits</b> at each site to separate two probabilities:</p>\n<ul>\n  <li>ψ (psi): probability that a site is <b>occupied</b>, depending on habitat (here NDVI);</li>\n  <li><i>p</i>: probability of <b>detecting</b> the species during a visit if it is there, depending on conditions (here wind).</li>\n</ul>\n<p>For a site where the species was seen at least once, the likelihood is ψ × ∏ p<sup>y</sup>(1 − p)<sup>1 − y</sup>. For a site where it was never seen: ψ × ∏(1 − p) + (1 − ψ). Data: 60 point counts, 3 visits, 8 bird species of the Tlemcen mountains. Real bird observations from Algeria can be found on <a href=\"https://ebird.org\" target=\"_blank\" rel=\"noopener\">eBird</a> and <a href=\"https://www.gbif.org\" target=\"_blank\" rel=\"noopener\">GBIF</a>.</p><!--code:0-->",
  "exercice": "<ol>\n  <li>By how much does naive occupancy underestimate estimated occupancy?</li>\n  <li>Is the effect of wind on detection negative? Is it significant (estimate / standard error &gt; 2)?</li>\n  <li>Redo the analysis for Levaillant's woodpecker (<i>Picus vaillantii</i>), very discreet: what do you notice?</li>\n</ol>"
 },
 "b6-l2": {
  "titre": "Mapping occupancy and designing the protocol",
  "duree": "35 min",
  "objectifs": [
   "Project the probability of occupancy onto a covariate raster",
   "Compute the number of visits needed to conclude absence",
   "Use the unmarked package to go further"
  ],
  "contenu": "\n<p>The estimated coefficients apply to the whole area: just standardise the NDVI raster with the <b>same mean and standard deviation</b> as the fitting data.</p><!--code:0-->\n<p>For your projects, the <a href=\"https://cran.r-project.org/package=unmarked\" target=\"_blank\" rel=\"noopener\">unmarked</a> package fits this model and many variants (multiple seasons, N-mixture abundance, false positives). The <code>~ detection ~ occupancy</code> syntax matches our function (code not run on our test server):</p><!--code:1-->",
  "exercice": "<ol>\n  <li>How many visits would be needed for the African blue tit? for Levaillant's woodpecker?</li>\n  <li>Compare the occupancy map with the NDVI map: where should conservation efforts focus?</li>\n  <li>If you install <code>unmarked</code>, check that its estimates are identical to those of <code>optim()</code>.</li>\n</ol>"
 },
 "b7": {
  "titre": "Environmental DNA and modelling",
  "resume": "Understand the environmental DNA workflow (sampling, extraction, PCR, metabarcoding), structure hierarchical detections and fit a Bayesian multi-scale occupancy model with JAGS.",
  "quiz": [
   {
    "question": "In the multi-scale eDNA model, θ is the probability…",
    "choix": [
     "of a sequencing error",
     "that a PCR replicate is positive",
     "that DNA is present in a water sample from an occupied pond",
     "that a pond is occupied"
    ],
    "explication": "ψ: pond; θ: sample; p: PCR replicate."
   },
   {
    "question": "Metabarcoding makes it possible…",
    "choix": [
     "to identify several species from a single sample using reference sequence databases",
     "to measure NDVI",
     "to count individuals by sight",
     "to georeference a map"
    ],
    "explication": "Sequences are compared with GenBank, BOLD or local databases."
   },
   {
    "question": "In JAGS, what is gelman.diag() for?",
    "choix": [
     "drawing a map",
     "installing JAGS",
     "checking the convergence of MCMC chains (R-hat)",
     "computing the AUC"
    ],
    "explication": "An R-hat close to 1 indicates that the chains have converged."
   },
   {
    "question": "Increasing the number of PCR replicates mainly improves…",
    "choix": [
     "water quality",
     "detection in a sample that contains the DNA",
     "the number of ponds",
     "the true occupancy of ponds"
    ],
    "explication": "Replicates act on 1 − (1 − p)^K."
   }
  ]
 },
 "b7-l1": {
  "titre": "From pond to data: the hierarchical structure of eDNA",
  "duree": "35 min",
  "objectifs": [
   "Describe the steps of an environmental DNA study",
   "Organise detections by pond, water sample and PCR replicate",
   "Compute the cumulative sensitivity of a protocol"
  ],
  "contenu": "\n<p>Organisms leave DNA in water, soil or air (mucus, cells, faeces). By filtering a few litres of water from a pond and amplifying DNA by <b>PCR</b>, discreet species such as amphibians can be detected without capture. With <b>metabarcoding</b>, all species of a group are identified by comparing sequences with reference databases (<a href=\"https://www.ncbi.nlm.nih.gov/genbank/\" target=\"_blank\" rel=\"noopener\">GenBank</a>, <a href=\"https://boldsystems.org\" target=\"_blank\" rel=\"noopener\">BOLD</a>).</p>\n<p>Detection is imperfect at <b>two levels</b>: DNA may be in the pond without being captured in a sample (θ), and in the sample without being amplified in a PCR replicate (<i>p</i>). Our data: 40 ponds, 3 water samples per pond, 4 PCR replicates per sample, 4 North African amphibians.</p><!--code:0-->",
  "exercice": "<ol>\n  <li>Which species has the lowest naive occupancy?</li>\n  <li>With θ = 0.5 and p = 0.55, which protocol (J samples, K replicates) reaches 95% sensitivity at the lowest cost, if a sample costs 3 times more than a replicate?</li>\n  <li>Search <a href=\"https://www.gbif.org/species/search?q=Pleurodeles%20nebulosus\" target=\"_blank\" rel=\"noopener\">GBIF</a> for occurrences of the Algerian ribbed newt (<i>Pleurodeles nebulosus</i>).</li>\n</ol>"
 },
 "b7-l2": {
  "titre": "Bayesian multi-scale occupancy model (JAGS)",
  "duree": "45 min",
  "objectifs": [
   "Write a three-level hierarchical model in the BUGS language",
   "Fit the model with rjags and check convergence",
   "Interpret ψ, θ and p and the effect of pond covariates"
  ],
  "contenu": "\n<p>The multi-scale model (Nichols et al., 2008; Dorazio and Erickson, 2018) is written with three nested latent variables:</p>\n<ul>\n  <li>z<sub>i</sub> ~ Bernoulli(ψ<sub>i</sub>): pond <i>i</i> is occupied;</li>\n  <li>a<sub>ij</sub> ~ Bernoulli(z<sub>i</sub> θ): sample <i>j</i> contains the DNA;</li>\n  <li>y<sub>ijk</sub> ~ Bernoulli(a<sub>ij</sub> p): PCR replicate <i>k</i> is positive.</li>\n</ul>\n<p>ψ depends on how long the pond holds water (hydroperiod) and on the presence of livestock. The <a href=\"https://cran.r-project.org/package=eDNAoccupancy\" target=\"_blank\" rel=\"noopener\">eDNAoccupancy</a> and <code>msocc</code> packages provide this model ready to use.</p><div class=\"astuce\"><b>Installing JAGS:</b> the Bayesian models of this level use the free software <a href=\"https://sourceforge.net/projects/mcmc-jags/\" target=\"_blank\" rel=\"noopener\">JAGS</a> (install it once on Windows, like any program) and the <code>rjags</code> package (<code>install.packages(\"rjags\")</code>). Computations take from a few seconds to a minute.</div><!--code:0-->",
  "exercice": "<ol>\n  <li>Compare the estimated number of occupied ponds (median and interval) with the number of positive ponds observed.</li>\n  <li>Does the hydroperiod have a positive effect? The posterior probability P(a1 &gt; 0) is <code>mean(as.matrix(post)[, \"a1\"] &gt; 0)</code>.</li>\n  <li>Refit the model for <i>Discoglossus pictus</i> and compare θ and p between the two species.</li>\n</ol>"
 },
 "b8": {
  "titre": "Joint species distribution models (JSDM)",
  "resume": "Move from species-by-species models (stacked SDMs) to joint models that estimate both responses to the environment and residual co-occurrences between species, with a Bayesian latent factor model.",
  "quiz": [
   {
    "question": "What does a JSDM model in addition to a classic SDM?",
    "choix": [
     "NDVI",
     "GBIF duplicates",
     "residual correlations between species",
     "only temperature"
    ],
    "explication": "The JSDM jointly estimates responses to the environment and residual co-occurrences."
   },
   {
    "question": "What are latent factors used for in a JSDM?",
    "choix": [
     "summarising the correlation matrix between species with few parameters",
     "computing slope",
     "projecting to UTM",
     "replacing presence data"
    ],
    "explication": "Σ ≈ Λ Λᵀ with a few factors."
   },
   {
    "question": "Two species often co-occur but their residual correlation is zero. This is probably because…",
    "choix": [
     "they compete",
     "the model did not converge",
     "the data are wrong",
     "they respond in the same way to the environmental variables"
    ],
    "explication": "Their co-occurrence is explained by the shared environment."
   },
   {
    "question": "Which R package is the reference for hierarchical JSDMs?",
    "choix": [
     "ggplot2",
     "sf",
     "readxl",
     "Hmsc"
    ],
    "explication": "Hmsc (Hierarchical Modelling of Species Communities)."
   }
  ]
 },
 "b8-l1": {
  "titre": "From stacked SDMs to co-occurrences",
  "duree": "35 min",
  "objectifs": [
   "Fit one model per species (stacked SDMs) with glm()",
   "Distinguish raw co-occurrence from residual co-occurrence",
   "Understand the value of a joint model"
  ],
  "contenu": "\n<p>Species in a community respond to the environment (elevation, rainfall) but also to each other (competition, facilitation) or to <b>unmeasured</b> factors. Two species may co-occur simply because they like the same elevation: this is an “environmental” co-occurrence. The <b>JSDM</b> (Joint Species Distribution Model) models all species together and estimates what remains once the environment is accounted for: the <b>residual correlations</b>. Our data: presence-absence of 10 woody plants at 120 sites.</p><!--code:0-->",
  "exercice": "<ol>\n  <li>Which species increase with elevation? Which ones decrease?</li>\n  <li>Find a pair of species with a strong raw co-occurrence but a weak residual correlation: how can it be explained?</li>\n  <li>Why are residuals from separate GLMs not enough to estimate the correlations properly?</li>\n</ol>"
 },
 "b8-l2": {
  "titre": "A Bayesian latent factor JSDM",
  "duree": "50 min",
  "objectifs": [
   "Write a multivariate probit latent factor model in the BUGS language",
   "Apply the identifiability constraints of the factors",
   "Compute and map the residual correlation matrix"
  ],
  "contenu": "\n<p>For <i>S</i> species, a correlation matrix has <i>S(S − 1)/2</i> parameters. <b>Latent factors</b> (Warton et al., 2015; Ovaskainen et al., 2017) summarise it: each site receives scores <i>u</i> (“hidden” environmental variables) and each species loadings λ. Residual correlation comes from Λ Λ<sup>T</sup>. This is the principle of <a href=\"https://www.helsinki.fi/en/researchgroups/statistical-ecology/software/hmsc\" target=\"_blank\" rel=\"noopener\">Hmsc</a>, <code>jSDM</code>, <code>gllvm</code> and <code>boral</code>.</p><div class=\"astuce\"><b>Installing JAGS:</b> the Bayesian models of this level use the free software <a href=\"https://sourceforge.net/projects/mcmc-jags/\" target=\"_blank\" rel=\"noopener\">JAGS</a> (install it once on Windows, like any program) and the <code>rjags</code> package (<code>install.packages(\"rjags\")</code>). Computations take from a few seconds to a minute.</div><!--code:0-->",
  "exercice": "<ol>\n  <li>Compare the JSDM residual correlations with those of the separate GLMs (lesson 1).</li>\n  <li>Which pairs of species are positively associated once the environment is accounted for? negatively?</li>\n  <li>Does a residual correlation prove a biological interaction? Discuss (unmeasured factors, scale).</li>\n</ol>"
 },
 "b9": {
  "titre": "Bayesian multi-species and spatio-temporal models",
  "resume": "Fit a hierarchical Bayesian community occupancy model (8 bird species) to estimate richness corrected for detection, then model the spatio-temporal change of a population (2010-2024) and quantify the uncertainty of trends.",
  "quiz": [
   {
    "question": "In a community occupancy model, rare species…",
    "choix": [
     "are modelled without covariates",
     "are removed",
     "always have p = 1",
     "borrow information from other species through the shared distributions"
    ],
    "explication": "This is the partial pooling of hierarchical models."
   },
   {
    "question": "The richness estimated by the community model is…",
    "choix": [
     "greater than or equal to the observed richness",
     "independent of detection",
     "equal to the number of visits",
     "always lower than the observed richness"
    ],
    "explication": "The model adds species present but not detected."
   },
   {
    "question": "In mgcv, te(X, Y, ANNEE, d = c(2, 1)) represents…",
    "choix": [
     "an occupancy model",
     "three independent linear effects",
     "a spatial surface that changes over time",
     "an interaction between species"
    ],
    "explication": "Tensor product of a 2D smooth (X, Y) and a 1D smooth (year)."
   },
   {
    "question": "Why simulate coefficients with MASS::mvrnorm(…, vcov(gam_st))?",
    "choix": [
     "to change projection",
     "to propagate uncertainty and compute probabilities, such as the probability of decline",
     "to remove missing values",
     "to speed up computation"
    ],
    "explication": "We get an (approximate posterior) distribution of the predictions."
   }
  ]
 },
 "b9-l1": {
  "titre": "Hierarchical multi-species model (community occupancy)",
  "duree": "50 min",
  "objectifs": [
   "Understand borrowing strength (partial pooling) between species",
   "Fit a community occupancy model with JAGS",
   "Estimate the species richness of each site accounting for detection"
  ],
  "contenu": "\n<p>The community occupancy model (Dorazio and Royle, 2005; Kéry and Royle, 2016) fits <b>all species at once</b>. The parameters of each species (ψ, p, NDVI effect) are drawn from a distribution <b>shared</b> by the community: rare, rarely detected species “borrow” information from common species. We then obtain the <b>true richness</b> of each site (sum of z), corrected for imperfect detection. The <a href=\"https://www.jeffdoser.com/files/spoccupancy-web/\" target=\"_blank\" rel=\"noopener\">spOccupancy</a> package adds the spatial dimension.</p><div class=\"astuce\"><b>Installing JAGS:</b> the Bayesian models of this level use the free software <a href=\"https://sourceforge.net/projects/mcmc-jags/\" target=\"_blank\" rel=\"noopener\">JAGS</a> (install it once on Windows, like any program) and the <code>rjags</code> package (<code>install.packages(\"rjags\")</code>). Computations take from a few seconds to a minute.</div><!--code:0-->",
  "exercice": "<ol>\n  <li>Which species are favoured by high NDVI (95% interval above 0)? Which ones avoid dense vegetation?</li>\n  <li>Why is estimated richness always greater than or equal to observed richness?</li>\n  <li>Map the estimated richness of the point counts with <code>sf</code> (X, Y coordinates).</li>\n</ol>"
 },
 "b9-l2": {
  "titre": "Spatio-temporal model and trend uncertainty",
  "duree": "45 min",
  "objectifs": [
   "Model repeated counts in space and time with a tensor smooth",
   "Simulate the posterior distribution of predictions",
   "Map the 2010-2024 trend and the probability of decline"
  ],
  "contenu": "\n<p>Long-term monitoring (annual counts at fixed points) raises two questions: <b>where</b> is the population changing, and with what <b>certainty</b>? A generalised additive model (GAM) with a <code>te(X, Y, ANNEE)</code> smooth allows a surface that changes over time. The penalised smooths of <code>mgcv</code> have a <b>Bayesian</b> interpretation (Gaussian random effects): the <code>Vp</code> matrix is the posterior covariance of the coefficients, which makes it possible to simulate predictions and compute probabilities. For fully Bayesian models, see <a href=\"https://www.r-inla.org\" target=\"_blank\" rel=\"noopener\">R-INLA</a> (SPDE spatial fields), <code>sdmTMB</code> and <code>spOccupancy</code>. Real bird monitoring data: <a href=\"https://www.gbif.org\" target=\"_blank\" rel=\"noopener\">GBIF</a>, <a href=\"https://ebird.org/science/status-and-trends\" target=\"_blank\" rel=\"noopener\">eBird Status and Trends</a>.</p><!--code:0-->",
  "exercice": "<ol>\n  <li>In which part of the area is the Barbary partridge declining? With what probability?</li>\n  <li>Predict abundance for 2017 and compare with the counts observed that year.</li>\n  <li>Why must we be very careful when predicting 2030 with this model (extrapolation)?</li>\n</ol>"
 }
});
