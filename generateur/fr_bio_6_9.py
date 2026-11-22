from outils import C, lecon, q

JAGS = """<div class="astuce"><b>Installer JAGS :</b> les modèles bayésiens de ce niveau utilisent le logiciel libre <a href="https://sourceforge.net/projects/mcmc-jags/" target="_blank" rel="noopener">JAGS</a> (à installer une fois sur Windows, comme un programme) puis le package <code>rjags</code> (<code>install.packages("rjags")</code>). Les calculs prennent de quelques secondes à une minute.</div>"""

B6 = dict(id="b6", numero=6, titre="Occupation et détection imparfaite", echelle="ψ · p",
  resume="Comprendre pourquoi « non détecté » ne veut pas dire « absent », estimer séparément la probabilité d'occupation et la probabilité de détection à partir de passages répétés, et dimensionner un protocole de terrain.",
  lecons=[
  lecon("b6-l1", "Le modèle d'occupation pas à pas", "45 min",
    ["Organiser des détections répétées en matrice sites × passages",
     "Écrire la vraisemblance du modèle d'occupation et l'ajuster avec optim()",
     "Comparer l'occupation estimée à l'occupation naïve"],
    """
<p>Sur le terrain, une espèce présente peut <b>ne pas être détectée</b> (oiseau silencieux, vent, observateur). Si l'on compte seulement les sites où elle a été vue, on <b>sous-estime</b> sa distribution. Le <b>modèle d'occupation</b> (MacKenzie et al., 2002) utilise des <b>passages répétés</b> sur chaque site pour séparer deux probabilités :</p>
<ul>
  <li>ψ (psi) : probabilité qu'un site soit <b>occupé</b>, qui dépend de l'habitat (ici le NDVI) ;</li>
  <li><i>p</i> : probabilité de <b>détecter</b> l'espèce lors d'un passage si elle est là, qui dépend des conditions (ici le vent).</li>
</ul>
<p>Pour un site où l'espèce a été vue au moins une fois, la vraisemblance vaut ψ × ∏ p<sup>y</sup>(1 − p)<sup>1 − y</sup>. Pour un site où elle n'a jamais été vue : ψ × ∏(1 − p) + (1 − ψ). Les données : 60 points d'écoute, 3 passages, 8 espèces d'oiseaux des monts de Tlemcen. Les vraies observations d'oiseaux d'Algérie sont consultables sur <a href="https://ebird.org" target="_blank" rel="noopener">eBird</a> et <a href="https://www.gbif.org" target="_blank" rel="noopener">GBIF</a>.</p>"""
    + C("""
# ---- Niveau B6 : occupation et détection imparfaite ----
library(dplyr); library(tidyr)
det <- read.csv("donnees/biodiversite/detections_oiseaux.csv")
pts <- read.csv("donnees/biodiversite/points_ecoute.csv")
esp <- "Cyanistes teneriffae"            # Mésange maghrébine
d <- filter(det, ESPECE == esp)
Y <- d |> select(SITE, PASSAGE, DETECTION) |>
  pivot_wider(names_from = PASSAGE, values_from = DETECTION, names_prefix = "passage_")
V <- d |> select(SITE, PASSAGE, VENT) |>
  pivot_wider(names_from = PASSAGE, values_from = VENT, names_prefix = "passage_")
sites <- Y$SITE
Y <- as.matrix(Y[, -1]); V <- as.matrix(V[, -1]) - 1.5    # vent centré (échelle 0 à 3)
zndvi <- as.numeric(scale(pts$ndvi[match(sites, pts$SITE)]))
head(Y)
naive <- mean(rowSums(Y) > 0); naive     # occupation naïve : proportion de sites avec au moins une détection

nll <- function(par) {                    # moins la log-vraisemblance
  psi <- plogis(par[1] + par[2] * zndvi)
  p <- plogis(par[3] + par[4] * V)
  vu <- apply(p^Y * (1 - p)^(1 - Y), 1, prod)
  jamais <- rowSums(Y) == 0
  -sum(log(psi * vu + (1 - psi) * jamais))
}
fit <- optim(c(0, 0, 0, 0), nll, method = "BFGS", hessian = TRUE)
est <- data.frame(parametre = c("psi: constante", "psi: NDVI", "p: constante", "p: vent"),
                  estimation = fit$par, erreur_type = sqrt(diag(solve(fit$hessian))))
est
psi_i <- plogis(fit$par[1] + fit$par[2] * zndvi)
c(occupation_naive = naive, occupation_estimee = mean(psi_i), detection_moyenne = plogis(fit$par[3]))
plot(pts$ndvi[match(sites, pts$SITE)], psi_i, xlab = "NDVI", ylab = "Probabilité d'occupation")
"""),
    """<ol>
  <li>De combien l'occupation naïve sous-estime-t-elle l'occupation estimée ?</li>
  <li>L'effet du vent sur la détection est-il négatif ? Est-il significatif (estimation / erreur type &gt; 2) ?</li>
  <li>Refaites l'analyse pour le Pic de Levaillant (<i>Picus vaillantii</i>), très discret : que constatez-vous ?</li>
</ol>"""),
  lecon("b6-l2", "Cartographier l'occupation et dimensionner le protocole", "35 min",
    ["Projeter la probabilité d'occupation sur un raster de covariables",
     "Calculer le nombre de passages nécessaires pour conclure à une absence",
     "Utiliser le package unmarked pour aller plus loin"],
    """
<p>Les coefficients estimés s'appliquent à toute la zone : il suffit de standardiser le raster de NDVI avec la <b>même moyenne et le même écart-type</b> que les données d'ajustement.</p>"""
    + C("""
library(terra)
cov <- rast("donnees/biodiversite/covariables_bio.tif")
ndvi_sites <- pts$ndvi[match(sites, pts$SITE)]
z <- (cov$ndvi - mean(ndvi_sites)) / sd(ndvi_sites)
psi_carte <- 1 / (1 + exp(-(fit$par[1] + fit$par[2] * z)))
plot(psi_carte, main = "Probabilité d'occupation de la Mésange maghrébine (fictif)")
dir.create("sorties", showWarnings = FALSE)
writeRaster(psi_carte, "sorties/occupation_mesange.tif", overwrite = TRUE)

# Combien de passages pour être sûr à 95 % qu'un site sans détection est vide ?
p_moy <- plogis(fit$par[3])
K <- 1:10
proba_detecter <- 1 - (1 - p_moy)^K
plot(K, proba_detecter, type = "b", ylim = c(0, 1), xlab = "Nombre de passages",
     ylab = "P(détection au moins une fois | présente)"); abline(h = 0.95, lty = 2)
min(K[proba_detecter >= 0.95])
""")
    + """
<p>Pour vos projets, le package <a href="https://cran.r-project.org/package=unmarked" target="_blank" rel="noopener">unmarked</a> ajuste ce modèle et de nombreuses variantes (plusieurs saisons, abondance N-mixture, faux positifs). La syntaxe <code>~ détection ~ occupation</code> est la même que dans notre fonction (code non exécuté sur notre serveur de test) :</p>"""
    + C("""
if (requireNamespace("unmarked", quietly = TRUE)) {
  umf <- unmarked::unmarkedFrameOccu(y = Y, siteCovs = data.frame(ndvi = zndvi),
                                     obsCovs = list(vent = V))
  m <- unmarked::occu(~ vent ~ ndvi, data = umf)
  print(m)
}
"""),
    """<ol>
  <li>Combien de passages faudrait-il pour la Mésange maghrébine ? pour le Pic de Levaillant ?</li>
  <li>Comparez la carte d'occupation à la carte du NDVI : où concentrer les efforts de conservation ?</li>
  <li>Si vous installez <code>unmarked</code>, vérifiez que ses estimations sont identiques à celles de <code>optim()</code>.</li>
</ol>"""),
  ],
  quiz=[
    q("Dans un modèle d'occupation, p représente…", ["la probabilité de détecter l'espèce lors d'un passage si elle est présente", "la proportion de sites visités", "la p-valeur", "la probabilité d'occupation"], 0, "ψ = occupation ; p = détection conditionnelle à la présence."),
    q("Pourquoi faut-il des passages répétés sur chaque site ?", ["pour séparer la non-détection de l'absence réelle", "pour augmenter le NDVI", "pour réduire le nombre de sites", "parce que GBIF l'exige"], 0, "La répétition informe sur la probabilité de détection."),
    q("L'occupation naïve est en général…", ["inférieure à l'occupation réelle", "supérieure à l'occupation réelle", "égale à 1", "égale à p"], 0, "Les sites occupés mais jamais détectés sont comptés comme vides."),
    q("Avec p = 0,4 par passage, la probabilité de détecter au moins une fois en 3 passages est…", ["1 − 0,6³ ≈ 0,78", "0,4³ ≈ 0,06", "3 × 0,4 = 1,2", "0,4"], 0, "1 − (1 − p)^K."),
  ])

