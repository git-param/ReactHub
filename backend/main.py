from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import Base, engine
from app.routes import auth

settings = get_settings()

# Create tables (only if database is available)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"⚠️  Warning: Could not create tables on startup: {e}")
    print("This is OK during development. Set up PostgreSQL to create tables.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="ReactHub Component Library API"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "environment": settings.ENVIRONMENT}


@app.get("/")
def root():
    """Root endpoint."""
    return {"message": "Welcome to ReactHub API", "version": "1.0.0"}
