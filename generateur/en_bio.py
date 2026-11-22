def K(n): return f"<!--code:{n}-->"
def Q(question, choix, explication): return dict(question=question, choix=choix, explication=explication)

SRC = """<div class="astuce"><b>Practical data:</b> the files in <code>donnees/biodiversite/</code> are <b>fictitious</b> (simulated values for the Oued Tamda basin, UTM 30N) but the species names are real. The “online” code of this lesson (<code>EN_LIGNE &lt;- TRUE</code>) downloads the real data; it needs an Internet connection and could not be run from our test server: check it in the computer room.</div>"""
JAGS = """<div class="astuce"><b>Installing JAGS:</b> the Bayesian models of this level use the free software <a href="https://sourceforge.net/projects/mcmc-jags/" target="_blank" rel="noopener">JAGS</a> (install it once on Windows, like any program) and the <code>rjags</code> package (<code>install.packages("rjags")</code>). Computations take from a few seconds to a minute.</div>"""

EN = {}
EN["bio"] = dict(nom="Biodiversity", accroche="Quantitative ecology with R: from open data to Bayesian models",
  lead="An advanced course in modern quantitative ecology methods with R, built on open data sources (GBIF, OBIS, WorldClim, Copernicus, MODIS): remote sensing and NDVI time series, beta diversity and neutrality, multiplex ecological networks, explainable machine learning, occupancy models with imperfect detection, environmental DNA, joint species distribution models (JSDM), and Bayesian multi-species and spatio-temporal models. Practical data are fictitious but realistic, in the Tlemcen area.")

EN["b1"] = dict(titre="Online biodiversity data", resume="Download species occurrences (GBIF, OBIS), climate variables (WorldClim, CHELSA) and satellite images (Copernicus, MODIS) from R, then clean, filter and rasterise the occurrences.",
  quiz=[
    Q("Which database gathers species occurrences from all over the world and gives a DOI for each download?", ["GBIF", "WorldClim", "MODIS", "OpenStreetMap"], "GBIF (Global Biodiversity Information Facility) aggregates occurrences; occ_download() provides a DOI to cite."),
    Q("Why remove points with coordinates (0, 0)?", ["They are almost always badly coded missing values", "They are in the Indian Ocean", "They are too precise", "GBIF forbids them"], "The point (0, 0) is in the Gulf of Guinea: it is usually missing coordinates recorded as 0."),
    Q("“Thinning” on a 1 km grid is used to…", ["reduce sampling bias by keeping one occurrence per species and per cell", "increase the number of occurrences", "change the coordinate system", "compute NDVI"], "Heavily surveyed areas (roads, towns) weigh less after thinning."),
    Q("Which R package downloads the WorldClim bioclimatic variables?", ["geodata", "dplyr", "ggplot2", "readxl"], "geodata::worldclim_country() or worldclim_global()."),
  ])
