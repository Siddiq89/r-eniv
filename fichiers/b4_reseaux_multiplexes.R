# R ENIV — parcours Biodiversité — Niveau 4 : Réseaux écologiques multiplexes
# Enseignant : BOUHAFSI SIDDIQ. Données FICTIVES (dossier donnees/biodiversite), noms d'espèces réels.
# Ouvrez TP_R.Rproj puis exécutez ce script ligne par ligne (Ctrl + Entrée).

# ==== Leçon b4-l1 : Réseaux bipartis d'interactions
# ---- Niveau B4 : réseaux écologiques multiplexes ----
library(igraph); library(vegan)
pol <- read.csv("donnees/biodiversite/reseau_pollinisation.csv")
her <- read.csv("donnees/biodiversite/reseau_herbivorie.csv")
head(pol)
M_pol <- xtabs(interactions ~ plante + pollinisateur, data = pol)
M_pol <- unclass(M_pol)
dim(M_pol)
connectance <- sum(M_pol > 0) / length(M_pol)
nodf <- nestednodf(M_pol > 0)$statistic["NODF"]
c(connectance = connectance, NODF = unname(nodf))

g <- graph_from_biadjacency_matrix(M_pol, weighted = TRUE)
V(g)$color <- ifelse(V(g)$type, "gold", "forestgreen")
plot(g, layout = layout_as_bipartite(g), vertex.label.cex = 0.6, vertex.size = 6,
     edge.width = E(g)$weight / 5, main = "Réseau plantes-pollinisateurs")
sort(degree(g)[!V(g)$type], decreasing = TRUE)[1:5]   # plantes les plus visitées
mod <- cluster_louvain(g, weights = E(g)$weight)
modularity(mod); table(membership(mod))

# ==== Leçon b4-l2 : Réseau multiplexe et robustesse aux extinctions
M_her <- unclass(xtabs(interactions ~ plante + herbivore, data = her))
plantes <- sort(union(rownames(M_pol), rownames(M_her)))
deg <- data.frame(plante = plantes,
                  pollinisation = rowSums(M_pol > 0)[plantes],
                  herbivorie = rowSums(M_her > 0)[plantes])
deg[is.na(deg)] <- 0
deg$multiplexe <- deg$pollinisation + deg$herbivorie
# Coefficient de participation : 1 = liens répartis entre couches, 0 = une seule couche
deg$participation <- 2 * (1 - ((deg$pollinisation / deg$multiplexe)^2 + (deg$herbivorie / deg$multiplexe)^2))
deg[order(-deg$multiplexe), ]
cor.test(deg$pollinisation, deg$herbivorie, method = "spearman")

# ==== Leçon b4-l2 : Réseau multiplexe et robustesse aux extinctions
robustesse <- function(M, ordre) {
  survie <- sapply(0:nrow(M), function(k) {
    reste <- M[setdiff(rownames(M), ordre[seq_len(k)]), , drop = FALSE]
    mean(colSums(reste) > 0)
  })
  list(survie = survie, R = mean(survie))
}
set.seed(42)
hasard <- replicate(100, robustesse(M_pol, sample(rownames(M_pol)))$R)
plus_connectees <- names(sort(rowSums(M_pol > 0), decreasing = TRUE))
r_cible <- robustesse(M_pol, plus_connectees)
c(hasard = mean(hasard), plus_connectees_d_abord = r_cible$R)
plot(0:nrow(M_pol) / nrow(M_pol), r_cible$survie, type = "s", col = "firebrick",
     xlab = "Proportion de plantes perdues", ylab = "Pollinisateurs survivants")
