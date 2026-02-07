import React, { useState } from 'react';
import { Activity, Calculator, Apple, Egg, Fish, Microscope, Flame, Bone, ShieldAlert } from 'lucide-react';

export default function DietPlan() {
    const [formData, setFormData] = useState({
        age: '',
        gender: 'male',
        weight: '',
        height: '',
        injury: 'none',
        injuryType: 'fracture' // 'fracture' or 'strain'
    });

    const [result, setResult] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculatePlan = (e) => {
        e.preventDefault();
        const { age, gender, weight, height, injury, injuryType } = formData;

        if (!age || !weight || !height) return;

        // Mifflin-St Jeor Equation
        let bmr = (10 * parseFloat(weight)) + (6.25 * parseFloat(height)) - (5 * parseFloat(age));
        if (gender === 'male') {
            bmr += 5;
        } else {
            bmr -= 161;
        }

        // Stress Factor
        let stressFactor = 1.2;
        if (injury === 'yes') {
            if (injuryType === 'fracture') stressFactor = 1.5;
            if (injuryType === 'strain') stressFactor = 1.3;
        }

        const tdee = Math.round(bmr * stressFactor);

        // Macros
        // Protein: 2.0g per kg
        const proteinGrams = Math.round(parseFloat(weight) * 2.0);
        const proteinCals = proteinGrams * 4;

        // Carbs: 50% of total calories
        const carbCals = tdee * 0.5;
        const carbGrams = Math.round(carbCals / 4);

        // Fats: Remaining calories
        const fatCals = tdee - proteinCals - carbCals;
        const fatGrams = Math.round(fatCals / 9);

        // Fiber: Minimum 30g
        const fiberGrams = 30;

        // Micros & Tips
        let minerals = [];
        let avoid = [];
        let superfoods = [];

        if (injury === 'yes' && injuryType === 'fracture') {
            minerals = ['Calcium', 'Vitamin D', 'Vitamin K'];
            avoid = ['Alcohol (slows bone healing)', 'Excessive Salt (calcium loss)', 'Excessive Caffeine'];
            superfoods = ['Dairy/Fortified Plant Milk', 'Leafy Greens (Kale, Spinach)', 'Fatty Fish (Salmon, Sardines)'];
        } else if (injury === 'yes' && injuryType === 'strain') {
            minerals = ['Vitamin C', 'Zinc', 'Magnesium'];
            avoid = ['Processed Sugars (inflammatory)', 'Trans Fats (fried foods)', 'Alcohol (dehydrating)'];
            superfoods = ['Citrus Fruits/Berries', 'Nuts & Seeds (Pumpkin/Chia)', 'Lean Meats/Legumes'];
        } else {
            minerals = ['General Multivitamin', 'Iron', 'B12'];
            avoid = ['Processed Foods', 'Sugary Drinks', 'Deep Fried Foods'];
            superfoods = ['Mixed Berries', 'Whole Grains', 'Lean Proteins'];
        }

        setResult({
            calories: tdee,
            protein: proteinGrams,
            carbs: carbGrams,
            fats: fatGrams,
            fiber: fiberGrams,
            minerals,
            avoid,
            superfoods
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                        Recovery Diet <span className="text-blue-600">Planner</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Generate a specialized nutrition plan tailored to your body's recovery needs.
                        Optimized for injury healing and tissue repair.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Input Form */}
                    <div className="md:col-span-1 bg-white rounded-2xl shadow-xl p-6 h-fit border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                            Your Details
                        </h2>

                        <form onSubmit={calculatePlan} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gender: 'male' })}
                                        className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all ${formData.gender === 'male'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Male
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gender: 'female' })}
                                        className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all ${formData.gender === 'female'
                                            ? 'bg-pink-500 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Female
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="25"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="70"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="175"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Do you have an injury?</label>
                                <select
                                    name="injury"
                                    value={formData.injury}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="none">No Injury</option>
                                    <option value="yes">Yes, I'm recovering</option>
                                </select>
                            </div>

                            {formData.injury === 'yes' && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Injury Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, injuryType: 'fracture' })}
                                            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${formData.injuryType === 'fracture'
                                                ? 'bg-orange-500 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            <Bone className="w-3 h-3" />
                                            Fracture
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, injuryType: 'strain' })}
                                            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${formData.injuryType === 'strain'
                                                ? 'bg-red-500 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            <Activity className="w-3 h-3" />
                                            Strain
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg active:scale-95 mt-4"
                            >
                                Generate Plan
                            </button>
                        </form>
                    </div>

                    {/* Results Display */}
                    <div className="md:col-span-2 space-y-6">
                        {!result ? (
                            <div className="h-full flex flex-col items-center justify-center bg-white/50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
                                <div className="bg-blue-100 p-4 rounded-full mb-4">
                                    <Microscope className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Plan Generated Yet</h3>
                                <p className="text-gray-500">Enter your details and injury status to get a personalized recovery nutrition chart.</p>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

                                {/* Macros Cards */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-blue-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-500 text-xs font-bold uppercase">Daily Calories</span>
                                            <Flame className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div className="text-2xl font-black text-gray-900">{result.calories}</div>
                                        <div className="text-xs text-gray-400">kcal/day</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-green-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-500 text-xs font-bold uppercase">Protein</span>
                                            <Fish className="w-4 h-4 text-green-500" />
                                        </div>
                                        <div className="text-2xl font-black text-gray-900">{result.protein}g</div>
                                        <div className="text-xs text-gray-400">For repair</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-yellow-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-500 text-xs font-bold uppercase">Carbs</span>
                                            <Apple className="w-4 h-4 text-yellow-500" />
                                        </div>
                                        <div className="text-2xl font-black text-gray-900">{result.carbs}g</div>
                                        <div className="text-xs text-gray-400">For energy</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-purple-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-500 text-xs font-bold uppercase">Fats</span>
                                            <Egg className="w-4 h-4 text-purple-500" />
                                        </div>
                                        <div className="text-2xl font-black text-gray-900">{result.fats}g</div>
                                        <div className="text-xs text-gray-400">Anti-inflammatory</div>
                                    </div>
                                </div>

                                {/* Nutrition Focus */}
                                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="font-bold text-gray-900">Recommended Nutrition Focus</h3>
                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                                            {formData.injuryType === 'fracture' && formData.injury === 'yes' ? 'Bone Healing' : formData.injuryType === 'strain' && formData.injury === 'yes' ? 'Muscle Repair' : 'General Health'}
                                        </span>
                                    </div>
                                    <div className="p-6 grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 uppercase mb-3 flex items-center">
                                                <ShieldAlert className="w-4 h-4 mr-2 text-red-500" />
                                                Foods to Avoid
                                            </h4>
                                            <ul className="space-y-2">
                                                {result.avoid.map((item, idx) => (
                                                    <li key={idx} className="flex items-start text-sm text-gray-600">
                                                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 uppercase mb-3 flex items-center">
                                                <Activity className="w-4 h-4 mr-2 text-green-500" />
                                                Superfoods
                                            </h4>
                                            <ul className="space-y-2">
                                                {result.superfoods.map((item, idx) => (
                                                    <li key={idx} className="flex items-start text-sm text-gray-600">
                                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 bg-blue-50/50 border-t border-blue-100">
                                        <p className="text-sm text-blue-800 flex items-center">
                                            <Microscope className="w-4 h-4 mr-2" />
                                            <strong>Priority Micros:</strong>&nbsp; {result.minerals.join(', ')}
                                        </p>
                                    </div>
                                </div>

                                {/* Sample Meal Structure */}
                                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-4">Daily Meal Structure</h3>
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gray-50">
                                            <div className="w-20 font-bold text-gray-500 text-sm uppercase pt-1">Breakfast</div>
                                            <div className="flex-1">
                                                <p className="text-gray-900 font-medium">Oatmeal with Berries & Protein Shake</p>
                                                <p className="text-sm text-gray-500 mt-1">Focus on fiber (oats) and antioxidants (berries) to start the day. High protein for repair.</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gray-50">
                                            <div className="w-20 font-bold text-gray-500 text-sm uppercase pt-1">Lunch</div>
                                            <div className="flex-1">
                                                <p className="text-gray-900 font-medium">Grilled Chicken/Tofu Salad with Quinoa</p>
                                                <p className="text-sm text-gray-500 mt-1">Lean protein source + complex carbs. Add olive oil dressing for healthy fats.</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gray-50">
                                            <div className="w-20 font-bold text-gray-500 text-sm uppercase pt-1">Snack</div>
                                            <div className="flex-1">
                                                <p className="text-gray-900 font-medium">Greek Yogurt with Nuts/Seeds</p>
                                                <p className="text-sm text-gray-500 mt-1">Calcium boost (yogurt) + Magnesium/Zinc (pumpkin seeds).</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gray-50">
                                            <div className="w-20 font-bold text-gray-500 text-sm uppercase pt-1">Dinner</div>
                                            <div className="flex-1">
                                                <p className="text-gray-900 font-medium">Baked Salmon with Steamed Broccoli</p>
                                                <p className="text-sm text-gray-500 mt-1">Omega-3s for inflammation control. Vitamin K & C from broccoli.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
