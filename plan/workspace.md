# Collaboro — (workspace)

> plan “dossiers + fichiers” basé sur ton blueprint.  
> tu peux importer ce `.md` dans notion ou le découper en pages ensuite.

---

## contexte projet (hypothèses)

- **nom du projet :** Collaboro  
- **one-liner :** plateforme québécoise qui transforme l’entraide (bénévolat + petits services) en **récompenses locales** + **réputation humaine**.  
- **pour qui (persona) :**
  1) étudiant/jeune pro qui veut s’impliquer + bâtir un “cv social”  
  2) obnl/organisme qui manque de bras  
  3) commerce local qui veut du trafic + impact
- **promesse / valeur :** “donne du temps → gagne du local → prouve ta fiabilité”
- **stade actuel :** idée + plan, maquette figma en cours (pré-pilote)
- **canaux actuels :** instagram à lancer + landing page à venir
- **stack technique :** (assumption) web app : next.js + api (spring/fastapi) + postgres + redis (plus tard)
- **contraintes :** temps limité (études/travail), budget lean, conformité loi 25, ton “chaleureux / communautaire / urbain”
- **succès dans 30 jours :** 1 maquette figma cliquable + 1 landing page + 10 organismes + 20 commerces + 150 bénévoles en waitlist + 1 pilote défini
- **blocages majeurs :** focus mvp, confiance/anti-triche, légalité (loi 25/consentements), acquisition partenaires

---

# 00-control-tower

## 00-control-tower/intake-triage.md
**outcome**: toute demande devient un ticket routé (département + job) en <10 min.

**inputs**
- request_title:
- request_type: (feature | design | growth | legal | ops | bug | research)
- urgency: (low | med | high)
- impact: (low | med | high)
- constraints: (time/budget/legal)
- definition_of_done:
- links/assets:

**steps**
1) classer request_type.  
2) attribuer département (product / design / engineering / marketing / qa).  
3) choisir le job playbook correspondant.  
4) créer ticket format: `[dept] - titre - date`.  
5) définir dod en 1 phrase + 3 critères.

**outputs**
- ticket.md (1 page) avec: scope, dod, owner(job), deadline, risks.

**garde-fous**
- non-goals: ne pas “démarrer” le travail ici.
- assumptions: si impact manquant → “med”.
- quality checks: dod mesurable, pas de “vague”.
- règle d’escalade: si légalité implique mineurs/vidéo/données sensibles → router studio ops avant.

**handoff contract**
- le prochain agent doit recevoir :
```yaml
ticket:
  title:
  dept:
  job_file:
  definition_of_done:
  constraints:
  links_assets:
```

---

## 00-control-tower/definition-of-done.md
**outcome**: standard unique de “terminé” pour Collaboro.

**inputs**
- deliverable_type: (figma | spec | code | landing | post | partnership)
- acceptance_criteria: (3-7 items)

**steps**
1) vérifier que chaque critère est observable/testable.  
2) ajouter “sécurité & loi 25” si données utilisateur.  
3) ajouter “anti-abus” si points/réputation impliqués.

**outputs**
- dod checklist intégrable dans ticket.

**garde-fous**
- non-goals: pas de roadmap ici.
- quality checks: critères = verbes d’action + preuve.
- règle d’escalade: si manque d’assets clés → assumer version placeholder + le noter.

**handoff contract**
```yaml
dod:
  deliverable_type:
  criteria:
  risk_flags:
```

---

## 00-control-tower/release-checklist.md
**outcome**: chaque release (même mini) est safe, cohérente, vérifiée.

**inputs**
- release_name:
- scope_links:
- env: (figma | staging | prod)

**steps**
1) vérif loi 25 (collecte, consentement, suppression).  
2) vérif confiance (validation points, no-show, signalement).  
3) vérif ux (copies, parcours complet).  
4) qa (tests/preview).  
5) notes de release (1 paragraphe).

