# R ENIV — parcours Biodiversité — Niveau 5 : Modèles de distribution et IA explicable
# Enseignant : BOUHAFSI SIDDIQ. Données FICTIVES (dossier donnees/biodiversite), noms d'espèces réels.
# Ouvrez TP_R.Rproj puis exécutez ce script ligne par ligne (Ctrl + Entrée).

# ==== Leçon b5-l1 : Un SDM par forêt aléatoire
# ---- Niveau B5 : SDM et IA explicable ----
library(ranger); library(terra)
sites <- read.csv("donnees/biodiversite/sites_bio.csv")
pa <- read.csv("donnees/biodiversite/presences_plantes.csv")
d <- merge(sites, pa[, c("SITE", "Tetraclinis_articulata")], by = "SITE")
d$presence <- factor(d$Tetraclinis_articulata, levels = c(0, 1))
vars <- c("altitude", "pente", "tmoy", "pluie", "ndvi")
set.seed(2026)
test <- sample(nrow(d), 36)
rf <- ranger(presence ~ altitude + pente + tmoy + pluie + ndvi, data = d[-test, ],
             probability = TRUE, num.trees = 500, importance = "permutation")
rf
p_test <- predict(rf, d[test, ])$predictions[, "1"]
auc <- function(p, y) { r <- rank(p); n1 <- sum(y == 1); n0 <- sum(y == 0)
  (sum(r[y == 1]) - n1 * (n1 + 1) / 2) / (n1 * n0) }
auc(p_test, d$Tetraclinis_articulata[test])     # 0.5 = hasard, 1 = parfait

cov <- rast("donnees/biodiversite/covariables_bio.tif")
carte <- predict(cov, rf, fun = function(m, ...) predict(m, ...)$predictions[, "1"], na.rm = TRUE)
plot(carte, main = "Probabilité de présence du thuya (modèle fictif)")
dir.create("sorties", showWarnings = FALSE)
writeRaster(carte, "sorties/sdm_thuya.tif", overwrite = TRUE)

# ==== Leçon b5-l2 : Expliquer le modèle : importance, dépendance partielle, explication locale
imp <- sort(importance(rf), decreasing = TRUE); imp
barplot(imp, las = 2, main = "Importance par permutation")

pdp <- function(modele, donnees, variable, n = 25) {
  grille <- seq(min(donnees[[variable]]), max(donnees[[variable]]), length.out = n)
  ice <- sapply(grille, function(v) { tmp <- donnees; tmp[[variable]] <- v
    predict(modele, tmp)$predictions[, "1"] })
  list(x = grille, ice = ice, pdp = colMeans(ice))
}
dp <- pdp(rf, d, "altitude")
matplot(dp$x, t(dp$ice), type = "l", lty = 1, col = "grey80", xlab = "Altitude (m)", ylab = "Probabilité")
lines(dp$x, dp$pdp, lwd = 3, col = "darkgreen")

# Explication locale d'un site : contribution approchée de chaque variable
site <- d[1, ]; p0 <- as.numeric(predict(rf, site)$predictions[, "1"])
contrib <- sapply(vars, function(v) { tmp <- site; tmp[[v]] <- mean(d[[v]])
  p0 - as.numeric(predict(rf, tmp)$predictions[, "1"]) })
round(c(prediction = p0, contrib), 3)