EN["b1-l1"] = dict(titre="Find and download open data", duree="35 min",
  objectifs=["Know the main open databases on biodiversity and the environment", "Query GBIF and OBIS from R with rgbif and robis", "Download WorldClim climate variables with geodata"],
  contenu="""
<p>Modern quantitative ecology methods (occupancy models, JSDM, Bayesian models) need species <b>observation data</b> and <b>environmental variables</b>. Much of it is now <b>open</b> and directly accessible from R.</p>
<table class="tab">
<tr><th>Source</th><th>Content</th><th>R package</th></tr>
<tr><td><a href="https://www.gbif.org" target="_blank" rel="noopener">GBIF</a></td><td>Over 2 billion species occurrences (museums, surveys, citizen science), including Algeria</td><td><code>rgbif</code></td></tr>
<tr><td><a href="https://obis.org" target="_blank" rel="noopener">OBIS</a></td><td>Marine biodiversity (Oran coast, Gulf of Arzew, Ghazaouet)</td><td><code>robis</code></td></tr>
<tr><td><a href="https://www.worldclim.org" target="_blank" rel="noopener">WorldClim</a> / <a href="https://chelsa-climate.org" target="_blank" rel="noopener">CHELSA</a></td><td>Current and future climate (19 bioclimatic variables, 30 s ≈ 1 km)</td><td><code>geodata</code></td></tr>
<tr><td><a href="https://esa-worldcover.org" target="_blank" rel="noopener">ESA WorldCover</a> / <a href="https://land.copernicus.eu" target="_blank" rel="noopener">Copernicus Land</a></td><td>Land cover at 10 m, vegetation indices</td><td><code>geodata</code>, <code>terra</code></td></tr>
<tr><td><a href="https://modis.ornl.gov" target="_blank" rel="noopener">MODIS (ORNL DAAC)</a></td><td>250 m NDVI every 16 days since 2000 (MOD13Q1 product)</td><td><code>MODISTools</code></td></tr>
<tr><td><a href="https://www.iucnredlist.org" target="_blank" rel="noopener">IUCN Red List</a></td><td>Threat status of species</td><td><code>rredlist</code></td></tr>
</table>
<p>The principle is always the same: describe <b>what</b> (species, variable), <b>where</b> (country, extent) and <b>when</b> (years), and the package queries the website's API.</p>""" + K(0) + SRC + """
<p>Without a connection, we work on the simulated export <code>occurrences_gbif_simulees.csv</code>, which has <b>exactly the same columns</b> as a GBIF export: the rest of the code therefore works identically on real data.</p>""" + K(1),
  exercice="""<ol>
  <li>On <a href="https://www.gbif.org/occurrence/search?country=DZ" target="_blank" rel="noopener">gbif.org</a>, search for <i>Tetraclinis articulata</i> in Algeria: how many occurrences have coordinates?</li>
  <li>In R, load <code>occurrences_gbif_simulees.csv</code> and count occurrences per species and per decade (<code>year %/% 10 * 10</code>).</li>
  <li>What proportion of occurrences has no coordinate uncertainty recorded?</li>
</ol>""")
EN["b1-l2"] = dict(titre="Clean, filter and rasterise occurrences", duree="40 min",
  objectifs=["Spot the classic errors of occurrence data (null or inverted coordinates, duplicates)", "Filter by spatial uncertainty and type of record", "Reduce sampling bias with a grid (thinning) and produce a richness map"],
  contenu="""
<p>Open data are valuable but <b>raw</b>. Before any modelling, apply a reproducible cleaning chain:</p>
<ul>
  <li><b>missing</b> coordinates or coordinates equal to <b>(0, 0)</b>;</li>
  <li><b>inverted sign</b> of the longitude (point falling outside the area);</li>
  <li><b>duplicates</b> (same species, same coordinates, same date);</li>
  <li><b>uncertainty</b> too large for the resolution of the analysis (here &gt; 1,000 m);</li>
  <li>old specimens or fossils depending on the question.</li>
</ul>""" + K(0) + """
<p>Observations often concentrate near roads and towns: this is <b>sampling bias</b>. A simple remedy is to keep <b>a single occurrence per species and per cell</b> (here 1 km).</p>""" + K(1),
  exercice="""<ol>
  <li>How many occurrences are removed at each filtering step? Make a small table.</li>
  <li>Redo the thinning with a 2 km cell: how many occurrences remain?</li>
  <li>Export the clean occurrences to GeoPackage (<code>st_write</code>) and open them in QGIS or ArcGIS.</li>
</ol>""")

EN["b2"] = dict(titre="Ecological remote sensing and time series", resume="Analyse an annual NDVI series (2010-2024): per-pixel trend, Mann-Kendall test, disturbance detection, then measure the fragmentation of forest cover between two dates.",
  quiz=[
    Q("NDVI is computed with…", ["near infrared and red", "blue and green", "elevation and slope", "temperature and rainfall"], "NDVI = (NIR − R) / (NIR + R)."),
    Q("Which terra function applies a function to the time series of each pixel?", ["app()", "crop()", "patches()", "freq()"], "app() goes through the cells and applies the function to the layer values."),
    Q("The Mann-Kendall test is popular in remote sensing because it…", ["is non-parametric and robust to outliers", "requires normal data", "only works with Sentinel-2", "computes NDVI"], "It relies on the ranks of the values (Kendall's tau)."),
    Q("A more fragmented forest usually has…", ["more patches and more edge", "fewer patches and less edge", "a single large patch", "a higher NDVI"], "Fragmentation increases the number of patches and edge density."),
  ])