**outputs**
- release_notes.md
- “go/no-go” + raisons

**garde-fous**
- non-goals: pas d’ajout scope à la dernière minute.
- escalation: si 1 bloc “high risk” non résolu → no-go.

**handoff contract**
```yaml
release:
  name:
  go_no_go:
  blockers:
  notes:
```

---

# départements (lean)

minimum nécessaire: **product, design, engineering, marketing, testing/qa, studio ops (legal/partnerships)**

---

# 01-product/

## 01-product/mvp-scope-freeze.md
**outcome**: mvp défini en 1 page, scope gelé pour 30 jours.

**inputs**
- target_users:
- top_3_jobs_to_be_done:
- must_have_features:
- nice_to_have_features:
- constraints:
- success_30_days:

**steps**
1) écrire “mvp = 1 phrase”.  
2) lister must-have (max 7).  
3) déplacer tout le reste en backlog.  
4) définir métriques pilote.  
5) publier “scope freeze date”.

**outputs**
- mvp_scope.md (1 page)
- backlog.md (liste)

**garde-fous**
- non-goals: pas de “marketplace complet”.
- assumptions: si flou → prioriser “missions + validation + points + profil réputation”.
- quality checks: must-have ≤ 7.
- escalation: si >7 → couper sans demander.

**handoff contract**
```yaml
mvp:
  statement:
  must_have:
  backlog:
  success_metrics:
```

---

## 01-product/trust-reputation-spec.md
**outcome**: spec claire réputation + anti-triche (mvp).

**inputs**
- validation_method: (qr | code | manual)
- reputation_signals: (references, badges, reliability)
- abuse_cases: (no-show, fake validation, harassment)

**steps**
1) définir “points” vs “références” (séparés).  
2) définir score fiabilité = honorées / inscrites.  
3) définir pénalités no-show.  
4) définir signalement + modération.  
5) définir affichage profil public.

**outputs**
- trust_spec.md (sections: scoring, references, penalties, reporting, display)

**garde-fous**
- non-goals: pas de kyc complet au mvp.
- quality checks: chaque règle a un exemple.
- escalation: si mineurs impliqués → router studio ops.

**handoff contract**
```yaml
trust:
  scoring_rules:
  reference_fields:
  penalties:
  report_flow:
```

---

## 01-product/pilot-plan-montreal.md
**outcome**: pilote 30 jours défini (quartier, partenaires, règles, ops).

**inputs**
- quartier:
- target_partners_org:
- target_partners_shops:
- volunteer_target:
- ops_rules:

**steps**
1) choisir 1 quartier.  
2) définir quotas (3 org / 5 shops / 50-150 bénévoles).  
3) définir workflow validation.  
4) définir calendrier (semaine 1–4).  
5) définir kpi.

**outputs**
- pilot_plan.md

**garde-fous**
- non-goals: pas de multi-villes.
- assumptions: quartier = “plateau / rose-mont” si non fourni.
- escalation: si aucun partenaire confirmé → passer par marketing/partnership.

**handoff contract**
```yaml
pilot:
  location:
  quotas:
  timeline:
  kpis:
```

---

# 02-design/

## 02-design/figma-sitemap-and-flows.md
**outcome**: sitemap + 4 user flows complets prêts à designer.

**inputs**
- mvp_scope:
- personas:
- trust_spec:

**steps**
1) sitemap (max 12 écrans).  
2) flows: citoyen / organisme / commerce / échange récompense.  
3) ajouter flow “référence post-mission”.  
4) ajouter “points d’échange sécuritaires” (si p2p).  
5) lister edge cases (no-show, refus validation).

**outputs**
- sitemap.md
- flows.md (diagram texte)

**garde-fous**
- non-goals: pas de “social network”.
- quality checks: chaque flow = start → end.
- escalation: si dépasse 12 écrans → fusionner.

**handoff contract**
```yaml
design:
  sitemap:
  flows:
  edge_cases:
```

---

