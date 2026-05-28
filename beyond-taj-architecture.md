# Beyond Taj — Intelligence Engine
## Technical Architecture Brief for the Developer

**Product:** Beyond Taj — Luxury AI-Powered India Travel Platform  
**Document type:** System Design & Architecture  
**Audience:** Lead Developer  
**Prepared by:** Product / Strategy

---

## The Core Problem We're Solving

India is not like Europe. You cannot do a 5-country "hop" in 10 days. The geography is vast, the road infrastructure is uneven, altitude acclimatisation is real, and regional identities are deeply distinct. A foreigner who selects Leh + Goa + Meghalaya for a 9-day trip isn't being unreasonable — they just don't know what they don't know.

Our system needs to be the local expert that gently, intelligently, and gracefully corrects that.

**We do not want a dumb "max 3 destinations" cap. We want a travel brain.**

---

## Part 1 — Database Structure

### 1.1 Destination Node

Every destination in the system is a node with rich metadata:

```json
{
  "id": "leh_ladakh",
  "name": "Leh-Ladakh",
  "cluster": "north_mountain",
  "region": "jammu_kashmir",
  "coordinates": { "lat": 34.1526, "lng": 77.5771 },
  "altitude_meters": 3500,
  "requires_acclimatization": true,
  "acclimatization_days": 2,
  "nearest_airport": "IXL",
  "road_accessible": true,
  "road_difficulty": "high",
  "best_months": [6, 7, 8, 9],
  "closed_months": [11, 12, 1, 2, 3],
  "landscape_tags": ["cold_desert", "mountains", "spiritual"],
  "energy_type": "adventurous",
  "pace_type": "slow_forced",
  "min_days_recommended": 4,
  "emotional_tone": ["awe", "silence", "adventure"],
  "traveler_type": ["adventure_nomad", "backpacker", "balanced"],
  "connectivity_score": 3
}
```

**Key fields explained:**

`pace_type` — whether travel through this place naturally forces slow pace (mountain roads, altitude) or allows faster movement.

`connectivity_score` — 1 to 5. How easy is it to get here and leave? Andaman = 1 (only flights). Jaipur = 5 (trains every hour from Delhi).

`energy_type` — does visiting this place *consume* energy (mountains, long drives) or *restore* it (beaches, backwaters)?

---

### 1.2 Cluster Definition

```json
{
  "id": "north_mountain",
  "name": "North Mountain Circuit",
  "destinations": ["manali", "leh_ladakh", "spiti", "shimla", "kasol", "dharamshala"],
  "hub_cities": ["delhi", "chandigarh"],
  "intra_cluster_travel": "road_and_shared_jeep",
  "cross_cluster_exit_modes": ["flight_from_delhi", "train_from_chandigarh"],
  "minimum_cluster_days": 6,
  "optimal_cluster_days": 10,
  "compatible_clusters": ["spiritual_north", "rajasthan"],
  "incompatible_short_trip_clusters": ["northeast", "kerala", "andaman"],
  "seasonal_window": [4, 5, 6, 7, 8, 9, 10]
}
```

---

### 1.3 Route Edge (Travel Link Between Two Destinations)

```json
{
  "from": "manali",
  "to": "leh_ladakh",
  "distance_km": 480,
  "travel_modes": [
    {
      "mode": "road",
      "duration_hours": 10,
      "difficulty": "high",
      "seasonal": true,
      "open_months": [6, 7, 8, 9],
      "fatigue_cost": 8
    },
    {
      "mode": "flight",
      "via_hub": "delhi",
      "duration_hours": 6,
      "extra_days_cost": 1,
      "fatigue_cost": 4
    }
  ],
  "recommended_mode": "road",
  "notes": "Manali-Leh highway is one of the world's most scenic roads. Open June-September only."
}
```

`fatigue_cost` — a score from 1–10 that represents how draining this transfer is. This feeds directly into the Travel Fatigue Engine.

---

### 1.4 Landscape Compatibility Matrix

Store as a simple 2D lookup table:

| | Mountains | Desert | Royal Cities | Beaches | Islands | Spiritual | Wildlife | Backwaters | Tea | Northeast |
|---|---|---|---|---|---|---|---|---|---|---|
| **Mountains** | ✓✓ | △ | △ | ✗ | ✗ | ✓✓ | △ | ✗ | ✓✓ | ✓ |
| **Desert** | △ | ✓✓ | ✓✓ | ✗ | ✗ | ✓ | △ | ✗ | ✗ | ✗ |
| **Royal Cities** | △ | ✓✓ | ✓✓ | ✗ | ✗ | ✓✓ | △ | ✗ | ✗ | ✗ |
| **Beaches** | ✗ | ✗ | ✗ | ✓✓ | ✓✓ | ✗ | △ | ✓✓ | △ | ✗ |
| **Northeast** | ✓ | ✗ | ✗ | ✗ | ✗ | △ | ✓✓ | ✗ | ✓✓ | ✓✓ |

Legend: `✓✓` = highly compatible, `✓` = compatible, `△` = possible with enough days, `✗` = avoid unless 20+ days

Implement this as a JSON object:

```json
{
  "landscape_compatibility": {
    "mountains_desert": { "score": 40, "min_days": 14 },
    "mountains_tea": { "score": 85, "min_days": 7 },
    "royal_cities_desert": { "score": 95, "min_days": 5 },
    "beaches_islands": { "score": 90, "min_days": 5 },
    "mountains_northeast": { "score": 70, "min_days": 12 },
    "beaches_northeast": { "score": 20, "min_days": 18 }
  }
}
```

---

## Part 2 — The Scoring System

Every time a user selects destinations, the system runs a **Trip Feasibility Score** from 0–100.

### 2.1 Score Components

```
TRIP_SCORE = (
  geographic_compatibility_score   × 0.30
  + fatigue_budget_score           × 0.25
  + seasonal_validity_score        × 0.20
  + landscape_harmony_score        × 0.15
  + pacing_quality_score           × 0.10
)
```

---

### 2.2 Geographic Compatibility Score

```python
def geographic_score(destinations, days):
    clusters = get_clusters(destinations)
    unique_clusters = set(clusters)
    
    if len(unique_clusters) == 1:
        return 100   # All destinations in same cluster — perfect
    
    # Check cross-cluster compatibility
    pair_scores = []
    for a, b in combinations(unique_clusters, 2):
        pair_scores.append(cluster_compatibility_matrix[a][b])
    
    base_score = mean(pair_scores)
    
    # Penalise if too many clusters for available days
    allowed_clusters = days_to_max_clusters(days)
    if len(unique_clusters) > allowed_clusters:
        penalty = (len(unique_clusters) - allowed_clusters) * 15
        base_score -= penalty
    
    return max(0, base_score)
```

---

### 2.3 Fatigue Budget Score

Every trip has a **Fatigue Budget** based on days and traveler type.

```python
FATIGUE_BUDGETS = {
    "luxury":     { "per_day": 4,  "recovery_factor": 1.3 },
    "balanced":   { "per_day": 6,  "recovery_factor": 1.0 },
    "backpacker": { "per_day": 8,  "recovery_factor": 0.8 },
    "adventure":  { "per_day": 9,  "recovery_factor": 0.7 },
}

def fatigue_score(destinations, days, style, traveler_type):
    total_fatigue_allowed = days * FATIGUE_BUDGETS[style]["per_day"]
    
    # Calculate fatigue from all transfers
    route = optimise_route(destinations)
    transfer_fatigue = sum(edge["fatigue_cost"] for edge in route)
    
    # Add fatigue from altitude destinations
    for dest in destinations:
        if dest["requires_acclimatization"]:
            transfer_fatigue += 6  # 2 acclimatisation days = 6 fatigue points
    
    # Add jet lag penalty for international travelers
    if traveler_type == "international":
        transfer_fatigue += 8  # First 2 days of trip reserved
    
    remaining = total_fatigue_allowed - transfer_fatigue
    experience_quality = remaining / total_fatigue_allowed
    
    return max(0, experience_quality * 100)
```