EN["b2-l1"] = dict(titre="NDVI time series and trends", duree="40 min",
  objectifs=["Understand NDVI and free satellite products (MODIS, Sentinel-2, Landsat)", "Compute a per-pixel trend with terra::app()", "Test the significance of a trend (Mann-Kendall) and detect a disturbance"],
  contenu="""
<p><b>NDVI</b> (normalised difference vegetation index) is computed from red and near infrared: <code>NDVI = (NIR − R) / (NIR + R)</code>. It ranges from −1 to 1; bare soil is around 0.1, dense maquis 0.5 to 0.7. Free series exist: <a href="https://lpdaac.usgs.gov/products/mod13q1v061/" target="_blank" rel="noopener">MODIS MOD13Q1</a> (250 m, since 2000), <a href="https://dataspace.copernicus.eu" target="_blank" rel="noopener">Sentinel-2</a> (10 m, since 2015) and Landsat (30 m, since 1984).</p>""" + K(0) + SRC + """
<h4>Per-pixel trend</h4>
<p><code>app()</code> applies a function to the time series of <b>each pixel</b>. We compute the slope of a linear regression (NDVI units per year) and <b>Kendall's tau</b>, the basis of the non-parametric <b>Mann-Kendall</b> test, robust to outliers.</p>""" + K(1),
  exercice="""<ol>
  <li>What share of the area shows a significant decrease in NDVI? an increase?</li>
  <li>Which year corresponds to the south-east disturbance? Suggest an explanation (fire, clearing…).</li>
  <li>Compute the mean trend per municipality with <code>zonal()</code> and the <code>communes</code> layer.</li>
</ol>""")
EN["b2-l2"] = dict(titre="Fragmentation of forest cover", duree="35 min",
  objectifs=["Compare two forest maps and compute a change matrix", "Identify forest patches and compute landscape metrics", "Interpret fragmentation for biodiversity"],
  contenu="""
<p><b>Fragmentation</b> breaks a continuous habitat into smaller, more isolated patches: forest interior shrinks and edges increase. Landscape ecology measures it with <b>metrics</b>: number of patches, mean area, largest patch, edge density. The <a href="https://r-spatialecology.github.io/landscapemetrics/" target="_blank" rel="noopener">landscapemetrics</a> package computes more than 100; here we compute the main ones ourselves with <code>terra</code> to understand them well.</p>""" + K(0),
  exercice="""<ol>
  <li>Has the forest area increased or decreased? And the number of patches?</li>
  <li>A forest can gain area while fragmenting locally: check it by keeping only the south-east quarter (<code>crop()</code>).</li>
  <li>With Internet access, install <code>landscapemetrics</code> and compare with <code>lsm_c_np()</code>, <code>lsm_c_ed()</code> and <code>lsm_c_lpi()</code>.</li>
</ol>""")

EN["b3"] = dict(titre="Beta diversity and neutrality", resume="Measure alpha, beta and gamma diversity, partition beta diversity into turnover and nestedness, then compare communities with null and neutral models.",
  quiz=[
    Q("Gamma diversity corresponds to…", ["the diversity of the whole region", "the diversity of a single plot", "the difference between two plots", "the Simpson index"], "Gamma = regional scale; alpha = local; beta = the difference between the two."),
    Q("In Baselga's partitioning, βsim measures…", ["species replacement (turnover)", "nestedness", "total richness", "mean abundance"], "βsim = min(b, c) / (a + min(b, c)) is the turnover component."),
    Q("According to Hubbell's neutral theory, species…", ["are ecologically equivalent and composition changes by drift", "all occupy a different niche", "never migrate", "are ranked by size"], "It is a null hypothesis for community structure."),
    Q("What does vegan's oecosimu() do?", ["compares an observed statistic with its distribution under a null model", "downloads occurrences", "computes NDVI", "draws a map"], "It permutes the matrix with a null algorithm and computes a p-value."),
  ])
EN["b3-l1"] = dict(titre="Alpha, beta, gamma diversity and Baselga's partitioning", duree="40 min",
  objectifs=["Compute richness, Shannon and Simpson indices with vegan", "Distinguish alpha, beta and gamma diversity", "Partition beta diversity into turnover and nestedness"],
  contenu="""
<p>Whittaker distinguishes three scales: <b>alpha diversity</b> (within a plot), <b>gamma diversity</b> (in the whole region) and <b>beta diversity</b> (the difference in composition between plots). The file <code>communautes_plantes.csv</code> contains 30 vegetation plots in three zones (foothill, slope, summit) along the elevation gradient.</p>""" + K(0) + """
<h4>Turnover or nestedness?</h4>
<p>Two communities can differ because species <b>replace</b> each other (turnover) or because the poorer one is a <b>subset</b> of the richer one (nestedness). With <i>a</i> shared species and <i>b</i> and <i>c</i> species unique to each plot, Baselga (2010) proposes:</p>
<ul>
  <li>β<sub>sor</sub> = (b + c) / (2a + b + c): total Sørensen dissimilarity;</li>
  <li>β<sub>sim</sub> = min(b, c) / (a + min(b, c)): part due to <b>turnover</b>;</li>
  <li>β<sub>sne</sub> = β<sub>sor</sub> − β<sub>sim</sub>: part due to <b>nestedness</b>.</li>
</ul>
<p>The <a href="https://cran.r-project.org/package=betapart" target="_blank" rel="noopener">betapart</a> package does this (<code>beta.pair()</code>, <code>beta.multi()</code>); here is the “by hand” version, useful to understand.</p>""" + K(1),
  exercice="""<ol>
  <li>Which zone has the highest Shannon diversity?</li>
  <li>Between different zones, does dissimilarity come mainly from turnover or from nestedness? Interpret with the elevation gradient.</li>
  <li>Try <code>betadisper()</code> to check whether the dispersion of plots differs between zones.</li>
</ol>""")
EN["b3-l2"] = dict(titre="Null models and neutral theory", duree="35 min",
  objectifs=["Fit species abundance distributions (Fisher's log-series, Preston's lognormal, radfit)", "Test community structure against a null model", "Simulate a neutral community (ecological drift) and compare it with the data"],
  contenu="""
<p>Hubbell's <b>neutral theory</b> (2001) assumes that all species are ecologically equivalent: composition changes only through <b>drift</b> (random births and deaths), immigration and speciation. It is a <b>null hypothesis</b>: if the data depart from it, the niche (elevation, climate) plays a role. We start with the classic abundance distributions.</p>""" + K(0) + """
<h4>A small neutral simulation</h4>
<p>We simulate a local community of fixed size <i>J</i>: at each step, an individual dies and is replaced by the offspring of a local individual (probability 1 − <i>m</i>) or by an immigrant drawn from the regional pool (probability <i>m</i>).</p>""" + K(1),
  exercice="""<ol>
  <li>Which <code>radfit</code> model has the lowest AIC?</li>
  <li>Vary immigration <code>m</code> (0.01; 0.1; 0.5): how does the mean dissimilarity of neutral communities change?</li>
  <li>Conclude: is the observed structure compatible with neutrality or dominated by the niche (elevation)?</li>
</ol>""")

