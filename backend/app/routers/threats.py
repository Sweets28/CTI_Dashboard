from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.threat import Vulnerability, ThreatActor, Indicator
from app.schemas.threat_schema import VulnerabilityResponse, ThreatActorResponse, IndicatorResponse
from typing import List
from app.ingestion.nvd import fetch_nvd_cves
from app.ingestion.mitre import fetch_and_map_mitre
from app.ingestion.taxii import fetch_taxii_indicators
from app.ingestion.telegram_ingestion import fetch_telegram_iocs

router = APIRouter()


@router.get("/vulnerabilities", response_model=List[VulnerabilityResponse])
def get_vulnerabilities(db: Session = Depends(get_db), skip: int = Query(default=0), limit: int = Query(default=20)):
    return db.query(Vulnerability).order_by(Vulnerability.published_date.desc()).offset(skip).limit(limit).all()

@router.get("/threat_actors", response_model=List[ThreatActorResponse])
def get_threat_actors(db: Session = Depends(get_db),skip: int = Query(default=0), limit: int = Query(default=20)):
    return db.query(ThreatActor).offset(skip).limit(limit).all()

@router.get("/indicators", response_model=List[IndicatorResponse])
def get_indicators(db: Session = Depends(get_db), skip: int = Query(default=0), limit: int = Query(default=20)):
    return db.query(Indicator).offset(skip).limit(limit).all()


@router.get("/vulnerabilities/count")
def get_vulnerabilities_count(db: Session = Depends(get_db)):
    return {"count": db.query(Vulnerability).count()}

@router.get("/vulnerabilities/stats/severity")
def get_severity_stats(db: Session = Depends(get_db)):
    from sqlalchemy import func
    results = db.query(Vulnerability.severity, func.count(Vulnerability.id))\
    .filter(Vulnerability.severity != None)\
    .filter(Vulnerability.severity != 'NONE')\
    .group_by(Vulnerability.severity).all()
    return [{"severity": r[0], "count": r[1]} for r in results]

@router.get("/vulnerabilities/stats/timeline")
def get_vulnerabilities_timeline(db: Session = Depends(get_db)):
    from sqlalchemy import func
    results = db.query(
        func.strftime('%Y-%m', Vulnerability.published_date).label('month'),
        func.count(Vulnerability.id).label('count')
    ).filter(Vulnerability.published_date >= '2024-01-01')\
    .group_by('month').order_by('month').all()
    return [{"month": r[0], "count": r[1]} for r in results]


@router.get("/threat_actors/count")
def get_threat_actors_count(db: Session = Depends(get_db)):
    return {"count": db.query(ThreatActor).count()}

@router.get("/indicators/count")
def get_indicators_count(db: Session = Depends(get_db)):
    return {"count": db.query(Indicator).count()}

@router.get("/indicators/stats/types")
def get_indicator_types(db: Session = Depends(get_db)):
    from sqlalchemy import func
    results = db.query(Indicator.pattern_type, func.count(Indicator.id))\
    .group_by(Indicator.pattern_type).all()
    return [{"type": r[0], "count": r[1]} for r in results]


@router.get("/stats/countries")
def get_country_stats(db: Session = Depends(get_db)):
    from app.models.threat import CountryStat
    results = db.query(CountryStat).order_by(CountryStat.count.desc()).all()
    return [{"country": r.country, "count": r.count} for r in results]

@router.get("/threat_actors/{stix_id}", response_model=ThreatActorResponse)
def get_threat_actor(stix_id: str, db: Session = Depends(get_db)):
    actor = db.query(ThreatActor).options(
        joinedload(ThreatActor.techniques),
        joinedload(ThreatActor.software)
    ).filter_by(stix_id=stix_id).first()
    
    if not actor:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Actor not found")
    
    return actor


@router.get("/vulnerabilities/{cve_id}", response_model=VulnerabilityResponse)
def get_vulnerability(cve_id: str, db: Session = Depends(get_db)):
    vuln = db.query(Vulnerability).filter_by(cve_id=cve_id).first()
    if not vuln:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="CVE not found")
    return vuln




@router.post("/ingest/telegram")
def ingest_telegram(db: Session = Depends(get_db)):
    fetch_telegram_iocs(db)
    return {"message": "Telegram ingestion complete"}

@router.post("/ingest/nvd")
def ingest_nvd(db: Session = Depends(get_db)):
    fetch_nvd_cves(db)
    return {"message": "NVD ingestion complete"}

@router.post("/ingest/mitre")
def ingest_mitre(db: Session = Depends(get_db)):
    fetch_and_map_mitre(db)
    return {"message": "Mitre ingestion complete"}

@router.post("/ingest/taxii")
def ingest_taxii(db: Session = Depends(get_db)):
    fetch_taxii_indicators(db)
    return {"message": "Taxii ingestion complete"}