B7 = dict(id="b7", numero=7, titre="ADN environnemental et modélisation", echelle="ψ · θ · p",
  resume="Comprendre la chaîne de l'ADN environnemental (prélèvement, extraction, PCR, métabarcoding), structurer des détections hiérarchiques et ajuster un modèle d'occupation multi-échelle bayésien avec JAGS.",
  lecons=[
  lecon("b7-l1", "De la mare à la donnée : la structure hiérarchique de l'ADNe", "35 min",
    ["Décrire les étapes d'une étude par ADN environnemental",
     "Organiser les détections par mare, échantillon d'eau et réplicat PCR",
     "Calculer la sensibilité cumulée d'un protocole"],
    """
<p>Les organismes laissent de l'ADN dans l'eau, le sol ou l'air (mucus, cellules, excréments). En filtrant quelques litres d'eau d'une mare et en amplifiant l'ADN par <b>PCR</b>, on peut détecter des espèces discrètes comme les amphibiens, sans les capturer. Avec le <b>métabarcoding</b>, on identifie toutes les espèces d'un groupe en comparant les séquences à des bases de référence (<a href="https://www.ncbi.nlm.nih.gov/genbank/" target="_blank" rel="noopener">GenBank</a>, <a href="https://boldsystems.org" target="_blank" rel="noopener">BOLD</a>).</p>
<p>La détection est imparfaite à <b>deux niveaux</b> : l'ADN peut être présent dans la mare sans être capturé dans un échantillon (θ), et présent dans l'échantillon sans être amplifié lors d'un réplicat PCR (<i>p</i>). Nos données : 40 mares, 3 échantillons d'eau par mare, 4 réplicats PCR par échantillon, 4 amphibiens d'Afrique du Nord.</p>"""
    + C("""
# ---- Niveau B7 : ADN environnemental ----
library(dplyr)
edna <- read.csv("donnees/biodiversite/edna_amphibiens.csv")
mares <- read.csv("donnees/biodiversite/mares.csv")
head(edna)
# Détection au niveau de la mare (au moins un réplicat positif)
edna |> group_by(ESPECE, MARE) |> summarise(det = max(DETECTION), .groups = "drop") |>
  group_by(ESPECE) |> summarise(mares_positives = sum(det), occupation_naive = mean(det))
# Proportion de réplicats PCR positifs dans les échantillons positifs
edna |> group_by(ESPECE, MARE, ECHANTILLON) |> filter(max(DETECTION) == 1) |>
  group_by(ESPECE) |> summarise(p_pcr_brut = mean(DETECTION))

# Sensibilité d'un protocole : J échantillons et K réplicats
sensibilite <- function(theta, p, J, K) 1 - (1 - theta * (1 - (1 - p)^K))^J
outer(1:5, 1:8, function(J, K) round(sensibilite(0.5, 0.55, J, K), 2))   # lignes : J ; colonnes : K
"""),
    """<ol>
  <li>Quelle espèce a l'occupation naïve la plus faible ?</li>
  <li>Avec θ = 0,5 et p = 0,55, quel protocole (J échantillons, K réplicats) atteint 95 % de sensibilité au moindre coût, si un échantillon coûte 3 fois plus qu'un réplicat ?</li>
  <li>Cherchez sur <a href="https://www.gbif.org/species/search?q=Pleurodeles%20nebulosus" target="_blank" rel="noopener">GBIF</a> les occurrences du Triton d'Algérie (<i>Pleurodeles nebulosus</i>).</li>
</ol>"""),
  lecon("b7-l2", "Modèle d'occupation multi-échelle bayésien (JAGS)", "45 min",
    ["Écrire un modèle hiérarchique à trois niveaux en langage BUGS",
     "Ajuster le modèle avec rjags et vérifier la convergence",
     "Interpréter ψ, θ et p et l'effet des covariables de la mare"],
    """
<p>Le modèle multi-échelle (Nichols et al., 2008 ; Dorazio et Erickson, 2018) s'écrit avec trois variables latentes emboîtées :</p>
<ul>
  <li>z<sub>i</sub> ~ Bernoulli(ψ<sub>i</sub>) : la mare <i>i</i> est occupée ;</li>
  <li>a<sub>ij</sub> ~ Bernoulli(z<sub>i</sub> θ) : l'échantillon <i>j</i> contient l'ADN ;</li>
  <li>y<sub>ijk</sub> ~ Bernoulli(a<sub>ij</sub> p) : le réplicat PCR <i>k</i> est positif.</li>
</ul>
<p>ψ dépend de la durée de mise en eau de la mare (hydropériode) et de la présence de bétail. Les packages <a href="https://cran.r-project.org/package=eDNAoccupancy" target="_blank" rel="noopener">eDNAoccupancy</a> et <code>msocc</code> proposent ce modèle prêt à l'emploi.</p>"""
    + JAGS
    + C("""
library(rjags)
esp <- "Pleurodeles nebulosus"
e <- filter(edna, ESPECE == esp)
N <- nrow(mares); J <- 3; K <- 4
y <- array(NA, c(N, J, K))
y[cbind(match(e$MARE, mares$MARE), e$ECHANTILLON, e$REPLICAT_PCR)] <- e$DETECTION
modele <- "
model {
  for (i in 1:N) {
    logit(psi[i]) <- a0 + a1 * hydro[i] + a2 * betail[i]
    z[i] ~ dbern(psi[i])
    for (j in 1:J) {
      a[i, j] ~ dbern(z[i] * theta)
      for (k in 1:K) { y[i, j, k] ~ dbern(a[i, j] * p) }
    }
  }
  a0 ~ dnorm(0, 0.4); a1 ~ dnorm(0, 0.4); a2 ~ dnorm(0, 0.4)
  theta ~ dbeta(1, 1); p ~ dbeta(1, 1)
  mares_occupees <- sum(z[])
}"
donnees <- list(y = y, N = N, J = J, K = K, betail = mares$betail,
                hydro = as.numeric(scale(mares$hydroperiode_mois)))
inits <- function() list(z = rep(1, N), a = matrix(1, N, J))
set.seed(7)
jm <- jags.model(textConnection(modele), data = donnees, inits = inits, n.chains = 3, quiet = TRUE)
update(jm, 1000)                                       # chauffe (burn-in)
post <- coda.samples(jm, c("a0", "a1", "a2", "theta", "p", "mares_occupees"), n.iter = 3000)
summary(post)$quantiles
gelman.diag(post)                                      # R-hat proche de 1 : convergence
plot(post[, c("a1", "theta", "p")])
"""),
    """<ol>
  <li>Comparez le nombre de mares occupées estimé (médiane et intervalle) au nombre de mares positives observées.</li>
  <li>L'hydropériode a-t-elle un effet positif ? La probabilité a posteriori P(a1 &gt; 0) se calcule avec <code>mean(as.matrix(post)[, "a1"] &gt; 0)</code>.</li>
  <li>Refaites le modèle pour <i>Discoglossus pictus</i> et comparez θ et p entre les deux espèces.</li>
</ol>"""),
  ],
  quiz=[
    q("Dans le modèle multi-échelle de l'ADNe, θ est la probabilité…", ["que l'ADN soit présent dans un échantillon d'eau d'une mare occupée", "qu'une mare soit occupée", "qu'un réplicat PCR soit positif", "d'une erreur de séquençage"], 0, "ψ : mare ; θ : échantillon ; p : réplicat PCR."),
    q("Le métabarcoding permet…", ["d'identifier plusieurs espèces à partir d'un seul échantillon grâce à des bases de séquences de référence", "de mesurer le NDVI", "de compter les individus à vue", "de géoréférencer une carte"], 0, "Les séquences sont comparées à GenBank, BOLD ou des bases locales."),
    q("Dans JAGS, à quoi sert la fonction gelman.diag() ?", ["vérifier la convergence des chaînes MCMC (R-hat)", "installer JAGS", "tracer une carte", "calculer l'AUC"], 0, "Un R-hat proche de 1 indique que les chaînes ont convergé."),
    q("Augmenter le nombre de réplicats PCR améliore surtout…", ["la détection dans un échantillon qui contient l'ADN", "l'occupation réelle des mares", "la qualité de l'eau", "le nombre de mares"], 0, "Les réplicats agissent sur 1 − (1 − p)^K."),
  ])

