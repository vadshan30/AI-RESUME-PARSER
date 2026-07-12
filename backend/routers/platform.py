from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from datetime import datetime
import logging

from backend.database import get_db
from backend.services.analytics_service import AnalyticsService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/platform", tags=["platform"])

@router.get("/overview")
def get_platform_overview(db: Session = Depends(get_db)):
    try:
        service = AnalyticsService(db)
        overview = service.get_platform_overview()
        
        return {
            "status": "success",
            "data": overview,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Failed to get platform overview: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve platform overview")

@router.get("/market-trends")
def get_market_trends(industry: Optional[str] = Query(None), db: Session = Depends(get_db)):
    try:
        service = AnalyticsService(db)
        trends = service.get_market_trends(industry)
        
        return {
            "status": "success",
            "data": trends,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Failed to get market trends: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve market trends")

@router.get("/ats-distribution")
def get_ats_distribution(db: Session = Depends(get_db)):
    try:
        service = AnalyticsService(db)
        distribution = service.get_ats_distribution()
        
        return {
            "status": "success",
            "data": distribution,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Failed to get ATS distribution: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve ATS distribution")

@router.get("/improvement-analytics")
def get_improvement_analytics(db: Session = Depends(get_db)):
    try:
        service = AnalyticsService(db)
        analytics = service.get_improvement_analytics()
        
        return {
            "status": "success",
            "data": analytics,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Failed to get improvement analytics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve improvement analytics")

@router.get("/industry-insights")
def get_industry_insights(db: Session = Depends(get_db)):
    try:
        service = AnalyticsService(db)
        insights = service.get_industry_insights()
        
        return {
            "status": "success",
            "data": insights,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Failed to get industry insights: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve industry insights")

@router.get("/dashboard")
def get_platform_dashboard(db: Session = Depends(get_db)):
    try:
        service = AnalyticsService(db)
        
        dashboard = {
            "overview": service.get_platform_overview(),
            "market_trends": service.get_market_trends(),
            "ats_distribution": service.get_ats_distribution(),
            "improvement_analytics": service.get_improvement_analytics(),
            "industry_insights": service.get_industry_insights()
        }
        
        return {
            "status": "success",
            "data": dashboard,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Failed to get platform dashboard: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve platform dashboard")
