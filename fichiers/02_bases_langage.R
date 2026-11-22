# =====================================================================
# R ENIV · Niveau 2 · Les bases du langage R
# =====================================================================

# 1. Objets et types
altitude <- 852            # numeric
station  <- "Tamda"        # character
en_service <- TRUE         # logical
class(altitude); class(station); class(en_service)

# 2. Vecteurs : pluie mensuelle (mm) d'une année fictive
mois  <- c("Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc")
pluie <- c(62, 55, 52, 40, 30, 8, 2, 4, 22, 40, 58, 64)
names(pluie) <- mois
length(pluie)
sum(pluie)                 # cumul annuel
mean(pluie)
pluie * 1.1                # opération vectorisée : +10 % sur chaque mois
pluie_cm <- pluie / 10

# 3. Indexation
pluie[1]                   # janvier
pluie[c(6, 7, 8)]          # été
pluie["Oct"]
pluie[pluie > 50]          # mois humides
which(pluie == max(pluie)) # mois le plus pluvieux

# 4. Valeurs manquantes
debit <- c(6.5, 7.1, NA, 16.0, 4.5)
mean(debit)                # NA !
mean(debit, na.rm = TRUE)
is.na(debit)
sum(is.na(debit))

# 5. Facteurs
etat <- factor(c("En service", "À l'arrêt", "En service", "Abandonné", "En service"))
levels(etat)
table(etat)

# 6. Séquences et répétitions
annees <- 2010:2024
seq(0, 1000, by = 250)
rep("S01", 3)

# 7. Listes et matrices
forage <- list(id = "F001", prof_m = 175, analyses = c(38.7, 41.2))
forage$prof_m
forage[["analyses"]][2]
m <- matrix(1:6, nrow = 2)
m; dim(m); t(m)