B8 = dict(id="b8", numero=8, titre="Modèles joints de distribution d'espèces (JSDM)", echelle="Hmsc · JAGS",
  resume="Passer des modèles espèce par espèce (SDM empilés) aux modèles joints qui estiment à la fois les réponses à l'environnement et les co-occurrences résiduelles entre espèces, avec un modèle à facteurs latents bayésien.",
  lecons=[
  lecon("b8-l1", "Des SDM empilés aux co-occurrences", "35 min",
    ["Ajuster un modèle par espèce (SDM empilés) avec glm()",
     "Distinguer co-occurrence brute et co-occurrence résiduelle",
     "Comprendre l'intérêt d'un modèle joint"],
    """
<p>Les espèces d'une communauté répondent à l'environnement (altitude, pluie) mais aussi les unes aux autres (compétition, facilitation) ou à des facteurs <b>non mesurés</b>. Deux espèces peuvent co-occurrer simplement parce qu'elles aiment la même altitude : c'est une co-occurrence « environnementale ». Le <b>JSDM</b> (Joint Species Distribution Model) modélise toutes les espèces ensemble et estime ce qui reste une fois l'environnement pris en compte : les <b>corrélations résiduelles</b>. Nos données : présence-absence de 10 plantes ligneuses sur 120 sites.</p>"""
    + C("""
# ---- Niveau B8 : JSDM ----
sites <- read.csv("donnees/biodiversite/sites_bio.csv")
pa <- read.csv("donnees/biodiversite/presences_plantes.csv")
Y <- as.matrix(pa[, -1]); colnames(Y) <- sub("_", " ", colnames(Y))
X <- data.frame(altitude = scale(sites$altitude)[, 1], pluie = scale(sites$pluie)[, 1],
                pente = scale(sites$pente)[, 1])
colMeans(Y)                                            # prévalence de chaque espèce
co_brute <- cor(Y)                                     # co-occurrence brute
# SDM empilés : un GLM probit par espèce
sdm <- lapply(seq_len(ncol(Y)), function(j)
  glm(Y[, j] ~ altitude + pluie + pente, data = X, family = binomial("probit")))
coefs <- t(sapply(sdm, coef)); rownames(coefs) <- colnames(Y); round(coefs, 2)
res <- sapply(sdm, residuals, type = "pearson")        # résidus de chaque espèce
co_resid <- cor(res); dimnames(co_resid) <- dimnames(co_brute)
round(co_resid[1:5, 1:5], 2)
heatmap(co_resid, symm = TRUE, col = hcl.colors(21, "Blue-Red 3"), main = "Corrélations résiduelles (approx.)")
"""),
    """<ol>
  <li>Quelles espèces augmentent avec l'altitude ? Lesquelles diminuent ?</li>
  <li>Trouvez une paire d'espèces avec une forte co-occurrence brute mais une faible corrélation résiduelle : comment l'expliquer ?</li>
  <li>Pourquoi les résidus de GLM séparés ne suffisent-ils pas pour estimer proprement les corrélations ?</li>
</ol>"""),
  lecon("b8-l2", "Un JSDM bayésien à facteurs latents", "50 min",
    ["Écrire un modèle probit multivarié à facteurs latents en langage BUGS",
     "Imposer les contraintes d'identifiabilité des facteurs",
     "Calculer et cartographier la matrice des corrélations résiduelles"],
    """
<p>Pour <i>S</i> espèces, une matrice de corrélation compte <i>S(S − 1)/2</i> paramètres. Les <b>facteurs latents</b> (Warton et al., 2015 ; Ovaskainen et al., 2017) la résument : chaque site reçoit des scores <i>u</i> (des variables environnementales « cachées ») et chaque espèce des chargements λ. La corrélation résiduelle vient de Λ Λ<sup>T</sup>. C'est le principe de <a href="https://www.helsinki.fi/en/researchgroups/statistical-ecology/software/hmsc" target="_blank" rel="noopener">Hmsc</a>, <code>jSDM</code>, <code>gllvm</code> et <code>boral</code>.</p>"""
    + JAGS
    + C("""
library(rjags)
modele <- "
model {
  for (i in 1:N) {
    for (f in 1:F) { u[i, f] ~ dnorm(0, 1) }
    for (j in 1:S) {
      eta[i, j] <- inprod(X[i, ], beta[j, ]) + inprod(u[i, ], lambda[j, ])
      Y[i, j] ~ dbern(phi(eta[i, j]))
    }
  }
  for (j in 1:S) { for (k in 1:P) { beta[j, k] ~ dnorm(0, 0.5) } }
  # contraintes d'identifiabilité (2 facteurs)
  lambda[1, 1] ~ dnorm(0, 1) T(0, ); lambda[1, 2] <- 0
  lambda[2, 1] ~ dnorm(0, 1);        lambda[2, 2] ~ dnorm(0, 1) T(0, )
  for (j in 3:S) { for (f in 1:F) { lambda[j, f] ~ dnorm(0, 1) } }
}"
Xm <- cbind(1, as.matrix(X))
donnees <- list(Y = Y, X = Xm, N = nrow(Y), S = ncol(Y), P = ncol(Xm), F = 2)
set.seed(8)
jm <- jags.model(textConnection(modele), data = donnees, n.chains = 2, quiet = TRUE)
update(jm, 1000)
post <- coda.samples(jm, c("beta", "lambda"), n.iter = 2000, thin = 2)
m <- as.matrix(post)
# corrélations résiduelles : moyenne a posteriori de cov2cor(Lambda Lambda' + I)
S <- ncol(Y)
R <- Reduce(`+`, lapply(seq_len(nrow(m)), function(t) {
  L <- matrix(m[t, grep("^lambda", colnames(m))], S, 2)
  cov2cor(L %*% t(L) + diag(S)) })) / nrow(m)
dimnames(R) <- list(colnames(Y), colnames(Y))
round(R[1:5, 1:5], 2)
heatmap(R, symm = TRUE, col = hcl.colors(21, "Blue-Red 3"), main = "JSDM : corrélations résiduelles")
# Effets de l'altitude (2e colonne de beta) : médiane a posteriori
b_alt <- apply(m[, sprintf("beta[%d,2]", 1:S)], 2, median); names(b_alt) <- colnames(Y)
round(sort(b_alt), 2)
"""),
    """<ol>
  <li>Comparez les corrélations résiduelles du JSDM à celles des GLM séparés (leçon 1).</li>
  <li>Quelles paires d'espèces sont associées positivement une fois l'environnement pris en compte ? négativement ?</li>
  <li>Une corrélation résiduelle prouve-t-elle une interaction biologique ? Discutez (facteurs non mesurés, échelle).</li>
</ol>"""),
  ],
  quiz=[
    q("Que modélise un JSDM en plus d'un SDM classique ?", ["les corrélations résiduelles entre espèces", "uniquement la température", "le NDVI", "les doublons GBIF"], 0, "Le JSDM estime conjointement les réponses à l'environnement et les co-occurrences résiduelles."),
    q("À quoi servent les facteurs latents dans un JSDM ?", ["résumer la matrice de corrélation entre espèces avec peu de paramètres", "remplacer les données de présence", "projeter en UTM", "calculer la pente"], 0, "Σ ≈ Λ Λᵀ avec quelques facteurs."),
    q("Deux espèces co-occurrent souvent mais leur corrélation résiduelle est nulle. C'est probablement parce que…", ["elles répondent de la même façon aux variables environnementales", "elles sont en compétition", "les données sont fausses", "le modèle n'a pas convergé"], 0, "Leur co-occurrence s'explique par l'environnement commun."),
    q("Quel package R est la référence pour les JSDM hiérarchiques ?", ["Hmsc", "readxl", "sf", "ggplot2"], 0, "Hmsc (Hierarchical Modelling of Species Communities)."),
  ])

