import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:8000'
})

export const getVulnerabilities = (skip=0, limit=20) => API.get(`/vulnerabilities?skip=${skip}&limit=${limit}`)
export const getThreatActors = (skip=0, limit=20) => API.get(`/threat_actors?skip=${skip}&limit=${limit}`)
export const getIndicators = (skip=0, limit=20) => API.get(`/indicators?skip=${skip}&limit=${limit}`)
export const getVulnerabilitiesCount = () => API.get('/vulnerabilities/count')
export const getVulnerability = (cve_id) => API.get(`/vulnerabilities/${cve_id}`)
export const getThreatActor = (stix_id) => API.get(`/threat_actors/${stix_id}`)

export const getThreatActorsCount = () => API.get('/threat_actors/count')
export const getIndicatorsCount = () => API.get('/indicators/count')
export const ingestNVD = () => API.post('/ingest/nvd')
export const ingestMitre = () => API.post('/ingest/mitre')
export const ingestOTX = () => API.post('/ingest/taxii')