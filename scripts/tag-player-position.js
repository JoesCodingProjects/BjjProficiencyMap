// Script to add playerPosition ('top' | 'bottom' | 'both') to each technique
// playerPosition = where YOU are physically when performing this technique
// top = you are on top / in the dominant top position
// bottom = you are underneath / guard player / on your back
// both = either player can do this / standing / truly symmetrical

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/src/data/techniques.json');
const techniques = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Explicit overrides by id — most reliable
const EXPLICIT = {
  // TOP techniques
  guard_posture_break: 'top',
  knee_slide_pass: 'top',
  toreando_pass: 'top',
  stack_pass: 'top',
  leg_drag_pass: 'top',
  over_under_pass: 'top',
  double_under_pass: 'top',
  knee_cut_pass: 'top',
  body_lock_pass: 'top',
  long_step_pass: 'top',
  folding_pass: 'top',
  smash_pass: 'top',
  back_step_pass: 'top',
  x_pass: 'top',
  headquarters_position: 'top',
  hip_switch_pass: 'top',
  cross_face_pass_pressure: 'top',
  tozi_pass: 'top',
  closed_guard_break_standing: 'top',
  closed_guard_break_kneeling: 'top',
  leg_drag_to_back: 'top',
  maintain_side_control: 'top',
  americana_side_control: 'top',
  kimura_side_control: 'top',
  side_to_mount_transition: 'top',
  maintain_mount: 'top',
  armbar_mount: 'top',
  americana_mount: 'top',
  arm_triangle_mount: 'top',
  establish_back_hooks: 'top',
  rear_naked_choke: 'top',
  knee_on_belly: 'top',
  north_south_choke: 'top',
  north_south_kimura: 'top',
  armbar_side_control: 'top',
  armbar_from_back: 'top',
  side_triangle_choke: 'top',
  mounted_triangle: 'top',
  arm_triangle_side_control: 'top',
  rnc_seatbelt_control: 'top',
  back_control_body_triangle: 'top',
  s_mount_position: 'top',
  technical_mount: 'top',
  rear_triangle_choke: 'top',
  twister_side_control: 'top',
  truck_position: 'top',
  crucifix_position: 'top',
  von_flue_choke: 'top',
  wrist_lock_from_side_control: 'top',
  north_south_position: 'top',
  knee_on_belly_to_mount: 'top',
  mount_to_back_transition: 'top',
  darce_from_mount: 'top',
  darce_choke: 'top',
  anaconda_choke: 'top',
  turtle_to_back: 'top',
  arm_triangle_from_guard: 'top',
  front_headlock_position: 'top',
  rolling_back_take_turtle: 'top',
  clock_choke_nogi: 'top',
  bulldog_choke: 'top',
  peruvian_necktie: 'top',
  japanese_necktie: 'top',
  ninja_choke: 'top',
  guillotine_from_mount: 'top',
  ezekiel_choke_nogi_mount: 'top',
  kimura_trap_system: 'top',
  americana_from_mount_variation: 'top',
  triangle_from_mount_to_armbar: 'top',
  banana_split: 'top',
  rnc_from_turtle: 'top',
  kimura_from_north_south_to_back: 'top',
  monoplata: 'top',
  baratoplata: 'top',
  reverse_triangle_choke: 'top',

  // BOTTOM techniques
  establish_closed_guard: 'bottom',
  establish_half_guard: 'bottom',
  open_guard_retention: 'bottom',
  butterfly_guard_position: 'bottom',
  seated_guard_position: 'bottom',
  de_la_riva_nogi_position: 'bottom',
  reverse_de_la_riva_position: 'bottom',
  deep_half_guard_position: 'bottom',
  knee_shield_half_guard: 'bottom',
  x_guard_position: 'bottom',
  single_leg_x_position: 'bottom',
  fifty_fifty_position: 'bottom',
  saddle_position: 'bottom',
  outside_ashi_position: 'bottom',
  ashi_garami_position: 'bottom',
  backside_fifty_position: 'bottom',
  armbar_closed_guard: 'bottom',
  triangle_closed_guard: 'bottom',
  kimura_closed_guard: 'bottom',
  guillotine_closed_guard: 'bottom',
  omoplata_closed_guard: 'bottom',
  scissor_sweep: 'bottom',
  hip_bump_sweep: 'bottom',
  flower_pendulum_sweep: 'bottom',
  butterfly_sweep: 'bottom',
  de_la_riva_sweep: 'bottom',
  tripod_sweep: 'bottom',
  half_guard_kimura_sweep: 'bottom',
  old_school_sweep: 'bottom',
  underhook_half_guard_sweep: 'bottom',
  john_wayne_sweep: 'bottom',
  sickle_sweep: 'bottom',
  lumberjack_sweep: 'bottom',
  waiter_sweep: 'bottom',
  x_guard_technical_standup_sweep: 'bottom',
  slx_sweep: 'bottom',
  butterfly_hook_sweep: 'bottom',
  arm_drag_to_back: 'bottom',
  wrestle_up_from_guard: 'bottom',
  butterfly_arm_drag_to_back: 'bottom',
  overhead_sweep_butterfly: 'bottom',
  tripod_to_sickle_combo: 'bottom',
  berimbolo_to_back: 'bottom',
  z_guard_back_take: 'bottom',
  ashi_to_back_take: 'bottom',
  omoplata_to_back_take: 'bottom',
  straight_ankle_lock: 'bottom',
  kneebar: 'bottom',
  heel_hook: 'bottom',
  toe_hold: 'bottom',
  spinning_armbar_guard: 'bottom',
  omoplata_open_guard: 'bottom',
  wrist_lock_closed_guard: 'bottom',
  bicep_slicer_guard: 'bottom',
  inside_heel_hook: 'bottom',
  outside_heel_hook: 'bottom',
  calf_slicer: 'bottom',
  estima_lock: 'bottom',
  aoki_lock: 'bottom',
  kneebar_from_saddle: 'bottom',
  toe_hold_ashi: 'bottom',
  straight_ankle_lock_slx: 'bottom',
  single_leg_x_to_kneebar: 'bottom',
  fifty_fifty_heel_hook: 'bottom',
  dogbar_lock: 'bottom',
  matrix_leg_lock_entry: 'bottom',
  ankle_lock_from_open_guard_counter: 'bottom',
  pendulum_to_armbar: 'bottom',
  americana_from_guard: 'bottom',
  gogoplata: 'bottom',
  high_elbow_guillotine: 'bottom',
  arm_in_guillotine: 'bottom',
  low_elbow_guillotine: 'bottom',
  marcelotine: 'bottom',
  upa_mount_escape: 'bottom',
  elbow_knee_mount_escape: 'bottom',
  side_control_escape_guard: 'bottom',
  side_control_escape_underhook: 'bottom',
  rnc_defense: 'bottom',
  back_escape_to_turtle: 'bottom',
  guillotine_defense_posture: 'bottom',
  triangle_defense_posture: 'bottom',
  leg_lock_defense_boot: 'bottom',
  kneebar_defense: 'bottom',
  darce_defense: 'bottom',
  north_south_escape: 'bottom',
  knee_on_belly_escape: 'bottom',
  ghost_escape_side_control: 'bottom',
  mount_escape_heel_drag: 'bottom',
  shrimp_to_guard_recovery: 'bottom',
  granby_roll_escape: 'bottom',
  bridge_and_roll_side_control: 'bottom',
  half_guard_recovery_from_side: 'bottom',
  chair_sit_back_escape: 'bottom',
  body_triangle_escape: 'bottom',
  guard_retention_leg_pummel: 'bottom',
  knee_cut_counter_underhook: 'bottom',
  toreando_counter_hook: 'bottom',
  guillotine_from_bottom_guard_to_sweep: 'bottom',
  darce_from_half_guard: 'bottom',
  dogfight_position: 'both',
  kimura_from_guard_sweep: 'bottom',

  // BOTH / STANDING
  double_leg_takedown: 'both',
  single_leg_takedown: 'both',
  snap_down: 'both',
  ankle_pick_takedown: 'both',
  high_crotch_takedown: 'both',
  body_lock_takedown: 'both',
  guard_pull_to_seated: 'both',
  sprawl_defense: 'both',
  single_leg_finish_run_the_pipe: 'both',
  duck_under_takedown: 'both',
  russian_tie_to_back: 'both',
  power_guillotine_standing: 'both',
  turtle_recovery: 'bottom',
  leg_pummel_to_ashi: 'both',
  outside_ashi_to_saddle: 'both',
  heel_hook_50_50_to_backside: 'both',
  guillotine_high_elbow_from_mount_escape: 'top',
  imanari_roll: 'both',
};