B9 = dict(id="b9", numero=9, titre="Modèles bayésiens multi-espèces et spatio-temporels", echelle="JAGS · mgcv",
  resume="Ajuster un modèle hiérarchique bayésien d'occupation de communauté (8 espèces d'oiseaux) pour estimer la richesse corrigée de la détection, puis modéliser l'évolution spatio-temporelle d'une population (2010-2024) et quantifier l'incertitude des tendances.",
  lecons=[
  lecon("b9-l1", "Modèle hiérarchique multi-espèces (occupation de communauté)", "50 min",
    ["Comprendre l'emprunt de force (partial pooling) entre espèces",
     "Ajuster un modèle d'occupation de communauté avec JAGS",
     "Estimer la richesse spécifique de chaque site en tenant compte de la détection"],
    """
<p>Le modèle d'occupation de communauté (Dorazio et Royle, 2005 ; Kéry et Royle, 2016) ajuste <b>toutes les espèces à la fois</b>. Les paramètres de chaque espèce (ψ, p, effet du NDVI) sont tirés d'une distribution <b>commune</b> à la communauté : les espèces rares, peu détectées, « empruntent » de l'information aux espèces communes. On obtient alors la <b>richesse vraie</b> de chaque site (somme des z), corrigée de la détection imparfaite. Le package <a href="https://www.jeffdoser.com/files/spoccupancy-web/" target="_blank" rel="noopener">spOccupancy</a> ajoute la dimension spatiale.</p>"""
    + JAGS
    + C("""
# ---- Niveau B9 : modèles bayésiens multi-espèces et spatio-temporels ----
library(rjags)
det <- read.csv("donnees/biodiversite/detections_oiseaux.csv")
pts <- read.csv("donnees/biodiversite/points_ecoute.csv")
especes <- sort(unique(det$ESPECE)); sites <- pts$SITE
N <- length(sites); K <- 3; S <- length(especes)
y <- array(NA, c(N, K, S))
y[cbind(match(det$SITE, sites), det$PASSAGE, match(det$ESPECE, especes))] <- det$DETECTION
vent <- matrix(NA, N, K); vent[cbind(match(det$SITE, sites), det$PASSAGE)] <- det$VENT - 1.5
modele <- "
model {
  mu_a0 ~ dnorm(0, 0.4); mu_a1 ~ dnorm(0, 0.4); mu_b0 ~ dnorm(0, 0.4); b1 ~ dnorm(0, 0.4)
  sd_a0 ~ dunif(0, 3); sd_a1 ~ dunif(0, 3); sd_b0 ~ dunif(0, 3)
  for (s in 1:S) {
    a0[s] ~ dnorm(mu_a0, pow(sd_a0, -2))      # occupation propre à l'espèce
    a1[s] ~ dnorm(mu_a1, pow(sd_a1, -2))      # effet du NDVI propre à l'espèce
    b0[s] ~ dnorm(mu_b0, pow(sd_b0, -2))      # détection propre à l'espèce
    for (i in 1:N) {
      logit(psi[i, s]) <- a0[s] + a1[s] * ndvi[i]
      z[i, s] ~ dbern(psi[i, s])
      for (k in 1:K) {
        logit(p[i, k, s]) <- b0[s] + b1 * vent[i, k]
        y[i, k, s] ~ dbern(z[i, s] * p[i, k, s])
      }
    }
  }
  for (i in 1:N) { richesse[i] <- sum(z[i, ]) }
}"
donnees <- list(y = y, vent = vent, ndvi = as.numeric(scale(pts$ndvi)), N = N, K = K, S = S)
inits <- function() list(z = matrix(1, N, S))
set.seed(9)
jm <- jags.model(textConnection(modele), data = donnees, inits = inits, n.chains = 3, quiet = TRUE)
update(jm, 1000)
post <- coda.samples(jm, c("mu_a1", "sd_a1", "a1", "b0", "richesse"), n.iter = 2000)
m <- as.matrix(post)
a1 <- apply(m[, sprintf("a1[%d]", 1:S)], 2, quantile, c(0.025, 0.5, 0.975))
colnames(a1) <- especes; round(t(a1), 2)                 # effet du NDVI par espèce
rich_obs <- apply(y, 1, function(t) sum(apply(t, 2, max)))
rich_est <- apply(m[, sprintf("richesse[%d]", 1:N)], 2, median)
plot(rich_obs, rich_est, xlab = "Richesse observée", ylab = "Richesse estimée"); abline(0, 1, lty = 2)
"""),
    """<ol>
  <li>Quelles espèces sont favorisées par un NDVI élevé (intervalle à 95 % au-dessus de 0) ? Lesquelles évitent la végétation dense ?</li>
  <li>Pourquoi la richesse estimée est-elle toujours supérieure ou égale à la richesse observée ?</li>
  <li>Cartographiez la richesse estimée des points d'écoute avec <code>sf</code> (coordonnées X, Y).</li>
</ol>"""),
  lecon("b9-l2", "Modèle spatio-temporel et incertitude des tendances", "45 min",
    ["Modéliser des comptages répétés dans l'espace et le temps avec un lissage tensoriel",
     "Simuler la distribution a posteriori des prédictions",
     "Cartographier la tendance 2010-2024 et la probabilité de déclin"],
    """
<p>Les suivis à long terme (comptages annuels sur des points fixes) posent deux questions : <b>où</b> la population change-t-elle, et avec quelle <b>certitude</b> ? Un modèle additif généralisé (GAM) avec un lissage <code>te(X, Y, ANNEE)</code> permet une surface qui évolue dans le temps. Les lissages pénalisés de <code>mgcv</code> ont une interprétation <b>bayésienne</b> (effets aléatoires gaussiens) : la matrice <code>Vp</code> est la covariance a posteriori des coefficients, ce qui permet de simuler des prédictions et de calculer des probabilités. Pour des modèles entièrement bayésiens, voir <a href="https://www.r-inla.org" target="_blank" rel="noopener">R-INLA</a> (champs spatiaux SPDE), <code>sdmTMB</code> et <code>spOccupancy</code>. Données réelles de suivis d'oiseaux : <a href="https://www.gbif.org" target="_blank" rel="noopener">GBIF</a>, <a href="https://ebird.org/science/status-and-trends" target="_blank" rel="noopener">eBird Status and Trends</a>.</p>"""
    + C("""
library(mgcv); library(terra)
suivi <- read.csv("donnees/biodiversite/suivi_perdrix_2010_2024.csv")   # Perdrix gambra, fictif
head(suivi)
gam_st <- gam(COMPTAGE ~ te(X, Y, ANNEE, d = c(2, 1), k = c(12, 5)), family = nb(),
              data = suivi, method = "REML")
summary(gam_st)

# Grille de prédiction à 1 km pour 2010 et 2024
grille <- rast(ext(640000, 660000, 3830000, 3850000), resolution = 1000, crs = "EPSG:32630")
xy <- as.data.frame(crds(grille)); names(xy) <- c("X", "Y")
nd <- rbind(cbind(xy, ANNEE = 2010), cbind(xy, ANNEE = 2024))
Xp <- predict(gam_st, nd, type = "lpmatrix")
set.seed(10)
B <- MASS::mvrnorm(500, coef(gam_st), vcov(gam_st))     # tirages a posteriori des coefficients
eta <- Xp %*% t(B)                                      # log-abondance, 500 simulations
n <- nrow(xy)
evol <- exp(eta[(n + 1):(2 * n), ]) / exp(eta[1:n, ])   # rapport 2024 / 2010
tendance <- grille; values(tendance) <- log2(apply(evol, 1, median))
p_declin <- grille; values(p_declin) <- rowMeans(evol < 1)
plot(tendance, col = hcl.colors(50, "RdYlBu"), main = "log2(abondance 2024 / 2010)")
plot(p_declin, col = hcl.colors(50, "Reds", rev = TRUE), main = "Probabilité de déclin")
dir.create("sorties", showWarnings = FALSE)
writeRaster(c(tendance, p_declin), "sorties/perdrix_tendance_2010_2024.tif", overwrite = TRUE)
"""),
    """<ol>
  <li>Dans quelle partie de la zone la Perdrix gambra décline-t-elle ? Avec quelle probabilité ?</li>
  <li>Prédisez l'abondance pour 2017 et comparez aux comptages observés cette année-là.</li>
  <li>Pourquoi faut-il être très prudent si l'on prédit 2030 avec ce modèle (extrapolation) ?</li>
</ol>"""),
  ],
  quiz=[
    q("Dans un modèle d'occupation de communauté, les espèces rares…", ["empruntent de l'information aux autres espèces via les distributions communes", "sont supprimées", "ont toujours p = 1", "sont modélisées sans covariables"], 0, "C'est l'emprunt de force (partial pooling) des modèles hiérarchiques."),
    q("La richesse estimée par le modèle de communauté est…", ["supérieure ou égale à la richesse observée", "toujours inférieure à la richesse observée", "égale au nombre de passages", "indépendante de la détection"], 0, "Le modèle ajoute les espèces présentes mais non détectées."),
    q("Dans mgcv, te(X, Y, ANNEE, d = c(2, 1)) représente…", ["une surface spatiale qui évolue dans le temps", "trois effets linéaires indépendants", "une interaction entre espèces", "un modèle d'occupation"], 0, "Produit tensoriel d'un lissage 2D (X, Y) et d'un lissage 1D (année)."),
    q("Pourquoi simuler des coefficients avec MASS::mvrnorm(…, vcov(gam_st)) ?", ["pour propager l'incertitude et calculer des probabilités, comme la probabilité de déclin", "pour accélérer le calcul", "pour supprimer les valeurs manquantes", "pour changer de projection"], 0, "On obtient une distribution (approx. a posteriori) des prédictions."),
  ])
