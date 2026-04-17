from apscheduler.schedulers.background import BackgroundScheduler
from app.database import SessionLocal
from app.ingestion.nvd import fetch_nvd_cves
from app.ingestion.mitre import fetch_and_map_mitre
from app.ingestion.taxii import fetch_taxii_indicators


scheduler = BackgroundScheduler()


def run_nvd():
    db = SessionLocal()
    try:
        fetch_nvd_cves(db)
    finally:
        db.close()

def run_mitre():
    db = SessionLocal()
    try:
        fetch_and_map_mitre(db)
    finally:
        db.close()

def run_otx():
    db = SessionLocal()
    try:
        fetch_taxii_indicators(db)
    finally:
        db.close()

def start_scheduler():
    scheduler.add_job(run_nvd, 'interval', hours=6)
    scheduler.add_job(run_mitre, 'interval', hours=6)
    scheduler.add_job(run_otx, 'interval', hours=6)
    scheduler.start()