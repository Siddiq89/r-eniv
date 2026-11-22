import json, sys
V = [
 ("r1","","Les premiers pas avec R et RStudio (tutoriel pour les francophones)","pAm-6xxWkoE","Jean-Herman Guay"),
 ("r1","r1-l1","Installer R et RStudio sur votre ordinateur facilement","I-KZoK6Bc7E","Mikail Altundas"),
 ("r1","r1-l1","Prise en main facile et installation de R et RStudio","xubbiMmAjKA","TheData Kit"),
 ("r1","r1-l1","Télécharger et installer R et RStudio (en arabe)","BxppD9TtFEs","درس رياضيات ماث اون لاين"),
 ("r1","r1-l1","Tutoriel R du débutant au professionnel, leçon 1 : télécharger et installer R (en arabe)","roDs7WKAKyY","Mohamed Habashy"),
 ("r1","r1-l2","Introduction au logiciel R","y1L1fN8etZg","Statistical Models for Social Sciences"),
 ("r1","r1-l2","L'interface de RStudio (en arabe)","LvXq_pXPZbw","درس رياضيات ماث اون لاين"),
 ("r1","r1-l2","R pour débutants : découvrir RStudio (en arabe)","tNZzGrjfFLM","Mohamed El Desouki"),
 ("r1","","Introduction au langage R (en arabe)","nc9lDDmqkqw","Dr Rasha Nofal"),
 ("r2","r2-l1","webin-R #02 : les bases du langage R","Eh8piunoqQc","webin-R"),
 ("r2","r2-l1","Logiciel R : les types d'objets","KdSysaL8aKo","Manage Data Easily"),
 ("r2","r2-l2","Manipuler des vecteurs : R, un langage vectorisé","qmwQQCmtqfI","PabR67"),
 ("r2","r2-l4","Vecteurs et matrices","aXxAAjKadMw","PabR67"),
 ("r2","r2-l4","Convertir des chaînes de caractères en facteurs ou en nombres","xeSn6Y5Cj_g","Minukuu Tutorials"),
 ("r3","r3-l1","Créer un data frame dans R","BDaQEqDWvXQ","LES STATISTIQUES AVEC LE LOGICIEL R"),
 ("r3","r3-l1","Étendre un data frame (ajouter une colonne)","82Z8gnQpCy0","Manage Data Easily"),
 ("r3","r3-l2","Importer des données Excel, CSV ou texte dans R","22uO8uK5GXU","Minukuu Tutorials"),
 ("r3","r3-l2","Différences entre read.csv et read.csv2","Pt73OweqsqA","Minukuu Tutorials"),
 ("r3","r3-l3","Tidyverse en bref (1) : dplyr","tKzolveZgvM","WeData"),
 ("r3","r3-l4","webin-R #04 : manipuler les données avec dplyr","aFvBhgmawcs","webin-R"),
 ("r4","r4-l1","ggplot2 : graphiques de base","GK3FWftJA5c","WeData"),
 ("r4","r4-l2","ggplot2 : introduction","N7iHe7Fo-P4","WeData"),
 ("r4","r4-l2","webin-R #08 : ggplot2 et la grammaire des graphiques","msnwENny_cg","webin-R"),
 ("r4","r4-l3","webin-R #09 : graphiques uni- et bivariés avec ggplot2","73xvKXSnV1I","webin-R"),
 ("r4","","Visualisation des données dans R avec ggplot2 et plotly (formation complète)","j_sMzsJg_O8","J.A DATATECH CONSULTING"),
 ("r5","r5-l1","webin-R #03 : statistiques descriptives","oEF_8GXyP5c","webin-R"),
 ("r5","r5-l2","Comparer des moyennes : Student, Wilcoxon, ANOVA et Kruskal-Wallis dans R","ZU2brwY8LKA","Cabinet ELAN CONSULT"),
 ("r5","r5-l2","Test t de Student avec R","ny5eDeTI33I","Denis Lavillonière"),
 ("r5","r5-l2","Test t pour un échantillon dans RStudio (en arabe)","WnbsT-HN7Oc","د. أسماء الميرغني"),
 ("r5","r5-l3","Régression linéaire simple avec R","DYkBuNbcbSA","François Husson"),
 ("r5","r5-l3","Régression linéaire simple et multiple sous RStudio","kxaBVghhRk0","Statistical Models for Social Sciences"),
 ("r5","r5-l3","Régression linéaire multiple avec R (en arabe)","uWyIOYsYUHE","د. أسماء الميرغني"),
 ("r6","r6-l1","Les structures conditionnelles : R pour débutant","tjk2GJ3ITZA","IDS-Sprachschule"),
 ("r6","r6-l1","La boucle for en R","rW9wLDkfVsk","Naben"),
 ("r6","r6-l2","If-else, for et function : créer sa propre fonction sous R","h_b0Gi1Er3w","Lulus CommentdansR"),
 ("r6","r6-l3","Boucles et fonctions en langage R","hA9qR7__ge8","Germano VERA CRUZ"),
 ("r7","r7-l1","Cartographie avec R : importation des données de la carte","f0xpjRePlDc","Senegal for Artificial Intelligence - SN4AI"),
 ("r7","r7-l4","La cartographie avec le logiciel R de A à Z","OwLibDdu4_E","Stéphane Bourrelly"),
 ("r7","r7-l4","Le package R cartography (Timothée Giraud)","OI3_AOg6pfc","Mate-shs"),
 ("r7","r7-l4","Comment construire une représentation cartographique ? (notions de cartographie)","Uhan4Mf90co","Guillaume Michel"),
 ("r7","","Carte interactive simple sur RStudio avec Leaflet","aBR9dIOjrMg","Ugéosphère"),
 ("r8","r8-l1","Données raster et algèbre cartographique (notions SIG, sans R)","GO556Qn33oc","Walid Moulahoum (Moul el SIG)"),
 ("r8","r8-l1","Modèle de données raster (théorie)","NBmVtMniasU","Walid Moulahoum (Moul el SIG)"),
 ("r8","r8-l2","Réaliser une carte de pente à partir d'un MNT (notions, autre logiciel que R)","4tAnUTb_vmY","EGD ACADEMIA"),
]
out = [dict(niveau=n, lecon=l, titre=t, url="https://www.youtube.com/watch?v="+i, duree="", description=f"Chaîne YouTube : {c}.") for n,l,t,i,c in V]
assert len({o['url'] for o in out}) == len(out)
head = """/*
 * VIDÉOS TUTORIELLES — parcours R
 * Vidéos YouTube en français ou en arabe uniquement, vérifiées en ligne le 22/11/2026.
 * Ajoutez des vidéos depuis la page « Administration » du site, puis remplacez ce fichier
 * par le videos.js téléchargé, ou copiez un bloc { ... } à la main.
 * Champs : niveau ("r1"…"r8"), lecon (ex. "r3-l2" ou "" pour tout le niveau), titre,
 *          url (YouTube ou videos/fichier.mp4), duree, description ("Chaîne YouTube : Nom." alimente la page Remerciements).
 */
"""
open(sys.argv[1],'w',encoding='utf-8').write(head+"window.VIDEOS = "+json.dumps(out,ensure_ascii=False,indent=2)+";\n")
print(len(out), "vidéos,", len({v[4] for v in V}), "chaînes")
