# =====================================================================
# R ENIV · Niveau 5 · Statistiques appliquées à l'environnement
# =====================================================================
library(dplyr)
qualite <- read.csv2("donnees/tables/qualite_eau_forages.csv", encoding = "UTF-8")
pluie   <- read.csv("donnees/tables/pluie_mensuelle.csv")
forages <- read.csv("donnees/tables/forages_attributs.csv", encoding = "UTF-8")

# 1. Statistique descriptive
summary(qualite$NITRATES_MGL)
sd(qualite$NITRATES_MGL); var(qualite$NITRATES_MGL)
quantile(qualite$NITRATES_MGL, c(0.1, 0.5, 0.9))
cv <- 100 * sd(qualite$NITRATES_MGL) / mean(qualite$NITRATES_MGL); cv
qualite |> group_by(CAMPAGNE) |>
  summarise(n = n(), moy = mean(NITRATES_MGL), med = median(NITRATES_MGL), et = sd(NITRATES_MGL))
table(qualite$NITRATES_MGL > 50, qualite$CAMPAGNE)

# 2. Normalité
shapiro.test(qualite$NITRATES_MGL)
qqnorm(qualite$NITRATES_MGL); qqline(qualite$NITRATES_MGL)

# 3. Comparer deux campagnes (mêmes forages -> test apparié)
hautes <- qualite |> filter(CAMPAGNE == "Hautes eaux") |> arrange(ID_FOR)
basses <- qualite |> filter(CAMPAGNE == "Basses eaux") |> arrange(ID_FOR)
t.test(basses$NITRATES_MGL, hautes$NITRATES_MGL, paired = TRUE)
wilcox.test(basses$NITRATES_MGL, hautes$NITRATES_MGL, paired = TRUE)

# 4. Corrélation et régression : nitrates ~ profondeur
d <- hautes |> left_join(forages, by = "ID_FOR")
cor(d$PROF_M, d$NITRATES_MGL)
cor.test(d$PROF_M, d$NITRATES_MGL, method = "pearson")
modele <- lm(NITRATES_MGL ~ PROF_M, data = d)
summary(modele)
plot(d$PROF_M, d$NITRATES_MGL, pch = 19, xlab = "Profondeur (m)", ylab = "Nitrates (mg/L)")
abline(modele, col = "red", lwd = 2)
predict(modele, newdata = data.frame(PROF_M = c(50, 150, 250)))
par(mfrow = c(2, 2)); plot(modele); par(mfrow = c(1, 1))

# 5. Comparer plusieurs groupes : nitrates selon l'état du forage (ANOVA)
a <- aov(NITRATES_MGL ~ ETAT, data = d); summary(a)
kruskal.test(NITRATES_MGL ~ ETAT, data = d)

# 6. Tendance de la pluie annuelle (test de Mann-Kendall = tau de Kendall avec le temps)
annuel <- pluie |> group_by(ANNEE) |> summarise(P = sum(PLUIE_MM, na.rm = TRUE) / 5)
cor.test(annuel$ANNEE, annuel$P, method = "kendall")
tendance <- lm(P ~ ANNEE, data = annuel); coef(tendance)   # mm par an

# 7. Khi-deux : cause des feux selon l'occupation du sol
feux <- read.csv("donnees/tables/feux_inventaire.csv", encoding = "UTF-8")
tab <- table(feux$OCCUP, feux$CAUSE); tab
chisq.test(tab, simulate.p.value = TRUE)
