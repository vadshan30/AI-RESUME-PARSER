import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Briefcase } from 'lucide-react';
import { JOB_CATEGORIES, ALL_ROLES } from '../../data/jobRoles';
import { useJobMatchStore } from '../../store/useJobMatchStore';

const JobRoleSelector = () => {
  const { selectedRole, setSelectedRole } = useJobMatchStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCategories = JOB_CATEGORIES.map(cat => ({
    ...cat,
    roles: cat.roles.filter(r => r.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(cat => cat.roles.length > 0);

  // If search term is present but not in any category, allow custom
  const isCustomRole = searchTerm.length > 0 && !ALL_ROLES.some(r => r.toLowerCase() === searchTerm.toLowerCase());

  return (
    <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 shadow-xl relative" ref={dropdownRef}>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center">
        <Briefcase className="h-5 w-5 text-blue-400 mr-2" /> Target Job Role
      </h2>
      
      <div className="relative">
        <div 
          className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-4 flex items-center justify-between cursor-pointer focus-within:border-blue-500 shadow-inner group"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center flex-1">
            <Search className="h-5 w-5 text-slate-400 mr-3 group-focus-within:text-blue-400" />
            <input 
              type="text" 
              className="bg-transparent border-none outline-none text-white font-medium w-full placeholder:text-slate-500"
              placeholder="Search 300+ engineering roles..."
              value={isOpen ? searchTerm : selectedRole}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
            />
          </div>
          <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, idx) => (
                <div key={idx} className="border-b border-slate-700/50 last:border-0">
                  <div className="bg-slate-900/50 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 backdrop-blur-md">
                    <span className="mr-2">{category.icon}</span> {category.name}
                  </div>
                  {category.roles.map(role => (
                    <div 
                      key={role}
                      className="px-6 py-3 hover:bg-blue-500/10 cursor-pointer flex items-center justify-between group transition-colors"
                      onClick={() => {
                        setSelectedRole(role);
                        setSearchTerm('');
                        setIsOpen(false);
                      }}
                    >
                      <span className={`text-sm ${selectedRole === role ? 'text-blue-400 font-bold' : 'text-slate-300 font-medium group-hover:text-blue-300'}`}>
                        {role}
                      </span>
                      {selectedRole === role && <Check className="h-4 w-4 text-blue-500" />}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-400 text-sm">
                No standard roles found matching "{searchTerm}"
              </div>
            )}
            
            {isCustomRole && (
              <div 
                className="px-6 py-4 bg-blue-600/20 hover:bg-blue-600/30 cursor-pointer border-t border-blue-500/30 flex items-center justify-between"
                onClick={() => {
                  setSelectedRole(searchTerm);
                  setSearchTerm('');
                  setIsOpen(false);
                }}
              >
                <div>
                  <span className="text-blue-400 font-bold block text-sm">Use Custom Role:</span>
                  <span className="text-white text-base">{searchTerm}</span>
                </div>
                <Check className="h-5 w-5 text-blue-400" />
              </div>
            )}
          </div>
        )}
      </div>

      {selectedRole && (
        <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">Selected Target Role</p>
            <p className="text-white font-bold">{selectedRole}</p>
          </div>
          <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
            ATS Ready
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRoleSelector;
