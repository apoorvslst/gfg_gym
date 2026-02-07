import React, { useState } from 'react';
import { Activity, Calculator, Apple, Egg, Fish, Microscope, Flame, Bone, ShieldAlert } from 'lucide-react';

export default function DietPlan() {
    const [formData, setFormData] = useState({
        age: '',
        gender: 'male',
        weight: '',
        height: '',
        injury: 'none',
        injuryType: 'fracture', // 'fracture' or 'strain'
        dietType: 'non-veg', // 'veg' or 'non-veg'
        disease: 'none' // 'none', 'diabetes', 'hypertension'
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
        const { age, gender, weight, height, injury, injuryType, dietType, disease } = formData;

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
        let mealPlan = {};

        if (injury === 'yes' && injuryType === 'fracture') {
            minerals = ['Calcium', 'Vitamin D', 'Vitamin K'];
            avoid = ['Alcohol (slows bone healing)', 'Excessive Salt (calcium loss)', 'Excessive Caffeine'];

            if (dietType === 'non-veg') {
                superfoods = ['Dairy/Fortified Plant Milk', 'Leafy Greens (Kale, Spinach)', 'Fatty Fish (Salmon, Sardines)'];
                mealPlan = {
                    breakfast: { name: 'Oatmeal with Berries & Whey Protein', desc: 'Calcium from milk/whey and fiber from oats.' },
                    lunch: { name: 'Grilled Chicken Salad with Quinoa', desc: 'Lean protein + complex carbs.' },
                    snack: { name: 'Greek Yogurt with Almonds', desc: 'High calcium and healthy fats.' },
                    dinner: { name: 'Baked Salmon with Steamed Broccoli', desc: 'Omega-3s and Vitamin K.' }
                };
            } else {
                superfoods = ['Dairy/Fortified Plant Milk', 'Leafy Greens (Kale, Spinach)', 'Chia Seeds/Flaxseeds'];
                mealPlan = {
                    breakfast: { name: 'Oatmeal with Berries & Plant Protein', desc: 'Fortified milk for Calcium and fiber from oats.' },
                    lunch: { name: 'Quinoa & Chickpea Salad', desc: 'Complete plant protein + complex carbs.' },
                    snack: { name: 'Greek Yogurt (or Fortified Soy) with Almonds', desc: 'High calcium.' },
                    dinner: { name: 'Tofu Stir-fry with Broccoli', desc: 'Calcium-set tofu and Vitamin K from broccoli.' }
                };
            }

        } else if (injury === 'yes' && injuryType === 'strain') {
            minerals = ['Vitamin C', 'Zinc', 'Magnesium'];
            avoid = ['Processed Sugars (inflammatory)', 'Trans Fats (fried foods)', 'Alcohol (dehydrating)'];

            if (dietType === 'non-veg') {
                superfoods = ['Citrus Fruits/Berries', 'Nuts & Seeds', 'Lean Meats (Chicken/Turkey)'];
                mealPlan = {
                    breakfast: { name: 'Scrambled Eggs with Spinach & Toast', desc: 'Choline and protein for muscle repair.' },
                    lunch: { name: 'Turkey Breast Sandwich on Whole Wheat', desc: 'Lean protein and Zinc.' },
                    snack: { name: 'Orange & Pumpkin Seeds', desc: 'Vitamin C and Magnesium boost.' },
                    dinner: { name: 'Lean Beef Stir-fry with Bell Peppers', desc: 'Iron, Zinc and Vitamin C.' }
                };
            } else {
                superfoods = ['Citrus Fruits/Berries', 'Nuts & Seeds', 'Legumes/Lentils'];
                mealPlan = {
                    breakfast: { name: 'Tofu Scramble with Spinach & Toast', desc: 'Protein and Iron implementation.' },
                    lunch: { name: 'Lentil Soup with Whole Wheat Roll', desc: 'Zinc and fiber rich.' },
                    snack: { name: 'Orange & Pumpkin Seeds', desc: 'Vitamin C and Magnesium boost.' },
                    dinner: { name: 'Black Bean Chili with Bell Peppers', desc: 'Protein, Fiber and Vitamin C.' }
                };
            }
        } else {
            minerals = ['General Multivitamin', 'Iron', 'B12'];
            avoid = ['Processed Foods', 'Sugary Drinks', 'Deep Fried Foods'];

            if (dietType === 'non-veg') {
                superfoods = ['Mixed Berries', 'Whole Grains', 'Lean Proteins'];
                mealPlan = {
                    breakfast: { name: 'Egg White Omelet with Veggies', desc: 'Low fat, high protein start.' },
                    lunch: { name: 'Grilled Chicken Wrap', desc: 'Balanced macronutrients.' },
                    snack: { name: 'Apple & Peanut Butter', desc: 'Fiber and healthy fats.' },
                    dinner: { name: 'Grilled Fish with Asparagus', desc: 'Light, high protein dinner.' }
                };
            } else {
                superfoods = ['Mixed Berries', 'Whole Grains', 'Plant Proteins (Beans/Lentils)'];
                mealPlan = {
                    breakfast: { name: 'Smoothie Bowl with Seeds', desc: 'Antioxidant rich start.' },
                    lunch: { name: 'Hummus & Veggie Wrap', desc: 'Fiber and plant protein.' },
                    snack: { name: 'Apple & Peanut Butter', desc: 'Fiber and healthy fats.' },
                    dinner: { name: 'Lentil Curry with Brown Rice', desc: 'Complete protein source.' }
                };
            }

            // Disease Specific Logic
            if (disease === 'diabetes') {
                minerals.push('Chromium', 'Magnesium');
                avoid.push('Refined Sugars', 'Sweets/Desserts', 'High GI Fruits (Mango, Grapes)', 'Fruit Juices');
                superfoods.push('Bitter Gourd', 'Fenugreek Seeds', 'Cinnamon', 'Chia Seeds');

                // Modify meal descriptions for diabetes
                Object.keys(mealPlan).forEach(key => {
                    if (mealPlan[key].name.includes('Oatmeal')) {
                        mealPlan[key].name = mealPlan[key].name.replace('Oatmeal', 'Steel-cut Oats (Low GI)');
                    }
                    if (mealPlan[key].name.includes('Rice')) {
                        mealPlan[key].name = mealPlan[key].name.replace('Rice', 'Brown Rice/Quinoa');
                    }
                    if (mealPlan[key].name.includes('Toast')) {
                        mealPlan[key].name = mealPlan[key].name.replace('Toast', 'Multigrain Toast');
                    }
                    if (mealPlan[key].name.includes('Sandwich')) {
                        mealPlan[key].name = mealPlan[key].name.replace('Sandwich', 'Whole Grain Sandwich');
                    }
                    if (mealPlan[key].name.includes('Smoothie')) {
                        mealPlan[key].name = 'Vegetable & Berry Smoothie (Low GI)';
                    }
                });
            }

        }

        switch (disease) {
            case 'hypertension':
                minerals.push('Potassium', 'Magnesium', 'Calcium');
                avoid.push('Excess Sodium', 'Processed Meats', 'Pickles/Canned Foods');
                superfoods.push('Bananas', 'Spinach', 'Beets', 'Garlic');
                break;
            case 'pcos':
                minerals.push('Zinc', 'Magnesium', 'Chromium');
                avoid.push('Refined Carbs', 'Sugary Drinks', 'Processed Soya (sometimes)', 'Dairy (if sensitive)');
                superfoods.push('Cinnamon', 'Flaxseeds', 'Berries', 'Leafy Greens');
                // PCOS often benefits from lower carb
                mealPlan.dinner.desc += " (Low Carb recommended)";
                break;
            case 'thyroid':
                minerals.push('Selenium', 'Iodine', 'Zinc');
                avoid.push('Raw Cruciferous Veggies (Broccoli/Cauliflower)', 'Soy Products', 'Processed Foods', 'Gluten (if sensitive)');
                superfoods.push('Brazil Nuts (Selenium)', 'Seaweed (Iodine)', 'Eggs', 'Yogurt');
                break;
            case 'cholesterol':
                minerals.push('Niacin', 'Magnesium', 'Potassium');
                avoid.push('Trans Fats', 'Red Meat', 'Full Fat Dairy', 'Fried Foods');
                superfoods.push('Oats (Soluble Fiber)', 'Avocado', 'Almonds', 'Fatty Fish (Omega-3)');
                Object.keys(mealPlan).forEach(key => {
                    if (mealPlan[key].name.includes('Egg')) {
                        mealPlan[key].name = mealPlan[key].name.replace('Egg', 'Egg Whites');
                    }
                });
                break;
            case 'gerd':
                minerals.push('Magnesium', 'Potassium');
                avoid.push('Spicy Foods', 'Citrus Fruits', 'Caffeine', 'Late Night Meals', 'Tomato Sauce');
                superfoods.push('Ginger', 'Oatmeal', 'Melon', 'Banana');
                // GERD modifications
                if (mealPlan.dinner) {
                    mealPlan.dinner.desc += " (Eat 3 hours before bed)";
                    if (mealPlan.dinner.name.includes('Chili') || mealPlan.dinner.name.includes('Curry')) {
                        mealPlan.dinner.name = 'Baked Chicken/Fish with Steamed Veggies (Mild)';
                    }
                }
                break;
            case 'anemia':
                minerals.push('Iron', 'Vitamin C (for absorption)', 'B12');
                avoid.push('Tea/Coffee with meals (blocks Iron)', 'Calcium rich foods with Iron meals');
                superfoods.push('Spinach', 'Red Meat (in moderation)', 'Lentils', 'Citrus Fruits');
                break;
            default:
                // existing cases handled below or generic
                break;
        }

        setResult({
            calories: tdee,
            protein: proteinGrams,
            carbs: carbGrams,
            fats: fatGrams,
            fiber: fiberGrams,
            minerals,
            avoid,
            superfoods,
            mealPlan
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Diet Preference</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, dietType: 'veg' })}
                                        className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all ${formData.dietType === 'veg'
                                            ? 'bg-green-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Veg
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, dietType: 'non-veg' })}
                                        className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all ${formData.dietType === 'non-veg'
                                            ? 'bg-red-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Non-Veg
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Condition</label>
                                <select
                                    name="disease"
                                    value={formData.disease}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="none">None</option>
                                    <option value="diabetes">Diabetes (Sugar Control)</option>
                                    <option value="hypertension">Hypertension (BP Control)</option>
                                    <option value="pcos">PCOS/PCOD (Hormonal Balance)</option>
                                    <option value="thyroid">Thyroid (Hypothyroidism)</option>
                                    <option value="cholesterol">High Cholesterol (Heart Health)</option>
                                    <option value="gerd">GERD/Acid Reflux (Digestive)</option>
                                    <option value="anemia">Iron Deficiency Anemia</option>
                                </select>
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
                                                    <li key={idx} className="flex items-start text-sm text-gray-60">
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
                                    <h3 className="font-bold text-gray-900 mb-4">Daily Meal Structure ({formData.dietType === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'})</h3>
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gray-50">
                                            <div className="w-20 font-bold text-gray-500 text-sm uppercase pt-1">Breakfast</div>
                                            <div className="flex-1">
                                                <p className="text-gray-900 font-medium">{result.mealPlan.breakfast.name}</p>
                                                <p className="text-sm text-gray-500 mt-1">{result.mealPlan.breakfast.desc}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gray-50">
                                            <div className="w-20 font-bold text-gray-500 text-sm uppercase pt-1">Lunch</div>
                                            <div className="flex-1">
                                                <p className="text-gray-900 font-medium">{result.mealPlan.lunch.name}</p>
                                                <p className="text-sm text-gray-500 mt-1">{result.mealPlan.lunch.desc}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gray-50">
                                            <div className="w-20 font-bold text-gray-500 text-sm uppercase pt-1">Snack</div>
                                            <div className="flex-1">
                                                <p className="text-gray-900 font-medium">{result.mealPlan.snack.name}</p>
                                                <p className="text-sm text-gray-500 mt-1">{result.mealPlan.snack.desc}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gray-50">
                                            <div className="w-20 font-bold text-gray-500 text-sm uppercase pt-1">Dinner</div>
                                            <div className="flex-1">
                                                <p className="text-gray-900 font-medium">{result.mealPlan.dinner.name}</p>
                                                <p className="text-sm text-gray-500 mt-1">{result.mealPlan.dinner.desc}</p>
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
