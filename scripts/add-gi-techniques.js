const fs = require('fs');
const filePath = require('path').join(__dirname, '../app/src/data/techniques.json');
let t = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Retag sickle sweep, tripod sweep and combo as 'both' (work in gi and no-gi)
t = t.map(x => {
  if (['sickle_sweep', 'tripod_sweep', 'tripod_to_sickle_combo'].includes(x.id)) {
    return { ...x, giType: 'both' };
  }
  return x;
});

const newTechs = [
  // Gi Chokes
  {
    id: 'cross_collar_choke',
    name: 'Cross Collar Choke',
    description: 'From closed guard or mount, grip deep into both collars with a cross-grip and rotate the wrists to drive the forearm blades into the carotid arteries. The most fundamental gi choke.',
    positions: ['closed_guard', 'mount'],
    moveType: 'offensive', playerPosition: 'bottom',
    category: 'submission_choke', beltLevel: 'white', difficulty: 2, giType: 'gi', videoUrl: ''
  },
  {
    id: 'loop_choke_gi',
    name: 'Loop Choke',
    description: 'Grip the collar with one hand while posting the other forearm across the throat, then loop the collar under the chin as the opponent postures or passes, cutting off the carotid arteries with the lapel.',
    positions: ['open_guard', 'half_guard', 'standing'],
    moveType: 'offensive', playerPosition: 'bottom',
    category: 'submission_choke', beltLevel: 'blue', difficulty: 3, giType: 'gi', videoUrl: ''
  },
  {
    id: 'bow_and_arrow_choke',
    name: 'Bow and Arrow Choke',
    description: 'From back control, grip the collar with one hand and the far leg at the knee with the other, then extend the body like drawing a bow to crank the collar tight across the neck. One of the highest-percentage gi back attacks.',
    positions: ['back_control'],
    moveType: 'offensive', playerPosition: 'top',
    category: 'submission_choke', beltLevel: 'blue', difficulty: 2, giType: 'gi', videoUrl: ''
  },
  {
    id: 'clock_choke_gi',
    name: 'Clock Choke',
    description: 'From turtle top, drive one forearm across the throat using the collar grip while walking your feet around the opponent head clock-wise, using your body weight to crank the choke tight.',
    positions: ['turtle'],
    moveType: 'offensive', playerPosition: 'top',
    category: 'submission_choke', beltLevel: 'blue', difficulty: 2, giType: 'gi', videoUrl: ''
  },
  {
    id: 'baseball_bat_choke',
    name: 'Baseball Bat Choke',
    description: 'From side control or knee on belly, grip both collars with staggered hands like holding a baseball bat and drive them across the throat to compress the carotids. Often set up when the opponent frames against the neck.',
    positions: ['side_control'],
    moveType: 'offensive', playerPosition: 'top',
    category: 'submission_choke', beltLevel: 'blue', difficulty: 2, giType: 'gi', videoUrl: ''
  },
  {
    id: 'paper_cutter_choke',
    name: 'Paper Cutter Choke',
    description: 'From side control, feed the near collar to your bottom hand and use the top hand to drive the blade of the wrist across the throat in a slicing motion, compressing the carotid artery.',
    positions: ['side_control'],
    moveType: 'offensive', playerPosition: 'top',
    category: 'submission_choke', beltLevel: 'blue', difficulty: 3, giType: 'gi', videoUrl: ''
  },
  {
    id: 'brabo_choke_gi',
    name: 'Brabo Choke (Gi)',
    description: 'Feed the opponent lapel under their arm and across their own neck, then close the arm triangle using the lapel as the choking surface rather than your own arm.',
    positions: ['side_control', 'half_guard'],
    moveType: 'offensive', playerPosition: 'top',
    category: 'submission_choke', beltLevel: 'purple', difficulty: 4, giType: 'gi', videoUrl: ''
  },
  {
    id: 'collar_choke_from_back',
    name: 'Collar Choke from Back',
    description: 'From back control, feed one hand deep under the chin to grip the far collar, then lock the second hand over the top for the cross-collar squeeze — a blood choke finishing alternative to the rear naked choke.',
    positions: ['back_control'],
    moveType: 'offensive', playerPosition: 'top',
    category: 'submission_choke', beltLevel: 'white', difficulty: 2, giType: 'gi', videoUrl: ''
  },
  // Gi Guards
  {
    id: 'spider_guard',
    name: 'Spider Guard',
    description: 'Post both feet in the opponent biceps while gripping the sleeves, using the leg-arm connection to control posture, distance and angle for sweeps and submissions.',
    positions: ['open_guard'],
    moveType: 'defensive', playerPosition: 'bottom',
    category: 'guard', beltLevel: 'blue', difficulty: 3, giType: 'gi', videoUrl: ''
  },
  {
    id: 'lasso_guard',
    name: 'Lasso Guard',
    description: 'Thread one leg through the opponent arm and around the outside, wrapping the shin against their forearm while gripping the sleeve, creating strong rotation control for sweeps and omoplata entries.',
    positions: ['open_guard'],
    moveType: 'defensive', playerPosition: 'bottom',
    category: 'guard', beltLevel: 'blue', difficulty: 3, giType: 'gi', videoUrl: ''
  },
  {
    id: 'collar_sleeve_guard',
    name: 'Collar Sleeve Guard',
    description: 'Control one sleeve with both hands while one foot pushes the bicep and the other hooks the hip or ankle, using the collar-sleeve connection to manipulate posture and weight distribution.',
    positions: ['open_guard'],
    moveType: 'defensive', playerPosition: 'bottom',
    category: 'guard', beltLevel: 'blue', difficulty: 3, giType: 'gi', videoUrl: ''
  },
  // Gi Sweeps
  {
    id: 'balloon_sweep_gi',
    name: 'Balloon Sweep',
    description: 'From closed guard, grip the collar and sleeve, place a foot on the hip, and use the collar pull combined with hip extension to flip the opponent over in a rotating motion.',
    positions: ['closed_guard'],
    moveType: 'offensive', playerPosition: 'bottom',
    category: 'sweep', beltLevel: 'blue', difficulty: 3, giType: 'gi', videoUrl: ''
  },
  {
    id: 'spider_guard_sweep',
    name: 'Spider Guard Sweep',
    description: 'From spider guard, extend one leg to break the arm straight while pulling the sleeve and switching the other hook to the hip, toppling the opponent to the straightened-arm side.',
    positions: ['open_guard'],
    moveType: 'offensive', playerPosition: 'bottom',
    category: 'sweep', beltLevel: 'blue', difficulty: 3, giType: 'gi', videoUrl: ''
  },
  {
    id: 'lasso_sweep',
    name: 'Lasso Sweep',
    description: 'From lasso guard, use the rotational control of the lasso leg combined with the sleeve grip to off-balance the opponent and sweep them to the lasso side, coming up into a dominant position.',
    positions: ['open_guard'],
    moveType: 'offensive', playerPosition: 'bottom',
    category: 'sweep', beltLevel: 'blue', difficulty: 3, giType: 'gi', videoUrl: ''
  },
  // Maybe include
  {
    id: 'lapel_guard',
    name: 'Lapel Guard',
    description: 'Extract the opponent lapel and thread it through their legs or around limbs to create entanglements that restrict movement, the foundation for worm guard, squid guard and various lapel-based sweeps.',
    positions: ['open_guard'],
    moveType: 'offensive', playerPosition: 'bottom',
    category: 'guard', beltLevel: 'purple', difficulty: 4, giType: 'gi', videoUrl: ''
  },
  {
    id: 'worm_guard',
    name: 'Worm Guard',
    description: 'Thread the opponent lapel under their leg and back to your grip, creating a powerful leg and posture lock that severely restricts their passing and sets up off-balancing sweeps.',
    positions: ['open_guard'],
    moveType: 'offensive', playerPosition: 'bottom',
    category: 'guard', beltLevel: 'brown', difficulty: 5, giType: 'gi', videoUrl: ''
  },
  {
    id: 'squid_guard',
    name: 'Squid Guard',
    description: 'An advanced lapel entanglement where the lapel is threaded around the arm and back, creating an omoplata-like shoulder control with the lapel while restricting the opponent posture and balance.',
    positions: ['open_guard'],
    moveType: 'offensive', playerPosition: 'bottom',
    category: 'guard', beltLevel: 'black', difficulty: 5, giType: 'gi', videoUrl: ''
  },
];

t = [...t, ...newTechs];

const belts = { white: 0, blue: 0, purple: 0, brown: 0, black: 0 };
t.forEach(x => belts[x.beltLevel]++);
const giTypes = { gi: 0, 'no-gi': 0, both: 0 };
t.forEach(x => giTypes[x.giType] = (giTypes[x.giType] || 0) + 1);

console.log('Total:', t.length);
console.log('Belt distribution:', belts);
console.log('GiType distribution:', giTypes);

fs.writeFileSync(filePath, JSON.stringify(t, null, 2));
console.log('Done.');
