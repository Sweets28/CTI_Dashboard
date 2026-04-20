from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List



class TechniqueSchema(BaseModel):
    stix_id: str
    mitre_id: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

class SoftwareSchema(BaseModel):
    stix_id: str
    name: Optional[str] = None
    sw_type: Optional[str] = None

    class Config:
        from_attributes = True



class VulnerabilityBase(BaseModel):
    cve_id: str
    description: Optional[str] = None
    severity: Optional[str] = None
    cvss_score: Optional[float] = None
    published_date: Optional[datetime] = None
    source: Optional[str] = None

class ThreatActorBase(BaseModel):
    stix_id: str
    name: Optional[str] = None
    description: Optional[str] = None
    aliases: Optional[str] = None
    source: Optional[str] = None

class IndicatorBase(BaseModel):
    stix_id: str
    pattern: Optional[str] = None
    pattern_type: Optional[str] = None
    valid_from: Optional[datetime] = None
    source: Optional[str] = None



class VulnerabilityResponse(VulnerabilityBase):
    id: int
    class Config:
        from_attributes = True

class ThreatActorResponse(ThreatActorBase):
    id: int
    techniques: List[TechniqueSchema] = []
    software: List[SoftwareSchema] = []

    class Config:
        from_attributes = True

class IndicatorResponse(IndicatorBase):
    id: int
    class Config:
        from_attributes = True