EN["b4"] = dict(titre="Multiplex ecological networks", resume="Build plant-pollinator and plant-herbivore interaction networks, compute connectance, nestedness and modularity, assemble a multiplex network and simulate extinction cascades.",
  quiz=[
    Q("A plant-pollinator network is a…", ["bipartite graph", "directed acyclic graph", "planar graph", "complete graph"], "Links only connect plants to animals: two distinct groups."),
    Q("The connectance of a network is…", ["the proportion of possible interactions that are realised", "the number of species", "the length of the longest path", "the maximum degree"], "Connectance = realised links / (number of plants × number of animals)."),
    Q("A multiplex network…", ["overlays several types of interactions among the same species", "contains only one species", "is always random", "replaces GBIF data"], "Each layer is a type of interaction (pollination, herbivory…)."),
    Q("In an extinction simulation, robustness is lower when we first remove…", ["the most connected plants", "the least connected plants", "the animals", "no species"], "Highly connected species support many partners."),
  ])
EN["b4-l1"] = dict(titre="Bipartite interaction networks", duree="35 min",
  objectifs=["Turn an interaction table into a matrix and an igraph graph", "Compute degree, connectance, nestedness (NODF) and modularity", "Identify key species of the network"],
  contenu="""
<p>An <b>interaction network</b> links species from two groups: plants and their pollinators, or plants and their herbivores. It is a <b>bipartite</b> graph. Pollination networks are often <b>nested</b> (specialists visit plants already visited by generalists) and <b>modular</b> (groups of species interacting mostly among themselves). Real datasets are available on <a href="https://www.web-of-life.es" target="_blank" rel="noopener">Web of Life</a> and <a href="https://www.globalbioticinteractions.org" target="_blank" rel="noopener">GloBI</a> (<code>rglobi</code> package).</p>""" + K(0),
  exercice="""<ol>
  <li>Which three plants receive the most different pollinators?</li>
  <li>Compute the connectance and NODF of the herbivory network and compare with pollination.</li>
  <li>Test nestedness against a null model with <code>oecosimu(M_pol &gt; 0, nestednodf, "r00")</code>.</li>
</ol>""")
EN["b4-l2"] = dict(titre="Multiplex network and robustness to extinctions", duree="40 min",
  objectifs=["Assemble two interaction layers sharing the same plants", "Compute multiplex degree and the participation coefficient", "Simulate plant loss and measure the robustness of animal communities"],
  contenu="""
<p>In nature, the same plant is pollinated, browsed, dispersed… A <b>multiplex network</b> overlays several <b>layers</b> of interactions on the same species. We can then ask whether plants important for pollinators are also the most eaten, and what the loss of a plant (fire, overgrazing) causes in <b>all</b> layers.</p>""" + K(0) + """
<h4>Extinction cascades</h4>
<p>We remove plants one by one and count the animals left without any partner plant (secondary extinctions). <b>Robustness</b> R is the area under the survival curve (close to 1: robust network).</p>""" + K(1),
  exercice="""<ol>
  <li>Which plant has the highest multiplex degree? Is it important in both layers?</li>
  <li>Compute the robustness of the herbivory layer, then of the multiplex network (animals of both layers).</li>
  <li>Which scenario is worse: random loss or loss of the most connected plants? What are the consequences for fire management in the Tlemcen mountains?</li>
</ol>""")