The logic here: if your fatigue budget is used up just getting between places, you have nothing left to actually *experience* India.

---

### 2.4 Seasonal Validity Score

```python
def seasonal_score(destinations, travel_month):
    scores = []
    for dest in destinations:
        if travel_month in dest["best_months"]:
            scores.append(100)
        elif travel_month in dest["closed_months"]:
            scores.append(0)   # Hard block — Leh in January is inaccessible
        else:
            scores.append(50)  # Possible but not ideal
    return mean(scores)
```

---

### 2.5 Pacing Quality Score

This is the emotional pacing engine.

```python
EMOTIONAL_FLOW_RULES = [
    # After intensity, prescribe calm
    { "after": "chaotic_city",     "recommend": "calm_nature",   "score_bonus": 20 },
    { "after": "long_road_drive",  "recommend": "rest_city",     "score_bonus": 15 },
    { "after": "mountains",        "recommend": "plains_or_city", "score_bonus": 10 },
    
    # Jarring transitions
    { "after": "spiritual",        "next": "party_beach",        "score_penalty": 25 },
    { "after": "luxury_palace",    "next": "overnight_bus",      "score_penalty": 30 },
]

def pacing_score(ordered_destinations, style):
    score = 70  # Start with baseline
    for i in range(len(ordered_destinations) - 1):
        current = ordered_destinations[i]
        next_dest = ordered_destinations[i + 1]
        
        for rule in EMOTIONAL_FLOW_RULES:
            if matches(current, rule["after"]) and matches(next_dest, rule.get("recommend")):
                score += rule.get("score_bonus", 0)
            if matches(current, rule["after"]) and matches(next_dest, rule.get("next")):
                score -= rule.get("score_penalty", 0)
    
    return clamp(score, 0, 100)
```

---

## Part 3 — Route Optimisation

### 3.1 Algorithm

Use a modified **Nearest Neighbor Traveling Salesman** approach, but weighted by fatigue cost rather than raw distance.

```python
def optimise_route(destinations, start_city):
    """
    Returns destinations in optimal visit order.
    Minimises fatigue cost, not just kilometers.
    """
    unvisited = list(destinations)
    route = [start_city]
    current = start_city
    
    while unvisited:
        # Find the "cheapest" next destination by fatigue, not distance
        next_dest = min(
            unvisited,
            key=lambda d: get_edge(current, d)["fatigue_cost"]
        )
        route.append(next_dest)
        unvisited.remove(next_dest)
        current = next_dest
    
    return route
```

**Why fatigue cost, not distance?** Delhi → Agra is 200km but trivially easy. Manali → Leh is 480km but takes 10 hours on mountain roads with passes at 5,000m. Raw distance is a bad metric in India.

---

### 3.2 Circuit Detection

Before presenting any route, check if the selected destinations form a natural circuit:

```python
KNOWN_CIRCUITS = [
    { "id": "rajasthan_golden_triangle", "destinations": ["delhi", "jaipur", "agra"], "days": 5 },
    { "id": "rajasthan_full",  "destinations": ["jaipur", "jodhpur", "jaisalmer", "udaipur"], "days": 8 },
    { "id": "north_mountain",  "destinations": ["manali", "leh_ladakh", "spiti"], "days": 10 },
    { "id": "kerala_backwaters", "destinations": ["kochi", "munnar", "alleppey", "varkala"], "days": 7 },
    { "id": "northeast_loop", "destinations": ["shillong", "cherrapunji", "kaziranga"], "days": 6 },
    { "id": "spiritual_north", "destinations": ["varanasi", "rishikesh", "haridwar"], "days": 5 },
]

def detect_circuit(selected_destinations):
    for circuit in KNOWN_CIRCUITS:
        overlap = set(circuit["destinations"]) & set(selected_destinations)
        if len(overlap) / len(circuit["destinations"]) >= 0.6:
            return circuit
    return None
```

