from sqlalchemy.orm import Session
from app.models.threat import Indicator, CountryStat
from datetime import datetime
from dotenv import load_dotenv
import httpx
import os

load_dotenv()

def fetch_taxii_indicators(db: Session):
    url = "https://otx.alienvault.com/api/v1/pulses/subscribed"
    headers = {"X-OTX-API-KEY": os.getenv("OTX_API_KEY")}
    response = httpx.get(url, headers=headers)
    data = response.json()
    seen = set()  # ← add this
    for pulse in data.get("results", []):
        for item in pulse.get("indicators", []):
            stix_id = str(item["id"])
            if stix_id in seen:  # ← check in-memory first
                continue
            existing = db.query(Indicator).filter_by(stix_id=stix_id).first()
            if existing:
                continue
            seen.add(stix_id)  # ← track it
            pattern = item.get("indicator", "")
            pattern_type = item.get("type", "unknown")
            try:
                valid_from = datetime.strptime(item["created"], "%Y-%m-%dT%H:%M:%S.%f")
            except ValueError:
                valid_from = datetime.strptime(item["created"], "%Y-%m-%dT%H:%M:%S")
            indicator = Indicator(
                stix_id=stix_id,
                pattern=pattern,
                pattern_type=pattern_type,
                valid_from=valid_from,
                source="OTX"
            )
            db.add(indicator)
        for country in pulse.get("targeted_countries", []):
            existing = db.query(CountryStat).filter_by(country=country).first()
            if existing:
                existing.count += 1
                existing.last_seen = datetime.utcnow()
            else:
                db.add(CountryStat(
                    country=country,
                    count=1,
                    last_seen=datetime.utcnow(),
                    source="OTX"
                    ))
    db.commit()
