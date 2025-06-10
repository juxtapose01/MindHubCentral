from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.orm import declarative_base, sessionmaker

# MySQL connection
DATABASE_URL = "mysql+mysqlconnector://root:root@localhost:3306/appathon"  # change DB details as needed

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# FastAPI app
app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can set ["http://localhost:3000"] for React only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB model
class AssessmentResult(Base):
    __tablename__ = "assessment_results"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), nullable=True)
    score = Column(Integer)
    result_text = Column(Text)
    created_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP")

# Create table (if not exists)
Base.metadata.create_all(bind=engine)

# Input model from frontend
class ResultIn(BaseModel):
    user_id: str | None = None
    score: int
    result_text: str

# POST endpoint to save assessment result
@app.post("/save-result/")
def save_result(result: ResultIn):
    db = SessionLocal()
    new_entry = AssessmentResult(
        user_id=result.user_id,
        score=result.score,
        result_text=result.result_text
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    db.close()
    return {"message": "Result saved", "id": new_entry.id}

@app.get("/get-results/")
def get_results():
    db = SessionLocal()
    results = db.query(AssessmentResult).all()
    db.close()
    return [
        {
            "id": r.id,
            "user_id": r.user_id,
            "score": r.score,
            "result_text": r.result_text,
            "created_at": r.created_at
        } for r in results
    ]

