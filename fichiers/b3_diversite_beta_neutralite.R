# R ENIV — parcours Biodiversité — Niveau 3 : Diversité bêta et neutralité
# Enseignant : BOUHAFSI SIDDIQ. Données FICTIVES (dossier donnees/biodiversite), noms d'espèces réels.
# Ouvrez TP_R.Rproj puis exécutez ce script ligne par ligne (Ctrl + Entrée).

# ==== Leçon b3-l1 : Diversité alpha, bêta, gamma et décomposition de Baselga
# ---- Niveau B3 : diversité bêta et neutralité ----
library(vegan)
com <- read.csv("donnees/biodiversite/communautes_plantes.csv", check.names = FALSE)
ab <- as.matrix(com[, -(1:3)])          # abondances : relevés en lignes, espèces en colonnes
rownames(ab) <- com$RELEVE
alpha <- data.frame(com[, 1:3], richesse = specnumber(ab),
                    shannon = diversity(ab, "shannon"), simpson = diversity(ab, "simpson"))
aggregate(cbind(richesse, shannon) ~ ZONE, data = alpha, FUN = mean)
gamma <- sum(colSums(ab) > 0)
beta_whittaker <- gamma / mean(alpha$richesse)
c(gamma = gamma, alpha_moy = mean(alpha$richesse), beta = beta_whittaker)

# ==== Leçon b3-l1 : Diversité alpha, bêta, gamma et décomposition de Baselga
pa <- (ab > 0) * 1
baselga <- function(x, y) {
  a <- sum(x & y); b <- sum(x & !y); c <- sum(!x & y)
  sor <- (b + c) / (2 * a + b + c); sim <- min(b, c) / (a + min(b, c))
  c(sorensen = sor, remplacement = sim, emboitement = sor - sim)
}
paires <- combn(nrow(pa), 2)
res <- t(apply(paires, 2, function(k) baselga(pa[k[1], ], pa[k[2], ])))
res <- data.frame(r1 = com$ZONE[paires[1, ]], r2 = com$ZONE[paires[2, ]], res)
res$type <- ifelse(res$r1 == res$r2, "même zone", "zones différentes")
aggregate(cbind(sorensen, remplacement, emboitement) ~ type, data = res, FUN = mean)

# Ordination NMDS de la composition
nmds <- metaMDS(ab, distance = "bray", k = 2, trace = FALSE)
plot(nmds$points, col = factor(com$ZONE), pch = 19, main = "NMDS (Bray-Curtis)")
legend("topright", legend = levels(factor(com$ZONE)), col = 1:3, pch = 19)
adonis2(ab ~ ZONE, data = com, permutations = 499)   # PERMANOVA

# ==== Leçon b3-l2 : Modèles nuls et théorie neutre
total <- colSums(ab)
fisher <- fisherfit(total[total > 0]); fisher$estimate        # alpha de Fisher
preston <- prestonfit(total[total > 0]); preston
rad <- radfit(total[total > 0]); rad                          # préemption, log-normale, Zipf, Mandelbrot...
plot(rad, main = "Diagrammes rang-abondance")

# Modèle nul : l'emboîtement (NODF) est-il plus fort que le hasard ?
nodf <- oecosimu(pa, nestednodf, method = "r00", nsimul = 199)
nodf$oecosimu$statistic; nodf$oecosimu$pval[3]

# ==== Leçon b3-l2 : Modèles nuls et théorie neutre
simul_neutre <- function(pool, J = 300, m = 0.1, pas = 20000) {
  com <- sample(names(pool), J, replace = TRUE, prob = pool)
  for (t in 1:pas) {
    i <- sample.int(J, 1)
    com[i] <- if (runif(1) < m) sample(names(pool), 1, prob = pool) else com[sample.int(J, 1)]
  }
  table(factor(com, levels = names(pool)))
}
set.seed(1)
pool <- total / sum(total)
neutres <- t(replicate(10, simul_neutre(pool, J = round(mean(rowSums(ab))))))
# Les relevés neutres sont-ils aussi différents entre eux que les vrais relevés ?
c(observe = mean(vegdist(ab)), neutre = mean(vegdist(neutres)))
