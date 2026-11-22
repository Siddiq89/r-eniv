# R ENIV — parcours Biodiversité — Niveau 9 : Modèles bayésiens multi-espèces et spatio-temporels
# Enseignant : BOUHAFSI SIDDIQ. Données FICTIVES (dossier donnees/biodiversite), noms d'espèces réels.
# Ouvrez TP_R.Rproj puis exécutez ce script ligne par ligne (Ctrl + Entrée).

# ==== Leçon b9-l1 : Modèle hiérarchique multi-espèces (occupation de communauté)
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

# ==== Leçon b9-l2 : Modèle spatio-temporel et incertitude des tendances
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
