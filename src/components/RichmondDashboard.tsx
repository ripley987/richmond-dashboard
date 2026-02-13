import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  AlertCircle,
  Building,
  ArrowRight,
  Info,
  ShoppingBag,
  Clock
} from 'lucide-react';

// --- Data Structure ---

const capabilityDefinitions = {
  A: { title: "Category A", subtitle: "Foundational / Necessity-Led", desc: "Needs-based retail and services dominate. Discretionary is limited and tenant-specific.", color: "bg-gray-200 text-gray-800" },
  B: { title: "Category B", subtitle: "Services-Anchored", desc: "Healthcare, dental, grooming, professional services perform reliably.", color: "bg-blue-100 text-blue-800" },
  C: { title: "Category C", subtitle: "Selective Discretionary", desc: "Some discretionary concepts perform well, typically price-aware or habit-driven.", color: "bg-green-100 text-green-800" },
  D: { title: "Category D", subtitle: "Broad Discretionary", desc: "Multiple discretionary concepts can coexist sustainably. Strong upper-income distribution.", color: "bg-purple-100 text-purple-800" },
  E: { title: "Category E", subtitle: "Mature / Affluent", desc: "Premium discretionary is broadly supported with high rent tolerance and durability.", color: "bg-indigo-100 text-indigo-800" }
};

