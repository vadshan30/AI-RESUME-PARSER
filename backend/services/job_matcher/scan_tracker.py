import time
from typing import Optional, List, Any, Dict

class ScanTracker:
    def __init__(self):
        self.reset()
        
    def reset(self):
        self.current_stage: str = "Idle"
        self.completed_steps: List[str] = []
        self.failed_step: Optional[str] = None
        self.error: Optional[str] = None
        self.stack_trace: Optional[str] = None
        self.start_time: float = 0.0
        self.execution_time: float = 0.0
        self.resume_summary: Optional[Dict[str, Any]] = None
        self.jd_summary: Optional[Dict[str, Any]] = None
        
    def start(self):
        self.reset()
        self.start_time = time.time()
        self.current_stage = "Upload Complete"
        self.completed_steps.append("Upload Complete")
        
    def set_stage(self, stage: str):
        self.current_stage = stage
        self.completed_steps.append(stage)
        self.execution_time = time.time() - self.start_time
        
    def fail(self, stage: str, error_msg: str, stack_trace: str):
        self.failed_step = stage
        self.error = error_msg
        self.stack_trace = stack_trace
        self.current_stage = "Failed"
        self.execution_time = time.time() - self.start_time

# Global tracker instance
scan_tracker = ScanTracker()
