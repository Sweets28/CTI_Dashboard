import httpx 
from sqlalchemy.orm import Session
from app.models.threat import Vulnerability
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()



def fetch_nvd_cves(db: Session):
    headers = {}
    vulnerabilities = []
    api_key = os.getenv("NVD_API_KEY")
    if api_key:
        headers["apiKey"] = api_key
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=30)
    url = "https://services.nvd.nist.gov/rest/json/cves/2.0"
    params = {
        "pubStartDate": start_date.strftime("%Y-%m-%dT%H:%M:%S.000"),
        "pubEndDate": end_date.strftime("%Y-%m-%dT%H:%M:%S.000"),
    }
    request = httpx.get(url, params=params, timeout=60.0)
    data = request.json()
    print("Total results:", data.get("totalResults"))
    print("First CVE:", data["vulnerabilities"][0]["cve"]["id"] if data.get("vulnerabilities") else "none")
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