const locations = [
  {
    id: 'church_hill',
    name: 'Church Hill Surrounds',
    capability: 'A → B',
    risk: 'High',
    summary: 'Services-led market. Discretionary success is tenant-specific.',
    details: 'Large population base but median income materially below West End benchmarks. Thin upper-income cohort relative to peer areas.',
    supports: ['Foundational uses', 'Healthcare/Dental', 'Price-accessible F&B', 'Personal Services'],
    stats: {
      pop_3mi: 110205,
      med_inc_3mi: 44967,
      avg_inc_3mi: 64408,
      high_earner_share: 8.6, 
      bachelors_plus: 33,
      median_age: 33.3,
      density_label: 'Moderate'
    },
    rings: [
      { dist: '2 miles', pop: 51472, med_inc: 50452 },
      { dist: '3 miles', pop: 110205, med_inc: 44967 },
      { dist: '5 miles', pop: 229041, med_inc: 51441 },
    ],
    incomeDist: [
      { name: '<$50k', value: 54 },
      { name: '$50k-100k', value: 27 },
      { name: '$100k-150k', value: 10 },
      { name: '$150k+', value: 9 },
    ],
    // Age Estimations from PDF Chart (3 mile)
    age_segments: [
      { name: 'Gen Z/Young (15-34)', value: 30 }, 
      { name: 'Prime Working (35-54)', value: 25 },
      { name: 'Mature (55+)', value: 23 } 
    ],
    spending: null // Data source incompatible for direct comparison
  },
  {
    id: 'the_current',
    name: 'The Current',
    sub: 'Manchester / Downtown South',
    capability: 'B → C',
    risk: 'Moderate',
    summary: 'Discretionary viability driven by density and daytime pop, not income depth.',
    details: 'Dense, renter-heavy population with strong 25-34 cohort. Median income below West End, but with a visible affluent tail.',
    supports: ['Habit-driven discretionary (fitness, coffee)', 'Fast-casual', 'Brand-led concepts'],
    stats: {
      pop_3mi: 127694,
      med_inc_3mi: 61698,
      avg_inc_3mi: 89896,
      high_earner_share: 16.6, 
      bachelors_plus: 44.2, 
      median_age: 30.9,
      density_label: 'High'
    },
    rings: [
      { dist: '1 mile', pop: 16582, med_inc: 69048 },
      { dist: '3 miles', pop: 127694, med_inc: 61698 },
      { dist: '5 miles', pop: 261601, med_inc: 65924 },
    ],
    incomeDist: [
      { name: '<$50k', value: 41 },
      { name: '$50k-100k', value: 30 },
      { name: '$100k-150k', value: 12 },
      { name: '$150k+', value: 17 },
    ],
    age_segments: [
      { name: 'Gen Z/Young (15-34)', value: 45.5 }, // 21.8 + 23.7
      { name: 'Prime Working (35-54)', value: 20.9 }, // 12.8 + 8.1
      { name: 'Mature (55+)', value: 20.3 } // 8.7 + 7.4 + 3.2 + 1.0
    ],
    spending: {
        dining: 3400,
        entertainment: 3123,
        apparel: 2080
    }
  },
  {
    id: 'willow_place',
    name: 'Willow Place',
    sub: 'W Broad Corridor',
    capability: 'D',
    risk: 'Low',
    summary: 'Supports services and discretionary uses with low demand risk.',
    details: 'High median household income with substantial $150k+ household share. Large and stable commuter/worker base.',
    supports: ['Medical/Dental', 'Higher-quality discretionary retail', 'Convenience-oriented premium'],
    stats: {
      pop_3mi: 93639,
      med_inc_3mi: 93253,
      avg_inc_3mi: 136913,
      high_earner_share: 29.6, 
      bachelors_plus: 59.8, 
      median_age: 38.6,
      density_label: 'Moderate'
    },
    rings: [
      { dist: '1 mile', pop: 8459, med_inc: 92046 },
      { dist: '2 miles', pop: 40403, med_inc: 91561 },
      { dist: '3 miles', pop: 93639, med_inc: 93253 },
    ],
    incomeDist: [
      { name: '<$50k', value: 24 },
      { name: '$50k-100k', value: 29 },
      { name: '$100k-150k', value: 18 },
      { name: '$150k+', value: 29 },
    ],
    age_segments: [
      { name: 'Gen Z/Young (15-34)', value: 32 }, // 9.2+19.7+ (approx split of <15?) using 15-34
      { name: 'Prime Working (35-54)', value: 26.7 }, // 16.4 + 10.3
      { name: 'Mature (55+)', value: 29.8 } 
    ],
    spending: {
        dining: 4995,
        entertainment: 4888,
        apparel: 2995
    }
  },
  {
    id: 'the_village',
    name: 'The Village',
    sub: 'Shopping Center',
    capability: 'E',
    risk: 'Very Low',
    summary: 'Most durable discretionary market. Highest rent tolerance.',
    details: 'Deep, stable affluence. High home values and wealth density. Slower population growth but strong purchasing power.',
    supports: ['Premium discretionary', 'Boutique fitness', 'Wellness', 'Dining'],
    stats: {
      pop_3mi: 82529,
      med_inc_3mi: 94675,
      avg_inc_3mi: 143204,
      high_earner_share: 30.5, 
      bachelors_plus: 55.3, 
      median_age: 37.6,
      density_label: 'Moderate'
    },
    rings: [
      { dist: '1 mile', pop: 12037, med_inc: 104547 },
      { dist: '3 miles', pop: 82529, med_inc: 94675 },
      { dist: '5 miles', pop: 231699, med_inc: 91009 },
    ],
    incomeDist: [
      { name: '<$50k', value: 23 },
      { name: '$50k-100k', value: 29 },
      { name: '$100k-150k', value: 17 },
      { name: '$150k+', value: 31 },
    ],
    age_segments: [
      { name: 'Gen Z/Young (15-34)', value: 28.3 }, // 13.5 + 14.8
      { name: 'Prime Working (35-54)', value: 26.3 }, // 15.1 + 11.2
      { name: 'Mature (55+)', value: 27.9 } 
    ],
    spending: {
        dining: 5116,
        entertainment: 5004,
        apparel: 3053
    }
  }
];

// --- Components ---