EN["b5"] = dict(titre="Distribution models and explainable AI", resume="Build a species distribution model (SDM) with random forest, evaluate it (AUC) and explain it: variable importance, partial dependence, individual curves and local explanation.",
  quiz=[
    Q("A species distribution model has an AUC of 0.5. This means the model…", ["does no better than chance", "is perfect", "always overestimates", "has no variables"], "AUC = 0.5: no discrimination; 1: perfect discrimination."),
    Q("Permutation importance measures…", ["the loss of performance when a variable is shuffled", "the number of trees", "the correlation between variables", "the slope of a regression"], "If shuffling a variable degrades the model a lot, it is important."),
    Q("A partial dependence curve shows…", ["the average effect of a variable on the prediction", "the prediction map", "the confusion matrix", "the residuals"], "Average of the individual ICE curves."),
    Q("Which R package provides explainable AI tools (Shapley, break-down)?", ["DALEX", "readr", "sf", "igraph"], "DALEX (and iml) are dedicated to model explanation."),
  ])
EN["b5-l1"] = dict(titre="An SDM with random forest", duree="40 min",
  objectifs=["Join presence-absence and environmental variables", "Fit a random forest with ranger and evaluate it on test data (AUC)", "Predict and map the probability of presence"],
  contenu="""
<p>A <b>species distribution model</b> (SDM) relates the presence of a species to environmental conditions. <b>Machine learning</b> methods (random forest, boosting) perform very well but work like “black boxes”. We model the <b>Barbary thuja</b> (<i>Tetraclinis articulata</i>), an emblematic tree of western Algeria, from 120 survey sites.</p>""" + K(0),
  exercice="""<ol>
  <li>What is the AUC of the model on the test data? Rerun with another seed: does the AUC change a lot?</li>
  <li>Compare with a generalised linear model <code>glm(..., family = binomial)</code>.</li>
  <li>With Internet access, replace the covariates with the WorldClim variables (bio1, bio12) downloaded in level B1.</li>
</ol>""")
EN["b5-l2"] = dict(titre="Explaining the model: importance, partial dependence, local explanation", duree="40 min",
  objectifs=["Interpret permutation variable importance", "Build partial dependence and ICE curves", "Explain an individual prediction (“what if…” approach)"],
  contenu="""
<p><b>Explainable AI</b> (XAI) opens the black box. Three simple tools, automated by the <a href="https://modeloriented.github.io/DALEX/" target="_blank" rel="noopener">DALEX</a> and <code>iml</code> packages (Shapley values, break-down…):</p>
<ul>
  <li><b>permutation importance</b>: how much performance drops when a variable is shuffled;</li>
  <li><b>partial dependence</b> (PDP): average effect of a variable when the others stay as observed; <b>ICE</b> curves show this effect site by site;</li>
  <li><b>local explanation</b>: for a given site, how the prediction changes when each variable is replaced by its mean value.</li>
</ul>""" + K(0),
  exercice="""<ol>
  <li>Which variable is the most important? Is it ecologically consistent for the thuja (a thermophilous species of low elevations)?</li>
  <li>Plot the partial dependence of rainfall and slope.</li>
  <li>Are the ICE curves parallel? If not, what does it indicate (interactions)?</li>
</ol>""")

EN["b6"] = dict(titre="Occupancy and imperfect detection", resume="Understand why “not detected” does not mean “absent”, estimate occupancy and detection probabilities separately from repeated visits, and design a field protocol.",
  quiz=[
    Q("In an occupancy model, p represents…", ["the probability of detecting the species during a visit if it is present", "the proportion of sites visited", "the p-value", "the probability of occupancy"], "ψ = occupancy; p = detection conditional on presence."),
    Q("Why are repeated visits needed at each site?", ["to separate non-detection from true absence", "to increase NDVI", "to reduce the number of sites", "because GBIF requires it"], "Repetition informs on the detection probability."),
    Q("Naive occupancy is usually…", ["lower than true occupancy", "higher than true occupancy", "equal to 1", "equal to p"], "Occupied but never detected sites are counted as empty."),
    Q("With p = 0.4 per visit, the probability of detecting at least once in 3 visits is…", ["1 − 0.6³ ≈ 0.78", "0.4³ ≈ 0.06", "3 × 0.4 = 1.2", "0.4"], "1 − (1 − p)^K."),
  ])
