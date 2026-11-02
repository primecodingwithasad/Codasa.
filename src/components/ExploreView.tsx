import React from 'react';
import {
  Sparkles,
  TrendingUp,
  Compass,
  ArrowRight,
  Flame,
  Check,
  UserPlus,
} from 'lucide-react';
import { useCodext } from '../context/CodextContext';
import { PinCard } from './PinCard';

export const ExploreView: React.FC = () => {
  const {
    pins,
    creators,
    followingUserIds,
    toggleFollowUser,
    setActiveCategory,
    setSearchQuery,
    setCurrentView,
  } = useCodext();

  const curatedTopics = [
    {
      title: 'Nordic Timber Cabins & Aurora',
      category: 'Travel & Nature',
      query: 'aurora cabin alpine',
      image: '/src/assets/images/pin_aurora_mountain_cabin_1793379380790.jpg',
      pinsCount: '3.4k pins',
    },
    {
      title: 'Tokyo Night Rain & Cyber Cafes',
      category: 'Photography',
      query: 'coffee tokyo neon',
      image: '/src/assets/images/pin_cyber_cafe_aesthetic_1793379381224.jpg',
      pinsCount: '4.8k pins',
    },
    {
      title: 'Amalfi Cliff Plunge Pools & Villas',
      category: 'Architecture',
      query: 'amalfi villa pool',
      image: '/src/assets/images/pin_coastal_mediterranean_cliff_1793379382199.jpg',
      pinsCount: '5.1k pins',
    },
    {
      title: 'Sculptural Terracotta & Wild Eucalyptus',
      category: 'Craft & Ceramics',
      query: 'ceramics terracotta travertine',
      image: '/src/assets/images/pin_minimalist_ceramic_vases_1793379381036.jpg',
      pinsCount: '2.3k pins',
    },
  ];

  const handleSelectTopic = (category: string, query: string) => {
    setActiveCategory(category);
    setSearchQuery(query);
    setCurrentView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
      
      {/* Editorial Hero Spotlight */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[380px] sm:min-h-[460px] flex items-end p-6 sm:p-12 mb-12 shadow-2xl border border-slate-800">
        <img
          src="/src/assets/images/pin_coastal_mediterranean_cliff_1793379382199.jpg"
          alt="Amalfi Coast Villa Spotlight"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-102 hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">
            <Flame className="w-4 h-4" />
            <span>Curator Spotlight · Codasa Autumn 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Sun-Drenched Sanctuaries & Coastal Infinity Vistas
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
            Explore whitewashed organic architecture cascading over turquoise sea cliffs, curated for modern design enthusiasts and dreamers.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleSelectTopic('Architecture', 'amalfi')}
              className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Coastal Villas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSelectTopic('Travel & Nature', 'aurora')}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
            >
              <span>Nordic Aurora Cabins</span>
            </button>
          </div>
        </div>
      </div>

      {/* Curated Channels Bento Grid */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Trending Curation Channels
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Top aesthetic themes bookmarked across Codasa this week.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {curatedTopics.map((topic, i) => (
            <div
              key={i}
              onClick={() => handleSelectTopic(topic.category, topic.query)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 transition-all duration-300 h-64 flex flex-col justify-end p-5"
            >
              <img
                src={topic.image}
                alt={topic.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="relative z-10 text-white">
                <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider block mb-1">
                  {topic.category}
                </span>
                <h3 className="text-base font-bold leading-snug group-hover:text-rose-100 transition-colors">
                  {topic.title}
                </h3>
                <span className="text-xs text-slate-300 mt-1 block tabular-nums">
                  {topic.pinsCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Creators to Follow */}
      <div className="mb-14 p-6 sm:p-8 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Creators To Follow
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Architects, street photographers, stylists, and ceramic craftspeople.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {creators.slice(0, 6).map((c) => {
            const isFollowing = followingUserIds.includes(c.id);
            return (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-11 h-11 rounded-full object-cover bg-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {c.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">@{c.username}</p>
                    <span className="text-[10px] text-slate-500 tabular-nums">
                      {c.followersCount} followers
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollowUser(c.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 cursor-pointer ${
                    isFollowing
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                      : 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fresh Discovery Stream */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Daily Visual Discovery
          </h2>
          <span className="text-xs text-slate-400">Curated hourly on Codasa</span>
        </div>

        <div className="masonry-grid">
          {pins.slice(0, 20).map((pin) => (
            <PinCard key={pin.id} pin={pin} />
          ))}
        </div>
      </div>

    </div>
  );
};
