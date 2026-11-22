import random
def perm(niv_id, i, n):
    r = random.Random(f"{niv_id}-{i}-eniv"); p = list(range(n)); r.shuffle(p); return p  # p[nouvelle_pos] = ancienne_pos
def melanger_fr(niveaux):
    for n in niveaux:
        for i, q in enumerate(n['quiz']):
            p = perm(n['id'], i, len(q['choix']))
            q['choix'] = [q['choix'][k] for k in p]; q['bonne'] = p.index(q['bonne'])
def melanger_trad(D, niveaux):
    for n in niveaux:
        t = D.get(n['id'])
        for i, tq in enumerate(t['quiz']):
            p = perm(n['id'], i, len(tq['choix'])); tq['choix'] = [tq['choix'][k] for k in p]