EN["b6-l1"] = dict(titre="The occupancy model step by step", duree="45 min",
  objectifs=["Organise repeated detections in a sites × visits matrix", "Write the likelihood of the occupancy model and fit it with optim()", "Compare estimated occupancy with naive occupancy"],
  contenu="""
<p>In the field, a species that is present may <b>not be detected</b> (silent bird, wind, observer). If we only count the sites where it was seen, we <b>underestimate</b> its distribution. The <b>occupancy model</b> (MacKenzie et al., 2002) uses <b>repeated visits</b> at each site to separate two probabilities:</p>
<ul>
  <li>ψ (psi): probability that a site is <b>occupied</b>, depending on habitat (here NDVI);</li>
  <li><i>p</i>: probability of <b>detecting</b> the species during a visit if it is there, depending on conditions (here wind).</li>
</ul>
<p>For a site where the species was seen at least once, the likelihood is ψ × ∏ p<sup>y</sup>(1 − p)<sup>1 − y</sup>. For a site where it was never seen: ψ × ∏(1 − p) + (1 − ψ). Data: 60 point counts, 3 visits, 8 bird species of the Tlemcen mountains. Real bird observations from Algeria can be found on <a href="https://ebird.org" target="_blank" rel="noopener">eBird</a> and <a href="https://www.gbif.org" target="_blank" rel="noopener">GBIF</a>.</p>""" + K(0),
  exercice="""<ol>
  <li>By how much does naive occupancy underestimate estimated occupancy?</li>
  <li>Is the effect of wind on detection negative? Is it significant (estimate / standard error &gt; 2)?</li>
  <li>Redo the analysis for Levaillant's woodpecker (<i>Picus vaillantii</i>), very discreet: what do you notice?</li>
</ol>""")
EN["b6-l2"] = dict(titre="Mapping occupancy and designing the protocol", duree="35 min",
  objectifs=["Project the probability of occupancy onto a covariate raster", "Compute the number of visits needed to conclude absence", "Use the unmarked package to go further"],
  contenu="""
<p>The estimated coefficients apply to the whole area: just standardise the NDVI raster with the <b>same mean and standard deviation</b> as the fitting data.</p>""" + K(0) + """
<p>For your projects, the <a href="https://cran.r-project.org/package=unmarked" target="_blank" rel="noopener">unmarked</a> package fits this model and many variants (multiple seasons, N-mixture abundance, false positives). The <code>~ detection ~ occupancy</code> syntax matches our function (code not run on our test server):</p>""" + K(1),
  exercice="""<ol>
  <li>How many visits would be needed for the African blue tit? for Levaillant's woodpecker?</li>
  <li>Compare the occupancy map with the NDVI map: where should conservation efforts focus?</li>
  <li>If you install <code>unmarked</code>, check that its estimates are identical to those of <code>optim()</code>.</li>
</ol>""")

EN["b7"] = dict(titre="Environmental DNA and modelling", resume="Understand the environmental DNA workflow (sampling, extraction, PCR, metabarcoding), structure hierarchical detections and fit a Bayesian multi-scale occupancy model with JAGS.",
  quiz=[
    Q("In the multi-scale eDNA model, θ is the probability…", ["that DNA is present in a water sample from an occupied pond", "that a pond is occupied", "that a PCR replicate is positive", "of a sequencing error"], "ψ: pond; θ: sample; p: PCR replicate."),
    Q("Metabarcoding makes it possible…", ["to identify several species from a single sample using reference sequence databases", "to measure NDVI", "to count individuals by sight", "to georeference a map"], "Sequences are compared with GenBank, BOLD or local databases."),
    Q("In JAGS, what is gelman.diag() for?", ["checking the convergence of MCMC chains (R-hat)", "installing JAGS", "drawing a map", "computing the AUC"], "An R-hat close to 1 indicates that the chains have converged."),
    Q("Increasing the number of PCR replicates mainly improves…", ["detection in a sample that contains the DNA", "the true occupancy of ponds", "water quality", "the number of ponds"], "Replicates act on 1 − (1 − p)^K."),
  ])