## 02-design/ui-copy-and-microtexts.md
**outcome**: tous les textes ui (fr) prêts à coller dans figma.

**inputs**
- tone: (chaleureux/urbain)
- key_actions:
- legal_required_texts:

**steps**
1) cta pour chaque écran.  
2) messages état (success/error/empty).  
3) consentements (vidéo, données).  
4) safety prompts (échange public).

**outputs**
- ui_copy_fr.md

**garde-fous**
- non-goals: pas de longs paragraphes.
- quality checks: phrases courtes, claires.
- escalation: si légal incertain → placeholders + tag [legal].

**handoff contract**
```yaml
copy:
  screens:
  consent_text:
  safety_text:
```

---

## 02-design/design-system-minimal.md
**outcome**: mini design system (couleurs, typos, composants mvp).

**inputs**
- brand_values:
- accessibility_level: (basic)

**steps**
1) palette (3 couleurs + neutrals).  
2) type scale.  
3) composants: button, card, tag, badge, map pin.  
4) états: hover/disabled/error.

**outputs**
- design_system.md + tokens

**garde-fous**
- non-goals: pas de librairie complète.
- quality checks: contrast lisible.
- escalation: si doute → tokens standard.

**handoff contract**
```yaml
design_system:
  colors:
  typography:
  components:
```

---

# 03-engineering/

## 03-engineering/architecture-mvp.md
**outcome**: architecture mvp définie + boundaries (simple, livrable).

**inputs**
- mvp_scope:
- stack_preference:
- hosting_constraints:

**steps**
1) définir modules: auth, missions, validations, rewards, reputation.  
2) définir db tables (mvp).  
3) définir api endpoints (crud minimal).  
4) définir logging + audit (validation points).  
5) définir versioning & env.

**outputs**
- architecture.md
- api_endpoints.yaml
- db_schema.sql (ou diagram)

**garde-fous**
- non-goals: microservices.
- assumptions: monolithe + postgres.
- quality checks: chaque feature du mvp mappe à endpoint + table.
- escalation: si loi 25 → ajouter champs “consent_*”.

**handoff contract**
```yaml
engineering:
  modules:
  endpoints:
  schema:
  audit:
```

---

## 03-engineering/reputation-and-references-implementation.md
**outcome**: références + badges + fiabilité implémentés (mvp).

**inputs**
- trust_spec:
- db_schema:
- ui_needs:

**steps**
1) créer tables: references, badges, reliability_stats.  
2) endpoint: post reference (org/shop only).  
3) calcul fiabilité (cron ou on-write).  
4) endpoint profil public.  
5) tests unitaires.

**outputs**
- pr: references feature
- tests passing report

**garde-fous**
- non-goals: scoring ml.
- quality checks: permissions strictes (qui peut référencer).
- escalation: si ambigu permissions → règle: “seulement validateur”.

**handoff contract**
```yaml
payload:
  pr_link:
  endpoints_added:
  migrations:
  tests:
```

---

## 03-engineering/safe-exchange-points-feature.md
**outcome**: “points d’échange recommandés” affichés + safety rules (mvp).

**inputs**
- city: montreal
- data_source: (manual list)
- copy_safety_text:

**steps**
1) créer table/list “safe_meetup_spots”.  
2) filtrer par quartier.  
3) ajouter écran/section “recommandations”.  
4) ajouter disclaimer “non affilié”.  
5) log usage (analytics).

**outputs**
- safe_points.json + ui section
- disclaimer block

**garde-fous**
- non-goals: “partenariat police” sans preuve.
- assumptions: liste manuelle initiale.
- quality checks: disclaimers visibles.
- escalation: si demande police → router studio ops (partenariat officiel).

**handoff contract**
```yaml
safe_points:
  dataset:
  ui_location:
  disclaimer:
```

---

## 03-engineering/privacy-law25-basics.md
**outcome**: conformité de base loi 25 intégrée au produit.

