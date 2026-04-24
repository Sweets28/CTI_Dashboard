import os
import httpx
import pycountry
from datetime import datetime
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from app.models.threat import Indicator, CountryStat

load_dotenv()

COUNTRY_CACHE = {}

def get_alpha2_code(country_name: str) -> str:
    """Converts country names or Alpha-3 codes to Alpha-2."""
    if not country_name:
        return "Unknown"
    
    country_name = country_name.strip()
    
    if country_name in COUNTRY_CACHE:
        return COUNTRY_CACHE[country_name]

    try:
        country = pycountry.countries.get(name=country_name) or \
                  pycountry.countries.get(alpha_2=country_name.upper()) or \
                  pycountry.countries.get(official_name=country_name)
        
        if country:
            COUNTRY_CACHE[country_name] = country.alpha_2
            return country.alpha_2
            
        fuzzy_results = pycountry.countries.search_fuzzy(country_name)
        if fuzzy_results:
            res = fuzzy_results[0].alpha_2
            COUNTRY_CACHE[country_name] = res
            return res
            
    except Exception:
        pass
        
    COUNTRY_CACHE[country_name] = country_name
    return country_name

def fetch_taxii_indicators(db: Session):
    url = "https://otx.alienvault.com/api/v1/pulses/subscribed"
    api_key = os.getenv("OTX_API_KEY")
    headers = {"X-OTX-API-KEY": api_key}
    
    seen_stix_ids = set()
    page = 1
    max_pages = 5
    
    print(f"Starting OTX fetch (Max Pages: {max_pages})...")

    while page <= max_pages:
        try:
            response = httpx.get(
                url, 
                headers=headers, 
                params={"page": page}, 
                timeout=60.0
            )
            response.raise_for_status()
            data = response.json()
        except Exception as e:
            print(f"Error fetching page {page}: {e}")
            break

        results = data.get("results", [])
        if not results:
            print("No more results found.")
            break 
            
        for pulse in results:
            pulse_name = pulse.get("name", "Unknown Pulse")
            raw_countries = pulse.get("targeted_countries", [])
            
            alpha2_countries = [get_alpha2_code(c) for c in raw_countries]
            
            if alpha2_countries:
                print(f"Pulse: {pulse_name} | Countries: {alpha2_countries}")

            for country_code in alpha2_countries:
                existing_stat = db.query(CountryStat).filter_by(country=country_code).first()
                if existing_stat:
                    existing_stat.count += 1
                    existing_stat.last_seen = datetime.utcnow()
                else:
                    db.add(CountryStat(
                        country=country_code,
                        count=1,
                        last_seen=datetime.utcnow(),
                        source="OTX"
                    ))

            for item in pulse.get("indicators", []):
                stix_id = str(item.get("id"))
                
                if stix_id in seen_stix_ids:
                    continue
                
                existing_ind = db.query(Indicator).filter_by(stix_id=stix_id).first()
                if existing_ind:
                    seen_stix_ids.add(stix_id)
                    continue

                seen_stix_ids.add(stix_id)
                pattern = item.get("indicator", "")
                pattern_type = item.get("type", "unknown")
                
                created_str = item.get("created", "")
                try:
                    valid_from = datetime.strptime(created_str, "%Y-%m-%dT%H:%M:%S.%f")
                except (ValueError, TypeError):
                    try:
                        valid_from = datetime.strptime(created_str, "%Y-%m-%dT%H:%M:%S")
                    except Exception:
                        valid_from = datetime.utcnow()

                db.add(Indicator(
                    stix_id=stix_id,
                    pattern=pattern,
                    pattern_type=pattern_type,
                    valid_from=valid_from,
                    source="OTX"
                ))
        
        db.commit()
        print(f"Finished processing page {page}.")
        page += 1

    print("OTX data sync complete.")
