from fastapi import FastAPI
from app.database import Base, engine
from app.routers import threats
from contextlib import asynccontextmanager
from app.scheduler import start_scheduler, scheduler
from fastapi.middleware.cors import CORSMiddleware




@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    scheduler.shutdown()


app = FastAPI(title="CTI Dashboard", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(threats.router)