**inputs**
- data_collected:
- consent_needs:
- deletion_flow:

**steps**
1) inventaire données (table).  
2) consentements explicites (vidéo).  
3) export/suppression compte.  
4) logs d’accès admin.  
5) politique confidentialité version 0.

**outputs**
- privacy_inventory.md
- delete_account_flow.md
- policy_v0.md

**garde-fous**
- non-goals: conformité enterprise.
- quality checks: suppression testée.
- escalation: si collecte sensible → minimiser.

**handoff contract**
```yaml
privacy:
  inventory:
  consent:
  deletion:
  policy:
```

---

# 04-marketing/

## 04-marketing/landing-page-conversion.md
**outcome**: landing page qui convertit en waitlist.

**inputs**
- one_liner:
- personas:
- proof_points:
- cta:

**steps**
1) hero + 3 bénéfices + 3 segments (bénévole/org/commerce).  
2) form waitlist (email + rôle + quartier).  
3) faq (loi 25, points, validation).  
4) tracking (utm).  

**outputs**
- landing_copy.md
- wireframe_landing.md

**garde-fous**
- non-goals: blog complet.
- quality checks: cta visible 2x.
- escalation: si preuve manque → “pilote bientôt”.

**handoff contract**
```yaml
landing:
  copy:
  form_fields:
  faq:
```

---

## 04-marketing/partner-outreach-script.md
**outcome**: script dm/email pour recruter 10 org + 20 commerces.

**inputs**
- target_type: (org | shop)
- value_prop:
- pilot_offer:

**steps**
1) message court 120-180 mots.  
2) 1 cta = call 15 min / formulaire.  
3) 2 follow-ups (j+3, j+7).  

**outputs**
- outreach_org.md
- outreach_shop.md

**garde-fous**
- non-goals: pitch vague.
- quality checks: bénéfice concret + effort minimal.
- escalation: si secteur réglementé → éviter.

**handoff contract**
```yaml
outreach:
  message:
  followups:
  cta:
```

---

## 04-marketing/weekly-growth-loop.md
**outcome**: boucle hebdo simple waitlist + partenaires.

**inputs**
- weekly_target_numbers:
- channels: (ig, linkedin, community groups)

**steps**
1) 2 posts ig (valeur + histoire).  
2) 20 outreach partenaires.  
3) 1 mini-event / partenariat local.  
4) review kpi dimanche.

**outputs**
- growth_report_week_X.md

**garde-fous**
- non-goals: pub payante au mvp.
- quality checks: 1 métrique principale.
- escalation: si temps low → réduire volume, garder cadence.

**handoff contract**
```yaml
growth:
  actions_done:
  numbers:
  learnings:
  next_week:
```

---

# 05-testing-qa/

## 05-testing-qa/mvp-qa-pass.md
**outcome**: qa minimal complet sur flows mvp (0 critical).

**inputs**
- figma_or_app_link:
- flows_list:

**steps**
1) tester chaque flow start→finish.  
2) tester edge cases: no-show, refus validation, suppression compte.  
3) vérifier copies + consentements.  

**outputs**
- qa_report.md (bugs: critical/major/minor)

**garde-fous**
- non-goals: perf testing.
- quality checks: “critical = 0” pour release.
- escalation: si critical → bloquer release.

**handoff contract**
```yaml
qa:
  critical:
  majors:
  minors:
  screenshots:
```

---

## 05-testing-qa/release-go-no-go.md
**outcome**: décision release objective.

**inputs**
- release_checklist:
- qa_report:

**steps**
1) vérifier critères go.  
2) lister blockers.  
3) décider go/no-go.

**outputs**
- decision.md

**garde-fous**
- non-goals: négocier scope.
- escalation: si legal flag → no-go.

**handoff contract**
```yaml
release_decision:
  go_no_go:
  blockers:
  rationale:
```

---

# 06-studio-ops/

## 06-studio-ops/partner-agreement-lite.md
**outcome**: entente simple (1-2 pages) pour org/commerce pilote.