const CATEGORY_FALLBACK = {
  pass: 'top',
  sweep: 'bottom',
  escape: 'bottom',
  guard: 'bottom',
};

const POSITION_FALLBACK = {
  closed_guard: 'bottom',
  open_guard: 'bottom',
  half_guard: 'bottom',
  side_control: 'top',
  mount: 'top',
  north_south: 'top',
  back_control: 'top',
  turtle: 'both',
  standing: 'both',
};

const tagged = techniques.map(t => {
  let playerPosition = EXPLICIT[t.id];
  if (!playerPosition) {
    playerPosition = CATEGORY_FALLBACK[t.category];
  }
  if (!playerPosition) {
    playerPosition = POSITION_FALLBACK[t.positions[0]] || 'both';
  }
  return { ...t, playerPosition };
});

// Stats
const counts = { top: 0, bottom: 0, both: 0 };
tagged.forEach(t => counts[t.playerPosition]++);
console.log('playerPosition counts:', counts);

// List any that used fallback (not in EXPLICIT)
const fallbacks = tagged.filter(t => !EXPLICIT[t.id]);
if (fallbacks.length > 0) {
  console.log('\nFallback-tagged (verify these):');
  fallbacks.forEach(t => {
    console.log(' ', t.playerPosition.padEnd(8), t.id, '-', t.name);
    console.log('            category:', t.category, '| positions:', t.positions.join(', '));
  });
}

// Write output
fs.writeFileSync(filePath, JSON.stringify(tagged, null, 2));
console.log('\nWrote', tagged.length, 'techniques to', filePath);
