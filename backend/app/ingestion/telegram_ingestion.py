import re
import os
from telethon.sync import TelegramClient
from sqlalchemy.orm import Session
from app.models.threat import Indicator
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

def extract_iocs(text: str) -> list:
    iocs = []
    
    ips = re.findall(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', text)
    for ip in ips:
        iocs.append({"pattern": ip, "pattern_type": "IPv4"})
    
    md5s = re.findall(r'\b[a-fA-F0-9]{32}\b', text)
    for h in md5s:
        iocs.append({"pattern": h, "pattern_type": "FileHash-MD5"})
    
    sha256s = re.findall(r'\b[a-fA-F0-9]{64}\b', text)
    for h in sha256s:
        iocs.append({"pattern": h, "pattern_type": "FileHash-SHA256"})
    
    domains = re.findall(r'\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b', text)
    for d in domains:
        iocs.append({"pattern": d, "pattern_type": "domain"})
    
    cves = re.findall(r'CVE-\d{4}-\d{4,7}', text)
    for c in cves:
        iocs.append({"pattern": c, "pattern_type": "CVE"})
    
    return iocs

API_ID = int(os.getenv("TELEGRAM_API_ID"))
API_HASH = os.getenv("TELEGRAM_API_HASH")


CHANNELS = [
    'vxunderground',
    'darkwebinformer',
    'malwrhunterteam',
]

def fetch_telegram_iocs(db: Session):
    with TelegramClient('cti_session', API_ID, API_HASH) as client:
        for channel in CHANNELS:
            try:
                messages = client.get_messages(channel, limit=50)
                for msg in messages:
                    if not msg.text:
                        continue
                    iocs = extract_iocs(msg.text)
                    for ioc in iocs:
                        stix_id = f"telegram-{channel}-{hash(ioc['pattern'])}"
                        existing = db.query(Indicator).filter_by(stix_id=stix_id).first()
                        if existing:
                            continue
                        db.add(Indicator(
                            stix_id=stix_id,
                            pattern=ioc['pattern'],
                            pattern_type=ioc['pattern_type'],
                            valid_from=datetime.utcnow(),
                            source=f"Telegram/{channel}"
                        ))
                db.commit()
            except Exception as e:
                print(f"Error fetching {channel}: {e}")