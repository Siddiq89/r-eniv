# R ENIV — parcours Biodiversité — Niveau 8 : Modèles joints de distribution d'espèces (JSDM)
# Enseignant : BOUHAFSI SIDDIQ. Données FICTIVES (dossier donnees/biodiversite), noms d'espèces réels.
# Ouvrez TP_R.Rproj puis exécutez ce script ligne par ligne (Ctrl + Entrée).

# ==== Leçon b8-l1 : Des SDM empilés aux co-occurrences
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

# ==== Leçon b8-l2 : Un JSDM bayésien à facteurs latents
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