EN["b7-l1"] = dict(titre="From pond to data: the hierarchical structure of eDNA", duree="35 min",
  objectifs=["Describe the steps of an environmental DNA study", "Organise detections by pond, water sample and PCR replicate", "Compute the cumulative sensitivity of a protocol"],
  contenu="""
<p>Organisms leave DNA in water, soil or air (mucus, cells, faeces). By filtering a few litres of water from a pond and amplifying DNA by <b>PCR</b>, discreet species such as amphibians can be detected without capture. With <b>metabarcoding</b>, all species of a group are identified by comparing sequences with reference databases (<a href="https://www.ncbi.nlm.nih.gov/genbank/" target="_blank" rel="noopener">GenBank</a>, <a href="https://boldsystems.org" target="_blank" rel="noopener">BOLD</a>).</p>
<p>Detection is imperfect at <b>two levels</b>: DNA may be in the pond without being captured in a sample (θ), and in the sample without being amplified in a PCR replicate (<i>p</i>). Our data: 40 ponds, 3 water samples per pond, 4 PCR replicates per sample, 4 North African amphibians.</p>""" + K(0),
  exercice="""<ol>
  <li>Which species has the lowest naive occupancy?</li>
  <li>With θ = 0.5 and p = 0.55, which protocol (J samples, K replicates) reaches 95% sensitivity at the lowest cost, if a sample costs 3 times more than a replicate?</li>
  <li>Search <a href="https://www.gbif.org/species/search?q=Pleurodeles%20nebulosus" target="_blank" rel="noopener">GBIF</a> for occurrences of the Algerian ribbed newt (<i>Pleurodeles nebulosus</i>).</li>
</ol>""")
EN["b7-l2"] = dict(titre="Bayesian multi-scale occupancy model (JAGS)", duree="45 min",
  objectifs=["Write a three-level hierarchical model in the BUGS language", "Fit the model with rjags and check convergence", "Interpret ψ, θ and p and the effect of pond covariates"],
  contenu="""
<p>The multi-scale model (Nichols et al., 2008; Dorazio and Erickson, 2018) is written with three nested latent variables:</p>
<ul>
  <li>z<sub>i</sub> ~ Bernoulli(ψ<sub>i</sub>): pond <i>i</i> is occupied;</li>
  <li>a<sub>ij</sub> ~ Bernoulli(z<sub>i</sub> θ): sample <i>j</i> contains the DNA;</li>
  <li>y<sub>ijk</sub> ~ Bernoulli(a<sub>ij</sub> p): PCR replicate <i>k</i> is positive.</li>
</ul>
<p>ψ depends on how long the pond holds water (hydroperiod) and on the presence of livestock. The <a href="https://cran.r-project.org/package=eDNAoccupancy" target="_blank" rel="noopener">eDNAoccupancy</a> and <code>msocc</code> packages provide this model ready to use.</p>""" + JAGS + K(0),
  exercice="""<ol>
  <li>Compare the estimated number of occupied ponds (median and interval) with the number of positive ponds observed.</li>
  <li>Does the hydroperiod have a positive effect? The posterior probability P(a1 &gt; 0) is <code>mean(as.matrix(post)[, "a1"] &gt; 0)</code>.</li>
  <li>Refit the model for <i>Discoglossus pictus</i> and compare θ and p between the two species.</li>
</ol>""")

EN["b8"] = dict(titre="Joint species distribution models (JSDM)", resume="Move from species-by-species models (stacked SDMs) to joint models that estimate both responses to the environment and residual co-occurrences between species, with a Bayesian latent factor model.",
  quiz=[
    Q("What does a JSDM model in addition to a classic SDM?", ["residual correlations between species", "only temperature", "NDVI", "GBIF duplicates"], "The JSDM jointly estimates responses to the environment and residual co-occurrences."),
    Q("What are latent factors used for in a JSDM?", ["summarising the correlation matrix between species with few parameters", "replacing presence data", "projecting to UTM", "computing slope"], "Σ ≈ Λ Λᵀ with a few factors."),
    Q("Two species often co-occur but their residual correlation is zero. This is probably because…", ["they respond in the same way to the environmental variables", "they compete", "the data are wrong", "the model did not converge"], "Their co-occurrence is explained by the shared environment."),
    Q("Which R package is the reference for hierarchical JSDMs?", ["Hmsc", "readxl", "sf", "ggplot2"], "Hmsc (Hierarchical Modelling of Species Communities)."),
  ])
EN["b8-l1"] = dict(titre="From stacked SDMs to co-occurrences", duree="35 min",
  objectifs=["Fit one model per species (stacked SDMs) with glm()", "Distinguish raw co-occurrence from residual co-occurrence", "Understand the value of a joint model"],
  contenu="""
<p>Species in a community respond to the environment (elevation, rainfall) but also to each other (competition, facilitation) or to <b>unmeasured</b> factors. Two species may co-occur simply because they like the same elevation: this is an “environmental” co-occurrence. The <b>JSDM</b> (Joint Species Distribution Model) models all species together and estimates what remains once the environment is accounted for: the <b>residual correlations</b>. Our data: presence-absence of 10 woody plants at 120 sites.</p>""" + K(0),
  exercice="""<ol>
  <li>Which species increase with elevation? Which ones decrease?</li>
  <li>Find a pair of species with a strong raw co-occurrence but a weak residual correlation: how can it be explained?</li>
  <li>Why are residuals from separate GLMs not enough to estimate the correlations properly?</li>
</ol>""")
EN["b8-l2"] = dict(titre="A Bayesian latent factor JSDM", duree="50 min",
  objectifs=["Write a multivariate probit latent factor model in the BUGS language", "Apply the identifiability constraints of the factors", "Compute and map the residual correlation matrix"],
  contenu="""
<p>For <i>S</i> species, a correlation matrix has <i>S(S − 1)/2</i> parameters. <b>Latent factors</b> (Warton et al., 2015; Ovaskainen et al., 2017) summarise it: each site receives scores <i>u</i> (“hidden” environmental variables) and each species loadings λ. Residual correlation comes from Λ Λ<sup>T</sup>. This is the principle of <a href="https://www.helsinki.fi/en/researchgroups/statistical-ecology/software/hmsc" target="_blank" rel="noopener">Hmsc</a>, <code>jSDM</code>, <code>gllvm</code> and <code>boral</code>.</p>""" + JAGS + K(0),
  exercice="""<ol>
  <li>Compare the JSDM residual correlations with those of the separate GLMs (lesson 1).</li>
  <li>Which pairs of species are positively associated once the environment is accounted for? negatively?</li>
  <li>Does a residual correlation prove a biological interaction? Discuss (unmeasured factors, scale).</li>
</ol>""")

