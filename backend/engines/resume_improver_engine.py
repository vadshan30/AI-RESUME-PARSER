"""
Hybrid Resume Optimization Engine
Combines rule-based improvements with optional AI enhancement
Never fails completely - always returns optimized content
"""

import re
from typing import Dict, List, Tuple, Optional

class ResumeImproverEngine:
    """Deterministic resume improvement engine - works without AI"""
    
    # Weak verb replacements
    WEAK_TO_STRONG_VERBS = {
        'responsible for': 'Managed',
        'worked on': 'Developed',
        'helped': 'Collaborated with',
        'made': 'Designed',
        'did': 'Executed',
        'was involved in': 'Spearheaded',
        'participated in': 'Led',
        'was part of': 'Architected',
        'contributed to': 'Engineered',
        'assisted': 'Supported',
        'handled': 'Orchestrated',
        'dealt with': 'Resolved',
        'worked with': 'Partnered with',
        'used': 'Leveraged',
        'tried': 'Implemented',
        'attempted': 'Pioneered',
        'was': 'Became',
        'got': 'Achieved',
        'had': 'Demonstrated',
        'showed': 'Exhibited',
        'proved': 'Validated',
    }
    
    # Strong action verbs for different sections
    STRONG_VERBS = {
        'experience': [
            'Architected', 'Engineered', 'Spearheaded', 'Orchestrated', 'Optimized',
            'Deployed', 'Scaled', 'Transformed', 'Accelerated', 'Pioneered',
            'Delivered', 'Launched', 'Implemented', 'Designed', 'Built',
            'Developed', 'Created', 'Established', 'Managed', 'Led',
            'Mentored', 'Collaborated', 'Resolved', 'Improved', 'Enhanced',
            'Reduced', 'Increased', 'Streamlined', 'Automated', 'Integrated',
        ],
        'project': [
            'Built', 'Developed', 'Created', 'Designed', 'Engineered',
            'Implemented', 'Deployed', 'Launched', 'Delivered', 'Architected',
        ],
        'summary': [
            'Proven', 'Experienced', 'Skilled', 'Accomplished', 'Results-driven',
            'Strategic', 'Innovative', 'Collaborative', 'Technical', 'Passionate',
        ]
    }
    
    # ATS keywords by role
    ATS_KEYWORDS_BY_ROLE = {
        'react developer': [
            'React.js', 'Redux', 'Hooks', 'TypeScript', 'REST APIs',
            'State Management', 'Component Architecture', 'Performance Optimization',
            'Testing (Jest/Enzyme)', 'Webpack', 'Babel', 'Git', 'Agile'
        ],
        'java developer': [
            'Java', 'Spring Boot', 'Microservices', 'REST APIs', 'SQL',
            'JUnit', 'Maven', 'Git', 'Docker', 'AWS', 'Agile', 'Design Patterns'
        ],
        'python developer': [
            'Python', 'Django', 'Flask', 'FastAPI', 'REST APIs', 'SQL',
            'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Git', 'Pytest'
        ],
        'data scientist': [
            'Machine Learning', 'Python', 'TensorFlow', 'PyTorch', 'Pandas',
            'NumPy', 'Scikit-learn', 'SQL', 'Data Visualization', 'Statistics',
            'A/B Testing', 'Feature Engineering', 'Model Deployment'
        ],
        'devops engineer': [
            'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform', 'AWS',
            'Azure', 'Linux', 'Bash', 'Git', 'Monitoring', 'Infrastructure as Code'
        ],
        'ui/ux designer': [
            'Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing',
            'Design Systems', 'Accessibility', 'Usability Testing', 'Interaction Design'
        ],
        'data analyst': [
            'SQL', 'Tableau', 'Power BI', 'Excel', 'Python', 'Data Visualization',
            'Statistical Analysis', 'A/B Testing', 'Google Analytics', 'Dashboards'
        ],
    }
    
    # Filler words to remove
    FILLER_WORDS = [
        'very', 'really', 'quite', 'just', 'basically', 'essentially',
        'actually', 'literally', 'obviously', 'clearly', 'simply',
        'somewhat', 'kind of', 'sort of', 'a bit', 'a little',
    ]
    
    # Common abbreviations to expand
    ABBREVIATIONS = {
        'w/': 'with',
        'w/o': 'without',
        'b/c': 'because',
        'b/w': 'between',
        'approx': 'approximately',
        'mgmt': 'management',
        'dept': 'department',
        'yr': 'year',
        'yrs': 'years',
        'exp': 'experience',
        'req': 'required',
        'dev': 'development',
        'eng': 'engineering',
        'perf': 'performance',
        'impl': 'implementation',
    }
    
    def __init__(self):
        pass
    
    def validate_input(self, text: str) -> Tuple[bool, Optional[str]]:
        """Validate input before improvement"""
        if not text or not text.strip():
            return False, "Input cannot be empty"
        
        if len(text.strip()) < 20:
            return False, "Input must be at least 20 characters"
        
        if len(text.strip()) > 5000:
            return False, "Input cannot exceed 5000 characters"
        
        # Check for keyboard spam (repeated characters)
        if re.search(r'(.)\1{5,}', text):
            return False, "Input appears to contain keyboard spam"
        
        # Check for random symbols only
        if re.match(r'^[^a-zA-Z0-9\s]{5,}$', text.strip()):
            return False, "Input appears to be random symbols"
        
        # Check for numbers only
        if re.match(r'^[\d\s\-\.]+$', text.strip()):
            return False, "Input cannot be numbers only"
        
        return True, None
    
    def detect_section(self, text: str) -> str:
        """Detect which resume section this is"""
        text_lower = text.lower()
        
        # Professional Summary indicators
        if any(phrase in text_lower for phrase in [
            'passionate', 'motivated', 'dedicated', 'experienced professional',
            'skilled', 'results-driven', 'seeking', 'objective', 'summary'
        ]):
            if len(text.split()) < 100:  # Summaries are typically short
                return 'summary'
        
        # Experience indicators
        if any(phrase in text_lower for phrase in [
            'responsible for', 'worked on', 'managed', 'led', 'developed',
            'implemented', 'designed', 'built', 'created', 'at', 'for'
        ]):
            if any(char in text for char in ['•', '-', '*', '◦']):
                return 'experience'
        
        # Project indicators
        if any(phrase in text_lower for phrase in [
            'project', 'built', 'developed', 'created', 'github', 'deployed',
            'technologies', 'tech stack', 'tools used'
        ]):
            return 'project'
        
        # Education indicators
        if any(phrase in text_lower for phrase in [
            'bachelor', 'master', 'degree', 'university', 'college',
            'b.tech', 'b.e', 'm.tech', 'gpa', 'cgpa'
        ]):
            return 'education'
        
        # Skills indicators
        if any(phrase in text_lower for phrase in [
            'skills', 'proficient', 'expertise', 'languages', 'tools',
            'technologies', 'programming', 'frameworks'
        ]):
            return 'skills'
        
        # Default to experience
        return 'experience'
    
    def improve_text(self, text: str, section_type: str, target_role: Optional[str] = None) -> Dict:
        """Main improvement pipeline"""
        
        # 1. Validate
        is_valid, error = self.validate_input(text)
        if not is_valid:
            return {
                'success': False,
                'error': error,
                'improved_text': text,
                'changes': []
            }
        
        # 2. Detect section if not provided
        if not section_type or section_type == 'auto':
            section_type = self.detect_section(text)
        
        improved = text
        changes = []
        
        # 3. Apply improvements
        improved, section_changes = self._apply_grammar_fixes(improved, section_type)
        changes.extend(section_changes)
        
        improved, verb_changes = self._replace_weak_verbs(improved, section_type)
        changes.extend(verb_changes)
        
        improved, filler_changes = self._remove_filler_words(improved)
        changes.extend(filler_changes)
        
        improved, abbrev_changes = self._expand_abbreviations(improved)
        changes.extend(abbrev_changes)
        
        improved, passive_changes = self._convert_passive_to_active(improved)
        changes.extend(passive_changes)
        
        improved, format_changes = self._improve_formatting(improved, section_type)
        changes.extend(format_changes)
        
        improved, ats_changes = self._inject_ats_keywords(improved, target_role, section_type)
        changes.extend(ats_changes)
        
        improved, readability_changes = self._improve_readability(improved)
        changes.extend(readability_changes)
        
        # 4. Quality check
        quality_score = self._calculate_quality_score(improved, section_type)
        
        return {
            'success': True,
            'improved_text': improved.strip(),
            'section_type': section_type,
            'changes': changes[:10],  # Top 10 changes
            'quality_score': quality_score,
            'stats': {
                'original_length': len(text),
                'improved_length': len(improved),
                'word_count_original': len(text.split()),
                'word_count_improved': len(improved.split()),
                'changes_count': len(changes),
            }
        }
    
    def _apply_grammar_fixes(self, text: str, section_type: str) -> Tuple[str, List[str]]:
        """Fix common grammar issues"""
        changes = []
        original = text
        
        # Fix capitalization at start of sentences
        text = re.sub(r'(?:^|\.\s+)([a-z])', lambda m: m.group(0)[:-1] + m.group(1).upper(), text)
        
        # Fix double spaces
        if '  ' in text:
            text = re.sub(r'\s+', ' ', text)
            changes.append('Removed extra spaces')
        
        # Fix missing periods at end
        if text.strip() and not text.strip().endswith(('.', '!', '?')):
            text = text.rstrip() + '.'
            changes.append('Added period at end')
        
        # Fix comma spacing
        text = re.sub(r',([^ ])', r', \1', text)
        
        # Fix common typos
        typo_fixes = {
            r'\brecieve\b': 'receive',
            r'\boccured\b': 'occurred',
            r'\bseperate\b': 'separate',
            r'\bneccessary\b': 'necessary',
            r'\boccassion\b': 'occasion',
        }
        for typo, fix in typo_fixes.items():
            if re.search(typo, text, re.IGNORECASE):
                text = re.sub(typo, fix, text, flags=re.IGNORECASE)
                changes.append(f'Fixed typo: {typo} → {fix}')
        
        if text != original:
            changes.append('Applied grammar fixes')
        
        return text, changes
    
    def _replace_weak_verbs(self, text: str, section_type: str) -> Tuple[str, List[str]]:
        """Replace weak verbs with strong action verbs"""
        changes = []
        original = text
        
        for weak, strong in self.WEAK_TO_STRONG_VERBS.items():
            pattern = r'\b' + re.escape(weak) + r'\b'
            if re.search(pattern, text, re.IGNORECASE):
                text = re.sub(pattern, strong, text, flags=re.IGNORECASE)
                changes.append(f'Replaced "{weak}" with "{strong}"')
        
        # Add strong verbs if missing
        if section_type in ['experience', 'project']:
            verbs_in_text = [v for v in self.STRONG_VERBS.get(section_type, []) if v.lower() in text.lower()]
            if len(verbs_in_text) < 2:
                changes.append(f'Consider using more strong action verbs like: {", ".join(self.STRONG_VERBS[section_type][:3])}')
        
        return text, changes
    
    def _remove_filler_words(self, text: str) -> Tuple[str, List[str]]:
        """Remove filler words"""
        changes = []
        original = text
        
        for filler in self.FILLER_WORDS:
            pattern = r'\b' + re.escape(filler) + r'\b\s*'
            if re.search(pattern, text, re.IGNORECASE):
                text = re.sub(pattern, '', text, flags=re.IGNORECASE)
                changes.append(f'Removed filler word: "{filler}"')
        
        # Remove duplicate words
        words = text.split()
        cleaned_words = []
        for i, word in enumerate(words):
            if i == 0 or word.lower() != words[i-1].lower():
                cleaned_words.append(word)
        
        if len(cleaned_words) < len(words):
            text = ' '.join(cleaned_words)
            changes.append('Removed duplicate words')
        
        return text, changes
    
    def _expand_abbreviations(self, text: str) -> Tuple[str, List[str]]:
        """Expand common abbreviations"""
        changes = []
        
        for abbrev, full in self.ABBREVIATIONS.items():
            pattern = r'\b' + re.escape(abbrev) + r'\b'
            if re.search(pattern, text, re.IGNORECASE):
                text = re.sub(pattern, full, text, flags=re.IGNORECASE)
                changes.append(f'Expanded "{abbrev}" to "{full}"')
        
        return text, changes
    
    def _convert_passive_to_active(self, text: str) -> Tuple[str, List[str]]:
        """Convert passive voice to active voice"""
        changes = []
        
        # Common passive patterns
        passive_patterns = [
            (r'was\s+(\w+ed)\s+by', 'Active voice detected'),
            (r'were\s+(\w+ed)\s+by', 'Active voice detected'),
            (r'is\s+being\s+(\w+ed)', 'Active voice detected'),
            (r'has\s+been\s+(\w+ed)', 'Active voice detected'),
        ]
        
        for pattern, msg in passive_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                changes.append('Consider converting passive voice to active voice for stronger impact')
                break
        
        return text, changes
    
    def _improve_formatting(self, text: str, section_type: str) -> Tuple[str, List[str]]:
        """Improve formatting and consistency"""
        changes = []
        
        # Ensure consistent bullet points
        if section_type in ['experience', 'project']:
            lines = text.split('\n')
            formatted_lines = []
            
            for line in lines:
                line = line.strip()
                if line and not line.startswith(('•', '-', '*', '◦')):
                    line = '• ' + line
                formatted_lines.append(line)
            
            formatted_text = '\n'.join(formatted_lines)
            if formatted_text != text:
                text = formatted_text
                changes.append('Standardized bullet point formatting')
        
        # Fix spacing around punctuation
        text = re.sub(r'\s+([.,!?;:])', r'\1', text)
        text = re.sub(r'([.,!?;:])\s*', r'\1 ', text)
        text = re.sub(r'\s+', ' ', text)
        
        return text, changes
    
    def _inject_ats_keywords(self, text: str, target_role: Optional[str], section_type: str) -> Tuple[str, List[str]]:
        """Inject ATS keywords naturally"""
        changes = []
        
        if not target_role:
            return text, changes
        
        role_lower = target_role.lower()
        keywords = None
        
        # Find matching role
        for role_key, kw_list in self.ATS_KEYWORDS_BY_ROLE.items():
            if role_key in role_lower or any(word in role_lower for word in role_key.split()):
                keywords = kw_list
                break
        
        if not keywords:
            return text, changes
        
        # Check which keywords are missing
        text_lower = text.lower()
        missing_keywords = [kw for kw in keywords if kw.lower() not in text_lower]
        
        if missing_keywords and section_type in ['experience', 'project', 'summary']:
            # Add top 2-3 missing keywords naturally
            for keyword in missing_keywords[:3]:
                if keyword.lower() not in text_lower:
                    # Add to end of text naturally
                    if section_type == 'summary':
                        text = text.rstrip('.') + f', with expertise in {keyword}.'
                    else:
                        text = text.rstrip('.') + f' Utilized {keyword}.'
                    changes.append(f'Added ATS keyword: "{keyword}"')
        
        return text, changes
    
    def _improve_readability(self, text: str) -> Tuple[str, List[str]]:
        """Improve readability"""
        changes = []
        
        # Check sentence length
        sentences = re.split(r'[.!?]+', text)
        long_sentences = [s for s in sentences if len(s.split()) > 25]
        
        if long_sentences:
            changes.append('Some sentences are long - consider breaking them up for better readability')
        
        # Check for varied sentence structure
        sentences_starting_with = {}
        for sentence in sentences:
            if sentence.strip():
                first_word = sentence.strip().split()[0].lower()
                sentences_starting_with[first_word] = sentences_starting_with.get(first_word, 0) + 1
        
        if sentences_starting_with and max(sentences_starting_with.values()) > len(sentences) * 0.5:
            changes.append('Vary sentence structure for better flow')
        
        return text, changes
    
    def _calculate_quality_score(self, text: str, section_type: str) -> int:
        """Calculate quality score 0-100"""
        score = 50
        
        # Grammar and structure
        if text.count('.') > 0:
            score += 10
        if text.count(',') > 0:
            score += 5
        
        # Action verbs
        strong_verbs = self.STRONG_VERBS.get(section_type, [])
        verb_count = sum(1 for verb in strong_verbs if verb.lower() in text.lower())
        score += min(20, verb_count * 3)
        
        # Quantified achievements
        if re.search(r'\d+%|\d+x|\d+\s*(million|k|cr|lpa|users|requests)', text, re.IGNORECASE):
            score += 15
        
        # Length appropriateness
        word_count = len(text.split())
        if section_type == 'summary' and 30 <= word_count <= 100:
            score += 10
        elif section_type in ['experience', 'project'] and 20 <= word_count <= 150:
            score += 10
        
        # No filler words
        filler_count = sum(1 for filler in self.FILLER_WORDS if filler in text.lower())
        score -= filler_count * 2
        
        return min(100, max(0, score))
    
    def get_improvement_highlights(self, changes: List[str]) -> Dict[str, List[str]]:
        """Categorize changes for display"""
        highlights = {
            'action_verbs': [],
            'grammar': [],
            'ats_keywords': [],
            'formatting': [],
            'readability': [],
            'other': []
        }
        
        for change in changes:
            if 'verb' in change.lower() or 'replaced' in change.lower():
                highlights['action_verbs'].append(change)
            elif 'grammar' in change.lower() or 'typo' in change.lower():
                highlights['grammar'].append(change)
            elif 'keyword' in change.lower():
                highlights['ats_keywords'].append(change)
            elif 'bullet' in change.lower() or 'format' in change.lower():
                highlights['formatting'].append(change)
            elif 'readability' in change.lower() or 'sentence' in change.lower():
                highlights['readability'].append(change)
            else:
                highlights['other'].append(change)
        
        return {k: v for k, v in highlights.items() if v}