If a circuit is detected, display it as a recommendation:

> *"Your selections form the classic Rajasthan Royal Circuit — one of India's most iconic journeys."*

---

## Part 4 — Day Budget Allocation

### 4.1 Days-to-Clusters Table

```python
def days_to_cluster_budget(days):
    if days <= 5:   return { "max_clusters": 1, "max_destinations": 2, "buffer_days": 1 }
    if days <= 7:   return { "max_clusters": 1, "max_destinations": 3, "buffer_days": 1 }
    if days <= 10:  return { "max_clusters": 2, "max_destinations": 4, "buffer_days": 2 }
    if days <= 14:  return { "max_clusters": 2, "max_destinations": 5, "buffer_days": 2 }
    if days <= 21:  return { "max_clusters": 3, "max_destinations": 7, "buffer_days": 3 }
    if days <= 30:  return { "max_clusters": 4, "max_destinations": 9, "buffer_days": 4 }
    return          { "max_clusters": 5, "max_destinations": 12, "buffer_days": 5 }
```

`buffer_days` are days reserved for travel, rest, jet lag, and acclimatisation — they are **not available for sightseeing.** This is a key concept. A 10-day trip is really an 8-day trip for a foreigner once you strip out arrival fatigue and departure prep.

---

### 4.2 Per-Destination Day Allocation

```python
def allocate_days(destinations, total_days, style):
    buffer = calculate_buffer(destinations, style)
    available_days = total_days - buffer
    
    # Each destination has a minimum and recommended stay
    total_min = sum(d["min_days_recommended"] for d in destinations)
    
    if total_min > available_days:
        return { "feasible": False, "shortfall_days": total_min - available_days }
    
    # Distribute remaining days proportionally by destination "depth"
    base_allocation = { d.id: d["min_days_recommended"] for d in destinations }
    extra_days = available_days - total_min
    
    # Prioritise depth: give extra days to destinations with more to offer
    for dest in sorted(destinations, key=lambda d: d["depth_score"], reverse=True):
        extra_per_dest = min(extra_days, dest["max_days_useful"] - dest["min_days_recommended"])
        base_allocation[dest.id] += extra_per_dest
        extra_days -= extra_per_dest
        if extra_days <= 0:
            break
    
    return { "feasible": True, "allocation": base_allocation }
```

---

## Part 5 — Recommendation Engine

### 5.1 Destination Suggestion Pipeline

When a user selects landscapes, the system should not just dump all available destinations. It should rank them.

```python
def recommend_destinations(selected_landscapes, days, style, start_city, travel_month):
    
    # Step 1: Get all destinations tagged with selected landscapes
    candidates = get_destinations_by_landscapes(selected_landscapes)
    
    # Step 2: Score each candidate
    scored = []
    for dest in candidates:
        score = 0
        
        # Seasonal fit
        score += seasonal_fit(dest, travel_month) * 30
        
        # Style fit
        score += style_compatibility(dest, style) * 20
        
        # Proximity to start city (reduce transfer fatigue)
        score += proximity_score(dest, start_city) * 20
        
        # Landscape harmony with other selected landscapes
        score += landscape_harmony(dest, selected_landscapes) * 20
        
        # Popularity penalty (push hidden gems)
        score -= dest["overtourism_score"] * 10
        
        scored.append({ "destination": dest, "score": score })
    
    # Step 3: Cluster-balance the results
    # Don't return 5 destinations from the same cluster if there are others
    return cluster_balanced_sort(scored, max_per_cluster=3)
```

---

### 5.2 Hidden Gem Surfacing

One of our core differentiators. The recommendation engine should actively surface lesser-known alternatives:

