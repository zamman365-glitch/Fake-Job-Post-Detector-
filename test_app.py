import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_predict_sample_post():
    payload = {
        "title": "Senior Frontend Software Engineer",
        "company_profile": "Innovatech is an established global software engineering team.",
        "description": "We are seeking a senior React frontend engineer to architect next-generation web apps.",
        "requirements": "Solid experience with modern React, JavaScript/TypeScript, and responsive web performance.",
        "employment_type": "Full-time",
        "required_experience": "Mid-Senior level",
        "required_education": "Bachelor's Degree",
        "telecommuting": 1,
        "has_company_logo": 1,
        "has_questions": 1
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # Assert dual keys exist for both fraudulent and probability
    assert "fradulent" in data
    assert "fraudulent" in data
    assert "pobability" in data
    assert "probability" in data
    
    # Check values
    assert data["fradulent"] in [0, 1]
    assert data["fraudulent"] in [0, 1]
    assert 0.0 <= data["pobability"] <= 1.0
    assert 0.0 <= data["probability"] <= 1.0

def test_predict_validation_error():
    # Empty title should fail with 422 Unprocessable Entity
    payload = {
        "title": "",
        "telecommuting": 0,
        "has_company_logo": 0,
        "has_questions": 0
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422

def test_spa_routes():
    # Test root and SPA client-side fallback routes
    for path in ["/", "/scan", "/dashboard"]:
        response = client.get(path)
        assert response.status_code == 200
        assert "text/html" in response.headers.get("content-type", "")
