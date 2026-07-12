import json
import re
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class JSONParsingError(Exception):
    pass

def parse_llm_json(text: str) -> Dict[str, Any]:
    """
    Robustly parses JSON from LLM outputs.
    - Strips markdown code blocks (e.g. ```json)
    - Removes trailing/leading whitespace
    - Validates JSON structure
    - Raises JSONParsingError with specific details if parsing fails
    """
    print(f"Raw AI Response Received:\n{text}\n")
    logger.info(f"Raw AI Response Received:\n{text}\n")

    if not text or not text.strip():
        raise JSONParsingError("Received empty text from LLM.")

    cleaned_text = text.strip()
    
    # Remove markdown formatting if present
    if "```json" in cleaned_text:
        # Extract content between ```json and ```
        match = re.search(r"```json\s*(.*?)\s*```", cleaned_text, re.DOTALL | re.IGNORECASE)
        if match:
            cleaned_text = match.group(1).strip()
    elif "```" in cleaned_text:
        match = re.search(r"```\s*(.*?)\s*```", cleaned_text, re.DOTALL)
        if match:
            cleaned_text = match.group(1).strip()

    # Sometimes LLMs add an intro like "Here is the JSON:"
    # We find the first { and the last }
    start_idx = cleaned_text.find('{')
    end_idx = cleaned_text.rfind('}')
    
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        cleaned_text = cleaned_text[start_idx:end_idx+1]
    else:
        # Check for JSON arrays if not an object
        start_idx = cleaned_text.find('[')
        end_idx = cleaned_text.rfind(']')
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            cleaned_text = cleaned_text[start_idx:end_idx+1]
        else:
            raise JSONParsingError("No valid JSON object or array bounds found in text.")

    try:
        data = json.loads(cleaned_text)
        if not data:
             logger.warning("Parsed JSON is empty.")
        return data
    except json.JSONDecodeError as e:
        logger.error(f"JSONDecodeError: {str(e)}\nRaw Text: {cleaned_text}")
        raise JSONParsingError(f"Failed to decode JSON: {str(e)}")
