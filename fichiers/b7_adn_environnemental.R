# R ENIV — parcours Biodiversité — Niveau 7 : ADN environnemental et modélisation
# Enseignant : BOUHAFSI SIDDIQ. Données FICTIVES (dossier donnees/biodiversite), noms d'espèces réels.
# Ouvrez TP_R.Rproj puis exécutez ce script ligne par ligne (Ctrl + Entrée).

# ==== Leçon b7-l1 : De la mare à la donnée : la structure hiérarchique de l'ADNe
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

# ==== Leçon b7-l2 : Modèle d'occupation multi-échelle bayésien (JAGS)
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