**inputs**
- partner_type:
- validation_process:
- reward_terms:

**steps**
1) rôle plateforme vs partenaire.  
2) validation + comportement.  
3) responsabilités + résiliation.

**outputs**
- agreement_org_v0.md
- agreement_shop_v0.md

**garde-fous**
- non-goals: contrat juridique lourd.
- quality checks: clair + compréhensible.
- escalation: risque élevé → consultation légale.

**handoff contract**
```yaml
agreement:
  version:
  partner_type:
  key_terms:
```

---

## 06-studio-ops/privacy-policy-v0.md
**outcome**: politique confidentialité v0 cohérente loi 25 (pilot).

**inputs**
- data_inventory:
- consent_text:

**steps**
1) sections: collecte, usage, partage, sécurité, droits.  
2) contact + suppression.  

**outputs**
- privacy_policy_v0.md

**garde-fous**
- non-goals: promesses impossibles.
- escalation: si vidéo mineurs → interdire dans mvp.

**handoff contract**
```yaml
policy:
  text:
  missing_items:
```

---

## 06-studio-ops/safety-guidelines-p2p.md
**outcome**: règles sécurité officielles pour échanges p2p.

**inputs**
- safe_points_feature:
- tone:

**steps**
1) règles: lieu public, annulation, signalement.  
2) disclaimer non-affiliation.

**outputs**
- safety_guidelines.md

**garde-fous**
- non-goals: se présenter comme autorité.
- quality checks: simple, actionnable.
- escalation: incident réel → suspendre feature.

**handoff contract**
```yaml
safety:
  rules:
  disclaimer:
  incident_protocol:
```

---

# chaînes de routage (réutilisables)

## flow nouvelle feature
1) `00-control-tower/intake-triage.md` → ticket + dod  
2) `01-product/mvp-scope-freeze.md` (si scope) ou `01-product/trust-reputation-spec.md` (si confiance)  
3) `02-design/figma-sitemap-and-flows.md` + `02-design/ui-copy-and-microtexts.md`  
4) `03-engineering/architecture-mvp.md` + job feature spécifique  
5) `05-testing-qa/mvp-qa-pass.md`  
6) `00-control-tower/release-checklist.md` + `05-testing-qa/release-go-no-go.md`

**payload standard:** ticket + dod + liens + specs + décision qa.

---

## boucle croissance hebdo
1) `04-marketing/weekly-growth-loop.md`  
2) `04-marketing/partner-outreach-script.md`  
3) `04-marketing/landing-page-conversion.md`  
4) `00-control-tower/intake-triage.md` (insights → tickets)

---

## support → correctif (pilot)
1) `00-control-tower/intake-triage.md` (bug report)  
2) `05-testing-qa/mvp-qa-pass.md` (repro + gravité)  
3) `03-engineering/*` (fix)  
4) `05-testing-qa/release-go-no-go.md`

---

## pilote partenaire (org/commerce)
1) `04-marketing/partner-outreach-script.md`  
2) `06-studio-ops/partner-agreement-lite.md`  
3) `01-product/pilot-plan-montreal.md`  
4) `02-design/ui-copy-and-microtexts.md` (consent/safety)  
5) `00-control-tower/release-checklist.md`

---

# plan “start small”

## day 1 setup (3 agents/jobs)
1) `01-product/mvp-scope-freeze.md` — scope gelé = éviter dispersion  
2) `02-design/figma-sitemap-and-flows.md` — accélérateur maquette + pitch  
3) `04-marketing/partner-outreach-script.md` — acquisition partenaires = vital

## next 5 agents to add
1) `01-product/trust-reputation-spec.md`  
2) `06-studio-ops/privacy-policy-v0.md`  
3) `03-engineering/architecture-mvp.md`  
4) `05-testing-qa/mvp-qa-pass.md`  
5) `06-studio-ops/safety-guidelines-p2p.md`