EN["b9"] = dict(titre="Bayesian multi-species and spatio-temporal models", resume="Fit a hierarchical Bayesian community occupancy model (8 bird species) to estimate richness corrected for detection, then model the spatio-temporal change of a population (2010-2024) and quantify the uncertainty of trends.",
  quiz=[
    Q("In a community occupancy model, rare species…", ["borrow information from other species through the shared distributions", "are removed", "always have p = 1", "are modelled without covariates"], "This is the partial pooling of hierarchical models."),
    Q("The richness estimated by the community model is…", ["greater than or equal to the observed richness", "always lower than the observed richness", "equal to the number of visits", "independent of detection"], "The model adds species present but not detected."),
    Q("In mgcv, te(X, Y, ANNEE, d = c(2, 1)) represents…", ["a spatial surface that changes over time", "three independent linear effects", "an interaction between species", "an occupancy model"], "Tensor product of a 2D smooth (X, Y) and a 1D smooth (year)."),
    Q("Why simulate coefficients with MASS::mvrnorm(…, vcov(gam_st))?", ["to propagate uncertainty and compute probabilities, such as the probability of decline", "to speed up computation", "to remove missing values", "to change projection"], "We get an (approximate posterior) distribution of the predictions."),
  ])
EN["b9-l1"] = dict(titre="Hierarchical multi-species model (community occupancy)", duree="50 min",
  objectifs=["Understand borrowing strength (partial pooling) between species", "Fit a community occupancy model with JAGS", "Estimate the species richness of each site accounting for detection"],
  contenu="""
<p>The community occupancy model (Dorazio and Royle, 2005; Kéry and Royle, 2016) fits <b>all species at once</b>. The parameters of each species (ψ, p, NDVI effect) are drawn from a distribution <b>shared</b> by the community: rare, rarely detected species “borrow” information from common species. We then obtain the <b>true richness</b> of each site (sum of z), corrected for imperfect detection. The <a href="https://www.jeffdoser.com/files/spoccupancy-web/" target="_blank" rel="noopener">spOccupancy</a> package adds the spatial dimension.</p>""" + JAGS + K(0),
  exercice="""<ol>
  <li>Which species are favoured by high NDVI (95% interval above 0)? Which ones avoid dense vegetation?</li>
  <li>Why is estimated richness always greater than or equal to observed richness?</li>
  <li>Map the estimated richness of the point counts with <code>sf</code> (X, Y coordinates).</li>
</ol>""")
EN["b9-l2"] = dict(titre="Spatio-temporal model and trend uncertainty", duree="45 min",
  objectifs=["Model repeated counts in space and time with a tensor smooth", "Simulate the posterior distribution of predictions", "Map the 2010-2024 trend and the probability of decline"],
  contenu="""
<p>Long-term monitoring (annual counts at fixed points) raises two questions: <b>where</b> is the population changing, and with what <b>certainty</b>? A generalised additive model (GAM) with a <code>te(X, Y, ANNEE)</code> smooth allows a surface that changes over time. The penalised smooths of <code>mgcv</code> have a <b>Bayesian</b> interpretation (Gaussian random effects): the <code>Vp</code> matrix is the posterior covariance of the coefficients, which makes it possible to simulate predictions and compute probabilities. For fully Bayesian models, see <a href="https://www.r-inla.org" target="_blank" rel="noopener">R-INLA</a> (SPDE spatial fields), <code>sdmTMB</code> and <code>spOccupancy</code>. Real bird monitoring data: <a href="https://www.gbif.org" target="_blank" rel="noopener">GBIF</a>, <a href="https://ebird.org/science/status-and-trends" target="_blank" rel="noopener">eBird Status and Trends</a>.</p>""" + K(0),
  exercice="""<ol>
  <li>In which part of the area is the Barbary partridge declining? With what probability?</li>
  <li>Predict abundance for 2017 and compare with the counts observed that year.</li>
  <li>Why must we be very careful when predicting 2030 with this model (extrapolation)?</li>
</ol>""")
