from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.threat import Vulnerability, ThreatActor, Indicator
from app.schemas.threat_schema import VulnerabilityResponse, ThreatActorResponse, IndicatorResponse
from typing import List
from app.ingestion.nvd import fetch_nvd_cves
from app.ingestion.mitre import fetch_and_map_mitre
from app.ingestion.taxii import fetch_taxii_indicators


router = APIRouter()


@router.get("/vulnerabilities", response_model=List[VulnerabilityResponse])
def get_vulnerabilities(db: Session = Depends(get_db), skip: int = Query(default=0), limit: int = Query(default=20)):
    return db.query(Vulnerability).offset(skip).limit(limit).all()

@router.get("/threat_actors", response_model=List[ThreatActorResponse])
def get_threat_actors(db: Session = Depends(get_db),skip: int = Query(default=0), limit: int = Query(default=20)):
    return db.query(ThreatActor).offset(skip).limit(limit).all()

@router.get("/indicators", response_model=List[IndicatorResponse])
def get_indicators(db: Session = Depends(get_db), skip: int = Query(default=0), limit: int = Query(default=20)):
    return db.query(Indicator).offset(skip).limit(limit).all()


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


@router.get("/vulnerabilities/count")
def get_vulnerabilities_count(db: Session = Depends(get_db)):
    return {"count": db.query(Vulnerability).count()}

@router.get("/vulnerabilities/{cve_id}", response_model=VulnerabilityResponse)
def get_vulnerability(cve_id: str, db: Session = Depends(get_db)):
    vuln = db.query(Vulnerability).filter_by(cve_id=cve_id).first()
    if not vuln:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="CVE not found")
    return vuln

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


@router.get("/threat_actors/count")
def get_threat_actors_count(db: Session = Depends(get_db)):
    return {"count": db.query(ThreatActor).count()}

@router.get("/indicators/count")
def get_indicators_count(db: Session = Depends(get_db)):
    return {"count": db.query(Indicator).count()}