const MetricCard = ({ title, value, subtext, icon: Icon, trend }: any) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 bg-slate-50 rounded-lg">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend === 'High' ? 'bg-red-100 text-red-700' : trend === 'Low' || trend === 'Very Low' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            Risk: {trend}
          </span>
        )}
      </div>
      <div className="text-slate-500 text-sm font-medium">{title}</div>
      <div className="text-2xl font-bold text-slate-800 mt-1">{value}</div>
    </div>
    {subtext && <div className="text-slate-400 text-xs mt-3 pt-2 border-t border-slate-50">{subtext}</div>}
  </div>
);

const CapabilityBadge = ({ capability }: { capability: string }) => {
  const mainCap = capability.split(' ')[0] as keyof typeof capabilityDefinitions;
  const config = capabilityDefinitions[mainCap] || capabilityDefinitions['C'];
  
  return (
    <div className={`px-3 py-1 rounded-full text-sm font-bold inline-flex items-center gap-2 ${config.color}`}>
      <Activity className="w-4 h-4" />
      Category {capability}
    </div>
  );
};

export default function RichmondDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const selectedLocation = locations.find(l => l.id === selectedLocationId) || locations[0];

  const ComparisonView = () => {
    // Transform data for Spending Chart (Filtering out Church Hill due to data incompatibility)
    const spendingData = locations
      .filter(l => l.spending !== null)
      .map(l => ({
        name: l.name,
        Dining: l.spending?.dining,
        Entertainment: l.spending?.entertainment,
        Apparel: l.spending?.apparel
      }));

    // Transform data for Age Stacked Bar
    const ageData = locations.map(l => ({
      name: l.name,
      'Young (15-34)': l.age_segments[0].value,
      'Prime (35-54)': l.age_segments[1].value,
      'Mature (55+)': l.age_segments[2].value
    }));

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {locations.map((loc) => (
            <div 
              key={loc.id}
              onClick={() => { setSelectedLocationId(loc.id); setActiveTab('details'); }}
              className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 overflow-hidden"
            >
              <div className="h-2 bg-slate-800 group-hover:bg-blue-600 transition-colors" />
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-slate-800 leading-tight">{loc.name}</h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ${loc.risk === 'High' ? 'bg-red-50 text-red-600' : loc.risk === 'Very Low' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                    {loc.risk} Risk
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Capability</span>
                    <span className="font-semibold text-slate-700">{loc.capability}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Med. Income</span>
                    <span className="font-semibold text-slate-700">${(loc.stats.med_inc_3mi / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Median Age</span>
                    <span className="font-semibold text-slate-700">{loc.stats.median_age}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                  View Analysis <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 1: Income & High Earners */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Income Comparison (3 Mile Radius)
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locations} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(value) => `$${value/1000}k`} />
                  <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, 'Median Income']}
                  />
                  <Bar dataKey="stats.med_inc_3mi" name="Median Income" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                  <Bar dataKey="stats.avg_inc_3mi" name="Avg Income" fill="#93c5fd" radius={[0, 4, 4, 0]} barSize={24} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              Age Distribution Profile
            </h3>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 11}} interval={0} />
                  <YAxis unit="%" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Young (15-34)" stackId="a" fill="#818cf8" />
                  <Bar dataKey="Prime (35-54)" stackId="a" fill="#6366f1" />
                  <Bar dataKey="Mature (55+)" stackId="a" fill="#3730a3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center italic">
              Note: The Current skews significantly younger (45% under 35).
            </p>
          </div>
        </div>

        {/* Row 2: Consumer Spending */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-500" />
              Discretionary Spending Power (Avg Household / Year)
            </h3>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">ESRI 2023 Estimates</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tickFormatter={(val) => `$${val}`} />
                <Tooltip formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, '']} />
                <Legend />
                <Bar dataKey="Dining" fill="#f472b6" name="Dining Out" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Entertainment" fill="#a78bfa" name="Entertainment" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Apparel" fill="#34d399" name="Apparel" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            *Church Hill excluded from direct comparison due to differing data source methodology.
          </p>
        </div>
      </div>
    );
  };

  const LocationDetailView = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-6 w-full">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedLocation.name}</h2>
                {selectedLocation.sub && <p className="text-slate-500 text-sm mt-1">{selectedLocation.sub}</p>}
              </div>
              <CapabilityBadge capability={selectedLocation.capability} />
            </div>
            <p className="mt-4 text-slate-700 leading-relaxed max-w-3xl">
              {selectedLocation.details}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {selectedLocation.supports.map((item, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard 
              title="Median Age" 
              value={selectedLocation.stats.median_age} 
              icon={Clock}
              subtext="3 Mile Radius"
            />
            <MetricCard 
              title="Avg HH Income" 
              value={`$${(selectedLocation.stats.avg_inc_3mi / 1000).toFixed(0)}k`} 
              icon={DollarSign}
              subtext="Mean (vs Median)"
            />
            <MetricCard 
              title="Education (Bach+)" 
              value={`${selectedLocation.stats.bachelors_plus}%`} 
              icon={Building}
              subtext="Pop 25+"
            />
            <MetricCard 
              title="Discretionary Risk" 
              value={selectedLocation.risk} 
              icon={AlertCircle}
              trend={selectedLocation.risk}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income Distribution Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">Household Income</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedLocation.incomeDist}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 10}} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" name="% of Households" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Age Distribution Pie */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">Age Segments</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={selectedLocation.age_segments}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {selectedLocation.age_segments.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#818cf8', '#6366f1', '#3730a3'][index % 3]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Spending Spotlight */}
           {selectedLocation.spending && (
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-xl text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                Consumer Spending Spotlight (Avg Annual)
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-3 bg-white/10 rounded-lg">
                    <div className="text-xs text-slate-300 uppercase tracking-wider mb-1">Dining Out</div>
                    <div className="text-xl font-bold text-emerald-300">${selectedLocation.spending.dining.toLocaleString()}</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg">
                    <div className="text-xs text-slate-300 uppercase tracking-wider mb-1">Entertainment</div>
                    <div className="text-xl font-bold text-purple-300">${selectedLocation.spending.entertainment.toLocaleString()}</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg">
                    <div className="text-xs text-slate-300 uppercase tracking-wider mb-1">Apparel</div>
                    <div className="text-xl font-bold text-blue-300">${selectedLocation.spending.apparel.toLocaleString()}</div>
                </div>
              </div>
            </div>
           )}
        </div>

        {/* Sidebar Data - Rings */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              Radius Breakdown
            </h3>
            <div className="space-y-6">
              {selectedLocation.rings.map((ring, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-slate-100 last:border-0 pb-0">
                  <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full ${idx === 1 ? 'bg-blue-500' : 'bg-slate-300'}`} />
                  <div className="text-sm font-semibold text-slate-900 mb-1">{ring.dist}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider">Population</div>
                      <div className="text-sm font-mono text-slate-700">{ring.pop.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider">Med. Income</div>
                      <div className="text-sm font-mono text-slate-700">${ring.med_inc.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Analyst Take
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              {selectedLocation.summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 md:px-8 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Richmond Trade Area Analysis</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setActiveTab('overview'); setSelectedLocationId(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => { setActiveTab('details'); if(!selectedLocationId) setSelectedLocationId('church_hill'); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'details' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Location Details
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {activeTab === 'details' && (
          <div className="mb-8 flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocationId(loc.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  selectedLocationId === loc.id 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'overview' ? <ComparisonView /> : <LocationDetailView />}

        {/* Framework Reference Footer */}
        <div className="mt-12 border-t border-slate-200 pt-8">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Market Capability Framework Reference</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(capabilityDefinitions).map(([key, def]) => (
              <div key={key} className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                <div className={`text-xs font-bold px-2 py-1 rounded inline-block mb-2 ${def.color}`}>
                  {def.title}
                </div>
                <div className="font-semibold text-slate-800 text-sm mb-1">{def.subtitle}</div>
                <p className="text-xs text-slate-500 leading-snug">{def.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}