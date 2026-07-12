import React, { useEffect, useRef, useState } from 'react';
import { Search, ChevronDown, Check, Briefcase, Star, TrendingUp } from 'lucide-react';
import { JOB_CATEGORIES, ALL_ROLES } from '../../data/jobRoles';

const TRENDING_ROLES = [
  'AI Engineer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer',
  'Product Manager', 'Cyber Security Analyst', 'Cloud Architect', 'ML Engineer',
];

interface RoleSelectorProps {
  value: string;
  onChange: (role: string) => void;
  label?: string;
  placeholder?: string;
  accent?: 'indigo' | 'emerald' | 'blue' | 'purple';
  showTrending?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  onChange,
  label = 'Target Role',
  placeholder = 'Search 500+ roles (e.g. Senior Frontend Developer)',
  accent = 'indigo',
  showTrending = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const recentKey = 'recent_target_roles';
  const favKey = 'favorite_target_roles';

  const [recentRoles, setRecentRoles] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(recentKey) || '[]'); } catch { return []; }
  });
  const [favoriteRoles, setFavoriteRoles] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(favKey) || '[]'); } catch { return []; }
  });

  useEffect(() => { setSearchTerm(value); }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectRole = (role: string) => {
    onChange(role);
    setSearchTerm(role);
    setIsOpen(false);
    const updated = [role, ...recentRoles.filter((r) => r !== role)].slice(0, 5);
    setRecentRoles(updated);
    localStorage.setItem(recentKey, JSON.stringify(updated));
  };

  const toggleFavorite = (role: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favoriteRoles.includes(role)
      ? favoriteRoles.filter((r) => r !== role)
      : [...favoriteRoles, role].slice(0, 8);
    setFavoriteRoles(updated);
    localStorage.setItem(favKey, JSON.stringify(updated));
  };

  const filteredCategories = JOB_CATEGORIES.map((cat) => ({
    ...cat,
    roles: cat.roles.filter((r) => r.toLowerCase().includes(searchTerm.toLowerCase())),
  })).filter((cat) => cat.roles.length > 0);

  const isCustomRole =
    searchTerm.length > 0 &&
    !ALL_ROLES.some((r) => r.toLowerCase() === searchTerm.toLowerCase());

  const focusBorder = {
    indigo: 'focus-within:border-indigo-500',
    emerald: 'focus-within:border-emerald-500',
    blue: 'focus-within:border-blue-500',
    purple: 'focus-within:border-purple-500',
  }[accent];

  return (
    <div ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={`w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3.5 flex items-center gap-3 cursor-text shadow-inner ${focusBorder}`}
          onClick={() => setIsOpen(true)}
        >
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white font-medium w-full placeholder:text-slate-500"
            placeholder={placeholder}
            value={isOpen ? searchTerm : value || searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
            {showTrending && !searchTerm && (
              <div className="border-b border-slate-700/50 p-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                  <TrendingUp className="h-3.5 w-3.5" /> Trending roles
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING_ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => selectRole(role)}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-900/80 text-slate-300 rounded-lg border border-slate-700 hover:border-indigo-500/50 hover:text-indigo-300 transition-colors"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {recentRoles.length > 0 && !searchTerm && (
              <div className="border-b border-slate-700/50 p-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Recently selected</div>
                {recentRoles.map((role) => (
                  <div
                    key={role}
                    onClick={() => selectRole(role)}
                    className="px-3 py-2 hover:bg-slate-700/50 cursor-pointer text-sm text-slate-300 flex items-center justify-between rounded-lg"
                  >
                    {role}
                    {value === role && <Check className="h-4 w-4 text-emerald-400" />}
                  </div>
                ))}
              </div>
            )}

            {favoriteRoles.length > 0 && !searchTerm && (
              <div className="border-b border-slate-700/50 p-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Favorites</div>
                {favoriteRoles.map((role) => (
                  <div
                    key={role}
                    onClick={() => selectRole(role)}
                    className="px-3 py-2 hover:bg-slate-700/50 cursor-pointer text-sm text-slate-300 flex items-center justify-between rounded-lg"
                  >
                    <span className="flex items-center gap-2">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> {role}
                    </span>
                    {value === role && <Check className="h-4 w-4 text-emerald-400" />}
                  </div>
                ))}
              </div>
            )}

            {filteredCategories.map((category) => (
              <div key={category.name} className="border-b border-slate-700/50 last:border-0">
                <div className="bg-slate-900/50 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 backdrop-blur-md flex items-center gap-2">
                  <Briefcase className="h-3 w-3" />
                  <span>{category.icon}</span> {category.name}
                </div>
                {category.roles.slice(0, 30).map((role) => (
                  <div
                    key={role}
                    onClick={() => selectRole(role)}
                    className="px-4 py-2.5 hover:bg-indigo-500/10 cursor-pointer flex items-center justify-between group"
                  >
                    <span className={`text-sm ${value === role ? 'text-indigo-400 font-bold' : 'text-slate-300 group-hover:text-indigo-300'}`}>
                      {role}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleFavorite(role, e)}
                        className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Toggle favorite"
                      >
                        <Star className={`h-3.5 w-3.5 ${favoriteRoles.includes(role) ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
                      </button>
                      {value === role && <Check className="h-4 w-4 text-indigo-400" />}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {filteredCategories.length === 0 && !isCustomRole && (
              <div className="p-4 text-center text-slate-400 text-sm">No matches found.</div>
            )}

            {isCustomRole && (
              <div
                className="px-4 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 cursor-pointer border-t border-indigo-500/30 text-white font-bold text-sm"
                onClick={() => selectRole(searchTerm)}
              >
                Use custom role: {searchTerm}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelector;