```python
HIDDEN_GEM_ALTERNATIVES = {
    "manali":        ["kasol", "tosh", "kalpa"],
    "shimla":        ["chitkul", "sangla", "narkanda"],
    "goa":           ["gokarna", "tarkarli", "agonda"],
    "darjeeling":    ["yuksom", "tabo", "pelling"],
    "leh_ladakh":    ["nubra_valley", "pangong_via_khardung", "tso_moriri"],
    "jaisalmer":     ["osian", "bikaner", "barmer"],
}

def inject_hidden_gems(recommendations, style, days):
    if style in ["adventure_nomad", "backpacker"] and days >= 10:
        for main_dest in recommendations:
            alternatives = HIDDEN_GEM_ALTERNATIVES.get(main_dest.id, [])
            if alternatives:
                gem = pick_best_gem(alternatives, main_dest, days)
                recommendations.insert_after(main_dest, gem, tag="hidden_gem")
```

---

## Part 6 — UX Behavior

### 6.1 Warning System (Soft Restrictions)

Never hard-block. Always explain and offer alternatives.

```python
WARNING_LEVELS = {
    "info":    { "color": "gold",   "blocks": False },  # Gentle tip
    "caution": { "color": "amber",  "blocks": False },  # Worth considering
    "warning": { "color": "red",    "blocks": False },  # Likely problematic
}

def generate_warnings(trip):
    warnings = []
    score = trip["feasibility_score"]
    
    if score < 40:
        warnings.append({
            "level": "warning",
            "message": f"Your selected destinations span {trip['cluster_count']} major regions. For {trip['days']} days, this will feel more like transit than travel.",
            "suggestion": f"Consider focusing on {suggest_primary_cluster(trip)} for a truly immersive experience.",
            "cta": "Let us rebuild your trip around one region"
        })
    
    if trip["fatigue_budget_remaining"] < 0:
        warnings.append({
            "level": "warning", 
            "message": f"Your transfers will consume approximately {abs(trip['fatigue_budget_remaining'])} days of your trip.",
            "suggestion": f"Adding {trip['days_needed_to_fix']} more days would make this trip comfortable.",
            "cta": "Adjust trip duration"
        })
    
    if any(d for d in trip["destinations"] if travel_month not in d["best_months"]):
        warnings.append({
            "level": "caution",
            "message": "Some destinations you've selected may be experiencing off-season conditions during your travel month.",
            "suggestion": "Swap X for Y which is perfect in your travel month."
        })
    
    return warnings
```

---

### 6.2 Compatibility Score Display

Show the user a live score as they build their trip. Update in real-time.

```
┌─────────────────────────────────────────────┐
│  Your Journey Score                          │
│                                              │
│  Geographic Flow      ████████░░  82/100    │
│  Seasonal Timing      ██████████  95/100    │
│  Travel Pace          █████░░░░░  54/100    │
│  Overall Feasibility  ███████░░░  71/100    │
│                                              │
│  ⚠ Improving pace score: Remove 1 destination│
└─────────────────────────────────────────────┘
```

---

### 6.3 Smart Destination Card States

Destinations should have **4 visual states** in the selection UI:

1. **Recommended** (glowing border) — matches user's landscapes + season + cluster
2. **Compatible** (normal) — can be added without issue
3. **Possible with warning** (amber border) — will trigger a caution warning
4. **Incompatible** (dimmed) — shown but visually de-emphasised; clicking shows explanation

This makes the interface teach the user rather than block them.

---

## Part 7 — Technical Stack Recommendations

### 7.1 Backend

The scoring and route logic should live entirely on the backend, not in browser JavaScript. It will evolve frequently and you don't want to re-deploy the frontend every time you tune a score.

```
API Endpoint: POST /api/trip/evaluate
Input: { destinations, days, style, travel_month, start_city, traveler_type }
Output: { feasibility_score, warnings, suggested_route, day_allocation, alternative_suggestions }
```

Technology: Node.js or Python (FastAPI) — either works. Python gives you better data science tooling if you want to train models later.

---

### 7.2 Database

**PostgreSQL** for destination and route data. The edge graph (travel links between destinations) maps naturally to relational tables.

```sql
-- Core tables
destinations (id, name, cluster_id, coordinates, altitude, metadata JSONB)
clusters (id, name, compatible_clusters TEXT[], hub_cities TEXT[])
travel_edges (from_id, to_id, mode, duration_hours, fatigue_cost, seasonal BOOLEAN)
landscape_tags (destination_id, landscape_type)
```

