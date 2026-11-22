# Génère images/fond_ecologie.svg (clair) et fond_ecologie_sombre.svg : collines boisées et prairie fleurie.
import random, math, sys
def colline(x, base, amp, ph):
    return base - amp * (0.55*math.sin(x/260+ph) + 0.3*math.sin(x/97+2*ph) + 0.15*math.sin(x/41+ph))
def fleur(x, y, t, coul, coeur, tige, r):
    s = [f'<path d="M{x:.0f},{y:.0f} q{r.uniform(-4,4):.0f},-{t*0.5:.0f} 0,-{t:.0f}" stroke="{tige}" stroke-width="1.6" fill="none"/>']
    cy = y - t; p = t * 0.22
    for k in range(5):
        a = k * 2 * math.pi / 5 + r.random()
        s.append(f'<ellipse cx="{x+math.cos(a)*p:.1f}" cy="{cy+math.sin(a)*p:.1f}" rx="{p*0.75:.1f}" ry="{p*0.5:.1f}" transform="rotate({math.degrees(a):.0f} {x+math.cos(a)*p:.1f} {cy+math.sin(a)*p:.1f})" fill="{coul}"/>')
    s.append(f'<circle cx="{x:.1f}" cy="{cy:.1f}" r="{p*0.45:.1f}" fill="{coeur}"/>')
    return "".join(s)
def lavande(x, y, t, coul, tige, r):
    s = [f'<path d="M{x:.0f},{y:.0f} l0,-{t:.0f}" stroke="{tige}" stroke-width="1.4"/>']
    for k in range(6): s.append(f'<ellipse cx="{x:.1f}" cy="{y-t+k*3.2:.1f}" rx="2.4" ry="2" fill="{coul}"/>')
    return "".join(s)
def paysage(sombre):
    r = random.Random(7)
    if sombre:
        ciel = ("#0c1a17", "#12261f"); couches = ["#173327", "#14301f", "#10291a", "#0c2215"]; arbre = "#0a1d12"; soleil = "#2a4a35"
        prairie = "#0e2618"; tige = "#24503a"; fl = [("#8a3a3a", "#2b1a10"), ("#b9b9a6", "#a08a3a"), ("#a8913a", "#6b4f1c"), ("#6d5a8c", "#3a2f4a")]; lav = "#5a4b7a"
    else:
        ciel = ("#eef6ee", "#d9ecdc"); couches = ["#c4dfc6", "#a3cda7", "#7fb685", "#5d9c66"]; arbre = "#3f7d4a"; soleil = "#fdf3c4"
        prairie = "#6fae6f"; tige = "#3c7a43"; fl = [("#d9342b", "#2b1a10"), ("#ffffff", "#f2c230"), ("#f4c430", "#b5651d"), ("#e98fc4", "#f7e27a"), ("#7b6bd6", "#f7e27a")]; lav = "#8a6fc9"
    s = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">',
         f'<defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{ciel[0]}"/><stop offset="1" stop-color="{ciel[1]}"/></linearGradient>',
         f'<radialGradient id="s" cx=".78" cy=".22" r=".35"><stop offset="0" stop-color="{soleil}" stop-opacity=".9"/><stop offset="1" stop-color="{soleil}" stop-opacity="0"/></radialGradient></defs>',
         '<rect width="1600" height="900" fill="url(#c)"/><rect width="1600" height="900" fill="url(#s)"/>']
    for k, (base, amp, col) in enumerate(zip([520, 600, 690, 780], [110, 90, 70, 50], couches)):
        ph = r.random() * 6
        pts = [f"{x},{colline(x, base, amp, ph):.0f}" for x in range(0, 1601, 40)]
        s.append(f'<path d="M0,900 L{" L".join(pts)} L1600,900 Z" fill="{col}"/>')
        if k >= 2:
            for _ in range(28 if k == 2 else 22):
                x = r.uniform(0, 1600); y = colline(x, base, amp, ph) + 6
                h = r.uniform(26, 48) * (1.4 if k == 3 else 1); w = h * 0.32; c = arbre if k == 3 else couches[3]
                if r.random() < .5: s.append(f'<path d="M{x:.0f},{y-h:.0f} L{x+w:.0f},{y:.0f} L{x-w:.0f},{y:.0f} Z" fill="{c}"/>')
                else: s.append(f'<ellipse cx="{x:.0f}" cy="{y-h*.55:.0f}" rx="{w*1.3:.0f}" ry="{h*.5:.0f}" fill="{c}"/><rect x="{x-1.5:.0f}" y="{y-h*.2:.0f}" width="3" height="{h*.25:.0f}" fill="{c}"/>')
    # prairie fleurie au premier plan
    ph = r.random() * 6
    pts = [f"{x},{colline(x, 845, 22, ph):.0f}" for x in range(0, 1601, 40)]
    s.append(f'<path d="M0,900 L{" L".join(pts)} L1600,900 Z" fill="{prairie}"/>')
    for _ in range(170):
        x = r.uniform(0, 1600); y = colline(x, 845, 22, ph) + r.uniform(8, 60)
        t = r.uniform(14, 30)
        if r.random() < 0.18: s.append(lavande(x, y, t + 6, lav, tige, r))
        else:
            c, cc = r.choice(fl); s.append(fleur(x, y, t, c, cc, tige, r))
    for _ in range(5):
        x = r.uniform(200, 1300); y = r.uniform(120, 300); a = r.uniform(8, 14)
        s.append(f'<path d="M{x-a:.0f},{y:.0f} q{a/2:.0f},-{a/2:.0f} {a:.0f},0 q{a/2:.0f},-{a/2:.0f} {a:.0f},0" fill="none" stroke="{"#3b6b4d" if sombre else couches[3]}" stroke-width="2"/>')
    s.append('</svg>'); return "".join(s)
d = sys.argv[1]
open(d + '/fond_ecologie.svg', 'w').write(paysage(False))
open(d + '/fond_ecologie_sombre.svg', 'w').write(paysage(True))
