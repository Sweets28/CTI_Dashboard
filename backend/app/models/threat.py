from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base



actor_techniques = Table(
    "actor_techniques",
    Base.metadata,
    Column("actor_id", Integer, ForeignKey("threat_actors.id"), primary_key=True),
    Column("technique_id", Integer, ForeignKey("techniques.id"), primary_key=True),
)

# Junction table: Links your existing ThreatActor to Software
actor_software = Table(
    "actor_software",
    Base.metadata,
    Column("actor_id", Integer, ForeignKey("threat_actors.id"), primary_key=True),
    Column("software_id", Integer, ForeignKey("software.id"), primary_key=True),
)



class Vulnerability(Base):
    __tablename__ = "vulnerabilities"
    id = Column(Integer, primary_key=True)
    cve_id = Column(String, unique=True)
    description = Column(Text)
    severity = Column(String)
    cvss_score = Column(Float)
    published_date = Column(DateTime)
    source = Column(String)


class ThreatActor(Base):
    __tablename__ = "threat_actors"
    id = Column(Integer, primary_key=True)
    stix_id = Column(String, unique=True)
    name = Column(String)
    description = Column(Text)
    aliases = Column(String)
    source = Column(String)
    techniques = relationship("Technique", secondary=actor_techniques)
    software = relationship("Software", secondary=actor_software)


class Indicator(Base):
    __tablename__ = "indicators"
    id = Column(Integer, primary_key=True)
    stix_id = Column(String, unique=True)
    pattern = Column(Text)
    pattern_type = Column(String)
    valid_from = Column(DateTime)
    source = Column(String)

class Technique(Base):
    __tablename__ = "techniques"
    id = Column(Integer, primary_key=True)
    stix_id = Column(String, unique=True)
    mitre_id = Column(String)
    name = Column(String)
    description = Column(Text)


class Software(Base):
    __tablename__ = "software"
    id = Column(Integer, primary_key=True)
    stix_id = Column(String, unique=True)
    name = Column(String)
    sw_type = Column(String)