Use **JSONB** columns generously for destination metadata — requirements will change as you add destinations and the schema needs to be flexible.

---

### 7.3 Graph Library

Model the destinations as a graph for route optimisation. Use:
- **Python:** NetworkX (free, excellent)
- **Node.js:** graphlib or a custom adjacency list

```python
import networkx as nx

G = nx.DiGraph()

# Add destination nodes
for dest in destinations:
    G.add_node(dest.id, **dest.metadata)

# Add travel edges weighted by fatigue
for edge in travel_edges:
    G.add_edge(edge.from_id, edge.to_id, weight=edge.fatigue_cost)

# Find optimal route
optimal_path = nx.shortest_path(G, source=start, target=end, weight='weight')
```

---

### 7.4 AI Layer (Phase 2)

In Phase 1, the intelligence comes from the scoring engine and curated data — which is the right approach. A rule-based system with good data beats a badly-trained LLM.

In Phase 2, once you have real user trip data, consider:

**Fine-tune a recommendation model** on successful vs unsuccessful trip patterns. Input features: `[days, style, landscapes, destinations, season, traveler_type]`. Output: `feasibility_score + warnings`.

**Use Claude API** for generating the actual narrative itinerary text from the structured trip data. This is where LLMs shine — taking a structured day-by-day plan and writing it in the voice of a local expert.

```python
# Example: Generate day narrative
prompt = f"""
You are an India travel expert writing for Beyond Taj.
Write Day 3 of this itinerary in a cinematic, warm, premium tone.
Destination: {dest.name}
Activities: {day.activities}
Travel style: {style}
Tone: emotional, specific, immersive. No generic phrases.
"""
```

---

## Part 8 — Data You Need to Build This

Here is what needs to be populated in the database before launch. This is editorial work, not engineering:

**For each destination (~60 destinations at launch):**
- Cluster assignment
- Altitude and acclimatisation requirement
- Nearest airport / rail hub
- Best months / closed months
- Minimum recommended days
- Energy type (restorative / demanding)
- Fatigue cost to reach from 5 major hubs (Delhi, Mumbai, Chennai, Kolkata, Bengaluru)
- Landscape tags
- Traveler style fit scores

**For each major route pair (~200 edges):**
- Primary travel mode
- Duration and fatigue cost
- Seasonal availability
- Notes (e.g., "Spiti road closes after snowfall")

This data layer is your real moat. Competitors can copy the interface. They cannot easily replicate 12 months of curated India travel knowledge encoded in a structured database.

---

## Part 9 — Phased Build Plan

### Phase 1 (MVP — 6–8 weeks)
Build the rule-based scoring engine with ~30 destinations across 6 clusters. Manual data entry. No AI generation yet. Trip evaluation API working. UX shows scores and warnings live.

### Phase 2 (8–12 weeks after launch)
Expand to 60+ destinations. Add the hidden gems layer. Add seasonal logic. Introduce the AI narrative generator for itinerary text. Add WhatsApp integration.

### Phase 3 (Post-revenue)
Collect real user data. Train a recommendation model. Add dynamic pricing. Build a partner network (hotels, guides, transport operators) to fulfil the bookings directly.

---

## Summary for the Developer

The core of what we're building is this:

1. **A graph database** of India destinations with fatigue-weighted travel edges
2. **A scoring engine** that evaluates trip feasibility across 5 dimensions
3. **A cluster model** that groups destinations by geographic and experiential compatibility
4. **A soft-warning UX** that teaches and guides rather than blocking
5. **A recommendation pipeline** that surfaces the right destinations based on landscape preferences, season, and pacing
6. **An AI text layer** (Phase 2) that turns structured trip data into cinematic itinerary narratives

The data is the product. The scoring system is the product. The beautiful React frontend is the delivery mechanism.

---

*This document should be treated as a living spec. As destination data is collected and user patterns emerge, scoring weights and rules should be tuned regularly.*
