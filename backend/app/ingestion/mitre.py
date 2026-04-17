import httpx 
from sqlalchemy.orm import Session
from app.models.threat import ThreatActor, Technique, Software
from datetime import datetime


def fetch_and_map_mitre(db: Session):
    url = "https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json"
    data = httpx.get(url).json()
    objects = data["objects"]

    # 1. Map STIX IDs to objects for fast lookup
    master_map = {obj["id"]: obj for obj in objects}
    
    # 2. Storage for DB objects created in this session to avoid redundant queries
    actors_map = {}
    tech_map = {}
    sw_map = {}

    # 3. First Pass: Ensure all Actors, Techniques, and Software exist in DB
    for obj in objects:
        s_id = obj["id"]
        
        if obj["type"] == "intrusion-set":
            actor = db.query(ThreatActor).filter_by(stix_id=s_id).first()
            if not actor:
                actor = ThreatActor(
                    stix_id=s_id,
                    name=obj["name"],
                    description=obj.get("description"),
                    aliases=", ".join(obj.get("aliases", [])),
                    source="MITRE"
                )
                db.add(actor)
                db.flush() # Get the ID without committing yet
            actors_map[s_id] = actor

        elif obj["type"] == "attack-pattern":
            tech = db.query(Technique).filter_by(stix_id=s_id).first()
            if not tech:
                m_id = next((ref["external_id"] for ref in obj.get("external_references", []) if ref.get("source_name") == "mitre-attack"), None)
                tech = Technique(stix_id=s_id, name=obj["name"], mitre_id=m_id, description=obj.get("description"))
                db.add(tech)
                db.flush()
            tech_map[s_id] = tech

        elif obj["type"] in ["malware", "tool"]:
            sw = db.query(Software).filter_by(stix_id=s_id).first()
            if not sw:
                sw = Software(stix_id=s_id, name=obj["name"], sw_type=obj["type"])
                db.add(sw)
                db.flush()
            sw_map[s_id] = sw

    # 4. Second Pass: Create the Relationships
    for obj in objects:
        if obj["type"] == "relationship" and obj["relationship_type"] == "uses":
            source_id = obj["source_ref"] # The Actor
            target_id = obj["target_ref"] # The TTP or Software

            actor = actors_map.get(source_id)
            if not actor: continue

            # If the target is a Technique
            if target_id in tech_map:
                target_obj = tech_map[target_id]
                if target_obj not in actor.techniques:
                    actor.techniques.append(target_obj)
            
            # If the target is Software
            elif target_id in sw_map:
                target_obj = sw_map[target_id]
                if target_obj not in actor.software:
                    actor.software.append(target_obj)

    db.commit()
    print("Success: MITRE Actors, TTPs, and Software are now linked in your DB.")
