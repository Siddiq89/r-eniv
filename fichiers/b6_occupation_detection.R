# R ENIV — parcours Biodiversité — Niveau 6 : Occupation et détection imparfaite
# Enseignant : BOUHAFSI SIDDIQ. Données FICTIVES (dossier donnees/biodiversite), noms d'espèces réels.
# Ouvrez TP_R.Rproj puis exécutez ce script ligne par ligne (Ctrl + Entrée).

# ==== Leçon b6-l1 : Le modèle d'occupation pas à pas
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

# ==== Leçon b6-l2 : Cartographier l'occupation et dimensionner le protocole
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

# ==== Leçon b6-l2 : Cartographier l'occupation et dimensionner le protocole
if (requireNamespace("unmarked", quietly = TRUE)) {
  umf <- unmarked::unmarkedFrameOccu(y = Y, siteCovs = data.frame(ndvi = zndvi),
                                     obsCovs = list(vent = V))
  m <- unmarked::occu(~ vent ~ ndvi, data = umf)
  print(m)
}
