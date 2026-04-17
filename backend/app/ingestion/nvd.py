import httpx 
from sqlalchemy.orm import Session
from app.models.threat import Vulnerability
from datetime import datetime



def fetch_nvd_cves(db: Session):
    vulnerabilities = []
    url = "https://services.nvd.nist.gov/rest/json/cves/2.0"
    request = httpx.get(url)
    data = request.json()
    vulnerabilities = data["vulnerabilities"]
    for item in vulnerabilities:
        cve = item["cve"]
        cve_id = cve["id"]
        description = next((d["value"] for d in cve["descriptions"] if d["lang"] == "en"), None)
        metrics = cve.get("metrics", {})
        cvss_list = metrics.get("cvssMetricV31", [])
        if cvss_list:
            cvss_score = cvss_list[0]["cvssData"]["baseScore"]
            severity = cvss_list[0]["cvssData"]["baseSeverity"]
        else:
            cvss_score = None
            severity = None
        published_date = datetime.strptime(cve["published"], "%Y-%m-%dT%H:%M:%S.%f")
        existing = db.query(Vulnerability).filter_by(cve_id=cve_id).first()
        if existing:
            continue
        vuln = Vulnerability(
            cve_id=cve_id,
            description=description,
            severity=severity,
            cvss_score=cvss_score,
            published_date=published_date,
            source="NVD"
        )

        db.add(vuln)
        
    db.commit()